'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GAMES_CATALOG, useAppStore } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import { Flame, Star, Play, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface BattleCardData {
  id: string;
  title: string;
  badge: string;
  badgeBg: string;
  rating: string;
  statsLeft: string;
  statsRight: string;
  statsRightColor: string;
  description: string;
  buttonActionType: 'HOST SQUAD' | 'SOLO PLAY';
  image: string;
  fallbackImage: string;
  route: string;
  hoverGlow: string;
}

const TOP_BATTLES: BattleCardData[] = [
  {
    id: 'fun-race',
    title: 'Fun Race 3D 🏃💨',
    badge: '3D Obstacle Runner',
    badgeBg: 'bg-cyan-500 text-slate-950 font-black',
    rating: '4.99',
    statsLeft: '3D OBSTACLE SPRINT',
    statsRight: 'FEATURED HIT',
    statsRightColor: 'text-cyan-400',
    description: 'Sprint through tropical water tracks, dodge swinging pendulums, hydraulic crushers, and rotating sweepers to cross the finish arch first!',
    buttonActionType: 'SOLO PLAY',
    image: '/games/fun-race.jpg',
    fallbackImage: '/games/fun-race.jpg',
    route: '/game/fun-race',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(0,240,255,0.4)]'
  },
  {
    id: 'auto-rush',
    title: 'Auto Rush 🛺💨',
    badge: '3D Desi Racing',
    badgeBg: 'bg-teal-500 text-slate-950 font-black',
    rating: '4.98',
    statsLeft: '3D DESI RACING',
    statsRight: 'POPULAR',
    statsRightColor: 'text-teal-400',
    description: 'High-speed auto-rickshaw highway racing on Cyber City, NH-48 Expressway, and Old Delhi Red Fort with drift, boost, and physics.',
    buttonActionType: 'SOLO PLAY',
    image: '/games/auto-rush.jpg',
    fallbackImage: '/games/auto-rush.jpg',
    route: '/game/auto-rush',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(20,184,166,0.4)]'
  },
  {
    id: 'giant-rush',
    title: 'Giant Rush 3D 👊🔥',
    badge: '3D Chroma Runner',
    badgeBg: 'bg-amber-500 text-slate-950 font-black',
    rating: '4.98',
    statsLeft: 'CHROMA BRAWLER',
    statsRight: 'TRENDING',
    statsRightColor: 'text-amber-400',
    description: 'Absorb same-color runners, grow into a colossal Titan, pass through color gates, and punch the boss to the moon in the rapid-tap arena!',
    buttonActionType: 'SOLO PLAY',
    image: '/games/giant-rush.jpg',
    fallbackImage: '/games/giant-rush.jpg',
    route: '/game/giant-rush',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(255,159,28,0.4)]'
  },
  {
    id: 'indian-politics-arena',
    title: 'Politics Arena ⚔️🏛️',
    badge: 'Satirical 1v1 Brawl',
    badgeBg: 'bg-orange-500 text-slate-950 font-black',
    rating: '4.97',
    statsLeft: '1V1 MELEE BRAWLER',
    statsRight: 'TOP RATED',
    statsRightColor: 'text-orange-400',
    description: 'Choose your iconic satirical neta, unleash mic-drop debates, election promises, and flying chairs in heated 1v1 political combat!',
    buttonActionType: 'HOST SQUAD',
    image: '/games/indian-politics-arena.jpg',
    fallbackImage: '/games/indian-politics-arena.jpg',
    route: '/game/indian-politics-arena',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(249,115,22,0.4)]'
  },
  {
    id: 'chor-sipahi',
    title: 'Chor Sipahi (Raja Mantri) 👑🥷',
    badge: 'Desi Classroom Classic',
    badgeBg: 'bg-purple-500 text-slate-950 font-black',
    rating: '4.96',
    statsLeft: 'SOCIAL BLUFFING • 4P',
    statsRight: 'SQUAD MULTIPLAYER',
    statsRightColor: 'text-purple-400',
    description: 'Raja (1000), Mantri (800), Chor (0), Sipahi (500). Shuffle the chits, bluff your classmates, and guess who stole the royal treasury.',
    buttonActionType: 'HOST SQUAD',
    image: '/games/chor-sipahi.jpg',
    fallbackImage: '/games/chor-sipahi.jpg',
    route: '/game/chor-sipahi',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(168,85,247,0.4)]'
  },
  {
    id: 'escape-door',
    title: 'Escape From The Door 🚪',
    badge: 'Risk & Strategy',
    badgeBg: 'bg-yellow-500 text-slate-950 font-black',
    rating: '4.95',
    statsLeft: 'CHAMBER PUZZLE',
    statsRight: 'CHALLENGE',
    statsRightColor: 'text-yellow-400',
    description: 'Face the ominous locked vault doors. Decode clues, pick the right keycard, and escape before the countdown timer hits zero.',
    buttonActionType: 'SOLO PLAY',
    image: '/games/escape-door.jpg',
    fallbackImage: '/games/escape-door.jpg',
    route: '/game/escape-door',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(234,179,8,0.4)]'
  }
];

