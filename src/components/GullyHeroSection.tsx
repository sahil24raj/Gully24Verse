'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore, GAMES_CATALOG } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import confetti from 'canvas-confetti';
import { Play, Users, Sparkles, ChevronRight, Zap, ShieldCheck, Flame } from 'lucide-react';

export const GullyHeroSection: React.FC = () => {
  const router = useRouter();
  const { openMultiplayerModal } = useAppStore();

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

  const scrollToGames = () => {
    soundFx.playClick();
    const el = document.getElementById('games');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/games');
    }
  };

  const topQuickGames = [
    { id: 'truck-run', name: 'Truck Run 🚛', route: '/games/truck-run', badge: '3D High Speed' },
    { id: 'auto-rush', name: 'Auto Rush 🛺', route: '/games/auto-rush', badge: 'Delhi Drift' },
    { id: 'indian-politics-arena', name: 'Politics Arena ⚔️', route: '/games/indian-politics-arena', badge: 'Desi Rumble' },
    { id: 'chor-sipahi', name: 'Chor Sipahi 👑', route: '/games/chor-sipahi', badge: 'Hostel Classic' },
    { id: 'escape-door', name: 'Escape Door 🚪', route: '/games/escape-door', badge: 'Survival' },
    { id: 'spin-cricket', name: 'Spin Cricket 🏏', route: '/games/spin-cricket', badge: 'Gully Match' }
  ];

  return (
    <section className="relative w-full overflow-hidden pt-8 pb-16 px-4 sm:px-8 xl:px-14">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-10 relative z-10">
        {/* Main Hero Content - Open layout allowing gully environment to shine */}
        <div className="max-w-3xl flex flex-col gap-6">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-amber-500/30 backdrop-blur-md w-fit shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#FF9F1C]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              INSTANT PLAY • ZERO DOWNLOADS • 100% FREE
            </span>
          </div>

          {/* Main Headline */}
          <div className="flex flex-col gap-2">
            <h1 className="font-display-hero text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase font-black leading-[1.04]">
              INDIA KA APNA <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(255,159,28,0.3)]">
                GAMING ADDA.
              </span>
            </h1>
            <p className="font-body-lg text-slate-200 text-base sm:text-lg max-w-2xl leading-relaxed mt-2 text-shadow-sm">
              <strong className="text-white">Apni Gully. Apne Dost. Apne Games.</strong> Play free desi browser games instantly — no downloads, no waiting. Settle hostel bets, challenge friends, and rule the gully leaderboard with instant 6-character room codes.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={scrollToGames}
              className="flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_0_28px_rgba(255,159,28,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              PLAY NOW
            </button>

            <button
              onClick={handleCreateSquad}
              className="flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_0_26px_rgba(0,191,166,0.4)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Users className="w-5 h-5" />
              CREATE SQUAD
            </button>
          </div>

          {/* Quick Perks Bar */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15 max-w-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-slate-200 font-bold">Instant 6-Char Code</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-xs text-slate-200 font-bold">Cross-Device Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-slate-200 font-bold">12+ Desi Games</span>
            </div>
          </div>
        </div>

        {/* Quick Game Launch Bar (Preserving all routes without heavy spotlight panel) */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-black text-slate-300 tracking-wider">
              QUICK LAUNCH TRENDING GAMES
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
            {topQuickGames.map((game) => (
              <button
                key={game.id}
                onClick={() => handleLaunchGame(game.route)}
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#1B1B22]/80 hover:bg-[#1B1B22] border border-white/10 hover:border-amber-500/50 backdrop-blur-md transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
              >
                <span className="font-extrabold text-sm text-white group-hover:text-amber-400 transition-colors">
                  {game.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-lg border border-teal-500/20">
                  {game.badge}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const VibeArenaHero = GullyHeroSection;
export default GullyHeroSection;
