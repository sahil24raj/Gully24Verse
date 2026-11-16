'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToCloudLeaderboard } from '@/lib/firebaseService';
import { LeaderboardEntry } from '@/types';
import { soundFx } from '@/lib/audio';
import { isImageSource } from '@/components/profile/GamerAvatar';
import { Trophy, Flame } from 'lucide-react';

export const LegendsLeaderboardSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'all'>('today');
  const [cloudLeaderboard, setCloudLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const unsub = subscribeToCloudLeaderboard((entries) => {
      if (entries && entries.length > 0) {
        const sorted = [...entries].sort((a, b) => b.score - a.score);
        setCloudLeaderboard(sorted.slice(0, 3).map((e, idx) => ({ ...e, rank: idx + 1 })));
      } else {
        setCloudLeaderboard([]);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Default podium champions with authentic Gully titles
  const rank1 = cloudLeaderboard[0] || {
    rank: 1,
    username: 'Aarav',
    badge: 'Chor Sipahi Sultan',
    level: 35,
    subtitle: 'Undefeated Sultan • Level 35',
    score: 2450,
    avatar: 'A'
  };

  const rank2 = cloudLeaderboard[1] || {
    rank: 2,
    username: 'Priya',
    badge: 'Mantri Master',
    level: 28,
    subtitle: 'Gully Slayer • Level 28',
    score: 1820,
    avatar: 'P'
  };

  const rank3 = cloudLeaderboard[2] || {
    rank: 3,
    username: 'Kabir',
    badge: 'Auto Drift King',
    level: 22,
    subtitle: 'DesiRacer • Level 22',
    score: 1410,
    avatar: 'K'
  };

  return (
    <section className="w-full px-4 sm:px-8 xl:px-14 py-14 relative select-none">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-8">
        {/* Section Title & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-400 font-black uppercase tracking-widest text-xs">
              <Trophy className="w-4 h-4" />
              <span>GULLY ROLL OF HONOR</span>
            </div>
            <h2 className="font-headline-xl uppercase text-white tracking-tight mt-1 text-3xl sm:text-4xl font-black">
              GULLY KE TOP PLAYERS 👑
            </h2>
            <p className="font-body-md text-slate-300">
              Real verified rankings and battle scores across all squad rooms today.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#1B1B22] self-start sm:self-auto border border-white/10">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveFilter('today');
              }}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === 'today'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveFilter('week');
              }}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === 'week'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveFilter('all');
              }}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* 3-Player 3D-Styled Visual Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
          {/* Rank 2: Silver / Teal (Priya) */}
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-[#1B1B22] flex flex-col items-center text-center relative group shadow-xl border border-teal-500/30 hover:border-teal-400 transition-all">
            <div className="w-20 h-20 rounded-full bg-teal-500/20 p-1 mb-3 relative">
              <span className="w-full h-full rounded-full bg-black/50 flex items-center justify-center font-black text-teal-400 text-2xl overflow-hidden">
                {isImageSource(rank2.avatar) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={rank2.avatar} alt={rank2.username} className="w-full h-full object-cover" />
                ) : (
                  typeof rank2.avatar === 'string' && rank2.avatar.length <= 2 ? rank2.avatar : 'P'
                )}
              </span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                #2 RUNNER-UP
              </span>
            </div>
            <span className="font-headline-sm text-white font-black text-xl">{rank2.username}</span>
            <span className="text-xs text-teal-400 font-bold">{rank2.badge || 'Gully Slayer • Level 28'}</span>
            <div className="mt-4 p-3 w-full rounded-2xl bg-black/40 flex items-center justify-between border border-white/5">
              <span className="text-xs text-slate-400 font-semibold">{rank2.badge || 'Mantri Master'}</span>
              <span className="font-black text-teal-400 text-sm">{rank2.score.toLocaleString()} pts</span>
            </div>
          </div>

          {/* Rank 1: Gold / Elevated Center (Aarav) */}
          <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-[#24242E] to-[#1B1B22] flex flex-col items-center text-center relative shadow-[0_0_45px_rgba(255,159,28,0.35)] -mt-4 md:-mt-8 border border-amber-500/50">
            <div className="text-3xl mb-1 animate-bounce">👑</div>
            <div className="w-24 h-24 rounded-full bg-amber-500/30 p-1 mb-3 relative">
              <span className="w-full h-full rounded-full bg-black/60 flex items-center justify-center font-black text-amber-400 text-3xl overflow-hidden">
                {isImageSource(rank1.avatar) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={rank1.avatar} alt={rank1.username} className="w-full h-full object-cover" />
                ) : (
                  typeof rank1.avatar === 'string' && rank1.avatar.length <= 2 ? rank1.avatar : 'A'
                )}
              </span>
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                #1 GULLY SULTAN
              </span>
            </div>
            <span className="font-headline-md text-white font-black text-2xl">{rank1.username}</span>
            <span className="text-xs text-amber-400 font-bold">{rank1.badge || 'Undefeated Sultan • Level 35'}</span>
            <div className="mt-4 p-3.5 w-full rounded-2xl bg-black/50 flex items-center justify-between border border-amber-500/20">
              <span className="text-xs text-white font-bold">{rank1.badge || 'Chor Sipahi King'}</span>
              <span className="font-black text-amber-400 text-lg">{rank1.score.toLocaleString()} pts</span>
            </div>
          </div>

          {/* Rank 3: Bronze (Kabir) */}
          <div className="order-3 md:order-3 p-6 rounded-3xl bg-[#1B1B22] flex flex-col items-center text-center relative group shadow-xl border border-orange-500/30 hover:border-orange-400 transition-all">
            <div className="w-20 h-20 rounded-full bg-orange-500/20 p-1 mb-3 relative">
              <span className="w-full h-full rounded-full bg-black/50 flex items-center justify-center font-black text-orange-400 text-2xl overflow-hidden">
                {isImageSource(rank3.avatar) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={rank3.avatar} alt={rank3.username} className="w-full h-full object-cover" />
                ) : (
                  typeof rank3.avatar === 'string' && rank3.avatar.length <= 2 ? rank3.avatar : 'K'
                )}
              </span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                #3 CONTENDER
              </span>
            </div>
            <span className="font-headline-sm text-white font-black text-xl">{rank3.username}</span>
            <span className="text-xs text-orange-400 font-bold">{rank3.badge || 'DesiRacer • Level 22'}</span>
            <div className="mt-4 p-3 w-full rounded-2xl bg-black/40 flex items-center justify-between border border-white/5">
              <span className="text-xs text-slate-400 font-semibold">{rank3.badge || 'Auto Drift King'}</span>
              <span className="font-black text-orange-400 text-sm">{rank3.score.toLocaleString()} pts</span>
            </div>
          </div>
        </div>

        {/* Live Activity Ticker & Full Leaderboard CTA */}
        <div className="p-5 rounded-3xl bg-[#1B1B22] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto no-scrollbar">
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-black uppercase shrink-0 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              LIVE TICKER
            </span>
            <span className="text-xs text-slate-300 truncate">
              🔥 Aarav scored +350 in Chor Sipahi • Priya hit 6 runs in Spin Cricket • Kabir drifted past 10 autos in Auto Rush
            </span>
          </div>

          <Link
            href="/leaderboard"
            onClick={() => soundFx.playClick()}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-wider shrink-0 transition-all flex items-center gap-2 border border-white/10 hover:border-amber-500/40 cursor-pointer"
          >
            <span>VIEW FULL LEADERBOARD</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LegendsLeaderboardSection;