export const HeroTrendingCarousel: React.FC = () => {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const { openMultiplayerModal } = useAppStore();

  const handleScroll = (amount: number) => {
    soundFx.playClick();
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handlePlayNow = (battle: BattleCardData) => {
    soundFx.playClick();
    router.push(battle.route);
  };

  const handleActionRoom = (battle: BattleCardData) => {
    soundFx.playClick();
    const game = GAMES_CATALOG.find((g) => g.id === battle.id) || GAMES_CATALOG[0];
    if (battle.buttonActionType === 'HOST SQUAD') {
      openMultiplayerModal(game);
    } else {
      router.push(battle.route);
    }
  };

  return (
    <section className="w-full px-4 sm:px-8 xl:px-14 py-8 relative select-none">
      <div className="max-w-[1720px] mx-auto p-6 sm:p-8 xl:p-10 rounded-3xl sm:rounded-[36px] bg-[#121217]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] flex flex-col gap-6">
        {/* Section Header with Carousel Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-widest text-xs">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>GULLY TRENDING</span>
            </div>
            <h2 className="font-headline-xl uppercase text-white tracking-tight mt-1 text-3xl sm:text-4xl font-black">
              AAJ KYA KHELEIN?
            </h2>
            <p className="font-body-lg text-slate-300">
              Jump straight into the most played desi rooms across India right now.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => handleScroll(-440)}
              className="w-12 h-12 rounded-2xl bg-[#1B1B22] hover:bg-[#262630] text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer border border-white/10"
              title="Previous Battles"
              aria-label="Previous Battles"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll(440)}
              className="w-12 h-12 rounded-2xl bg-[#1B1B22] hover:bg-[#262630] text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer border border-white/10"
              title="Next Battles"
              aria-label="Next Battles"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Scroll Container */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto pb-5 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
        >
          {TOP_BATTLES.map((battle) => (
            <div
              key={battle.id}
              className={`min-w-[340px] sm:min-w-[400px] max-w-[420px] snap-start shrink-0 rounded-3xl bg-[#1B1B22] p-5 sm:p-6 flex flex-col justify-between shadow-2xl ${battle.hoverGlow} transition-all duration-300 group border border-white/10 hover:border-amber-500/50`}
            >
              <div className="flex flex-col gap-3">
                {/* Clean Top Bar (Above Cover) */}
                <div className="flex items-center justify-between gap-2 px-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] uppercase tracking-wider ${battle.badgeBg}`}>
                    {battle.badge}
                  </span>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{battle.rating}</span>
                  </div>
                </div>

                {/* Pure Clean Artwork Cover - 16/9 aspect ratio prevents cutting off */}
                <div className="w-full aspect-[16/9] rounded-2xl bg-black/50 overflow-hidden relative border border-white/5 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={battle.image}
                    alt={battle.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = battle.fallbackImage;
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center justify-between text-slate-400 text-xs pt-1 px-1 font-bold">
                  <span>{battle.statsLeft}</span>
                  <span className={battle.statsRightColor}>{battle.statsRight}</span>
                </div>

                <div className="px-1 flex flex-col gap-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white truncate group-hover:text-amber-400 transition-colors">
                    {battle.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 min-h-[36px]">
                    {battle.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 mt-5 pt-3 border-t border-white/10">
                <button
                  onClick={() => handlePlayNow(battle)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>PLAY NOW</span>
                </button>
                <button
                  onClick={() => handleActionRoom(battle)}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer border border-white/10 flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  <span>{battle.buttonActionType}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroTrendingCarousel;
