import { LevelConfig } from './types';

export const FUN_RACE_LEVELS: LevelConfig[] = [
  // LEVEL 1: Lagoon Sprint (Introductory Course)
  {
    levelNumber: 1,
    name: 'Lagoon Sprint',
    totalLength: 75,
    trackWidth: 2.6,
    trackColor: '#00F0FF',
    curbColor: '#1E293B',
    waterColor: '#00B4D8',
    waypoints: [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 20 },
      { x: 3, y: 0, z: 40 },
      { x: 0, y: 0, z: 60 },
      { x: 0, y: 0, z: 80 }
    ],
    checkpoints: [40],
    obstacles: [
      {
        id: 'obs_1_1',
        type: 'SWEEPER',
        s: 18,
        speed: 2.2,
        arms: 2,
        width: 2.5
      },
      {
        id: 'obs_1_2',
        type: 'HAMMER',
        s: 32,
        speed: 2.4,
        amplitude: 1.15
      },
      {
        id: 'obs_1_3',
        type: 'SWEEPER',
        s: 55,
        speed: 2.6,
        arms: 2,
        width: 2.5,
        reverse: true
      }
    ],
    opponents: [
      {
        id: 'bot_red',
        name: 'Crimson Rush',
        color: '#EF4444',
        lateralOffset: 0.65,
        speedFactor: 0.96,
        aggression: 0.5,
        accuracy: 0.88
      }
    ]
  },

  // LEVEL 2: Archipelago Slalom
  {
    levelNumber: 2,
    name: 'Archipelago Slalom',
    totalLength: 110,
    trackWidth: 2.6,
    trackColor: '#FFB703',
    curbColor: '#1E293B',
    waterColor: '#0096C7',
    waypoints: [
      { x: 0, y: 0, z: 0 },
      { x: -5, y: 0, z: 25 },
      { x: 5, y: 0, z: 50 },
      { x: 8, y: 0, z: 80 },
      { x: 0, y: 0, z: 115 }
    ],
    checkpoints: [35, 75],
    obstacles: [
      {
        id: 'obs_2_1',
        type: 'HAMMER',
        s: 16,
        speed: 2.5,
        amplitude: 1.2
      },
      {
        id: 'obs_2_2',
        type: 'PUSHER',
        s: 28,
        speed: 3.2,
        amplitude: 2.0
      },
      {
        id: 'obs_2_3',
        type: 'SWEEPER',
        s: 48,
        speed: 2.8,
        arms: 3,
        width: 2.5
      },
      {
        id: 'obs_2_4',
        type: 'ROLLER',
        s: 66,
        speed: 3.0,
        width: 2.6
      },
      {
        id: 'obs_2_5',
        type: 'HAMMER',
        s: 88,
        speed: 2.7,
        amplitude: 1.25,
        phaseOffset: 1.5
      },
      {
        id: 'obs_2_6',
        type: 'PUSHER',
        s: 98,
        speed: 3.4,
        amplitude: 2.2,
        reverse: true
      }
    ],
    opponents: [
      {
        id: 'bot_red',
        name: 'Crimson Rush',
        color: '#EF4444',
        lateralOffset: -0.65,
        speedFactor: 0.97,
        aggression: 0.6,
        accuracy: 0.89
      },
      {
        id: 'bot_gold',
        name: 'Golden Bolt',
        color: '#F59E0B',
        lateralOffset: 0.65,
        speedFactor: 0.99,
        aggression: 0.7,
        accuracy: 0.85
      }
    ]
  },

  // LEVEL 3: The Colosseum Gauntlet
  {
    levelNumber: 3,
    name: "The Colosseum Gauntlet",
    totalLength: 140,
    trackWidth: 2.7,
    trackColor: '#FF4D6D',
    curbColor: '#1E293B',
    waterColor: '#023E8A',
    waypoints: [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 30 },
      { x: 18, y: 0, z: 65 },
      { x: 8, y: 0, z: 100 },
      { x: -5, y: 0, z: 125 },
      { x: 0, y: 0, z: 150 }
    ],
    checkpoints: [35, 75, 115],
    obstacles: [
      {
        id: 'obs_3_1',
        type: 'SWEEPER',
        s: 18,
        speed: 3.2,
        arms: 4,
        width: 2.6
      },
      {
        id: 'obs_3_2',
        type: 'PUSHER',
        s: 30,
        speed: 3.8,
        amplitude: 2.2
      },
      {
        id: 'obs_3_3',
        type: 'HAMMER',
        s: 48,
        speed: 3.0,
        amplitude: 1.3
      },
      {
        id: 'obs_3_4',
        type: 'HAMMER',
        s: 56,
        speed: 3.0,
        amplitude: 1.3,
        phaseOffset: Math.PI
      },
      {
        id: 'obs_3_5',
        type: 'GATE',
        s: 70,
        speed: 2.8
      },
      {
        id: 'obs_3_6',
        type: 'ROLLER',
        s: 88,
        speed: 3.5,
        width: 2.6
      },
      {
        id: 'obs_3_7',
        type: 'PUSHER',
        s: 105,
        speed: 4.0,
        amplitude: 2.2,
        reverse: true
      },
      {
        id: 'obs_3_8',
        type: 'SWEEPER',
        s: 122,
        speed: 3.6,
        arms: 4,
        width: 2.6,
        reverse: true
      }
    ],
    opponents: [
      {
        id: 'bot_red',
        name: 'Crimson Rush',
        color: '#EF4444',
        lateralOffset: -0.7,
        speedFactor: 1.0,
        aggression: 0.8,
        accuracy: 0.92
      },
      {
        id: 'bot_gold',
        name: 'Golden Bolt',
        color: '#F59E0B',
        lateralOffset: 0.7,
        speedFactor: 1.01,
        aggression: 0.85,
        accuracy: 0.87
      }
    ]
  }
];
