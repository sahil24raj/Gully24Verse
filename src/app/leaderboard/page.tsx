'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { soundFx } from '@/lib/audio';
import { useAppStore, GAMES_CATALOG } from '@/store/useAppStore';
import {
  fetchAllCloudLeaderboard,
  subscribeToCloudLeaderboard
} from '@/lib/firebaseService';
import { LeaderboardEntry } from '@/types';
import { GamerAvatar } from '@/components/profile/GamerAvatar';
import {
  FrequentFriend,
  isFriend,
  saveFriend
} from '@/lib/friendsService';
import { UserPlus, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const PAGE_SIZE = 25;

export default function LeaderboardPage() {
  const { user } = useAppStore();
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setFriendsVersion] = useState(0);

  // Compute highest score of current user
  const highestUserScore = Math.max(0, ...Object.values(user.stats.highScores || {}));

  const loadData = useCallback(async (gameId = 'all', showSpinner = true) => {
    if (showSpinner) setIsLoading(true);
    setIsRefreshing(true);

    try {
      const data = await fetchAllCloudLeaderboard(gameId);
      setLeaderboardData(data);
    } catch (err) {
      console.warn('Error loading leaderboard data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedGameFilter, true);

    const unsub = subscribeToCloudLeaderboard(
      (cloudEntries) => {
        if (cloudEntries && cloudEntries.length > 0) {
          loadData(selectedGameFilter, false);
        }
      },
      200,
      selectedGameFilter
    );

    const handleFriendsUpdated = () => setFriendsVersion((v) => v + 1);
    window.addEventListener('gullyverse_friends_updated', handleFriendsUpdated);

    return () => {
      if (typeof unsub === 'function') unsub();
      window.removeEventListener('gullyverse_friends_updated', handleFriendsUpdated);
    };
  }, [selectedGameFilter, loadData]);

  const filteredData = useMemo(() => {
    let result = leaderboardData;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.username.toLowerCase().includes(q) ||
          (e.gameTitle && e.gameTitle.toLowerCase().includes(q))
      );
    }
    return result;
  }, [leaderboardData, searchQuery]);

  const totalUsers = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const top1 = filteredData[0];
  const top2 = filteredData[1];
  const top3 = filteredData[2];

  const handlePageChange = (newPage: number) => {
    soundFx.playClick();
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const handleAddFriend = async (entry: LeaderboardEntry) => {
    soundFx.playClick();
    const friend: FrequentFriend = {
      id: `f_${entry.username.toLowerCase()}`,
      username: entry.username,
      displayName: entry.username,
      avatar: entry.avatar || '🚀',
      level: Math.max(1, Math.floor(entry.score / 1500) + 1),
      status: 'online',
      currentlyPlaying: entry.gameTitle || 'Ready for match',
      lastSeen: 'Active now',
      gamesTogether: 1,
      gameId: 'fun-race'
    };
    await saveFriend(user.id, friend);
    soundFx.playSuccess();
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } catch {}
    setFriendsVersion((v) => v + 1);
  };

  return (
    <div className="space-y-10 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto pt-6">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-high border border-purple-500/20 text-xs font-label-sm text-tertiary font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">emoji_events</span>
          <span>COMPETITIVE HALL OF FAME</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-headline-xl font-bold text-on-surface uppercase tracking-tight">
          LEGENDS &amp; RANKINGS
        </h1>
        <p className="font-body-md text-soft-lavender leading-relaxed">
          Real scores submitted by verified players across all classroom duels, social deduction games, and rapid mind battles.
        </p>

        {/* Live Sync Status Pill */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-[11px] font-label-sm text-neon-green font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
            <span>Anti-Cheat Verified Standings</span>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              loadData(selectedGameFilter, true);
            }}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-purple-500/20 text-[11px] font-label-sm text-neon-cyan hover:text-white transition-colors cursor-pointer"
          >
            <span className={`material-symbols-outlined text-sm ${isRefreshing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto bg-surface-container p-3 rounded-2xl border border-purple-500/20 shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedGameFilter('all');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-label-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              selectedGameFilter === 'all'
                ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,44,255,0.4)]'
                : 'text-soft-lavender hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            All Games 🏆
          </button>

          {GAMES_CATALOG.slice(0, 7).map((game) => (
            <button
              key={game.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedGameFilter(game.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-label-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedGameFilter === game.id
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,44,255,0.4)]'
                  : 'text-soft-lavender hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>{game.thumbnail}</span>
              <span>{game.title}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <input
            type="text"
            placeholder="Search by gamer username..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-purple-500/20 text-xs font-body-sm text-on-surface placeholder-soft-lavender/50 outline-none focus:border-neon-cyan transition-colors"
          />
          <span className="material-symbols-outlined text-sm absolute left-3 top-2.5 text-soft-lavender">
            search
          </span>
        </div>
      </div>

      {/* User Current Standing Info Card */}
      <div className="max-w-4xl mx-auto p-5 rounded-2xl border border-purple-500/30 bg-surface-purple/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <GamerAvatar
            avatar={user.avatar}
            photoURL={user.photoURL}
            avatarType={user.avatarType}
            size="lg"
            showOnline={true}
            isOnline={true}
            rank={user.rank as string}
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-headline-sm text-on-surface font-bold">{user.displayName || user.username}</span>
              <span className="font-label-sm text-neon-cyan px-2 py-0.5 rounded bg-surface-container-high border border-neon-cyan/30">
                LVL {user.level}
              </span>
              <span className="font-label-sm text-tertiary px-2 py-0.5 rounded bg-surface-container-high border border-tertiary/30">
                {user.rank || 'Bronze II'}
              </span>
            </div>
            <p className="font-body-sm text-soft-lavender mt-0.5">
              Your Personal Best:{' '}
              <strong className="text-neon-cyan">
                {highestUserScore > 0 ? `${highestUserScore.toLocaleString()} pts` : 'No score recorded yet'}
              </strong>
              {' • '}
              Total Wins: <strong className="text-neon-green">{user.stats.totalWins || 0}</strong>
            </p>
          </div>
        </div>

        <Link
          href="/games"
          onClick={() => soundFx.playClick()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-tertiary text-on-tertiary-fixed font-headline-sm text-sm uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(235,195,21,0.5)] hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base">bolt</span>
          <span>PLAY TO SET RECORD</span>
        </Link>
      </div>

      {/* Top 3 Podium Cards */}
      {filteredData.length >= 3 && currentPage === 1 && !searchQuery && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4 items-end">
          {/* Rank 2 */}
          <div className="bg-surface-container border border-purple-500/20 rounded-2xl p-5 text-center flex flex-col items-center order-2 sm:order-1 shadow-xl">
            <span className="text-3xl mb-1">🥈</span>
            <GamerAvatar avatar={top2.avatar} size="xl" rank="Silver" className="my-2" />
            <div className="font-headline-sm text-on-surface font-bold">{top2.username}</div>
            <div className="font-label-sm text-soft-lavender">{top2.gameTitle || 'Top Arena Match'}</div>
            <div className="font-headline-md text-neon-cyan font-bold mt-2">{top2.score.toLocaleString()} pts</div>
            <div className="font-label-sm text-neon-green font-bold mt-0.5">{top2.wins} Wins</div>

            {top2.username.toLowerCase() !== user.username.toLowerCase() && (
              <div className="mt-3 w-full">
                {isFriend(user.id, top2.username) ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neon-green font-bold bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/30">
                    <UserCheck className="w-3 h-3" /> Friends
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddFriend(top2)}
                    className="w-full py-1.5 rounded-xl bg-neon-cyan/15 hover:bg-neon-cyan hover:text-slate-950 border border-neon-cyan/40 text-neon-cyan font-mono font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Add Friend</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Rank 1 (Champion) */}
          <div className="bg-gradient-to-b from-surface-container-high to-surface-container border-2 border-tertiary/60 rounded-2xl p-6 text-center flex flex-col items-center order-1 sm:order-2 shadow-[0_0_40px_rgba(235,195,21,0.35)] -mt-4 sm:-mt-6 scale-105">
            <span className="text-4xl mb-1 animate-bounce">👑</span>
            <GamerAvatar avatar={top1.avatar} size="2xl" rank="Grandmaster" className="my-2" />
            <div className="font-headline-md text-on-surface font-bold">{top1.username}</div>
            <div className="font-label-sm text-tertiary font-bold">{top1.gameTitle || 'Top Arena Match'}</div>
            <div className="font-headline-lg text-tertiary font-bold mt-2">{top1.score.toLocaleString()} pts</div>
            <div className="font-label-sm text-neon-green font-bold mt-0.5">{top1.wins} Wins</div>
            <span className="mt-2 font-label-sm px-2.5 py-0.5 rounded bg-tertiary/20 text-tertiary font-bold border border-tertiary/30">
              #1 ARENA SULTAN
            </span>

            {top1.username.toLowerCase() !== user.username.toLowerCase() && (
              <div className="mt-3 w-full">
                {isFriend(user.id, top1.username) ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neon-green font-bold bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/30">
                    <UserCheck className="w-3 h-3" /> Friends
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddFriend(top1)}
                    className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 fill-slate-950" />
                    <span>+ Add Friend</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Rank 3 */}
          <div className="bg-surface-container border border-purple-500/20 rounded-2xl p-5 text-center flex flex-col items-center order-3 shadow-xl">
            <span className="text-3xl mb-1">🥉</span>
            <GamerAvatar avatar={top3.avatar} size="xl" rank="Bronze" className="my-2" />
            <div className="font-headline-sm text-on-surface font-bold">{top3.username}</div>
            <div className="font-label-sm text-soft-lavender">{top3.gameTitle || 'Top Arena Match'}</div>
            <div className="font-headline-md text-primary font-bold mt-2">{top3.score.toLocaleString()} pts</div>
            <div className="font-label-sm text-neon-green font-bold mt-0.5">{top3.wins} Wins</div>

            {top3.username.toLowerCase() !== user.username.toLowerCase() && (
              <div className="mt-3 w-full">
                {isFriend(user.id, top3.username) ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neon-green font-bold bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/30">
                    <UserCheck className="w-3 h-3" /> Friends
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddFriend(top3)}
                    className="w-full py-1.5 rounded-xl bg-neon-cyan/15 hover:bg-neon-cyan hover:text-slate-950 border border-neon-cyan/40 text-neon-cyan font-mono font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Add Friend</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="max-w-4xl mx-auto rounded-2xl bg-surface-container border border-purple-500/20 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-purple-500/20 flex items-center justify-between font-label-sm text-soft-lavender">
          <span>ARENA PLAYERS ({totalUsers})</span>
          <span>SCORE &amp; STATS</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-soft-lavender font-body-sm flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-3xl animate-spin text-primary">
              sync
            </span>
            <span>Fetching verified rankings from Firestore...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-surface-container-high text-3xl flex items-center justify-center mx-auto text-soft-lavender">
              🏆
            </div>
            <div>
              <h3 className="font-headline-sm text-on-surface font-bold">No scores recorded for this category yet</h3>
              <p className="font-body-sm text-soft-lavender mt-1 max-w-sm mx-auto">
                Be the first player to complete a match and claim the #1 Champion spot on the leaderboard!
              </p>
            </div>
            <Link
              href="/games"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-tertiary text-on-tertiary-fixed font-label-md font-bold uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>PLAY A GAME NOW</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-purple-500/10">
            {paginatedData.map((entry) => {
              const isCurrentUser =
                entry.username.toLowerCase() === user.username.toLowerCase() ||
                (user.displayName && entry.username.toLowerCase() === user.displayName.toLowerCase());

              const alreadyFriend = isFriend(user.id, entry.username);

              return (
                <div
                  key={`${entry.rank}-${entry.username}-${entry.gameId || 'all'}`}
                  className={`px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 transition-colors ${
                    isCurrentUser ? 'bg-primary-container/20 border-l-4 border-primary' : 'hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`w-7 text-center font-headline-sm font-bold ${
                        entry.rank === 1
                          ? 'text-tertiary'
                          : entry.rank === 2
                          ? 'text-neon-cyan'
                          : entry.rank === 3
                          ? 'text-primary'
                          : 'text-soft-lavender'
                      }`}
                    >
                      #{entry.rank}
                    </span>

                    <GamerAvatar avatar={entry.avatar} size="md" rank={entry.badge} />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-label-lg text-on-surface font-bold truncate">
                          {entry.username}
                        </span>
                        {isCurrentUser && (
                          <span className="font-label-sm text-neon-green bg-neon-green/20 px-1.5 py-0.5 rounded font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="font-body-sm text-soft-lavender block text-xs truncate">
                        {entry.gameTitle || 'All Vibes Match'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-right shrink-0">
                    {!isCurrentUser && (
                      <div>
                        {alreadyFriend ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neon-green font-bold bg-neon-green/10 px-2.5 py-1 rounded-lg border border-neon-green/30">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Squad Mate</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddFriend(entry)}
                            className="px-2.5 sm:px-3 py-1 rounded-lg bg-neon-cyan/15 hover:bg-neon-cyan hover:text-slate-950 border border-neon-cyan/40 text-neon-cyan font-mono font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                            title="Add to Your Squad"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>+ Add Friend</span>
                          </button>
                        )}
                      </div>
                    )}

                    <div className="w-24 sm:w-28">
                      <span className="font-headline-sm text-tertiary font-bold block">
                        {entry.score.toLocaleString()} pts
                      </span>
                      <span className="font-label-sm text-neon-green">
                        {entry.wins || 0} Wins
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-purple-500/20 flex items-center justify-between font-label-md">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface disabled:opacity-40 hover:bg-surface-bright transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="text-soft-lavender">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface disabled:opacity-40 hover:bg-surface-bright transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
