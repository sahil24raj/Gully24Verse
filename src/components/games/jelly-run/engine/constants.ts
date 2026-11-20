import { LevelConfig } from './types';

export const JELLY_COLORS: Record<number, { bg: string; text: string; hex: number; glowHex: number; mass: number }> = {
  2:    { bg: '#22D3EE', text: '#FFFFFF', hex: 0x22D3EE, glowHex: 0x67E8F9, mass: 1.0 },
  4:    { bg: '#4ADE80', text: '#FFFFFF', hex: 0x4ADE80, glowHex: 0x86EFAC, mass: 1.04 },
  8:    { bg: '#FB923C', text: '#FFFFFF', hex: 0xFB923C, glowHex: 0xFDBA74, mass: 1.08 },
  16:   { bg: '#F97316', text: '#FFFFFF', hex: 0xF97316, glowHex: 0xFB923C, mass: 1.12 },
  32:   { bg: '#EF4444', text: '#FFFFFF', hex: 0xEF4444, glowHex: 0xF87171, mass: 1.16 },
  64:   { bg: '#F43F5E', text: '#FFFFFF', hex: 0xF43F5E, glowHex: 0xFB7185, mass: 1.20 },
  128:  { bg: '#FACC15', text: '#0F172A', hex: 0xFACC15, glowHex: 0xFDE047, mass: 1.25 },
  256:  { bg: '#A3E635', text: '#0F172A', hex: 0xA3E635, glowHex: 0xBEF264, mass: 1.30 },
  512:  { bg: '#10B981', text: '#FFFFFF', hex: 0x10B981, glowHex: 0x34D399, mass: 1.35 },
  1024: { bg: '#8B5CF6', text: '#FFFFFF', hex: 0x8B5CF6, glowHex: 0xA78BFA, mass: 1.40 },
  2048: { bg: '#FFD700', text: '#000000', hex: 0xFFD700, glowHex: 0xFFFBEB, mass: 1.50 },
  4096: { bg: '#EC4899', text: '#FFFFFF', hex: 0xEC4899, glowHex: 0xF472B6, mass: 1.55 },
  8192: { bg: '#6366F1', text: '#FFFFFF', hex: 0x6366F1, glowHex: 0x818CF8, mass: 1.60 }
};

export const TRACK_WIDTH = 5.6; // Lateral width of the running track
export const TRACK_HALF_WIDTH = TRACK_WIDTH / 2;
export const JELLY_BASE_SIZE = 1.1; // Base cube size
export const JELLY_Y_POS = 0.55; // Baseline altitude above track surface

export const SPLIT_DISTANCE = 1.6; // Distance between left and right cubes when split

export const DEFAULT_SPEED = 14.0; // Units per second forward
export const BOOST_SPEED = 24.0; // Finish line launch speed

export const MULTIPLIER_ZONES = [
  { multiplier: 1.5, length: 15, color: '#38BDF8' },
  { multiplier: 2.0, length: 15, color: '#34D399' },
  { multiplier: 3.0, length: 18, color: '#FBBF24' },
  { multiplier: 5.0, length: 20, color: '#FB923C' },
  { multiplier: 10.0, length: 22, color: '#F43F5E' },
  { multiplier: 20.0, length: 25, color: '#A855F7' },
  { multiplier: 50.0, length: 30, color: '#E11D48' }
];

