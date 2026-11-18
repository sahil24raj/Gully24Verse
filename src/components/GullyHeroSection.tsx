'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore, GAMES_CATALOG } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import confetti from 'canvas-confetti';
import {
  Play,
  Users,
  Compass,
  Gift,
  Flame,
  Target
} from 'lucide-react';

interface CategoryCard {
  id: string;
  name: string;
  image: string;
  borderColor: string;
  glowColor: string;
  categoryFilterKey: string;
  featuredRoute: string;
}

export const GullyHeroSection: React.FC = () => {
  const router = useRouter();
  const { openMultiplayerModal, openDailySpinModal } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<string>('desi-specials');

  const handlePlayNow = () => {
    try {
      soundFx.playGameStart();
    } catch {
      // Audio safety
    }
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF9F1C', '#00BFA6', '#F04438', '#FACC15']
    });
    // Launch featured flagship game
    router.push('/game/auto-rush');
  };

  const handleExploreGully = () => {
    try {
      soundFx.playClick();
    } catch {
      // Audio safety
    }
    const el = document.getElementById('games');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/games');
    }
  };

  const handleLaunchGame = (route: string) => {
    try {
      soundFx.playGameStart();
    } catch {
      // Audio safety
    }
    router.push(route);
  };

  const handleCategoryClick = (card: CategoryCard) => {
    try {
      soundFx.playClick();
    } catch {
      // Audio safety
    }
    setActiveCategory(card.id);
    
    // Smooth scroll to games section
    const el = document.getElementById('games');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // The 6 Iconic Category Cards exactly matching the Reference Mockup
  const categoryCards: CategoryCard[] = [
    {
      id: 'cricket-zone',
      name: 'Cricket Zone',
      image: '/categories/cricket_zone_2x.jpg',
      borderColor: '#22C55E',
      glowColor: 'rgba(34, 197, 94, 0.45)',
      categoryFilterKey: 'cricket',
      featuredRoute: '/game/spin-cricket'
    },
    {
      id: 'racing-hub',
      name: 'Racing Hub',
      image: '/categories/racing_hub_2x.jpg',
      borderColor: '#EF4444',
      glowColor: 'rgba(239, 68, 68, 0.45)',
      categoryFilterKey: 'racing',
      featuredRoute: '/game/auto-rush'
    },
    {
      id: 'arcade-adda',
      name: 'Arcade Adda',
      image: '/categories/arcade_adda_2x.jpg',
      borderColor: '#A855F7',
      glowColor: 'rgba(168, 85, 247, 0.45)',
      categoryFilterKey: 'action',
      featuredRoute: '/game/giant-rush'
    },
    {
      id: 'puzzle-gully',
      name: 'Puzzle Gully',
      image: '/categories/puzzle_gully_2x.jpg',
      borderColor: '#8B5CF6',
      glowColor: 'rgba(139, 92, 246, 0.45)',
      categoryFilterKey: 'party',
      featuredRoute: '/game/word-builder'
    },
    {
      id: 'multiplayer',
      name: 'Multiplayer',
      image: '/categories/multiplayer_2x.jpg',
      borderColor: '#3B82F6',
      glowColor: 'rgba(59, 130, 246, 0.45)',
      categoryFilterKey: 'multiplayer',
      featuredRoute: '/game/chor-sipahi'
    },
    {
      id: 'desi-specials',
      name: 'Desi Specials',
      image: '/categories/desi_specials_2x.jpg',
      borderColor: '#FF9F1C',
      glowColor: 'rgba(255, 159, 28, 0.55)',
      categoryFilterKey: 'desi-classics',
      featuredRoute: '/game/chor-sipahi'
    }
  ];

  // 3 Right-side Trending Games with thumbnails and Play buttons
  const trendingGames = [
    {
      id: 'truck-run',
      name: 'Truck Run 3D',
      emoji: '🚛',
      image: '/games/truck-run.jpg',
      route: '/game/truck-run'
    },
    {
      id: 'chor-sipahi',
      name: 'Chor Sipahi',
      emoji: '👑',
      image: '/games/chor-sipahi.jpg',
      route: '/game/chor-sipahi'
    },
    {
      id: 'auto-rush',
      name: 'Auto Rush',
      emoji: '🛺',
      image: '/games/auto-rush.jpg',
      route: '/game/auto-rush'
    }
  ];

  return (
    <section className="relative w-full overflow-hidden pt-4 pb-10 px-4 sm:px-8 xl:px-14">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-10 relative z-10">
        
        {/* Main Hero Row: Headline on Left, 3 Glass Widgets on Right */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pt-10 sm:pt-14 lg:pt-20 min-h-[380px]">
          
          {/* Left Column: Minimalistic text & Action Buttons letting the Gully graffiti shine */}
          <div className="max-w-xl flex flex-col gap-4 mt-auto pb-4">
            <div className="flex flex-col gap-1.5 drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
              <h2 className="text-white font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight leading-snug">
                Play • Compete • Create • Win
              </h2>
              <p className="text-slate-200 text-sm sm:text-base font-semibold leading-relaxed">
                Desi Games, Arcade Fun &amp; Multiplayer Battles
              </p>
            </div>

            {/* Action Buttons matching Reference Mockup */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handlePlayNow}
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#FFB703] hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_28px_rgba(255,183,3,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Play Now</span>
              </button>

              <button
                onClick={handleExploreGully}
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-black/55 hover:bg-black/75 text-white font-bold text-sm tracking-wide border border-white/35 hover:border-white transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer backdrop-blur-md"
              >
                <Compass className="w-4 h-4 text-white" />
                <span>Explore Gully</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Floating Glass Widgets (Daily Challenge, Online Now, Trending Games) */}
          <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0 lg:self-end">
            
            {/* 1. Daily Challenge Widget */}
            <div
              onClick={() => openDailySpinModal()}
              className="p-3.5 rounded-2xl bg-[#1B1B22]/85 hover:bg-[#1B1B22] border border-amber-500/30 backdrop-blur-md shadow-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daily Challenge</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  Play 3 different games today!
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 bg-black/60 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full w-1/3" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">0/3</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
                <Gift className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {/* 2. Online Now Status */}
            <div className="px-4 py-2.5 rounded-2xl bg-[#1B1B22]/85 border border-teal-500/30 backdrop-blur-md shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Online Now
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-emerald-400">
                  2,840 Players
                </span>
              </div>
            </div>

            {/* 3. Trending Games Widget */}
            <div className="p-3.5 rounded-2xl bg-[#1B1B22]/85 border border-white/10 backdrop-blur-md shadow-xl flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>Trending Games</span>
              </div>

              <div className="flex flex-col gap-2">
                {trendingGames.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleLaunchGame(game.route)}
                    className="flex items-center justify-between p-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={game.image}
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {game.name} {game.emoji}
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-3 h-3 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* --- BOTTOM DOCK: 6 CATEGORY CARDS MATCHING REFERENCE MOCKUP --- */}
        <div className="w-full pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {categoryCards.map((card) => {
              const isActive = activeCategory === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => handleCategoryClick(card)}
                  className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col items-center justify-end p-2.5 sm:p-3 aspect-[16/10] sm:aspect-[16/11] border-2 ${
                    isActive
                      ? 'scale-[1.04] z-10'
                      : 'hover:scale-[1.03] opacity-90 hover:opacity-100'
                  }`}
                  style={{
                    borderColor: isActive ? card.borderColor : `${card.borderColor}88`,
                    boxShadow: isActive
                      ? `0 0 28px ${card.glowColor}, inset 0 0 16px ${card.glowColor}`
                      : `0 0 12px ${card.glowColor}44`,
                    background: isActive
                      ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(20,20,25,0.65) 100%)'
                      : 'rgba(15, 15, 20, 0.7)'
                  }}
                >
                  {/* Category 3D Art Background Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Glass Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                  {/* Active Neon Border / Underglow Bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
                    style={{
                      background: card.borderColor,
                      boxShadow: `0 0 10px ${card.borderColor}`
                    }}
                  />

                  {/* Card Title Label */}
                  <span className="relative z-10 text-xs sm:text-sm font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center group-hover:text-amber-300 transition-colors">
                    {card.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export const VibeArenaHero = GullyHeroSection;
export default GullyHeroSection;
