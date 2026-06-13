export const GAME_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 10,
  DEFAULT_SKIP_LIMIT: 3,
  REROLL_TOKENS: 2,
  HOT_SEAT_COUNT: 3,
  WILDCARD_CHANCE: 0.05,
  POINTS: {
    DONE: 10,
    SKIP: -5,
  },
  TIMER_OPTIONS: [15, 30, 60, 90],
  DEFAULT_TIMER: 30,
};

export const PLAYER_COLORS = [
  '#FF2D78', // neon pink
  '#00F5FF', // neon cyan
  '#9D00FF', // neon purple
  '#FFD700', // neon gold
  '#00FF88', // neon green
  '#FF6B35', // neon orange
  '#FF00FF', // magenta
  '#00BFFF', // deep sky blue
  '#FF4444', // neon red
  '#ADFF2F', // green-yellow
];

export const EMOJI_OPTIONS = [
  '😎', '🤪', '🥳', '😈', '🤠',
  '👻', '🦄', '🐉', '🎭', '🌟',
  '🔥', '💀', '🤖', '👽', '🎪',
  '🦊', '🐸', '🍕', '💎', '🎸',
  '🏆', '🎯', '⚡', '🌈', '🦋',
];

export const SCREENS = {
  SETUP: 'setup',
  GAME: 'game',
  RESULTS: 'results',
};

export const PHASES = {
  SPINNING: 'spinning',
  CHOOSING: 'choosing',
  QUESTION: 'question',
  RESULT: 'result',
};

export const MODES = {
  MILD: 'mild',
  SPICY: 'spicy',
  WILD: 'wild',
};

export const CATEGORIES = {
  EMBARRASSING: 'embarrassing',
  RELATIONSHIPS: 'relationships',
  SECRETS: 'secrets',
  OPINIONS: 'opinions',
  WILD: 'wild',
  SOCIAL: 'social',
  FUNNY: 'funny',
  CREATIVE: 'creative',
};

export const STORAGE_KEYS = {
  PLAYERS: 'tod_players',
  SETTINGS: 'tod_settings',
  CUSTOM_QUESTIONS: 'tod_custom_questions',
  GAME_STATE: 'tod_game_state',
};
