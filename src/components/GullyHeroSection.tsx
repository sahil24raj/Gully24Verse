'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore, GAMES_CATALOG } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import confetti from 'canvas-confetti';
import {
  Play,
  Users,
  Sparkles,
  ChevronRight,
  Zap,
  Flame,
  Gift,
  Radio,
  Compass
} from 'lucide-react';

interface QuickGameCard {
  id: string;
  name: string;
  route: string;
  image: string;
  badge: string;
  borderColor: string;
}

export const GullyHeroSection: React.FC = () => {
  const router = useRouter();
  const { openMultiplayerModal, openDailySpinModal } = useAppStore();

  const handleLaunchGame = (route: string) => {
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
    router.push(route);
  };

  const handleCreateSquad = () => {
    try {
      soundFx.playPowerUp();
    } catch {
      // Audio safety
    }
    openMultiplayerModal();
  };

  const scrollToGames = () => {
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

  // 6 Visual Quick Launch Games matching the bottom dock in user screenshot
  const quickLaunchGames: QuickGameCard[] = [
    {
      id: 'spin-cricket',
      name: 'Cricket Zone 🏏',
      route: '/game/spin-cricket',
      image: '/games/spin-cricket.jpg',
      badge: 'Gully Match',
      borderColor: '#22C55E'
    },
    {
      id: 'auto-rush',
      name: 'Racing Hub 🛺',
      route: '/game/auto-rush',
      image: '/games/auto-rush.jpg',
      badge: 'Delhi Drift',
      borderColor: '#F04438'
    },
    {
      id: 'truck-run',
      name: 'Truck Run 3D 🚛',
      route: '/game/truck-run',
      image: '/games/truck-run.jpg',
      badge: 'GT Highway',
      borderColor: '#FF9F1C'
    },
    {
      id: 'chor-sipahi',
      name: 'Chor Sipahi 👑',
      route: '/game/chor-sipahi',
      image: '/games/chor-sipahi.jpg',
      badge: 'Hostel Bluff',
      borderColor: '#A855F7'
    },
    {
      id: 'indian-politics-arena',
      name: 'Politics Arena ⚔️',
      route: '/game/indian-politics-arena',
      image: '/games/indian-politics-arena.jpg',
      badge: 'Desi Rumble',
      borderColor: '#00BFA6'
    },
    {
      id: 'escape-door',
      name: 'Escape Door 🚪',
      route: '/game/escape-door',
      image: '/games/escape-door.jpg',
      badge: 'Survival IQ',
      borderColor: '#EAB308'
    }
  ];

  return (
    <section className="relative w-full overflow-hidden pt-6 pb-12 px-4 sm:px-8 xl:px-14">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-10 relative z-10">
        {/* Main Hero Row: Headline on Left, Widgets on Right */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pt-4">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="max-w-2xl flex flex-col gap-5">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-amber-500/30 backdrop-blur-md w-fit shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#FF9F1C]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                INSTANT PLAY • ZERO DOWNLOADS • 100% FREE
              </span>
            </div>

            {/* Main Headline */}
            <div className="flex flex-col gap-2">
              <h1 className="font-display-hero text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase font-black leading-[1.03]">
                INDIA KA APNA <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(255,159,28,0.3)]">
                  GAMING ADDA.
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-amber-400">
                  Apni Gully, Apne Games!
                </span>
              </div>
              <p className="font-body-md text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed text-shadow-sm">
                Play • Compete • Create • Win. Desi Games, Arcade Fun &amp; Multiplayer Battles with instant 6-character room codes.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToGames}
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_28px_rgba(255,159,28,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                PLAY NOW
              </button>

              <button
                onClick={handleCreateSquad}
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-black/50 hover:bg-black/70 text-white font-black text-sm uppercase tracking-wider border border-white/20 hover:border-teal-400 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer backdrop-blur-md"
              >
                <Compass className="w-4 h-4 text-teal-400" />
                EXPLORE GULLY
              </button>
            </div>

            {/* Quick Perks */}
            <div className="flex items-center gap-6 pt-3 text-xs text-slate-300 font-bold border-t border-white/10 max-w-md">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-4 h-4" /> Instant Codes
              </span>
              <span className="flex items-center gap-1.5 text-teal-400">
                <Sparkles className="w-4 h-4" /> 12+ Desi Games
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Users className="w-4 h-4" /> Real Multiplayer
              </span>
            </div>
          </div>

          {/* Right Column: Hero Floating Widgets (Daily Challenge & Online Now shifted to the bottom) */}
          <div className="w-full lg:w-80 flex flex-col gap-3.5 shrink-0 lg:self-end">
            {/* 1. Daily Challenge Widget */}
            <div
              onClick={() => openDailySpinModal()}
              className="p-4 rounded-2xl bg-[#1B1B22]/85 hover:bg-[#1B1B22] border border-amber-500/30 backdrop-blur-md shadow-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider">
                  <span>🎯</span>
                  <span>DAILY CHALLENGE</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  Play 3 different games today!
                </p>
                <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden mt-1 max-w-[140px]">
                  <div className="bg-amber-400 h-full rounded-full w-1/3" />
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                <Gift className="w-6 h-6 text-amber-400" />
              </div>
            </div>

            {/* 2. Online Now Status */}
            <div className="px-4 py-3 rounded-2xl bg-[#1B1B22]/85 border border-teal-500/30 backdrop-blur-md shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  ONLINE NOW
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-emerald-400">
                  2,840 Players
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM DOCK: QUICK LAUNCH GAMES WITH COVER IMAGES --- */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase font-black text-slate-200 tracking-wider">
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

          {/* Visual 16:9 Cover Cards Dock */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
            {quickLaunchGames.map((game) => (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game.route)}
                className="group relative w-44 sm:w-56 shrink-0 aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-xl hover:shadow-[0_0_30px_rgba(255,159,28,0.4)]"
                style={{ borderColor: game.borderColor }}
              >
                {/* 16:9 Cover Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Gradient Scrim & Play Badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent flex flex-col justify-end p-3">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-black text-white group-hover:text-amber-400 transition-colors drop-shadow line-clamp-1">
                      {game.name}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                      <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider mt-0.5">
                    {game.badge}
                  </span>
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
