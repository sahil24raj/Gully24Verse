'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToCloudLeaderboard } from '@/lib/firebaseService';
import { LeaderboardEntry } from '@/types';
import { soundFx } from '@/lib/audio';
import { isImageSource } from '@/components/profile/GamerAvatar';
import { Trophy, Flame, Rocket, Zap, ShieldCheck } from 'lucide-react';

interface PlayerRank {
  rank: number;
  username: string;
  gameTitle?: string;
  score: number;
  wins?: number;
  avatar?: string;
  badge?: string;
}

const DEFAULT_PLAYERS: PlayerRank[] = [
  {
    rank: 1,
    username: 'sr24',
    gameTitle: 'All Arena Games',
    score: 42000,
    wins: 59,
    avatar: '🚀',
    badge: '#1 ARENA SULTAN'
  },
  {
    rank: 2,
    username: 'sahil24',
    gameTitle: 'All Arena Games',
    score: 42000,
    wins: 49,
    avatar: '🚀',
    badge: '#2 RUNNER-UP'
  },
  {
    rank: 3,
    username: 'Gamer_HNEH',
    gameTitle: 'All Arena Games',
    score: 0,
    wins: 0,
    avatar: '🚀',
    badge: '#3 CONTENDER'
  },
  {
    rank: 4,
    username: 'SAHIL RAJ',
    gameTitle: 'All Arena Games',
    score: 0,
    wins: 0,
    avatar: '⚡',
    badge: 'TOP 5 RUMBLER'
  },
  {
    rank: 5,
    username: 'Aarav_Gamer',
    gameTitle: 'All Arena Games',
    score: 0,
    wins: 0,
    avatar: '🎮',
    badge: 'CHAI TAPRI WARRIOR'
  },
  {
    rank: 6,
    username: 'Priya_Vibes',
    gameTitle: 'All Arena Games',
    score: 0,
    wins: 0,
    avatar: '🎯',
    badge: 'SQUAD DRIFTER'
  }
];

