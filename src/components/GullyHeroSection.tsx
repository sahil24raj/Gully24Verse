'use client';

import React, { useRef } from 'react';
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
  const { openDailySpinModal, user } = useAppStore();
  const dockScrollRef = useRef<HTMLDivElement>(null);

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
    router.push('/game/fun-race');
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
      name: 'Jelly Jalwa 🍮✨',
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
      name: 'Pehelwan Rush 👊🔥',
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
      name: 'Fake Bomb 💣⚛️',
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
    <section className="relative w-full overflow-hidden pt-4 pb-8 px-4 sm:px-8 xl:px-14 select-none">
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
                <Sparkles className="w-4 h-4 text-teal-400" /> 13 Desi Games
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 drop-shadow">
                <Users className="w-4 h-4 text-emerald-400" /> Real Multiplayer
              </span>
            </div>
          </div>

          {/* Right Column: Hero Floating Glass Widgets (Clean Authentic Professional Status) */}
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
                    <div
                      className="bg-[#FFB703] h-full rounded-full transition-all duration-300"
                      style={{ width: `${challengeProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
                <Gift className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {/* 2. Platform Status (NO MOCK USER COUNTS) */}
            <div className="px-4 py-2.5 rounded-2xl bg-[#1B1B22]/90 border border-emerald-500/30 backdrop-blur-md shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  INSTANT PLAY
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-emerald-400 font-mono">
                  ZERO DOWNLOADS 🟢
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* --- BOTTOM DOCK: QUICK LAUNCH GAMES • 1-TAP PLAY (SWIPE ALL 13 GAMES) --- */}
        <div className="w-full flex flex-col gap-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase font-black text-white tracking-wider">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>QUICK LAUNCH GAMES • 1-TAP PLAY ({quickLaunchGames.length} GAMES • SWIPE TO EXPLORE)</span>
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
            className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 scroll-smooth snap-x snap-mandatory"
          >
            {quickLaunchGames.map((game) => (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game.route)}
                className="group relative shrink-0 w-[190px] sm:w-[220px] md:w-[240px] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-xl hover:shadow-[0_0_24px_rgba(255,183,3,0.35)] snap-start"
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
                    {/* Actual Game Name on Each Card */}
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
