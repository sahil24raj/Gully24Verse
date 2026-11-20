export type GameState = 'MENU' | 'COUNTDOWN' | 'RACING' | 'VICTORY' | 'DEFEAT';

export type RunnerState = 'IDLE' | 'RUNNING' | 'KNOCKED_OUT' | 'RESPAWNING' | 'FINISHED';

export type ObstacleType = 'SWEEPER' | 'HAMMER' | 'PUSHER' | 'ROLLER' | 'GATE';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface CheckpointData {
  index: number;
  s: number; // Arc-length distance along track
  position: Vector3D;
  tangent: Vector3D;
}

export interface RunnerTelemetry {
  id: string;
  name: string;
  isPlayer: boolean;
  color: string;
  s: number; // Current distance along track
  progress: number; // 0 to 1
  rank: number; // 1, 2, or 3
  state: RunnerState;
  position: Vector3D;
  finished: boolean;
  finishTime?: number;
}

export interface EngineTelemetry {
  gameState: GameState;
  countdown: number | string | null;
  level: number;
  totalLevels: number;
  playerRank: number;
  totalRunners: number;
  playerProgress: number; // 0 to 100
  runners: RunnerTelemetry[];
  coinsEarned: number;
  isHolding: boolean;
  currentCheckpoint: number;
  totalCheckpoints: number;
  speed: number;
}

export interface ObstacleConfig {
  id: string;
  type: ObstacleType;
  s: number; // Position along track
  speed: number; // Rotation / oscillation speed
  amplitude?: number; // Swing amplitude or push length
  phaseOffset?: number; // Starting phase in radians
  reverse?: boolean; // Reverse direction
  arms?: number; // Number of spokes for sweeper
  width?: number;
  height?: number;
  color?: string;
}

export interface LevelConfig {
  levelNumber: number;
  name: string;
  totalLength: number;
  trackWidth: number;
  trackColor: string;
  curbColor: string;
  waterColor: string;
  waypoints: Vector3D[];
  checkpoints: number[]; // s values
  obstacles: ObstacleConfig[];
  opponents: {
    id: string;
    name: string;
    color: string;
    lateralOffset: number;
    speedFactor: number; // e.g. 0.95 to 1.02
    aggression: number; // 0 to 1
    accuracy: number; // 0.7 to 0.98
  }[];
}
