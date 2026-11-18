import { ColorDef, ColorType, LevelConfig } from './types';

export const RUNWAY_WIDTH = 11.0;
export const RUNWAY_HALF_WIDTH = RUNWAY_WIDTH / 2; // 5.5m
export const PLAYER_LATERAL_LIMIT = 4.4; // 5.5 - 1.1m margin

export const COLOR_DEFINITIONS: Record<ColorType, ColorDef> = {
  red: {
    id: 'red',
    name: 'Red Titan',
    hex: 0xef4444,
    cssHex: '#ef4444',
    emissiveHex: 0x7f1d1d
  },
  green: {
    id: 'green',
    name: 'Green Giant',
    hex: 0x10b981,
    cssHex: '#10b981',
    emissiveHex: 0x064e3b
  },
  blue: {
    id: 'blue',
    name: 'Blue Colossus',
    hex: 0x3b82f6,
    cssHex: '#3b82f6',
    emissiveHex: 0x1e3a8a
  },
  yellow: {
    id: 'yellow',
    name: 'Gold Goliath',
    hex: 0xf59e0b,
    cssHex: '#f59e0b',
    emissiveHex: 0x78350f
  }
};

export const COLOR_KEYS: ColorType[] = ['red', 'green', 'blue', 'yellow'];

export const MULTIPLIERS = [
  { minDistance: 0, mult: 1.2, label: '1.2x', color: '#64748B' },
  { minDistance: 25, mult: 1.5, label: '1.5x', color: '#0EA5E9' },
  { minDistance: 50, mult: 2.0, label: '2.0x', color: '#10B981' },
  { minDistance: 80, mult: 3.0, label: '3.0x', color: '#F59E0B' },
  { minDistance: 120, mult: 5.0, label: '5.0x', color: '#EC4899' },
  { minDistance: 170, mult: 8.0, label: '8.0x', color: '#8B5CF6' },
  { minDistance: 230, mult: 10.0, label: '10.0x', color: '#EF4444' },
  { minDistance: 300, mult: 15.0, label: '15.0x (GODLY!)', color: '#FCD34D' }
];

export const LEVELS: LevelConfig[] = [
  {
    levelNum: 1,
    trackLength: 130,
    forwardSpeed: 17,
    bossHp: 240,
    bossScale: 2.2,
    bossColor: 'red',
    colorsAllowed: ['red', 'green', 'blue'],
    hazardFrequency: 0.3
  },
  {
    levelNum: 2,
    trackLength: 170,
    forwardSpeed: 19,
    bossHp: 420,
    bossScale: 2.6,
    bossColor: 'blue',
    colorsAllowed: ['red', 'green', 'blue', 'yellow'],
    hazardFrequency: 0.5
  },
  {
    levelNum: 3,
    trackLength: 210,
    forwardSpeed: 21,
    bossHp: 650,
    bossScale: 3.0,
    bossColor: 'yellow',
    colorsAllowed: ['red', 'green', 'blue', 'yellow'],
    hazardFrequency: 0.75
  }
];
