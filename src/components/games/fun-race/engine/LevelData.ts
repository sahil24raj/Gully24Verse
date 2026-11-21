import { LevelConfig } from './types';

export const FUN_RACE_LEVELS: LevelConfig[] = [
  // LEVEL 1: Lagoon Sprint (Relaxed, Easy-to-Play, Wide Openings)
  {
    levelNumber: 1,
    name: 'Lagoon Sprint',
    totalLength: 75,
    trackWidth: 2.8,
    trackColor: '#00F0FF',
    curbColor: '#1E293B',
    waterColor: '#00B4D8',
    waypoints: [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 20 },
      { x: 2.0, y: 0, z: 42 },
      { x: 0, y: 0, z: 62 },
      { x: 0, y: 0, z: 80 }
    ],
    checkpoints: [24, 46],
    obstacles: [
      {
        id: 'obs_1_1',
        type: 'SWEEPER',
        s: 16,
        speed: 0.55, // Very slow, generous 3.5s window
        arms: 2,
        width: 2.3
      },
      {
        id: 'obs_1_2',
        type: 'HAMMER',
        s: 36,
        speed: 0.7, // Gentle pendulum swing
        amplitude: 1.0
      },
      {
        id: 'obs_1_3',
        type: 'SWEEPER',
        s: 58,
        speed: 0.55,
        arms: 2,
        width: 2.3,
        reverse: true
      }
    ],
    opponents: [
      {
        id: 'bot_red',
        name: 'Crimson Rush',
        color: '#EF4444',
        lateralOffset: 0.7,
        speedFactor: 0.88,
        aggression: 0.35,
        accuracy: 0.90
      }
    ]
  },

  // LEVEL 2: Archipelago Slalom (Easy & Balanced, Crusher + Sweeper)
  {
    levelNumber: 2,
    name: 'Archipelago Slalom',
    totalLength: 105,
    trackWidth: 2.8,
    trackColor: '#FFB703',
    curbColor: '#1E293B',
    waterColor: '#0096C7',
    waypoints: [
      { x: 0, y: 0, z: 0 },
      { x: -3.5, y: 0, z: 25 },
      { x: 3.5, y: 0, z: 52 },
      { x: 4.5, y: 0, z: 80 },
      { x: 0, y: 0, z: 110 }
    ],
    checkpoints: [24, 52, 78],
    obstacles: [
      {
        id: 'obs_2_1',
        type: 'HAMMER',
        s: 16,
        speed: 0.7,
        amplitude: 1.05
      },
      {
        id: 'obs_2_2',
        type: 'PUSHER',
        s: 34,
        speed: 0.8,
        amplitude: 1.6
      },
      {
        id: 'obs_2_3',
        type: 'SWEEPER',
        s: 44,
        speed: 0.6, // Slow rotation, only 2 arms
        arms: 2,
        width: 2.3
      },
      {
        id: 'obs_2_4',
        type: 'ROLLER', // Hydraulic Overhead Crusher Stamp
        s: 64,
        speed: 0.75, // Stays up long, very easy to run under
        width: 2.3
      },
      {
        id: 'obs_2_5',
        type: 'HAMMER',
        s: 88,
        speed: 0.75,
        amplitude: 1.1,
        phaseOffset: 1.2
      }
    ],
    opponents: [
      {
        id: 'bot_red',
        name: 'Crimson Rush',
        color: '#EF4444',
        lateralOffset: -0.7,
        speedFactor: 0.89,
        aggression: 0.45,
        accuracy: 0.92
      },
      {
        id: 'bot_gold',
        name: 'Golden Bolt',
        color: '#F59E0B',
        lateralOffset: 0.7,
        speedFactor: 0.91,
        aggression: 0.5,
        accuracy: 0.90
      }
    ]
  },

  // LEVEL 3: The Colosseum Gauntlet (Accessible, 2-Arm Sweepers, Slower Speeds)
  {
    levelNumber: 3,
    name: 'The Colosseum Gauntlet',
    totalLength: 135,
    trackWidth: 2.8,
    trackColor: '#FF4D6D',
    curbColor: '#1E293B',
    waterColor: '#023E8A',
    waypoints: [
      { x: 0, y: 0, z: 0 },
      { x: 6, y: 0, z: 28 },
      { x: 12, y: 0, z: 60 },
      { x: 4, y: 0, z: 95 },
      { x: -3, y: 0, z: 120 },
      { x: 0, y: 0, z: 145 }
    ],
    checkpoints: [25, 52, 82, 108],
    obstacles: [
      {
        id: 'obs_3_1',
        type: 'SWEEPER',
        s: 16,
        speed: 0.6, // 2 arms only, slow & easy!
        arms: 2,
        width: 2.3
      },
      {
        id: 'obs_3_2',
        type: 'PUSHER',
        s: 35,
        speed: 0.8,
        amplitude: 1.7
      },
      {
        id: 'obs_3_3',
        type: 'HAMMER',
        s: 46,
        speed: 0.75,
        amplitude: 1.1
      },
      {
        id: 'obs_3_4',
        type: 'GATE',
        s: 66,
        speed: 0.7
      },
      {
        id: 'obs_3_5',
        type: 'ROLLER', // Hydraulic Crusher
        s: 88,
        speed: 0.75,
        width: 2.3
      },
      {
        id: 'obs_3_6',
        type: 'PUSHER',
        s: 100,
        speed: 0.8,
        amplitude: 1.7,
        reverse: true
      },
      {
        id: 'obs_3_7',
        type: 'SWEEPER',
        s: 118,
        speed: 0.6,
        arms: 2,
        width: 2.3,
        reverse: true
      }
    ],
    opponents: [
      {
        id: 'bot_red',
        name: 'Crimson Rush',
        color: '#EF4444',
        lateralOffset: -0.7,
        speedFactor: 0.90,
        aggression: 0.55,
        accuracy: 0.93
      },
      {
        id: 'bot_gold',
        name: 'Golden Bolt',
        color: '#F59E0B',
        lateralOffset: 0.7,
        speedFactor: 0.92,
        aggression: 0.6,
        accuracy: 0.91
      }
    ]
  }
];

