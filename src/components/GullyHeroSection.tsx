'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import {
  Play,
  Gift,
  Flame,
  Zap,
  ChevronRight,
  ChevronLeft
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
  const { user } = useAppStore();
  const dockScrollRef = useRef<HTMLDivElement>(null);

  const handleLaunchGame = (route: string) => {
    try {
      soundFx.playGameStart();
    } catch {
      // Audio safety
    }
    router.push(route);
  };

  const handleDockScroll = (amount: number) => {
    try {
      soundFx.playClick();
    } catch {
      // Audio safety
    }
    if (dockScrollRef.current) {
      dockScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // ALL Games in 1-Tap Play Dock: Prioritizing Newest 3D & Highest Played Hits
  const quickLaunchGames: QuickGameCard[] = [
    {
      id: 'jelly-run',
      name: 'Jelly Jalwa 🍬✨',
      category: 'Desi 2048 Runner',
      route: '/game/jelly-run',
      image: '/games/jelly-run.jpg',
      borderColor: '#F43F5E'
    },
    {
      id: 'fun-race',
      name: 'Gully Race 🏃💨',
      category: 'Desi Parkour',
      route: '/game/fun-race',
      image: '/games/fun-race.jpg',
      borderColor: '#00F0FF'
    },
    {
      id: 'auto-rush',
      name: 'Turri Run 🛺💨',
      category: 'Auto Rickshaw Racing',
      route: '/game/auto-rush',
      image: '/games/auto-rush.jpg',
      borderColor: '#EF4444'
    },
    {
      id: 'giant-rush',
      name: 'Pehelwan Rush 🥊🔥',
      category: 'Desi Akhaada Brawler',
      route: '/game/giant-rush',
      image: '/games/giant-rush.jpg',
      borderColor: '#FF9F1C'
    },
    {
      id: 'indian-politics-arena',
      name: 'Politics Arena ⚔️🏛️',
      category: 'Satirical Brawl',
      route: '/game/indian-politics-arena',
      image: '/games/indian-politics-arena.jpg',
      borderColor: '#3B82F6'
    },
    {
      id: 'chor-sipahi',
      name: 'Chor Sipahi 👑🥷',
      category: 'Hostel Classic',
      route: '/game/chor-sipahi',
      image: '/games/chor-sipahi.jpg',
      borderColor: '#A855F7'
    },
    {
      id: 'spin-cricket',
      name: 'Spin Cricket 🏏',
      category: 'Book Cricket',
      route: '/game/spin-cricket',
      image: '/games/spin-cricket.jpg',
      borderColor: '#22C55E'
    },
    {
      id: 'genz-protest-run',
      name: 'GenZ Protest Run 🏃📢',
      category: 'Meme Runner',
      route: '/game/genz-protest-run',
      image: '/games/genz-protest-run.jpg',
      borderColor: '#EC4899'
    },
    {
      id: 'escape-door',
      name: 'Escape The Door 🚪',
      category: 'Risk Puzzle',
      route: '/game/escape-door',
      image: '/games/escape-door.jpg',
      borderColor: '#EAB308'
    },
    {
      id: 'fake-bomb',
      name: 'Fake Bomb 💣⚡',
      category: 'Chaos Defusal',
      route: '/game/fake-bomb',
      image: '/games/fake-bomb.jpg',
      borderColor: '#F97316'
    },
    {
      id: 'tic-tac-toe',
      name: 'Neon Tic-Tac-Toe ❌⭕',
      category: 'PvP Duel',
      route: '/game/tic-tac-toe',
      image: '/games/tic-tac-toe.jpg',
      borderColor: '#06B6D4'
    },
    {
      id: 'word-builder',
      name: 'Word Builder Pro 🔠',
      category: 'Vocabulary Clash',
      route: '/game/word-builder',
      image: '/games/word-builder.jpg',
      borderColor: '#8B5CF6'
    },
    {
      id: 'pen-flip',
      name: 'Pen Flip Battle 🖊️',
      category: 'Classroom Duel',
      route: '/game/pen-flip',
      image: '/games/pen-flip.jpg',
      borderColor: '#10B981'
    },
    {
      id: 'brain-pot',
      name: 'Brain Pot IQ 🧠',
      category: 'Rapid IQ Arena',
      route: '/game/brain-pot',
      image: '/games/brain-pot.jpg',
      borderColor: '#6366F1'
    }
  ];

  const gamesPlayed = user?.stats?.gamesPlayed || 0;
  const challengeProgress = Math.min(100, Math.max(15, (gamesPlayed / 3) * 100));

  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100vh-80px)] flex flex-col justify-end pt-[40vh] sm:pt-[45vh] lg:pt-[52vh] pb-6 px-4 sm:px-8 xl:px-14 select-none">
      {/* Soft bottom vignette to ensure typography and card contrast without dimming the 70% hero view above */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#0e0e12]/95 via-[#0e0e12]/50 to-transparent pointer-events-none -z-0" />

      <div className="max-w-[1720px] mx-auto w-full flex flex-col gap-4 relative z-10">
        
        {/* COMPACT BOTTOM-ANCHORED BRANDING & STATUS ROW */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          
          {/* Left: Punchy Compact Headline & Subtitle */}
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-amber-500/40 backdrop-blur-md w-fit shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#FF9F1C]" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 font-mono">
                GULLYVERSE • INDIA KA APNA GAMING ADDA
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white uppercase font-black leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                APNI GULLY,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB703] via-[#00E5FF] to-white drop-shadow-[0_0_28px_rgba(0,229,255,0.45)]">
                  APNE GAMES!
                </span>
              </h1>
              <span className="text-xs sm:text-sm text-slate-300 font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                • Zero Downloads • Instant 1-Tap Play • 14 Desi Hits
              </span>
            </div>
          </div>

          {/* Right: Sleek Compact Status Badges */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {/* Daily Challenge Pill */}
            <div className="px-3.5 py-1.5 rounded-xl bg-black/75 border border-amber-500/30 backdrop-blur-md shadow-md flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Gift className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 leading-none">
                  Daily Challenge
                </span>
                <span className="text-xs text-slate-200 font-medium leading-tight">
                  Play 3 games ({gamesPlayed}/3)
                </span>
              </div>
              <div className="w-14 bg-black/60 h-1.5 rounded-full overflow-hidden ml-1">
                <div
                  className="bg-[#FFB703] h-full rounded-full transition-all duration-300"
                  style={{ width: `${challengeProgress}%` }}
                />
              </div>
            </div>

            {/* Instant Play Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-black/75 border border-emerald-500/30 backdrop-blur-md shadow-md flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-black text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                INSTANT PLAY
              </span>
            </div>
          </div>

        </div>

        {/* --- BOTTOM DOCK: QUICK LAUNCH GAMES • 1-TAP PLAY --- */}
        <div className="w-full flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase font-black text-white tracking-wider">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>QUICK LAUNCH • 1-TAP PLAY ({quickLaunchGames.length} GAMES)</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Left / Right Carousel Buttons */}
              <button
                onClick={() => handleDockScroll(-340)}
                className="w-7 h-7 rounded-lg bg-black/70 hover:bg-black/95 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDockScroll(340)}
                className="w-7 h-7 rounded-lg bg-black/70 hover:bg-black/95 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <Link
                href="/games"
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors ml-2"
              >
                <span>View Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Horizontally Scrollable & Swipeable Cards Container */}
          <div
            ref={dockScrollRef}
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 scroll-smooth snap-x snap-mandatory"
          >
            {quickLaunchGames.map((game) => (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game.route)}
                className="group relative shrink-0 w-[180px] sm:w-[210px] md:w-[230px] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-xl hover:shadow-[0_0_24px_rgba(255,183,3,0.35)] snap-start"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent flex flex-col justify-end p-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-[13px] font-black text-white group-hover:text-amber-300 transition-colors truncate drop-shadow">
                      {game.name}
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
