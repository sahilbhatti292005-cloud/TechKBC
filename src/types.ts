export type GamePhase = 
  | 'LOBBY' 
  | 'FFF_QUESTION' 
  | 'FFF_OPTIONS' 
  | 'FFF_RESULT' 
  | 'HOT_SEAT_QUESTION' 
  | 'HOT_SEAT_OPTIONS' 
  | 'HOT_SEAT' 
  | 'CROWD_SOURCE' 
  | 'GAME_OVER';

export interface Team {
  id: string;
  name: string;
  initialPoints: number;
  hotSeatPoints: number;
  bonusPoints: number;
  fffTime?: number;
  isCorrect: number; // 0 or 1
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOrder?: number[]; // For FFF
  correctIndex?: number; // For Hot Seat
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface TimerState {
  duration: number;
  startTime: number | null;
  endTime: number | null;
  remainingTime: number;
  isRunning: boolean;
  isPaused: boolean;
  type: 'FFF' | 'HOT_SEAT' | null;
}

export interface GameState {
  phase: GamePhase;
  cycle: number;
  hotSeatTeamId: string | null;
  currentQuestionId: string | null;
  timer: TimerState;
  // Keep these for UI sync
  teams: Team[];
  currentQuestion: Question | null;
  lifelines: {
    debugHelp: boolean;
    callDev: boolean;
    crowdSource: boolean;
  };
  lockedOption: number | null;
  revealCorrect: boolean;
  crowdSourceVotes: Record<string, number>;
  activeLifeline: 'debugHelp' | 'callDev' | 'crowdSource' | null;
  savedRemainingTime?: number | null;
  savedDuration?: number | null;
  showBottomLeaderboard: boolean;
  fffSubmissions?: Record<string, any>;
  isTimeOut: boolean;
}

export type Role = 'admin_laptop' | 'admin_mobile' | 'volunteer' | 'display';
