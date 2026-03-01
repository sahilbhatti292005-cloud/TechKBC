export type GameStatus = 
  | 'LOBBY' 
  | 'FFF_QUESTION' 
  | 'FFF_OPTIONS' 
  | 'FFF_RESULT' 
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

export interface GameState {
  status: GameStatus;
  currentCycle: number;
  teams: Team[];
  currentQuestion: Question | null;
  hotSeatTeamId: string | null;
  lifelines: {
    debugHelp: boolean;
    callDev: boolean;
    crowdSource: boolean;
  };
  lockedOption: number | null;
  revealCorrect: boolean;
  crowdSourceVotes: Record<string, number>;
  timer: {
    start: number;
    duration: number;
    active: boolean;
  };
}

export type Role = 'admin_laptop' | 'admin_mobile' | 'volunteer' | 'display';