export const LEVELS: LevelConfig[] = [
  {
    levelNumber: 1,
    trackLength: 160,
    speed: 13.0,
    targetNumber: 64,
    collectibles: [
      { z: 20, x: -1.0, value: 2 },
      { z: 35, x: 1.0, value: 4 },
      { z: 50, x: -1.2, value: 4 },
      { z: 65, x: 1.2, value: 8 },
      { z: 85, x: -1.0, value: 8 },
      { z: 105, x: 1.0, value: 16 },
      { z: 125, x: 0.0, value: 16 },
      { z: 145, x: 0.0, value: 32 }
    ],
    obstacles: [
      { z: 40, x: 0, type: 'DIVIDER' }, // Center divider forces split!
      { z: 75, x: -1.4, type: 'SPINNING_SAW' },
      { z: 95, x: 1.4, type: 'SPINNING_SAW' },
      { z: 115, x: 0, type: 'DIVIDER' },
      { z: 135, x: -1.2, type: 'SPIKE_BARRIER' }
    ],
    theme: {
      trackColor: 0x0EA5E9,
      railColor: 0x38BDF8,
      skyColorTop: '#0284C7',
      skyColorBottom: '#38BDF8',
      waterColor: 0x0284C7
    }
  },
  {
    levelNumber: 2,
    trackLength: 200,
    speed: 14.5,
    targetNumber: 256,
    collectibles: [
      { z: 22, x: 0, value: 4 },
      { z: 38, x: -1.4, value: 4 },
      { z: 38, x: 1.4, value: 4 },
      { z: 58, x: 0, value: 8 },
      { z: 75, x: -1.3, value: 16 },
      { z: 92, x: 1.3, value: 16 },
      { z: 110, x: -1.4, value: 32 },
      { z: 110, x: 1.4, value: 32 },
      { z: 135, x: 0, value: 64 },
      { z: 155, x: -1.2, value: 64 },
      { z: 175, x: 1.2, value: 128 }
    ],
    obstacles: [
      { z: 30, x: 0, type: 'DIVIDER' },
      { z: 48, x: 1.3, type: 'SPINNING_SAW' },
      { z: 66, x: -1.3, type: 'SPINNING_SAW' },
      { z: 85, x: 0, type: 'DIVIDER' },
      { z: 102, x: 0, type: 'DIVIDER' },
      { z: 125, x: 1.3, type: 'SPIKE_BARRIER' },
      { z: 145, x: -1.3, type: 'SPINNING_SAW' },
      { z: 165, x: 0, type: 'DIVIDER' }
    ],
    theme: {
      trackColor: 0x8B5CF6,
      railColor: 0xC084FC,
      skyColorTop: '#6D28D9',
      skyColorBottom: '#A855F7',
      waterColor: 0x5B21B6
    }
  },
  {
    levelNumber: 3,
    trackLength: 250,
    speed: 16.0,
    targetNumber: 2048,
    collectibles: [
      { z: 25, x: -1.4, value: 16 },
      { z: 25, x: 1.4, value: 16 },
      { z: 45, x: 0, value: 32 },
      { z: 65, x: -1.3, value: 32 },
      { z: 85, x: 1.3, value: 64 },
      { z: 105, x: -1.4, value: 64 },
      { z: 105, x: 1.4, value: 64 },
      { z: 130, x: 0, value: 128 },
      { z: 150, x: -1.2, value: 128 },
      { z: 170, x: 1.2, value: 256 },
      { z: 190, x: -1.4, value: 256 },
      { z: 190, x: 1.4, value: 256 },
      { z: 215, x: 0, value: 512 },
      { z: 235, x: 0, value: 1024 }
    ],
    obstacles: [
      { z: 35, x: 0, type: 'DIVIDER' },
      { z: 55, x: -1.2, type: 'SPINNING_SAW' },
      { z: 75, x: 1.2, type: 'SPINNING_SAW' },
      { z: 95, x: 0, type: 'DIVIDER' },
      { z: 120, x: -1.3, type: 'SPIKE_BARRIER' },
      { z: 140, x: 1.3, type: 'SPIKE_BARRIER' },
      { z: 160, x: 0, type: 'DIVIDER' },
      { z: 180, x: -1.2, type: 'SPINNING_SAW' },
      { z: 200, x: 0, type: 'DIVIDER' },
      { z: 225, x: 1.2, type: 'SPINNING_SAW' }
    ],
    theme: {
      trackColor: 0xF59E0B,
      railColor: 0xFDE047,
      skyColorTop: '#B45309',
      skyColorBottom: '#FBBF24',
      waterColor: 0x92400E
    }
  }
];
