'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { GAMES_CATALOG, useAppStore } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import { Sparkles, Play, Users, ChevronLeft, ChevronRight } from 'lucide-react';

type CategoryKey =
  | 'desi-classics'
  | 'endless-run'
  | 'multiplayer'
  | 'racing'
  | 'action'
  | 'meme-games'
  | 'party';

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  emoji: string;
  tag: string;
  tagColor: string;
  gameCount: string;
  title: string;
  description: string;
  exploreHref: string;
  gameIds: string[];
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    key: 'desi-classics',
    label: 'Desi Classics',
    emoji: '👑',
    tag: 'ICONIC INDIAN GAMES',
    tagColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    gameCount: '3 Games Ready',
    title: 'DESI CLASSICS',
    description: 'Raja Mantri Chor Sipahi, rough notebook Spin Cricket, and classroom Pen Flip battles. The games that ruled Indian childhoods.',
    exploreHref: '/games?cat=school',
    gameIds: ['chor-sipahi', 'spin-cricket', 'pen-flip']
  },
  {
    key: 'endless-run',
    label: 'Endless Run',
    emoji: '🏃',
    tag: 'HIGH VELOCITY DESI CORRIDORS',
    tagColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
    gameCount: '2 Games Ready',
    title: 'ENDLESS RUN',
    description: 'Full speed dashes through Grand Trunk highways and Delhi street checkpoints. Collect chai refills, dodge traffic, and break records.',
    exploreHref: '/games?cat=meme',
    gameIds: ['truck-run', 'genz-protest-run']
  },
  {
    key: 'multiplayer',
    label: 'Multiplayer Masti',
    emoji: '👥',
    tag: 'SQUAD ROOM BATTLES',
    tagColor: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
    gameCount: '3 Games Ready',
    title: 'MULTIPLAYER MASTI',
    description: 'Settle hostel arguments, bluff with your squad, and battle friends across India with instant 6-character room codes.',
    exploreHref: '/games?cat=squad',
    gameIds: ['chor-sipahi', 'auto-rush', 'fake-bomb']
  },
  {
    key: 'racing',
    label: 'Desi Racing',
    emoji: '🛺',
    tag: '3D WHEELS OF INDIA',
    tagColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    gameCount: '2 Games Ready',
    title: 'DESI RACING',
    description: 'Drift 3-wheel auto-rickshaws in the Gurugram Grand Prix or commandeer the legendary Tata 1613 heavy lorry with pressure horns.',
    exploreHref: '/games',
    gameIds: ['truck-run', 'auto-rush']
  },
  {
    key: 'action',
    label: 'Action & Battle',
    emoji: '⚔️',
    tag: 'STREET & RUMBLE COMBAT',
    tagColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
    gameCount: '2 Games Ready',
    title: 'ACTION & BATTLE',
    description: 'Satirical political 1v1 brawl arenas and tense risk-door escape chambers with real combat engines and combos.',
    exploreHref: '/games',
    gameIds: ['indian-politics-arena', 'escape-door']
  },
  {
    key: 'meme-games',
    label: 'Meme Games',
    emoji: '🔥',
    tag: 'VIRAL INDIAN INTERNET CULTURE',
    tagColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    gameCount: '3 Games Ready',
    title: 'MEME GAMES',
    description: 'Unhinged desi chaos inspired by Indian memes, viral news, dhaba banter, and street humor.',
    exploreHref: '/games?cat=meme',
    gameIds: ['indian-politics-arena', 'genz-protest-run', 'truck-run']
  },
  {
    key: 'party',
    label: 'Party Games',
    emoji: '🎉',
    tag: 'HOSTEL & ROOM PARTY',
    tagColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    gameCount: '3 Games Ready',
    title: 'PARTY GAMES',
    description: 'Hot potato ticking bombs, rapid vocabulary anagram duels, and classic Tic-Tac-Toe showdowns for groups of friends.',
    exploreHref: '/games?cat=brain',
    gameIds: ['fake-bomb', 'word-builder', 'tic-tac-toe']
  }
];

