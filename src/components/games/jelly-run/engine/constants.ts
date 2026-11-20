import { LevelConfig } from './types';

export const JELLY_COLORS: Record<number, { bg: string; text: string; hex: number; glowHex: number; mass: number }> = {
  2:    { bg: '#22D3EE', text: '#FFFFFF', hex: 0x22D3EE, glowHex: 0x67E8F9, mass: 1.00 },
  4:    { bg: '#4ADE80', text: '#FFFFFF', hex: 0x4ADE80, glowHex: 0x86EFAC, mass: 1.02 },
  8:    { bg: '#FB923C', text: '#FFFFFF', hex: 0xFB923C, glowHex: 0xFDBA74, mass: 1.04 },
  16:   { bg: '#F97316', text: '#FFFFFF', hex: 0xF97316, glowHex: 0xFB923C, mass: 1.06 },
  32:   { bg: '#EF4444', text: '#FFFFFF', hex: 0xEF4444, glowHex: 0xF87171, mass: 1.08 },
  64:   { bg: '#F43F5E', text: '#FFFFFF', hex: 0xF43F5E, glowHex: 0xFB7185, mass: 1.10 },
  128:  { bg: '#FACC15', text: '#0F172A', hex: 0xFACC15, glowHex: 0xFDE047, mass: 1.13 },
  256:  { bg: '#A3E635', text: '#0F172A', hex: 0xA3E635, glowHex: 0xBEF264, mass: 1.16 },
  512:  { bg: '#10B981', text: '#FFFFFF', hex: 0x10B981, glowHex: 0x34D399, mass: 1.19 },
  1024: { bg: '#8B5CF6', text: '#FFFFFF', hex: 0x8B5CF6, glowHex: 0xA78BFA, mass: 1.21 },
  2048: { bg: '#FFD700', text: '#000000', hex: 0xFFD700, glowHex: 0xFFFBEB, mass: 1.24 },
  4096: { bg: '#EC4899', text: '#FFFFFF', hex: 0xEC4899, glowHex: 0xF472B6, mass: 1.26 },
  8192: { bg: '#6366F1', text: '#FFFFFF', hex: 0x6366F1, glowHex: 0x818CF8, mass: 1.28 }
};

export const TRACK_WIDTH = 7.8; // Generous width ensuring wide corridors for expanded jellies
export const TRACK_HALF_WIDTH = TRACK_WIDTH / 2;
export const JELLY_BASE_SIZE = 1.0; // Optimized base cube size
export const JELLY_Y_POS = 0.50; // Baseline altitude above track surface

export const SPLIT_DISTANCE = 3.4; // Wide distance giving clear corridor on both sides of center divider

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
      { z: 20, x: 0.0, value: 2 },
      { z: 32, x: -1.7, value: 4 },
      { z: 32, x: 1.7, value: 4 },
      { z: 55, x: 0.0, value: 8 },
      { z: 70, x: -1.7, value: 8 },
      { z: 70, x: 1.7, value: 8 },
      { z: 95, x: 0.0, value: 16 },
      { z: 110, x: -1.7, value: 16 },
      { z: 110, x: 1.7, value: 16 },
      { z: 135, x: 0.0, value: 32 }
    ],
    obstacles: [
      { z: 40, x: 0, type: 'DIVIDER' }, // Center divider - cleanly splits at x=0
      { z: 62, x: -2.3, type: 'SPINNING_SAW' }, // Leaves wide center & right lane open
      { z: 82, x: 2.3, type: 'SPINNING_SAW' },  // Leaves wide center & left lane open
      { z: 102, x: 0, type: 'DIVIDER' }, // Second divider - split to pass!
      { z: 124, x: -2.3, type: 'SPIKE_BARRIER' }
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
      { z: 20, x: 0, value: 4 },
      { z: 35, x: -1.7, value: 4 },
      { z: 35, x: 1.7, value: 4 },
      { z: 58, x: 0, value: 8 },
      { z: 72, x: -1.7, value: 16 },
      { z: 72, x: 1.7, value: 16 },
      { z: 95, x: 0, value: 32 },
      { z: 112, x: -1.7, value: 32 },
      { z: 112, x: 1.7, value: 32 },
      { z: 135, x: 0, value: 64 },
      { z: 155, x: -1.7, value: 64 },
      { z: 155, x: 1.7, value: 64 },
      { z: 180, x: 0, value: 128 }
    ],
    obstacles: [
      { z: 42, x: 0, type: 'DIVIDER' },
      { z: 62, x: 2.3, type: 'SPINNING_SAW' },
      { z: 82, x: -2.3, type: 'SPINNING_SAW' },
      { z: 102, x: 0, type: 'DIVIDER' },
      { z: 124, x: 2.3, type: 'SPIKE_BARRIER' },
      { z: 145, x: 0, type: 'DIVIDER' },
      { z: 168, x: -2.3, type: 'SPINNING_SAW' }
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
      { z: 22, x: -1.7, value: 16 },
      { z: 22, x: 1.7, value: 16 },
      { z: 45, x: 0, value: 32 },
      { z: 65, x: -1.7, value: 32 },
      { z: 65, x: 1.7, value: 32 },
      { z: 88, x: 0, value: 64 },
      { z: 108, x: -1.7, value: 64 },
      { z: 108, x: 1.7, value: 64 },
      { z: 130, x: 0, value: 128 },
      { z: 152, x: -1.7, value: 128 },
      { z: 152, x: 1.7, value: 128 },
      { z: 175, x: 0, value: 256 },
      { z: 195, x: -1.7, value: 256 },
      { z: 195, x: 1.7, value: 256 },
      { z: 218, x: 0, value: 512 },
      { z: 238, x: 0, value: 1024 }
    ],
    obstacles: [
      { z: 32, x: 0, type: 'DIVIDER' },
      { z: 54, x: -2.3, type: 'SPINNING_SAW' },
      { z: 76, x: 2.3, type: 'SPINNING_SAW' },
      { z: 98, x: 0, type: 'DIVIDER' },
      { z: 118, x: -2.3, type: 'SPIKE_BARRIER' },
      { z: 140, x: 2.3, type: 'SPIKE_BARRIER' },
      { z: 162, x: 0, type: 'DIVIDER' },
      { z: 184, x: -2.3, type: 'SPINNING_SAW' },
      { z: 206, x: 0, type: 'DIVIDER' },
      { z: 228, x: 2.3, type: 'SPINNING_SAW' }
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
