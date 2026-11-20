export const FUN_RACE_CONSTANTS = {
  // Movement Physics
  PLAYER_RUN_SPEED: 8.2, // Units per second along track spline
  DECELERATION_TIME: 0.04, // Brake time in seconds
  GRAVITY: -24.0, // Falling gravity
  KNOCKBACK_UP_VELOCITY: 7.2,
  KNOCKBACK_LATERAL_VELOCITY: 8.5,
  RESPAWN_DELAY: 1.1, // Seconds before checkpoint respawn
  INVINCIBLE_TIME: 0.8, // Invincibility flash after respawn

  // Dimensions & Collisions
  CHARACTER_RADIUS: 0.38,
  CHARACTER_HEIGHT: 1.5,
  TRACK_WIDTH: 2.6,
  WATER_SURFACE_Y: -2.8,

  // Camera Settings
  CAMERA_FOLLOW_DISTANCE: 7.2,
  CAMERA_HEIGHT: 5.6,
  CAMERA_LOOKAHEAD: 3.2,
  CAMERA_LERP: 0.12,
  CAMERA_FOV: 55,

  // Visual Themes
  COLORS: {
    WATER: '#00B4D8',
    WATER_DEEP: '#0077B6',
    TRACK_CYAN: '#00F0FF',
    TRACK_AMBER: '#FFB703',
    TRACK_CORAL: '#FF4D6D',
    TRACK_EMERALD: '#10B981',
    TRACK_PURPLE: '#8B5CF6',
    OBSTACLE_DANGER: '#EF4444',
    OBSTACLE_WARN: '#F59E0B',
    OBSTACLE_METAL: '#334155',
    PLAYER: '#00E5FF',
    BOT_1: '#EF4444',
    BOT_2: '#FBBF24',
    CHECKPOINT: '#10B981',
    FINISH_GOLD: '#FACC15'
  }
};