export const PickYourVibeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryKey>('desi-classics');
  const carouselRef = useRef<HTMLDivElement>(null);
  const { openMultiplayerModal } = useAppStore();

  const currentConfig =
    CATEGORY_CONFIGS.find((c) => c.key === activeTab) || CATEGORY_CONFIGS[0];

  const handleScroll = (amount: number) => {
    soundFx.playClick();
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleTabChange = (key: CategoryKey) => {
    soundFx.playClick();
    setActiveTab(key);
  };

  return (
    <section id="games" className="w-full px-4 sm:px-8 xl:px-14 py-14 scroll-mt-24 select-none">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#1B1B22] border border-amber-500/25 text-amber-400 text-xs uppercase tracking-widest font-black shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GULLY CATEGORIES &amp; MODES</span>
          </div>
          <h2 className="font-headline-xl uppercase text-white tracking-tight mt-2 text-3xl sm:text-4xl font-black">
            CHOOSE YOUR GULLY VIBE
          </h2>
          <p className="font-body-lg text-slate-300 max-w-2xl mt-1">
            From unhinged 4-player bluffing to nostalgic last-bench school games and high-octane 3D street racing.
          </p>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#1B1B22] border border-white/10 backdrop-blur-xl max-w-5xl mx-auto">
          {CATEGORY_CONFIGS.map((config) => {
            const isActive = activeTab === config.key;
            return (
              <button
                key={config.key}
                onClick={() => handleTabChange(config.key)}
                className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(255,159,28,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Showcase Panel */}
        <div className="flex flex-col gap-6">
          {/* Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1B1B22] via-[#24242E] to-[#1B1B22] border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col gap-1.5 z-10">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${currentConfig.tagColor}`}>
                  {currentConfig.emoji} {currentConfig.tag}
                </span>
                <span className="text-[11px] text-teal-400 font-black">
                  {currentConfig.gameCount}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                {currentConfig.title}
              </h3>
              <p className="font-body-md text-slate-300 max-w-xl text-sm leading-relaxed">
                {currentConfig.description}
              </p>
            </div>

            <div className="flex items-center gap-3 z-10 self-start md:self-auto">
              <Link
                href="/games"
                onClick={() => soundFx.playClick()}
                className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-500 text-slate-950 hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-md"
              >
                <span>EXPLORE ALL GAMES</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleScroll(-360)}
                  className="w-10 h-10 rounded-xl bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/10"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleScroll(360)}
                  className="w-10 h-10 rounded-xl bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/10"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Games Slider - Center Aligned Across All Categories */}
          <div
            ref={carouselRef}
            className="w-full overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
          >
            <div className="flex items-stretch justify-start sm:justify-center gap-6 w-fit min-w-full sm:min-w-fit mx-auto px-2">
              {currentConfig.gameIds.map((gameId) => {
                const game =
                  GAMES_CATALOG.find((g) => g.id === gameId) || GAMES_CATALOG[0];
                return (
                  <div
                    key={game.id}
                    className="w-[320px] sm:w-[380px] lg:w-[410px] snap-center shrink-0 rounded-3xl bg-[#1B1B22]/90 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-between shadow-xl border border-white/10 hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(255,159,28,0.25)] transition-all duration-300 group"
                  >
                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/games/${game.slug || game.id}`}
                        onClick={() => soundFx.playClick()}
                        className="w-full aspect-[16/9] rounded-2xl bg-black/50 overflow-hidden relative flex items-center justify-center block group border border-white/5"
                      >
                        {game.bannerImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={game.bannerImage}
                            alt={game.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-7xl">{game.thumbnail}</span>
                        )}
                      </Link>

                      <div className="flex items-center justify-center gap-2 text-slate-400 text-xs pt-1 px-1 font-bold text-center">
                        <span className="flex items-center gap-1">
                          {game.multiplayer ? '👥 MULTIPLAYER' : '🕹️ SOLO ARCADE'} • {game.duration}
                        </span>
                        <span className="text-teal-400 uppercase tracking-wider font-extrabold">• {game.difficulty} IQ</span>
                      </div>

                      <div className="px-1 flex flex-col items-center text-center gap-1.5">
                        <Link
                          href={`/games/${game.slug || game.id}`}
                          onClick={() => soundFx.playClick()}
                          className="w-full"
                        >
                          <h4 className="text-xl sm:text-2xl font-black text-white truncate group-hover:text-amber-400 transition-colors text-center">
                            {game.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 min-h-[36px] text-center max-w-sm">
                          {game.tagline || game.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2.5 mt-5 pt-3 border-t border-white/10 w-full">
                      <Link
                        href={`/games/${game.slug || game.id}`}
                        onClick={() => soundFx.playClick()}
                        className="flex-1 py-3 px-4 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md text-center flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>PLAY NOW</span>
                      </Link>
                      {game.multiplayer && (
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            openMultiplayerModal(game);
                          }}
                          className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5 border border-white/10"
                        >
                          <Users className="w-3.5 h-3.5 text-teal-400" />
                          <span>SQUAD</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PickYourVibeSection;
