'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToCloudLeaderboard } from '@/lib/firebaseService';
import { LeaderboardEntry } from '@/types';
import { soundFx } from '@/lib/audio';
import { isImageSource } from '@/components/profile/GamerAvatar';
import { Trophy, Rocket, Zap, ShieldCheck, Play, ArrowRight } from 'lucide-react';

interface PlayerRank {
  rank: number;
  username: string;
  gameTitle?: string;
  score: number;
  wins?: number;
  avatar?: string;
  badge?: string;
}

export const LegendsLeaderboardSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'all'>('today');
  const [cloudLeaderboard, setCloudLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToCloudLeaderboard((entries) => {
      if (entries && entries.length > 0) {
        const sorted = [...entries].sort((a, b) => b.score - a.score);
        setCloudLeaderboard(sorted.slice(0, 10).map((e, idx) => ({ ...e, rank: idx + 1 })));
      } else {
        setCloudLeaderboard([]);
      }
      setIsLoading(false);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const playersList: PlayerRank[] = cloudLeaderboard.map((c, i) => ({
    rank: i + 1,
    username: c.username || `Gamer_${i + 1}`,
    gameTitle: (c as any).gameName || (c as any).gameId || 'All Arena Games',
    score: c.score || 0,
    wins: (c as any).wins ?? Math.max(0, Math.floor(c.score / 800)),
    avatar: c.avatar || '🚀',
    badge: i === 0 ? '👑 #1 ARENA SULTAN' : i === 1 ? '🥈 #2 RUNNER-UP' : i === 2 ? '🥉 #3 CONTENDER' : `TOP ${i + 1} RUMBLER`
  }));

  const rank1 = playersList[0];
  const rank2 = playersList[1];
  const rank3 = playersList[2];

  const renderAvatar = (avatar?: string) => {
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
            <div className="inline-flex items-center gap-1.5 text-[#FF8A35] font-black uppercase tracking-widest text-xs">
              <Trophy className="w-4 h-4" />
              <span>MASTIVERSE ROLL OF HONOR</span>
            </div>
            <h2 className="font-headline-xl uppercase text-white tracking-tight mt-1 text-3xl sm:text-4xl font-black">
              MASTIVERSE KE TOP PLAYERS 👑
            </h2>
            <p className="font-body-md text-slate-300">
              Real verified rankings and battle scores from authentic matches.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#101A33]/90 backdrop-blur-md self-start sm:self-auto border border-[#315CFF]/20">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveFilter('today');
              }}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === 'today'
                  ? 'bg-[#FF8A35] text-slate-950 shadow-md font-black'
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
                  ? 'bg-[#FF8A35] text-slate-950 shadow-md font-black'
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
                  ? 'bg-[#FF8A35] text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Real Leaderboard Content or Clean Professional Empty State */}
        {playersList.length > 0 ? (
          <>
            {/* Top 3 Podium (Olympic Standard: 2nd Left, 1st Center, 3rd Right) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
              {/* RANK 2 */}
              {rank2 ? (
                <div className="order-2 md:order-1 rounded-3xl p-6 bg-[#1B1B22] border-2 border-slate-300/40 relative flex flex-col items-center text-center shadow-xl hover:border-slate-300 transition-all group">
                  <div className="w-16 h-16 rounded-full bg-slate-300/20 border-2 border-slate-300 flex items-center justify-center text-2xl mb-3 shadow-[0_0_20px_rgba(203,213,225,0.3)]">
                    {renderAvatar(rank2.avatar)}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-400/20 text-slate-300 font-black text-xs uppercase tracking-wider mb-2 border border-slate-400/30">
                    🥈 RANK #2
                  </span>
                  <h3 className="text-xl font-black text-white truncate max-w-[200px]">{rank2.username}</h3>
                  <span className="text-xs text-slate-400 font-mono mt-0.5">{rank2.gameTitle}</span>
                  <div className="mt-4 px-4 py-2 rounded-xl bg-black/40 border border-white/5 w-full flex justify-between items-center text-xs">
                    <span className="text-slate-400">Battle Score:</span>
                    <span className="font-black text-white font-mono">{rank2.score.toLocaleString()} XP</span>
                  </div>
                </div>
              ) : null}

              {/* RANK 1: Sultan / Grand Champion */}
              {rank1 ? (
                <div className="order-1 md:order-2 rounded-3xl p-8 bg-gradient-to-b from-amber-500/20 to-[#1B1B22] border-2 border-amber-400 relative flex flex-col items-center text-center shadow-[0_0_40px_rgba(251,191,36,0.25)] hover:border-amber-300 transition-all md:-translate-y-4">
                  <div className="absolute -top-5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 fill-current" />
                    <span>#1 ARENA SULTAN</span>
                  </div>
                  <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-3 shadow-[0_0_25px_rgba(251,191,36,0.4)] mt-2">
                    {renderAvatar(rank1.avatar)}
                  </div>
                  <h3 className="text-2xl font-black text-white truncate max-w-[220px]">{rank1.username}</h3>
                  <span className="text-xs text-amber-300/80 font-mono mt-0.5">{rank1.gameTitle}</span>
                  <div className="mt-5 px-5 py-2.5 rounded-xl bg-black/50 border border-amber-400/30 w-full flex justify-between items-center text-sm">
                    <span className="text-amber-200">Champion Score:</span>
                    <span className="font-black text-amber-400 font-mono text-base">{rank1.score.toLocaleString()} XP</span>
                  </div>
                </div>
              ) : null}

              {/* RANK 3 */}
              {rank3 ? (
                <div className="order-3 md:order-3 rounded-3xl p-6 bg-[#1B1B22] border-2 border-amber-700/40 relative flex flex-col items-center text-center shadow-xl hover:border-amber-700 transition-all group">
                  <div className="w-16 h-16 rounded-full bg-amber-700/20 border-2 border-amber-700 flex items-center justify-center text-2xl mb-3 shadow-[0_0_20px_rgba(180,83,9,0.3)]">
                    {renderAvatar(rank3.avatar)}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-700/20 text-amber-300 font-black text-xs uppercase tracking-wider mb-2 border border-amber-700/30">
                    🥉 RANK #3
                  </span>
                  <h3 className="text-xl font-black text-white truncate max-w-[200px]">{rank3.username}</h3>
                  <span className="text-xs text-slate-400 font-mono mt-0.5">{rank3.gameTitle}</span>
                  <div className="mt-4 px-4 py-2 rounded-xl bg-black/40 border border-white/5 w-full flex justify-between items-center text-xs">
                    <span className="text-slate-400">Battle Score:</span>
                    <span className="font-black text-white font-mono">{rank3.score.toLocaleString()} XP</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Ranks 4 to 10 Table */}
            {playersList.length > 3 && (
              <div className="rounded-3xl bg-[#1B1B22]/90 border border-white/10 p-4 sm:p-6 shadow-xl flex flex-col gap-2">
                {playersList.slice(3).map((p) => (
                  <div
                    key={p.rank}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-slate-400 font-mono">
                        #{p.rank}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                        {renderAvatar(p.avatar)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-white truncate max-w-[140px] sm:max-w-xs">{p.username}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{p.badge}</span>
                      </div>
                    </div>
                    <span className="font-black font-mono text-xs sm:text-sm text-amber-400">
                      {p.score.toLocaleString()} XP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Clean Professional Empty State */
          <div className="rounded-3xl bg-[#1B1B22]/90 border border-amber-500/20 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">BE THE FIRST SULTAN 👑</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                No match scores registered today yet. Play any game, set a record, and claim Rank #1 on the live leaderboard!
              </p>
            </div>
            <Link
              href="/games"
              className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>PLAY A GAME NOW</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
