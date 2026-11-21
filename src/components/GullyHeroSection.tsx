'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import {
  Play,
  Flame,
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

  // ALL 14 Games in 1-Tap Play Dock: Prioritizing Newest 3D & Highest Played Hits
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

  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100vh-80px)] flex flex-col justify-end pt-[30vh] sm:pt-[32vh] lg:pt-[33vh] pb-0 px-4 sm:px-8 xl:px-14 select-none">
      <div className="max-w-[1720px] mx-auto w-full flex flex-col gap-2.5 sm:gap-3 relative z-10">
        
        {/* Main Hero Row: Bold Headline Positioned Just Below Gully Verse Wall Graffiti */}
        <div className="flex flex-col gap-1 w-full">
          {/* Sleek Brand Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-black/80 border border-amber-500/40 backdrop-blur-md w-fit shadow-md mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#FF9F1C]" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 font-mono">
              GULLYVERSE • INDIA KA APNA GAMING ADDA
            </span>
          </div>

          {/* Prominent Russo One Headline with Clean Natural Shadow and No Overflow */}
          <h1 className="font-['Russo_One',sans-serif] text-[clamp(2.35rem,5.8vw,6.8rem)] tracking-tight text-white uppercase leading-none whitespace-nowrap drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            <span className="text-white">APNI GULLY, </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB703] via-[#FF9F1C] to-[#00F0FF]">
              APNE GAMES!
            </span>
          </h1>

          <p className="text-slate-100 text-xs sm:text-sm md:text-base font-semibold max-w-4xl tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pt-1">
            Zero Downloads • 100% Free-to-Play Browser-Based Games • Instant 1-Tap Play • 14 Desi 3D Hits &amp; Multiplayer
          </p>
        </div>

        {/* --- BOTTOM DOCK: QUICK LAUNCH GAMES • 1-TAP PLAY (TIGHT GAP, HALF VISIBLE ON HOME SCREEN) --- */}
        <div className="w-full flex flex-col gap-1.5 pt-1 pb-1">
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
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-1 pt-0.5 scroll-smooth snap-x snap-mandatory"
          >
            {quickLaunchGames.map((game) => (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game.route)}
                className="group relative shrink-0 w-[175px] sm:w-[195px] md:w-[215px] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-xl hover:shadow-[0_0_24px_rgba(255,183,3,0.35)] snap-start"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent flex flex-col justify-end p-2">
                  <div className="flex items-center justify-between gap-1">
                    {/* Actual Game Name on Each Card */}
                    <span className="text-xs sm:text-[13px] font-black text-white group-hover:text-amber-300 transition-colors truncate drop-shadow">
                      {game.name}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-[#FFB703] text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-2.5 h-2.5 fill-slate-950 ml-0.5" />
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
