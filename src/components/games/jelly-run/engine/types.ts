import * as THREE from 'three';

export type GameState = 'START' | 'RUNNING' | 'PAUSED' | 'VICTORY' | 'DEFEAT';

export interface JellyCubeState {
  id: string;
  value: number; // 2, 4, 8, 16, 32, ...
  position: THREE.Vector3;
  targetX: number;
  scale: THREE.Vector3;
  wobbleTimer: number;
  wobbleMagnitude: number;
  mesh?: THREE.Group;
  alive: boolean;
  side: 'left' | 'right' | 'center';
}

export interface CollectibleItem {
  id: string;
  value: number;
  position: THREE.Vector3;
  mesh: THREE.Group;
  collected: boolean;
  baseY: number;
  floatOffset: number;
}

export type ObstacleType = 'DIVIDER' | 'SPINNING_SAW' | 'SPIKE_BARRIER' | 'CRUSHER_GATE';

export interface TrackObstacle {
  id: string;
  type: ObstacleType;
  position: THREE.Vector3;
  mesh: THREE.Group;
  rotationSpeed?: number;
  movementSpeed?: number;
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
}

export interface MultiplierZone {
  multiplier: number;
  zStart: number;
  zEnd: number;
  color: string;
}

export interface JellyParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface LevelConfig {
  levelNumber: number;
  trackLength: number;
  speed: number;
  targetNumber: number;
  collectibles: Array<{ z: number; x: number; value: number }>;
  obstacles: Array<{ z: number; x: number; type: ObstacleType }>;
  theme: {
    trackColor: number;
    railColor: number;
    skyColorTop: string;
    skyColorBottom: string;
    waterColor: number;
  };
}

export interface GameStats {
  score: number;
  highestNumber: number;
  mergesCount: number;
  splitsCount: number;
  level: number;
  multiplier: number;
  finalScore: number;
}
