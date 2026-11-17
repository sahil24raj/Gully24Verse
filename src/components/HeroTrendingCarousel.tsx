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
    id: 'truck-run',
    title: 'Truck Run 🚛💨',
    badge: '3D Unity Highway',
    badgeBg: 'bg-amber-500 text-slate-950 font-black',
    rating: '4.99',
    statsLeft: 'DESI HIGHWAY • 2-5 MIN',
    statsRight: '2,480 DRIVERS',
    statsRightColor: 'text-amber-400',
    description: 'Horn OK Please! Drive the roaring Tata 1613 heavy cargo truck, blast musical horns, grab dhaba chai & dodge traffic on the Grand Trunk Road!',
    buttonActionType: 'SOLO PLAY',
    image: '/games/truck-run.jpg',
    fallbackImage: '/games/truck-run.jpg',
    route: '/games/truck-run',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(255,159,28,0.4)]'
  },
  {
    id: 'auto-rush',
    title: 'Auto Rush 🛺💨',
    badge: '3D Desi Racing',
    badgeBg: 'bg-teal-500 text-slate-950 font-black',
    rating: '4.98',
    statsLeft: 'SOLO RACER • 2-5 MIN',
    statsRight: '1,840 RACING',
    statsRightColor: 'text-teal-400',
    description: 'The Gurugram Grand Prix! 8 Indian auto-rickshaws (Tirri), real 3-wheel drift mechanics & nitrous overdrive through street traffic!',
    buttonActionType: 'SOLO PLAY',
    image: '/games/auto-rush.jpg',
    fallbackImage: '/games/auto-rush.jpg',
    route: '/games/auto-rush',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(0,191,166,0.4)]'
  },
  {
    id: 'indian-politics-arena',
    title: 'Politics Arena ⚔️🏛️',
    badge: 'Desi Rumble',
    badgeBg: 'bg-orange-500 text-slate-950 font-black',
    rating: '4.99',
    statsLeft: '1V1 ARCADE • 2-4 MIN',
    statsRight: '1,530 COMBATANTS',
    statsRightColor: 'text-orange-400',
    description: 'Sansad Se Sadak Tak, Fight Karo! 8 satirical netas, real arcade combat engine and super attacks for parliamentary dominance!',
    buttonActionType: 'SOLO PLAY',
    image: '/games/indian-politics-arena.jpg',
    fallbackImage: '/games/indian-politics-arena.jpg',
    route: '/games/indian-politics-arena',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(255,159,28,0.4)]'
  },
  {
    id: 'chor-sipahi',
    title: 'Chor Sipahi (Raja Mantri) 👑🥷',
    badge: 'Squad Classic',
    badgeBg: 'bg-emerald-500 text-slate-950 font-black',
    rating: '4.98',
    statsLeft: '4 PLAYERS • 2-4 MIN',
    statsRight: '3,120 IN SQUADS',
    statsRightColor: 'text-emerald-400',
    description: 'Raja orders, Mantri hides, Sipahi investigates, Chor bluffs! The ultimate desi hostel party deduction game with real room codes.',
    buttonActionType: 'HOST SQUAD',
    image: '/games/chor-sipahi.jpg',
    fallbackImage: '/games/chor-sipahi.jpg',
    route: '/games/chor-sipahi',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(0,191,166,0.4)]'
  },
  {
    id: 'escape-door',
    title: 'Escape From The Door 🚪',
    badge: 'Mystery Risk',
    badgeBg: 'bg-teal-500/80 text-slate-950 font-black',
    rating: '4.98',
    statsLeft: 'SOLO PUZZLE • 1-3 MIN',
    statsRight: '142K PLAYS',
    statsRightColor: 'text-teal-400',
    description: 'Choose wisely. Exactly ONE cyber door leads to survival across 10 tense rooms and high-stakes Endless Mode!',
    buttonActionType: 'SOLO PLAY',
    image: '/games/escape-door.jpg',
    fallbackImage: '/games/escape-door.jpg',
    route: '/games/escape-door',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(0,191,166,0.4)]'
  },
  {
    id: 'genz-protest-run',
    title: 'GenZ Protest Run 🏃📢',
    badge: 'Desi Meme Runner',
    badgeBg: 'bg-amber-500 text-slate-950 font-black',
    rating: '4.99',
    statsLeft: 'ENDLESS RUN • 1-3 MIN',
    statsRight: 'CHAOS RUNNER',
    statsRightColor: 'text-amber-400',
    description: 'Dodge barricades, grab kulhad chai boosts, and dash your way through iconic Delhi checkpoints at full throttle!',
    buttonActionType: 'SOLO PLAY',
    image: '/games/genz-protest-run.jpg',
    fallbackImage: '/games/genz-protest-run.jpg',
    route: '/games/genz-protest-run',
    hoverGlow: 'hover:shadow-[0_0_35px_rgba(255,159,28,0.4)]'
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
    <section className="w-full px-4 sm:px-8 xl:px-14 py-14 bg-[#0B0B0E]/30 backdrop-blur-sm relative select-none">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-6">
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
