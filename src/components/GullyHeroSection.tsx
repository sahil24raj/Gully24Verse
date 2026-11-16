'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore, GAMES_CATALOG } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import confetti from 'canvas-confetti';
import { Gully3DHeroCanvas } from './Gully3DHeroCanvas';
import { Play, Users, Sparkles, ChevronRight, Zap, ShieldCheck } from 'lucide-react';

interface HeroSpotlightItem {
  id: string;
  title: string;
  tabName: string;
  category: string;
  categoryClass: string;
  desc: string;
  image: string;
  fallbackImage: string;
  duration: string;
  players: string;
  rating: string;
  online: string;
  trending: string;
  trendingClass: string;
  lobby: string;
  route: string;
}

const SPOTLIGHT_GAMES: HeroSpotlightItem[] = [
  {
    id: 'truck-run',
    title: 'Truck Run 🚛💨',
    tabName: '🚛 Truck Run',
    category: '3D DESI HIGHWAY',
    categoryClass: 'px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-label-sm text-xs uppercase font-bold border border-amber-500/40',
    desc: 'Horn OK Please! Master the iconic Indian Tata 1613 heavy cargo truck on the endless Grand Trunk Highway with multi-tone pressure horns & nitro boosts!',
    image: '/games/truck-run.jpg',
    fallbackImage: '/games/truck-run.jpg',
    duration: '⏱️ 2-5 MIN',
    players: '👥 SOLO / LEADERBOARD',
    rating: '4.99',
    online: '2,480 Drivers Online',
    trending: 'HOT NEW RELEASE',
    trendingClass: 'px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-label-sm text-xs font-black uppercase backdrop-blur-md shadow-md',
    lobby: 'Lobby #TR924 • 1-4 Squad',
    route: '/games/truck-run'
  },
  {
    id: 'auto-rush',
    title: 'Auto Rush 🛺💨',
    tabName: '🛺 Auto Rush',
    category: '3D DESI RACING',
    categoryClass: 'px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-label-sm text-xs uppercase font-bold border border-teal-500/40',
    desc: 'Meter se nahi, speed se chalegi! Cut through Mumbai & Delhi traffic jams with Bajaj RE Rickshaws, drift on corners, and earn meter coins!',
    image: '/games/auto-rush.jpg',
    fallbackImage: '/games/auto-rush.jpg',
    duration: '⏱️ 3-5 MIN',
    players: '👥 MULTIPLAYER / TIME TRIAL',
    rating: '4.95',
    online: '1,840 Drivers Racing',
    trending: 'DESI FAVORITE',
    trendingClass: 'px-2.5 py-1 rounded bg-teal-500 text-slate-950 font-label-sm text-xs font-black uppercase backdrop-blur-md shadow-md',
    lobby: 'Lobby #AR812 • 4/4 Squad',
    route: '/games/auto-rush'
  },
  {
    id: 'indian-politics-arena',
    title: 'Politics Arena 🗳️🔥',
    tabName: '⚔️ Politics Arena',
    category: 'DESI RUMBLE',
    categoryClass: 'px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-label-sm text-xs uppercase font-bold border border-orange-500/40',
    desc: 'Debate khatam, action shuru! Choose your neta, battle on the streets of Delhi and Patna, and conquer parliament seats in fierce 1v1 multiplayer combat!',
    image: '/games/indian-politics-arena.jpg',
    fallbackImage: '/games/indian-politics-arena.jpg',
    duration: '⏱️ 3-6 MIN',
    players: '👥 1V1 MULTIPLAYER',
    rating: '4.92',
    online: '1,530 Voters Online',
    trending: 'VIRAL RUMBLE',
    trendingClass: 'px-2.5 py-1 rounded bg-orange-500 text-slate-950 font-label-sm text-xs font-black uppercase backdrop-blur-md shadow-md',
    lobby: 'Lobby #PA771 • 2/2 Squad',
    route: '/games/indian-politics-arena'
  },
  {
    id: 'chor-sipahi',
    title: 'Chor Sipahi 👑🕵️',
    tabName: '👑 Chor Sipahi',
    category: 'CLASSIC DESI',
    categoryClass: 'px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-label-sm text-xs uppercase font-bold border border-amber-500/40',
    desc: 'Raja Mantri Chor Sipahi! The timeless Indian hostel slip-chits game. Raja gets 1000, Mantri catches the Chor, and players test their bluffing skills!',
    image: '/games/chor-sipahi.jpg',
    fallbackImage: '/games/chor-sipahi.jpg',
    duration: '⏱️ 5-10 MIN',
    players: '👥 4-PLAYER SQUAD',
    rating: '4.88',
    online: '3,120 Spies Online',
    trending: 'TOP SQUAD GAME',
    trendingClass: 'px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-label-sm text-xs font-black uppercase backdrop-blur-md shadow-md',
    lobby: 'Lobby #CS104 • 4/4 Squad',
    route: '/games/chor-sipahi'
  }
];