export const LegendsLeaderboardSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'all'>('today');
  const [cloudLeaderboard, setCloudLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const unsub = subscribeToCloudLeaderboard((entries) => {
      if (entries && entries.length > 0) {
        const sorted = [...entries].sort((a, b) => b.score - a.score);
        setCloudLeaderboard(sorted.slice(0, 10).map((e, idx) => ({ ...e, rank: idx + 1 })));
      } else {
        setCloudLeaderboard([]);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Merge cloud data with fallback players
  const playersList: PlayerRank[] =
    cloudLeaderboard.length >= 3
      ? cloudLeaderboard.map((c, i) => ({
          rank: i + 1,
          username: c.username || `Player_${i + 1}`,
          gameTitle: (c as any).gameName || (c as any).gameId || 'All Arena Games',
          score: c.score || 0,
          wins: (c as any).wins ?? Math.max(0, Math.floor(c.score / 800)),
          avatar: c.avatar || (i === 0 ? '🚀' : i === 1 ? '🚀' : '🚀'),
          badge: i === 0 ? '#1 ARENA SULTAN' : i === 1 ? '#2 RUNNER-UP' : '#3 CONTENDER'
        }))
      : DEFAULT_PLAYERS;

  const rank1 = playersList[0];
  const rank2 = playersList[1];
  const rank3 = playersList[2];

  const renderAvatar = (avatar?: string, fallback = '🚀') => {
    if (avatar && isImageSource(avatar)) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={avatar} alt="avatar" className="w-full h-full object-cover" />;
    }
    if (avatar && avatar.length <= 2) {
      return <span>{avatar}</span>;
    }
    return <Rocket className="w-6 h-6 text-white" />;
  };

  return (
    <section className="w-full px-4 sm:px-8 xl:px-14 py-14 relative select-none">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-10">
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
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#1B1B22]/90 backdrop-blur-md self-start sm:self-auto border border-white/10">
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

        {/* 1. TOP 3 PODIUM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 max-w-5xl mx-auto w-full">
          {/* Rank 2: Silver / Left */}
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-[#1B1B22]/90 backdrop-blur-md flex flex-col items-center text-center relative shadow-xl border border-white/10 hover:border-teal-500/40 transition-all duration-300">
            <div className="text-2xl mb-2">🥈</div>
            <div className="w-16 h-16 rounded-2xl bg-[#101014] border-2 border-teal-400/60 p-2 flex items-center justify-center text-2xl mb-3 shadow-[0_0_15px_rgba(0,191,166,0.3)]">
              {renderAvatar(rank2.avatar)}
            </div>
            <h3 className="font-black text-white text-xl">{rank2.username}</h3>
            <span className="text-xs text-slate-400 font-semibold mt-0.5">{rank2.gameTitle}</span>
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-emerald-400">
                {rank2.score.toLocaleString()} pts
              </span>
              <span className="text-xs text-emerald-400/90 font-bold">
                {rank2.wins ?? 0} Wins
              </span>
            </div>
          </div>

          {/* Rank 1: Gold / Elevated Center */}
          <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-[#252532] to-[#1B1B22] backdrop-blur-md flex flex-col items-center text-center relative shadow-[0_0_50px_rgba(255,159,28,0.35)] -mt-4 md:-mt-8 border-2 border-amber-500/70">
            <div className="text-3xl mb-2 animate-bounce">👑</div>
            <div className="w-20 h-20 rounded-2xl bg-[#101014] border-2 border-amber-400 p-2 flex items-center justify-center text-3xl mb-3 shadow-[0_0_25px_rgba(255,159,28,0.5)]">
              {renderAvatar(rank1.avatar)}
            </div>
            <h3 className="font-black text-white text-2xl">{rank1.username}</h3>
            <span className="text-xs text-slate-400 font-semibold mt-0.5">{rank1.gameTitle}</span>
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                {rank1.score.toLocaleString()} pts
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                {rank1.wins ?? 0} Wins
              </span>
            </div>
            <span className="mt-4 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[11px] font-black uppercase tracking-wider shadow-sm">
              {rank1.badge || '#1 ARENA SULTAN'}
            </span>
          </div>

          {/* Rank 3: Bronze / Right */}
          <div className="order-3 md:order-3 p-6 rounded-3xl bg-[#1B1B22]/90 backdrop-blur-md flex flex-col items-center text-center relative shadow-xl border border-white/10 hover:border-orange-500/40 transition-all duration-300">
            <div className="text-2xl mb-2">🥉</div>
            <div className="w-16 h-16 rounded-2xl bg-[#101014] border-2 border-cyan-400/60 p-2 flex items-center justify-center text-2xl mb-3 shadow-[0_0_15px_rgba(0,191,166,0.25)]">
              {renderAvatar(rank3.avatar)}
            </div>
            <h3 className="font-black text-white text-xl">{rank3.username}</h3>
            <span className="text-xs text-slate-400 font-semibold mt-0.5">{rank3.gameTitle}</span>
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-emerald-400">
                {rank3.score.toLocaleString()} pts
              </span>
              <span className="text-xs text-emerald-400/90 font-bold">
                {rank3.wins ?? 0} Wins
              </span>
            </div>
          </div>
        </div>

        {/* 2. LEADERBOARD LIST TABLE (ARENA PLAYERS) */}
        <div className="w-full max-w-5xl mx-auto rounded-3xl bg-[#1B1B22]/90 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider bg-black/20">
            <span>ARENA PLAYERS ({playersList.length})</span>
            <span>SCORE &amp; STATS</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {playersList.map((player) => {
              const rankColor =
                player.rank === 1
                  ? 'text-amber-400'
                  : player.rank === 2
                  ? 'text-teal-400'
                  : player.rank === 3
                  ? 'text-orange-400'
                  : 'text-slate-400';

              const avatarBorder =
                player.rank === 1
                  ? 'border-amber-500/60'
                  : player.rank === 2
                  ? 'border-teal-500/60'
                  : player.rank === 3
                  ? 'border-cyan-500/60'
                  : 'border-white/10';

              return (
                <div
                  key={player.rank}
                  className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
                >
                  {/* Left: Rank + Avatar + Name */}
                  <div className="flex items-center gap-4">
                    <span className={`text-base font-black w-7 ${rankColor}`}>
                      #{player.rank}
                    </span>
                    <div
                      className={`w-11 h-11 rounded-xl bg-[#101014] border ${avatarBorder} flex items-center justify-center text-lg shrink-0 shadow-inner`}
                    >
                      {renderAvatar(player.avatar)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-sm sm:text-base">
                        {player.username}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {player.gameTitle || 'All Arena Games'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Score + Wins */}
                  <div className="flex flex-col items-end">
                    <span
                      className={`font-black text-base sm:text-lg ${
                        player.score > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {player.score.toLocaleString()} pts
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      {player.wins ?? 0} Wins
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Ticker & Full Leaderboard CTA */}
        <div className="p-5 max-w-5xl mx-auto w-full rounded-3xl bg-[#1B1B22]/80 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto no-scrollbar">
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-black uppercase shrink-0 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              LIVE TICKER
            </span>
            <span className="text-xs text-slate-300 truncate">
              🔥 sr24 scored +42,000 in All Arena Games • sahil24 holds 49 wins • Gamer_HNEH joined squad
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
