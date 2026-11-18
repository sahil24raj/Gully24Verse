export type GamePhase =
  | 'MENU'
  | 'RUNNING'
  | 'BOSS_INTRO'
  | 'BOSS_QTE'
  | 'BOSS_PUNCH'
  | 'BOSS_LAUNCH'
  | 'VICTORY'
  | 'DEFEAT';

export type ColorType = 'red' | 'green' | 'blue' | 'yellow';

export interface ColorDef {
  id: ColorType;
  name: string;
  hex: number;
  cssHex: string;
  emissiveHex: number;
}

export interface PlayerState {
  x: number;
  y: number;
  z: number;
  scale: number;
  targetScale: number;
  color: ColorType;
  power: number;
  speedZ: number;
  streakCount: number;
  isInvulnerable: boolean;
  isPunching: boolean;
}

export interface CollectibleItem {
  id: string;
  x: number;
  y: number;
  z: number;
  color: ColorType;
  isCollected: boolean;
  scale: number;
  meshIndex?: number;
}

export interface ColorGateItem {
  id: string;
  z: number;
  targetColor: ColorType;
  width: number;
  isPassed: boolean;
}

export interface ObstacleItem {
  id: string;
  x: number;
  y: number;
  z: number;
  type: 'spinning_blade' | 'spike_roller' | 'barrier_wall';
  width: number;
  height: number;
  depth: number;
  rotSpeed: number;
  moveAmplitude: number;
  moveSpeed: number;
  initialX: number;
  isHit: boolean;
}

export interface BossEntity {
  name: string;
  level: number;
  maxHp: number;
  currentHp: number;
  scale: number;
  color: ColorType;
  x: number;
  y: number;
  z: number;
  isKnockedOut: boolean;
  launchVx: number;
  launchVy: number;
  launchVz: number;
  launchDistance: number;
}

export interface LevelConfig {
  levelNum: number;
  trackLength: number;
  forwardSpeed: number;
  bossHp: number;
  bossScale: number;
  bossColor: ColorType;
  colorsAllowed: ColorType[];
  hazardFrequency: number;
}