export const GullyHeroSection: React.FC = () => {
  const router = useRouter();
  const { openMultiplayerModal } = useAppStore();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedLobby, setCopiedLobby] = useState(false);
  const [viewMode, setViewMode] = useState<'3D' | 'SPOTLIGHT'>('3D');

  const currentItem = SPOTLIGHT_GAMES[activeTab];

  const handleLaunchGame = (route: string) => {
    soundFx.playGameStart();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF9F1C', '#00BFA6', '#F04438', '#FACC15']
    });
    router.push(route);
  };

  const handleCreateSquad = () => {
    soundFx.playPowerUp();
    openMultiplayerModal();
  };

  const handleCopyCode = (code: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(code);
    setCopiedLobby(true);
    setTimeout(() => setCopiedLobby(false), 2000);
  };

  const scrollToGames = () => {
    soundFx.playClick();
    const el = document.getElementById('games');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/games');
    }
  };

  return (
    <section className="relative w-full overflow-hidden pt-4 pb-14 px-4 sm:px-8 xl:px-14">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[460px] h-[460px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Bold GullyVerse Brand Pitch */}
        <div className="lg:col-span-6 flex flex-col gap-6 z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-amber-500/25 backdrop-blur-md w-fit">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              INSTANT PLAY • ZERO DOWNLOADS • 100% FREE
            </span>
          </div>

          {/* Main Headline */}
          <div className="flex flex-col gap-2">
            <h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase font-black leading-[1.05]">
              INDIA KA APNA <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-teal-400 bg-clip-text text-transparent">
                GAMING ADDA.
              </span>
            </h1>
            <p className="font-body-lg text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed mt-2">
              <strong className="text-white">Apni Gully. Apne Dost. Apne Games.</strong> Play free desi browser games instantly — no downloads, no waiting. Settle hostel bets, challenge friends, and rule the gully leaderboard with instant 6-character room codes.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={scrollToGames}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_0_28px_rgba(255,159,28,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              PLAY NOW
            </button>

            <button
              onClick={handleCreateSquad}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_0_24px_rgba(0,191,166,0.35)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Users className="w-5 h-5" />
              CREATE SQUAD
            </button>
          </div>

          {/* Quick Perks Bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 max-w-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-slate-300 font-bold">Instant 6-Char Code</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-xs text-slate-300 font-bold">Cross-Device Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-slate-300 font-bold">12+ Desi Games</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Indian Street Arcade & Featured Spotlight */}
        <div className="lg:col-span-6 flex flex-col gap-4 relative z-10">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2 bg-[#1B1B22]/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => { soundFx.playClick(); setViewMode('3D'); }}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === '3D'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🕹️ 3D Street Arcade
              </button>
              <button
                onClick={() => { soundFx.playClick(); setViewMode('SPOTLIGHT'); }}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === 'SPOTLIGHT'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🔥 Featured Spotlight
              </button>
            </div>

            <span className="text-xs text-amber-400 font-bold hidden sm:inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              60 FPS WebGL
            </span>
          </div>

          {/* Interactive Card Container */}
          <div className="relative rounded-3xl bg-[#1B1B22]/85 border border-white/10 p-4 sm:p-6 shadow-[0_0_40px_rgba(255,159,28,0.15)] backdrop-blur-xl">
            {viewMode === '3D' ? (
              <div className="flex flex-col gap-4">
                <Gully3DHeroCanvas />
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Interactive 3D Desi Scene
                    </span>
                    <span className="text-sm font-extrabold text-white">
                      Move mouse / drag to inspect the Gully Arcade
                    </span>
                  </div>
                  <button
                    onClick={() => handleLaunchGame('/games/truck-run')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase hover:scale-105 active:scale-95 transition-all"
                  >
                    Play Truck Run
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Spotlight Header Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {SPOTLIGHT_GAMES.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => { soundFx.playClick(); setActiveTab(idx); }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === idx
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {item.tabName}
                    </button>
                  ))}
                </div>

                {/* Spotlight Banner */}
                <div className="relative w-full h-[220px] sm:h-[260px] rounded-2xl overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentItem.image}
                    alt={currentItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={currentItem.trendingClass}>{currentItem.trending}</span>
                    <span className={currentItem.categoryClass}>{currentItem.category}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-bold">
                    <span>{currentItem.duration}</span>
                    <span className="text-amber-400">★ {currentItem.rating}</span>
                    <span className="text-emerald-400">{currentItem.online}</span>
                  </div>
                </div>

                {/* Spotlight Meta & Launch */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-black text-xl text-white">{currentItem.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{currentItem.desc}</p>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleLaunchGame(currentItem.route)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    ⚡ PLAY INSTANTLY
                  </button>
                  <button
                    onClick={handleCreateSquad}
                    className="flex-1 py-3 rounded-xl bg-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    + HOST ROOM
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const VibeArenaHero = GullyHeroSection;
export default GullyHeroSection;
