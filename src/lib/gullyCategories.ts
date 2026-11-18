export type GullyCategoryKey =
  | 'ALL'
  | 'desi-classics'
  | 'endless-run'
  | 'multiplayer'
  | 'racing'
  | 'action'
  | 'meme-games'
  | 'party';

export interface GullyCategory {
  key: GullyCategoryKey;
  label: string;
  emoji: string;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  gameIds: string[];
}

export const GULLY_CATEGORIES: GullyCategory[] = [
  {
    key: 'desi-classics',
    label: 'Desi Classics',
    emoji: '👑',
    tag: 'ICONIC INDIAN GAMES',
    tagColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    title: 'DESI CLASSICS',
    description:
      'Raja Mantri Chor Sipahi, rough notebook Spin Cricket, classroom Pen Flip battles, and classic Zero Kaata. The games that ruled Indian childhoods.',
    gameIds: ['chor-sipahi', 'spin-cricket', 'pen-flip', 'tic-tac-toe']
  },
  {
    key: 'endless-run',
    label: 'Endless Run',
    emoji: '🏃',
    tag: 'HIGH VELOCITY DESI CORRIDORS',
    tagColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
    title: 'ENDLESS RUN',
    description:
      'Full speed dashes through Grand Trunk highways, Chroma runways and Delhi street checkpoints. Collect chai refills, dodge traffic, and break records.',
    gameIds: ['giant-rush', 'truck-run', 'genz-protest-run', 'auto-rush']
  },
  {
    key: 'multiplayer',
    label: 'Multiplayer Masti',
    emoji: '👥',
    tag: 'SQUAD ROOM BATTLES',
    tagColor: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
    title: 'MULTIPLAYER MASTI',
    description:
      'Settle hostel arguments, bluff with your squad, and battle friends across India with instant 6-character room codes.',
    gameIds: [
      'chor-sipahi',
      'auto-rush',
      'spin-cricket',
      'pen-flip',
      'indian-politics-arena',
      'fake-bomb',
      'tic-tac-toe'
    ]
  },
  {
    key: 'racing',
    label: 'Desi Racing',
    emoji: '🛺',
    tag: '3D WHEELS OF INDIA',
    tagColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    title: 'DESI RACING',
    description:
      'Drift 3-wheel auto-rickshaws in the Gurugram Grand Prix or commandeer the legendary Tata 1613 heavy lorry with pressure horns.',
    gameIds: ['truck-run', 'auto-rush']
  },
  {
    key: 'action',
    label: 'Action & Battle',
    emoji: '⚔️',
    tag: 'STREET & RUMBLE COMBAT',
    tagColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
    title: 'ACTION & BATTLE',
    description:
      'Satirical political 1v1 brawl arenas, Giant Rush chroma Titan brawls, tense risk-door escape chambers, and high-speed bench combat.',
    gameIds: ['giant-rush', 'indian-politics-arena', 'escape-door', 'fake-bomb', 'pen-flip']
  },
  {
    key: 'meme-games',
    label: 'Meme Games',
    emoji: '🔥',
    tag: 'VIRAL INDIAN INTERNET CULTURE',
    tagColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    title: 'MEME GAMES',
    description:
      'Unhinged desi chaos inspired by Indian memes, viral news, dhaba banter, and street humor.',
    gameIds: ['indian-politics-arena', 'genz-protest-run', 'truck-run', 'auto-rush']
  },
  {
    key: 'party',
    label: 'Party Games',
    emoji: '🎉',
    tag: 'HOSTEL & ROOM PARTY',
    tagColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    title: 'PARTY GAMES',
    description:
      'Hot potato ticking bombs, rapid vocabulary anagram duels, IQ micro-challenges, and classic social bluffing showdowns.',
    gameIds: ['fake-bomb', 'chor-sipahi', 'word-builder', 'brain-pot', 'tic-tac-toe']
  }
];

// Helper to get category by key with fallback and legacy alias support
export function getCategoryConfig(key: string): GullyCategory {
  const normalized = normalizeCategoryKey(key);
  return GULLY_CATEGORIES.find((c) => c.key === normalized) || GULLY_CATEGORIES[0];
}

export function normalizeCategoryKey(key: string): GullyCategoryKey {
  if (key === 'school') return 'desi-classics';
  if (key === 'meme') return 'meme-games';
  if (key === 'squad') return 'multiplayer';
  if (key === 'brain') return 'party';
  return (key as GullyCategoryKey) || 'ALL';
}
