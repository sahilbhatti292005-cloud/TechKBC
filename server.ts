import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket as NodeWebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("kbc.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    initialPoints INTEGER DEFAULT 40,
    hotSeatPoints INTEGER DEFAULT 0,
    bonusPoints INTEGER DEFAULT 0,
    fffTime INTEGER,
    isCorrect INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS gameState (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    status TEXT DEFAULT 'LOBBY',
    currentCycle INTEGER DEFAULT 1,
    hotSeatTeamId TEXT,
    currentQuestionId TEXT,
    timerStart INTEGER,
    timerDuration INTEGER
  );

  INSERT OR IGNORE INTO gameState (id, status, currentCycle) VALUES (1, 'LOBBY', 1);
`);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

// Game State in Memory (for fast access and broadcasting)
let gameState = {
  status: 'LOBBY',
  currentCycle: 1,
  teams: [] as any[],
  currentQuestion: null as any,
  hotSeatTeamId: null as string | null,
  lifelines: {
    debugHelp: false,
    callDev: false,
    crowdSource: false
  },
  lockedOption: null as number | null,
  revealCorrect: false,
  crowdSourceVotes: {} as Record<string, number>,
  timer: {
    start: 0,
    duration: 0,
    active: false
  },
  fffSubmissions: [] as any[]
};

// Load initial teams
const loadTeams = () => {
  gameState.teams = db.prepare("SELECT * FROM teams").all();
};
loadTeams();

// Broadcast to all clients
const broadcast = (data: any) => {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// WebSocket Connection
wss.on("connection", (ws: NodeWebSocket) => {
  console.log("Client connected");
  ws.send(JSON.stringify({ type: "SYNC", state: gameState }));

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    handleClientMessage(ws, data);
  });
});

const handleClientMessage = (ws: NodeWebSocket, data: any) => {
  switch (data.type) {
    case "ADMIN_ACTION":
      handleAdminAction(data.action, data.payload);
      break;
    case "VOLUNTEER_JOIN":
      const { teamId, teamName } = data;
      const existingTeam = gameState.teams.find(t => t.id === teamId);
      if (!existingTeam) {
        db.prepare("INSERT INTO teams (id, name) VALUES (?, ?)").run(teamId, teamName);
        loadTeams();
        broadcast({ type: "SYNC", state: gameState });
      }
      break;
    case "VOLUNTEER_SUBMISSION":
      handleVolunteerSubmission(data.teamId, data.submission);
      break;
    case "VOTE":
      handleVote(data.teamId, data.option);
      break;
  }
};

const handleAdminAction = (action: string, payload: any) => {
  console.log("Admin Action:", action, payload);
  switch (action) {
    case "START_FFF":
      gameState.status = "FFF_QUESTION";
      gameState.fffSubmissions = [];
      gameState.currentQuestion = payload.question;
      // Reset team FFF stats
      gameState.teams.forEach(t => {
        t.isCorrect = 0;
        t.fffTime = undefined;
      });
      db.prepare("UPDATE teams SET isCorrect = 0, fffTime = NULL").run();
      break;
    case "SHOW_FFF_OPTIONS":
      gameState.status = "FFF_OPTIONS";
      gameState.timer = { start: Date.now(), duration: 15000, active: true };
      break;
    case "LOCK_FFF":
      gameState.status = "FFF_RESULT";
      gameState.timer.active = false;
      calculateFFFResults();
      break;
    case "SEND_TO_HOT_SEAT":
      gameState.status = "HOT_SEAT";
      gameState.hotSeatTeamId = payload.teamId;
      gameState.lifelines = { debugHelp: false, callDev: false, crowdSource: false };
      gameState.lockedOption = null;
      gameState.revealCorrect = false;
      break;
    case "START_HOT_SEAT_QUESTION":
      gameState.status = "HOT_SEAT";
      gameState.currentQuestion = payload.question;
      gameState.timer = { start: Date.now(), duration: payload.question.difficulty === 'easy' ? 30000 : payload.question.difficulty === 'medium' ? 45000 : 60000, active: true };
      gameState.lockedOption = null;
      gameState.revealCorrect = false;
      break;
    case "LOCK_OPTION":
      gameState.lockedOption = payload.optionIndex;
      break;
    case "REVEAL_CORRECT":
      gameState.revealCorrect = true;
      gameState.timer.active = false;
      break;
    case "UPDATE_SCORE":
      const team = gameState.teams.find(t => t.id === payload.teamId);
      if (team) {
        if (payload.type === 'hotSeat') team.hotSeatPoints += payload.amount;
        if (payload.type === 'bonus') team.bonusPoints += payload.amount;
        db.prepare("UPDATE teams SET hotSeatPoints = ?, bonusPoints = ? WHERE id = ?")
          .run(team.hotSeatPoints, team.bonusPoints, team.id);
      }
      break;
    case "ACTIVATE_LIFELINE":
      gameState.lifelines[payload.lifeline as keyof typeof gameState.lifelines] = true;
      if (payload.lifeline === 'crowdSource') {
        gameState.status = "CROWD_SOURCE";
        gameState.crowdSourceVotes = { A: 0, B: 0, C: 0, D: 0 };
        gameState.timer = { start: Date.now(), duration: 15000, active: true };
      }
      break;
    case "RESET_GAME":
      db.prepare("DELETE FROM teams").run();
      gameState.teams = [];
      gameState.status = "LOBBY";
      gameState.hotSeatTeamId = null;
      gameState.currentCycle = 1;
      gameState.timer.active = false;
      gameState.lockedOption = null;
      gameState.revealCorrect = false;
      break;
    case "NEXT_CYCLE":
      gameState.currentCycle++;
      gameState.status = "LOBBY";
      break;
    case "REFRESH_TEAMS":
      loadTeams();
      break;
  }
  broadcast({ type: "SYNC", state: gameState });
};

const handleVolunteerSubmission = (teamId: string, submission: any) => {
  if (gameState.status !== "FFF_OPTIONS") return;
  const timeTaken = Date.now() - gameState.timer.start;
  const existing = gameState.fffSubmissions.find(s => s.teamId === teamId);
  if (!existing) {
    gameState.fffSubmissions.push({ teamId, submission, timeTaken });
  }
};

const handleVote = (teamId: string, option: string) => {
  if (gameState.status !== "CROWD_SOURCE") return;
  if (gameState.crowdSourceVotes[option] !== undefined) {
    gameState.crowdSourceVotes[option]++;
    broadcast({ type: "SYNC", state: gameState });
  }
};

const calculateFFFResults = () => {
  const correctOrder = gameState.currentQuestion.correctOrder;
  gameState.fffSubmissions.forEach(sub => {
    const isCorrect = JSON.stringify(sub.submission) === JSON.stringify(correctOrder);
    const team = gameState.teams.find(t => t.id === sub.teamId);
    if (team) {
      team.isCorrect = isCorrect ? 1 : 0;
      team.fffTime = sub.timeTaken;
      db.prepare("UPDATE teams SET isCorrect = ?, fffTime = ? WHERE id = ?")
        .run(team.isCorrect, team.fffTime, team.id);
    }
  });
};

// API Routes
app.post("/api/login", (req, res) => {
  const { teamId, teamName, role } = req.body;
  if (role === 'admin_laptop' || role === 'admin_mobile') {
    // Simple admin check
    if (teamId === 'admin' && teamName === 'admin') {
      return res.json({ success: true, role });
    }
  } else {
    let team = db.prepare("SELECT * FROM teams WHERE id = ?").get(teamId);
    if (!team) {
      db.prepare("INSERT INTO teams (id, name) VALUES (?, ?)").run(teamId, teamName);
      loadTeams();
      broadcast({ type: "SYNC", state: gameState });
    }
    return res.json({ success: true, role: 'volunteer', teamId });
  }
  res.status(401).json({ success: false });
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
  }

  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
