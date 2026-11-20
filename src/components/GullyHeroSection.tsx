'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import confetti from 'canvas-confetti';
import {
  Play,
  Users,
  Compass,
  Gift,
  Flame,
  Zap,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface QuickGameCard {
  id: string;
  name: string;
  category: string;
  route: string;
  image: string;
  borderColor: string;
}

export const GullyHeroSection: React.FC = () => {
  const router = useRouter();
  const { openMultiplayerModal, openDailySpinModal } = useAppStore();

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

    // The 6 Quick Launch Games: Prioritizing Newest 3D Hits & Highest Played Games
  const quickLaunchGames: QuickGameCard[] = [
    {
      id: 'fun-race',
      name: 'FUN RACE 3D',
      category: 'Obstacle Run 🏃',
      route: '/game/fun-race',
      image: '/games/fun-race.jpg',
      borderColor: '#00F0FF'
    },
    {
      id: 'auto-rush',
      name: 'AUTO RUSH',
      category: 'Racing Hub 🏎️',
      route: '/game/auto-rush',
      image: '/games/auto-rush.jpg',
      borderColor: '#EF4444'
    },
    {
      id: 'giant-rush',
      name: 'GIANT RUSH 3D',
      category: 'Giant Rush 👊',
      route: '/game/giant-rush',
      image: '/games/giant-rush.jpg',
      borderColor: '#FF9F1C'
    },
    {
      id: 'indian-politics-arena',
      name: 'POLITICS ARENA',
      category: 'Politics Arena ⚔️',
      route: '/game/indian-politics-arena',
      image: '/games/indian-politics-arena.jpg',
      borderColor: '#3B82F6'
    },
    {
      id: 'chor-sipahi',
      name: 'CHOR SIPAHI',
      category: 'Chor Sipahi 👑',
      route: '/game/chor-sipahi',
      image: '/games/chor-sipahi.jpg',
      borderColor: '#A855F7'
    },
    {
      id: 'spin-cricket',
      name: 'SPIN CRICKET',
      category: 'Cricket Zone 🏏',
      route: '/game/spin-cricket',
      image: '/games/spin-cricket.jpg',
      borderColor: '#22C55E'
    }
  ];

  return (
    <section className="relative w-full overflow-hidden pt-4 pb-8 px-4 sm:px-8 xl:px-14">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Main Hero Row: Headline on Left, Widgets on Right */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pt-6 sm:pt-10 lg:pt-14 min-h-[360px]">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="max-w-2xl flex flex-col gap-4">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-amber-500/30 backdrop-blur-md w-fit shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#FF9F1C]" />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-300">
                INSTANT PLAY • ZERO DOWNLOADS • 100% FREE
              </span>
            </div>

            {/* Main Headline */}
            <div className="flex flex-col gap-1.5">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase font-black leading-[1.02] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                INDIA KA APNA <br />
                <span className="text-[#00E5FF] drop-shadow-[0_0_24px_rgba(0,229,255,0.4)]">
                  GAMING ADDA.
                </span>
              </h1>
              <p className="text-amber-400 font-black text-xl sm:text-2xl tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-1">
                Apni Gully, Apne Games!
              </p>
              <p className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-medium">
                Play • Compete • Create • Win. Desi Games, Arcade Fun &amp; Multiplayer Battles with instant 6-character room codes.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handlePlayNow}
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#FFB703] hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_28px_rgba(255,183,3,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>PLAY NOW</span>
              </button>

              <button
                onClick={handleExploreGully}
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-black/60 hover:bg-black/80 text-white font-bold text-sm tracking-wide border border-white/30 hover:border-teal-400 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer backdrop-blur-md"
              >
                <Compass className="w-4 h-4 text-teal-400" />
                <span>EXPLORE GULLY</span>
              </button>
            </div>

            {/* Quick Perks */}
            <div className="flex items-center gap-5 sm:gap-6 pt-2 text-xs text-slate-300 font-bold max-w-md">
              <span className="flex items-center gap-1.5 text-amber-400 drop-shadow">
                <Zap className="w-4 h-4 fill-amber-400" /> Instant Codes
              </span>
              <span className="flex items-center gap-1.5 text-teal-400 drop-shadow">
                <Sparkles className="w-4 h-4 text-teal-400" /> 12+ Desi Games
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 drop-shadow">
                <Users className="w-4 h-4 text-emerald-400" /> Real Multiplayer
              </span>
            </div>
          </div>

          {/* Right Column: Hero Floating Glass Widgets (Daily Challenge, Online Now) positioned cleanly at bottom right */}
          <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0 lg:self-end">
            
            {/* 1. Daily Challenge Widget */}
            <div
              onClick={() => openDailySpinModal()}
              className="p-3.5 rounded-2xl bg-[#1B1B22]/90 hover:bg-[#1B1B22] border border-amber-500/30 backdrop-blur-md shadow-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>DAILY CHALLENGE</span>
                </div>
                <p className="text-xs text-slate-200 font-semibold">
                  Play 3 different games today!
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-28 bg-black/60 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FFB703] h-full rounded-full w-1/3" />
                  </div>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
                <Gift className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {/* 2. Online Now Status */}
            <div className="px-4 py-2.5 rounded-2xl bg-[#1B1B22]/90 border border-teal-500/30 backdrop-blur-md shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  ONLINE NOW
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-emerald-400">
                  2,840 Players
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* --- BOTTOM DOCK: QUICK LAUNCH GAMES • 1-TAP PLAY --- */}
        <div className="w-full flex flex-col gap-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase font-black text-white tracking-wider">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>QUICK LAUNCH GAMES • 1-TAP PLAY</span>
            </div>
            <Link
              href="/games"
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
            >
              <span>View All 12 Games</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 6 Game Cards in Grid matching Screenshot */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {quickLaunchGames.map((game) => (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game.route)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[16/10] border-2 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-xl hover:shadow-[0_0_24px_rgba(255,183,3,0.35)]"
                style={{ borderColor: game.borderColor }}
              >
                {/* Game Cover Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors truncate drop-shadow">
                      {game.category}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-[#FFB703] text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-3 h-3 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export const VibeArenaHero = GullyHeroSection;
export default GullyHeroSection;
