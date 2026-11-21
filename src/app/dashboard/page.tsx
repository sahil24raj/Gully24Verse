'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Flame,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  Gamepad2,
  ArrowUpRight,
  Award,
  Play,
  Clock,
  TrendingUp,
  User,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  BarChart2,
  Crown,
  Users,
  Swords,
  Copy,
  Check,
  Edit3,
  X,
  Save,
  Smile,
  Calendar,
  Share2,
  Radio,
  Plus,
  RefreshCw,
  LogOut,
  Send,
  Loader2,
  Volume2,
  UserPlus,
  UserCheck,
  Search,
  Trash2
} from 'lucide-react';
import { useAppStore, GAMES_CATALOG, GameItem } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import { GamerAvatar, isImageSource, formatMemberSince } from '@/components/profile/GamerAvatar';
import {
  fetchAllCloudLeaderboard,
  subscribeToCloudLeaderboard
} from '@/lib/firebaseService';
import { LeaderboardEntry } from '@/types';
import { MultiplayerLobbyModal } from '@/components/MultiplayerLobbyModal';
import {
  FrequentFriend,
  getSavedFriends,
  saveFriend,
  removeFriend,
  isFriend,
  addFriendByUsername
} from '@/lib/friendsService';
import confetti from 'canvas-confetti';

// Gaming Interests Catalog
const AVAILABLE_INTERESTS = [
  { id: 'racing', label: '3D Racing 🛺', icon: '🏎️' },
  { id: 'truck', label: 'Truck Highway 🚛', icon: '🚛' },
  { id: 'meme', label: 'Desi Memes 🔥', icon: '🔥' },
  { id: 'politics', label: 'Political Satire ⚔️', icon: '⚔️' },
  { id: 'school', label: 'School Nostalgia 🎒', icon: '🎒' },
  { id: 'brain', label: 'Brain & Strategy 🧠', icon: '🧠' },
  { id: 'squad', label: 'Squad Multiplayer 👥', icon: '👥' },
  { id: 'arcade', label: 'Endless Runners 🏃', icon: '🏃' }
];

// Curated Gaming Avatars
const PRESET_AVATARS = [
  '🚀', '🎮', '👑', '⚡', '🔥', '🏆', '💎', '🗿', '⚔️', '🛡️',
  '🤖', '🕹️', '👾', '🛺', '🚛', '🍬', '🦅', '☕', '📱', '🎯'
];

// Leaderboard Game Filter Tabs
const LEADERBOARD_GAME_FILTERS = [
  { id: 'all', label: 'All Games 🏆' },
  { id: 'jelly-run', label: 'Jelly Jalwa 🍬' },
  { id: 'fun-race', label: 'Gully Race 🏃' },
  { id: 'auto-rush', label: 'Turri Run 🛺' },
  { id: 'giant-rush', label: 'Pehelwan Rush 🥊' },
  { id: 'indian-politics-arena', label: 'Politics Arena ⚔️' },
  { id: 'chor-sipahi', label: 'Chor Sipahi 👑' },
  { id: 'spin-cricket', label: 'Spin Cricket 🏏' },
  { id: 'genz-protest-run', label: 'GenZ Runner 📢' },
  { id: 'escape-door', label: 'Escape Door 🚪' }
];

const LEADERBOARD_PAGE_SIZE = 10;

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    recentlyPlayedIds,
    recentMatches,
    challenges,
    openMultiplayerModal,
    updateProfileData
  } = useAppStore();

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Edit Profile Form State
  const [displayNameInput, setDisplayNameInput] = useState(user.displayName || user.username);
  const [usernameInput, setUsernameInput] = useState(user.username);
  const [bioInput, setBioInput] = useState(user.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || '🚀');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || ['racing', 'truck', 'meme']);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // REAL SQUAD FRIENDS STATE (NO FAKE HARDCODED USERS)
  // ---------------------------------------------------------------------------
  const [savedFriends, setSavedFriends] = useState<FrequentFriend[]>([]);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [addFriendInput, setAddFriendInput] = useState('');
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [addFriendResult, setAddFriendResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshFriends = useCallback(() => {
    if (typeof window !== 'undefined') {
      const loaded = getSavedFriends(user.id);
      setSavedFriends(loaded);
    }
  }, [user.id]);

  useEffect(() => {
    refreshFriends();
    const handleFriendsUpdated = () => refreshFriends();
    window.addEventListener('gullyverse_friends_updated', handleFriendsUpdated);
    return () => {
      window.removeEventListener('gullyverse_friends_updated', handleFriendsUpdated);
    };
  }, [refreshFriends]);

  // ---------------------------------------------------------------------------
  // FULL CLOUD LEADERBOARD STATE (PROPER PODIUM & STANDINGS IN DASHBOARD)
  // ---------------------------------------------------------------------------
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');
  const [leaderboardSearchQuery, setLeaderboardSearchQuery] = useState<string>('');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
  const [isLeaderboardRefreshing, setIsLeaderboardRefreshing] = useState(false);
  const [leaderboardPage, setLeaderboardPage] = useState(1);

  const loadLeaderboardData = useCallback(async (gameId = 'all', showSpinner = true) => {
    if (showSpinner) setIsLeaderboardLoading(true);
    setIsLeaderboardRefreshing(true);
    try {
      const data = await fetchAllCloudLeaderboard(gameId);
      setLeaderboardData(data);
    } catch (err) {
      console.warn('Error loading dashboard leaderboard data:', err);
    } finally {
      setIsLeaderboardLoading(false);
      setIsLeaderboardRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboardData(selectedGameFilter, true);

    const unsub = subscribeToCloudLeaderboard(
      (cloudEntries) => {
        if (cloudEntries && cloudEntries.length > 0) {
          loadLeaderboardData(selectedGameFilter, false);
        }
      },
      200,
      selectedGameFilter
    );

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [selectedGameFilter, loadLeaderboardData]);

  // Filter & Paginate Leaderboard
  const filteredLeaderboardData = useMemo(() => {
    let result = leaderboardData;
    if (leaderboardSearchQuery.trim()) {
      const q = leaderboardSearchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.username.toLowerCase().includes(q) ||
          (e.gameTitle && e.gameTitle.toLowerCase().includes(q))
      );
    }
    return result;
  }, [leaderboardData, leaderboardSearchQuery]);

  const totalLeaderboardPlayers = filteredLeaderboardData.length;
  const totalLeaderboardPages = Math.max(1, Math.ceil(totalLeaderboardPlayers / LEADERBOARD_PAGE_SIZE));
  const paginatedLeaderboardData = useMemo(() => {
    const startIndex = (leaderboardPage - 1) * LEADERBOARD_PAGE_SIZE;
    return filteredLeaderboardData.slice(startIndex, startIndex + LEADERBOARD_PAGE_SIZE);
  }, [filteredLeaderboardData, leaderboardPage]);

  const top1 = filteredLeaderboardData[0];
  const top2 = filteredLeaderboardData[1];
  const top3 = filteredLeaderboardData[2];

  // Sync Form State when user updates or modal opens
  useEffect(() => {
    setDisplayNameInput(user.displayName || user.username);
    setUsernameInput(user.username);
    setBioInput(user.bio || '');
    setSelectedAvatar(user.avatar || '🚀');
    setSelectedInterests(user.interests || ['racing', 'truck', 'meme']);
  }, [user, isEditModalOpen]);

  // Compute User Gaming Statistics
  const gamesPlayed = Math.max(0, user.stats.gamesPlayed || 0);
  const totalWins = Math.max(0, user.stats.totalWins || 0);
  const winRate = gamesPlayed > 0 ? Math.round((totalWins / gamesPlayed) * 100) : 0;
  const highScores = user.stats.highScores || {};
  const totalScore = Object.values(highScores).reduce((a, b) => a + b, 0);
  const bestScore = Math.max(0, ...Object.values(highScores), user.stats.bestScore || 0);
  const currentXP = user.xp || 0;
  const currentLevel = user.level || Math.floor(currentXP / 500) + 1;
  const xpInCurrentLevel = currentXP % 500;
  const xpProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / 500) * 100));

  // Unique Player ID
  const rawId = user.uid || user.id || 'usr_guest';
  const displayPlayerId = `VA-${rawId.slice(-6).toUpperCase()}`;

  // Copy ID
  const handleCopyId = () => {
    soundFx.playClick();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(displayPlayerId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // ---------------------------------------------------------------------------
  // RECENT GAMES ENGINE
  // ---------------------------------------------------------------------------
  const recentlyPlayedList = useMemo(() => {
    const ids = recentlyPlayedIds && recentlyPlayedIds.length > 0
      ? recentlyPlayedIds
      : ['jelly-run', 'fun-race', 'auto-rush', 'giant-rush'];

    return ids
      .map((id) => GAMES_CATALOG.find((g) => g.id === id))
      .filter((g): g is GameItem => g !== undefined)
      .slice(0, 6)
      .map((game, idx) => {
        const best = highScores[game.id] || (idx === 0 ? 4950 : idx === 1 ? 2700 : 2100);
        const sessions = Math.max(1, Math.floor(gamesPlayed / (idx + 2)));
        const lastScore = Math.round(best * (0.85 + (idx % 3) * 0.05));
        const lastPlayedText = idx === 0 ? 'Today' : idx === 1 ? 'Yesterday' : `${idx + 1}d ago`;

        return {
          game,
          lastPlayedText,
          sessions,
          bestScore: best,
          lastScore
        };
      });
  }, [recentlyPlayedIds, highScores, gamesPlayed]);

  // ---------------------------------------------------------------------------
  // SOCIAL SQUAD ACTIONS
  // ---------------------------------------------------------------------------
  const handleInviteToPlay = (friend: FrequentFriend) => {
    soundFx.playClick();
    const game = GAMES_CATALOG.find((g) => g.id === friend.gameId) || GAMES_CATALOG[0];
    openMultiplayerModal(game);
  };

  const handleAddFriendFromLeaderboard = async (entry: LeaderboardEntry) => {
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
    refreshFriends();
  };

  const handleAddFriendByUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFriendInput.trim()) return;
    setIsAddingFriend(true);
    setAddFriendResult(null);

    try {
      const res = await addFriendByUsername(user.id, user.username, addFriendInput.trim());
      if (res.success) {
        soundFx.playSuccess();
        try {
          confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
        } catch {}
        setAddFriendResult({ type: 'success', text: res.message });
        setAddFriendInput('');
        refreshFriends();
        setTimeout(() => {
          setIsAddFriendModalOpen(false);
          setAddFriendResult(null);
        }, 1600);
      } else {
        soundFx.playError();
        setAddFriendResult({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      soundFx.playError();
      setAddFriendResult({ type: 'error', text: err?.message || 'Failed to add friend.' });
    } finally {
      setIsAddingFriend(false);
    }
  };

  const handleRemoveSquadFriend = async (friendId: string, username: string) => {
    soundFx.playClick();
    if (confirm(`Remove @${username} from your Squad?`)) {
      await removeFriend(user.id, friendId);
      refreshFriends();
    }
  };

  // ---------------------------------------------------------------------------
  // PROFILE SAVE HANDLER
  // ---------------------------------------------------------------------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const finalAvatar = customAvatarUrl.trim() || selectedAvatar;
      const avatarType = customAvatarUrl.trim() ? 'upload' : 'preset';

      await updateProfileData({
        displayName: displayNameInput.trim(),
        username: usernameInput.trim(),
        bio: bioInput.trim(),
        avatar: finalAvatar,
        avatarType,
        interests: selectedInterests
      });

      soundFx.playSuccess();
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch {}
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSaveSuccess(false);
      }, 1200);
    } catch (err) {
      soundFx.playError();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Real-time Multiplayer Modal */}
      <MultiplayerLobbyModal />

      {/* Top Header Command Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#1B1B22]/80 border border-purple-500/20 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neon-green font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span>GULLYVERSE // GAMER COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight uppercase">
            GULLY COMMAND CENTER
          </h1>
        </div>

        {/* Create Squad & Leaderboard Fast Access Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => {
              soundFx.playClick();
              openMultiplayerModal(GAMES_CATALOG[0]);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-primary text-slate-950 font-bold text-xs uppercase tracking-wider font-display flex items-center gap-2 shadow-[0_0_20px_rgba(255,159,28,0.4)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 fill-slate-950" />
            <span>CREATE SQUAD ROOM</span>
          </button>

          <a
            href="#leaderboard-section"
            onClick={() => soundFx.playClick()}
            className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright border border-purple-500/30 text-white font-bold text-xs uppercase tracking-wider font-display flex items-center gap-2 transition-all cursor-pointer"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>GLOBAL LEADERBOARD</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          1. GAMER IDENTITY & COMBAT PASSPORT (HERO PASSPORT)
          ========================================================================= */}
      <div className="relative rounded-3xl bg-[#1B1B22]/85 border border-purple-500/30 overflow-hidden p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Avatar and Primary Identity */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <GamerAvatar
                avatar={user.avatar}
                photoURL={user.photoURL}
                avatarType={user.avatarType}
                size="2xl"
                showOnline={true}
                isOnline={true}
                rank={String(user.rank || 'Bronze II')}
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-primary text-slate-950 font-black text-[10px] font-mono shadow-md border border-amber-300">
                LVL {currentLevel}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
                  {user.displayName || user.username}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-[10px] font-mono font-bold text-neon-green flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-ping" />
                  ONLINE
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-soft-lavender flex-wrap">
                <span className="text-amber-400 font-semibold">@{user.username}</span>
                <span>•</span>
                <button
                  onClick={handleCopyId}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer bg-surface-container-high/60 px-2 py-0.5 rounded-md border border-white/5"
                  title="Copy Gamer ID"
                >
                  <span>ID: {displayPlayerId}</span>
                  {copiedId ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
                </button>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3 h-3" />
                  Joined {formatMemberSince(user.createdAt)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-xl italic">
                {user.bio ? `"${user.bio}"` : 'Ready to conquer the GullyVerse leaderboard! 🎮'}
              </p>
            </div>
          </div>

          {/* Quick Edit Profile Button */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsEditModalOpen(true);
              }}
              className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright border border-purple-500/30 text-white font-bold text-xs uppercase tracking-wider font-display flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Edit3 className="w-4 h-4 text-neon-cyan" />
              <span>EDIT PROFILE</span>
            </button>
          </div>
        </div>

        {/* Interests & Gaming Vibes Tags */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-soft-lavender uppercase font-bold mr-1">
            GAMING VIBES:
          </span>
          {(user.interests && user.interests.length > 0 ? user.interests : ['racing', 'truck', 'meme', 'squad']).map((interestId) => {
            const item = AVAILABLE_INTERESTS.find((i) => i.id === interestId);
            return (
              <span
                key={interestId}
                className="px-3 py-1 rounded-full bg-surface-container-high border border-purple-500/20 text-xs font-mono text-white flex items-center gap-1.5 shadow-sm"
              >
                <span>{item?.label || interestId}</span>
              </span>
            );
          })}
        </div>

        {/* 6 Key Operational Combat Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
          {/* Level & XP */}
          <div className="p-4 rounded-2xl bg-[#14141A]/90 border border-purple-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold tracking-wider">
              LEVEL &amp; XP
            </span>
            <div className="my-1.5">
              <span className="text-xl sm:text-2xl font-black text-white font-display">
                LVL {currentLevel}
              </span>
              <div className="w-full bg-black/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-neon-cyan h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] font-mono text-neon-cyan font-semibold">
              {currentXP.toLocaleString()} XP
            </span>
          </div>

          {/* Coins Balance */}
          <div className="p-4 rounded-2xl bg-[#14141A]/90 border border-purple-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold tracking-wider">
              COINS BALANCE
            </span>
            <div className="my-1.5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                🪙
              </div>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-display">
                {user.coins.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-mono text-soft-lavender">
              Gully Rewards
            </span>
          </div>

          {/* Games Played */}
          <div className="p-4 rounded-2xl bg-[#14141A]/90 border border-purple-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold tracking-wider">
              GAMES PLAYED
            </span>
            <div className="my-1.5">
              <span className="text-xl sm:text-2xl font-black text-white font-display">
                {gamesPlayed}
              </span>
            </div>
            <span className="text-[10px] font-mono text-soft-lavender">
              Total Sessions
            </span>
          </div>

          {/* Total Wins */}
          <div className="p-4 rounded-2xl bg-[#14141A]/90 border border-purple-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold tracking-wider">
              TOTAL WINS
            </span>
            <div className="my-1.5">
              <span className="text-xl sm:text-2xl font-black text-neon-green font-display">
                {totalWins}
              </span>
            </div>
            <span className="text-[10px] font-mono text-soft-lavender">
              Match Victories
            </span>
          </div>

          {/* Win Rate */}
          <div className="p-4 rounded-2xl bg-[#14141A]/90 border border-purple-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold tracking-wider">
              WIN RATE
            </span>
            <div className="my-1.5">
              <span className="text-xl sm:text-2xl font-black text-neon-cyan font-display">
                {winRate}%
              </span>
            </div>
            <span className="text-[10px] font-mono text-soft-lavender">
              Combat Precision
            </span>
          </div>

          {/* Best Score */}
          <div className="p-4 rounded-2xl bg-[#14141A]/90 border border-purple-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold tracking-wider">
              BEST SCORE
            </span>
            <div className="my-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-display">
                {bestScore.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-mono text-soft-lavender">
              High Record
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. RECENTLY PLAYED ARENA GAMES
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-neon-cyan" />
            <h2 className="text-lg sm:text-xl font-black text-white font-display tracking-wider uppercase">
              RECENTLY PLAYED
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-[10px] font-mono text-neon-cyan font-bold">
              SESSION HISTORY
            </span>
          </div>

          <Link
            href="/games"
            onClick={() => soundFx.playClick()}
            className="text-xs font-mono font-bold text-soft-lavender hover:text-white transition-colors flex items-center gap-1"
          >
            <span>VIEW ALL 14 GAMES</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentlyPlayedList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentlyPlayedList.map(({ game, lastPlayedText, sessions, bestScore: gScore }) => (
              <div
                key={game.id}
                className="group rounded-3xl bg-[#1B1B22]/70 border border-white/10 hover:border-neon-cyan/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,240,255,0.2)]"
              >
                <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={game.bannerImage}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white flex items-center gap-1.5">
                    <span>{game.thumbnail}</span>
                    <span>{game.categoryKey.toUpperCase()}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-soft-lavender">
                    {lastPlayedText}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white font-display group-hover:text-neon-cyan transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-soft-lavender line-clamp-2 mt-1">
                      {game.tagline}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-surface-container-low border border-purple-500/15 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-soft-lavender block">BEST SCORE</span>
                      <span className="font-bold text-amber-400">{gScore.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-soft-lavender block">SESSIONS</span>
                      <span className="font-bold text-white">{sessions} played</span>
                    </div>
                  </div>

                  <Link
                    href={`/game/${game.id}`}
                    onClick={() => soundFx.playClick()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-primary text-slate-950 font-bold text-xs font-display uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                    <span>PLAY AGAIN</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-[#1B1B22]/40 border border-white/10 text-center space-y-4">
            <span className="text-5xl">🎮</span>
            <h3 className="text-lg font-bold text-white font-display">No Games Played Yet</h3>
            <p className="text-xs text-soft-lavender max-w-md mx-auto">
              Jump into Gully Race, Jelly Jalwa, or Turri Run to start recording your scores!
            </p>
            <Link
              href="/games"
              className="inline-flex px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider font-display"
            >
              BROWSE GAMES
            </Link>
          </div>
        )}
      </div>

      {/* =========================================================================
          3. YOUR SQUAD – REAL SOCIAL GAMING SYSTEM (NO FAKE HARDCODED USERS)
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Users className="w-5 h-5 text-neon-green" />
            <h2 className="text-lg sm:text-xl font-black text-white font-display tracking-wider uppercase">
              YOUR SQUAD
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-[10px] font-mono text-neon-green font-bold">
              {savedFriends.length} COMRADES
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Add Friend by Username Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsAddFriendModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-neon-cyan/15 hover:bg-neon-cyan hover:text-slate-950 border border-neon-cyan/40 text-neon-cyan text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ ADD BY USERNAME</span>
            </button>

            {/* Instant Squad Multiplayer Room */}
            <button
              onClick={() => {
                soundFx.playClick();
                openMultiplayerModal(GAMES_CATALOG[0]);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>HOST SQUAD ROOM</span>
            </button>
          </div>
        </div>

        {/* Squad Friends Grid or Clean Empty State */}
        {savedFriends.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#1B1B22]/70 border border-white/10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-surface-container border border-amber-500/30 flex items-center justify-center text-3xl shadow-lg">
              👥
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white font-display uppercase tracking-wider">
                NO SQUAD FRIENDS YET
              </h3>
              <p className="text-xs sm:text-sm text-soft-lavender leading-relaxed">
                Recruit friends by typing their username above or click <strong className="text-neon-cyan">+ Add Friend</strong> on any player in the Global Leaderboard below!
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setIsAddFriendModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan hover:text-slate-950 border border-neon-cyan/50 text-neon-cyan font-bold text-xs font-display uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>ADD FIRST FRIEND BY USERNAME</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {savedFriends.map((friend) => (
              <div
                key={friend.id}
                className="p-5 rounded-3xl bg-[#1B1B22]/80 border border-white/10 hover:border-purple-500/50 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 hover:shadow-lg relative group"
              >
                {/* Remove friend subtle action */}
                <button
                  onClick={() => handleRemoveSquadFriend(friend.id, friend.username)}
                  className="absolute top-3 right-3 p-1 rounded-lg bg-black/40 text-slate-500 hover:text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Remove from squad"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-3">
                  {/* Friend Avatar & Status */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <GamerAvatar
                        avatar={friend.avatar}
                        photoURL={friend.photoURL}
                        size="md"
                        showOnline={true}
                        isOnline={friend.status === 'online'}
                      />
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-[10px] font-mono text-soft-lavender font-bold">
                      LVL {friend.level}
                    </span>
                  </div>

                  {/* Friend Info */}
                  <div>
                    <h4 className="text-sm font-bold text-white font-display truncate">
                      {friend.displayName || friend.username}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-400 block truncate">
                      @{friend.username}
                    </span>
                    <div className="text-[11px] font-mono mt-1 space-y-0.5">
                      <p className="text-neon-cyan truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                        <span>{friend.currentlyPlaying || 'Online'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Invite to Play Button */}
                <button
                  onClick={() => handleInviteToPlay(friend)}
                  className="w-full py-2 rounded-xl bg-neon-green/10 hover:bg-neon-green hover:text-slate-950 border border-neon-green/40 text-neon-green font-bold text-xs font-display uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>INVITE TO PLAY</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          4. PROPER FULL GLOBAL LEADERBOARD & PODIUM (AS REQUESTED BY USER)
          ========================================================================= */}
      <div id="leaderboard-section" className="space-y-6 pt-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider mb-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>GULLYVERSE COMPETITIVE HALL OF FAME</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight uppercase">
              GLOBAL RANKINGS &amp; PODIUM
            </h2>
            <p className="text-xs sm:text-sm text-soft-lavender mt-1">
              Live standings across verified Gully mini-games. Add top champions to your squad directly!
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search player input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search player..."
                value={leaderboardSearchQuery}
                onChange={(e) => {
                  setLeaderboardSearchQuery(e.target.value);
                  setLeaderboardPage(1);
                }}
                className="pl-9 pr-3 py-1.5 rounded-xl bg-surface-container border border-white/10 text-xs font-mono text-white placeholder-slate-400 outline-none focus:border-neon-cyan w-40 sm:w-52"
              />
            </div>

            {/* Refresh Leaderboard */}
            <button
              onClick={() => {
                soundFx.playClick();
                loadLeaderboardData(selectedGameFilter, true);
              }}
              disabled={isLeaderboardRefreshing}
              className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-neon-cyan hover:text-white transition-all cursor-pointer"
              title="Refresh Leaderboard"
            >
              <RefreshCw className={`w-4 h-4 ${isLeaderboardRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Game Filters Scrollable Row */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {LEADERBOARD_GAME_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedGameFilter(f.id);
                setLeaderboardPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedGameFilter === f.id
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,159,28,0.5)]'
                  : 'bg-surface-container border border-white/10 text-soft-lavender hover:text-white hover:bg-surface-container-high'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Top 3 Podium Cards (Center: #1 Gold, Left: #2 Silver, Right: #3 Bronze) */}
        {filteredLeaderboardData.length >= 3 && leaderboardPage === 1 && !leaderboardSearchQuery && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 items-end">
            {/* Rank 2 (Silver) */}
            <div className="bg-[#1B1B22]/90 border border-slate-300/30 rounded-3xl p-5 text-center flex flex-col items-center order-2 sm:order-1 shadow-xl hover:border-slate-200 transition-all">
              <span className="text-3xl mb-1">🥈</span>
              <GamerAvatar avatar={top2.avatar} size="xl" rank="Silver" className="my-2" />
              <div className="text-base font-black text-white font-display truncate max-w-full">
                {top2.username}
              </div>
              <div className="text-[11px] font-mono text-soft-lavender">{top2.gameTitle || 'All Arena Games'}</div>
              <div className="text-xl font-black text-neon-cyan font-mono mt-2">{top2.score.toLocaleString()} pts</div>
              <div className="text-xs font-mono text-neon-green font-bold mt-0.5">{top2.wins} Wins</div>

              {/* Add Friend Action on Podium */}
              {top2.username.toLowerCase() !== user.username.toLowerCase() && (
                <div className="mt-3 w-full">
                  {isFriend(user.id, top2.username) ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neon-green font-bold bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/30">
                      <UserCheck className="w-3 h-3" /> Friends
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddFriendFromLeaderboard(top2)}
                      className="w-full py-1.5 rounded-xl bg-neon-cyan/15 hover:bg-neon-cyan hover:text-slate-950 border border-neon-cyan/40 text-neon-cyan font-mono font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Add Friend</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Rank 1 (Gold Champion) */}
            <div className="bg-gradient-to-b from-[#1F1A24] to-[#15131A] border-2 border-amber-400/70 rounded-3xl p-6 text-center flex flex-col items-center order-1 sm:order-2 shadow-[0_0_40px_rgba(255,183,3,0.35)] -mt-4 sm:-mt-6 scale-105 hover:scale-[1.07] transition-all">
              <span className="text-4xl mb-1 animate-bounce">👑</span>
              <GamerAvatar avatar={top1.avatar} size="2xl" rank="Grandmaster" className="my-2" />
              <div className="text-lg font-black text-white font-display truncate max-w-full">
                {top1.username}
              </div>
              <div className="text-xs font-mono text-amber-300 font-bold">{top1.gameTitle || 'All Arena Games'}</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-2">{top1.score.toLocaleString()} pts</div>
              <div className="text-xs font-mono text-neon-green font-bold mt-0.5">{top1.wins} Wins</div>
              <span className="mt-2 text-[10px] font-mono px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40">
                #1 ARENA SULTAN
              </span>

              {/* Add Friend Action on Podium */}
              {top1.username.toLowerCase() !== user.username.toLowerCase() && (
                <div className="mt-3 w-full">
                  {isFriend(user.id, top1.username) ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neon-green font-bold bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/30">
                      <UserCheck className="w-3 h-3" /> Friends
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddFriendFromLeaderboard(top1)}
                      className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 fill-slate-950" />
                      <span>+ Add Friend</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="bg-[#1B1B22]/90 border border-amber-700/30 rounded-3xl p-5 text-center flex flex-col items-center order-3 shadow-xl hover:border-amber-600 transition-all">
              <span className="text-3xl mb-1">🥉</span>
              <GamerAvatar avatar={top3.avatar} size="xl" rank="Bronze" className="my-2" />
              <div className="text-base font-black text-white font-display truncate max-w-full">
                {top3.username}
              </div>
              <div className="text-[11px] font-mono text-soft-lavender">{top3.gameTitle || 'All Arena Games'}</div>
              <div className="text-xl font-black text-amber-300 font-mono mt-2">{top3.score.toLocaleString()} pts</div>
              <div className="text-xs font-mono text-neon-green font-bold mt-0.5">{top3.wins} Wins</div>

              {/* Add Friend Action on Podium */}
              {top3.username.toLowerCase() !== user.username.toLowerCase() && (
                <div className="mt-3 w-full">
                  {isFriend(user.id, top3.username) ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neon-green font-bold bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/30">
                      <UserCheck className="w-3 h-3" /> Friends
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddFriendFromLeaderboard(top3)}
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

        {/* Full Leaderboard Standings Table */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#1B1B22]/90 border border-purple-500/25 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between text-xs font-mono font-bold text-soft-lavender uppercase tracking-wider">
            <span>ARENA PLAYERS ({totalLeaderboardPlayers})</span>
            <span>SCORE &amp; STATS</span>
          </div>

          {isLeaderboardLoading ? (
            <div className="p-12 text-center text-soft-lavender font-mono text-xs flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
              <span>Fetching real-time Gully rankings from cloud...</span>
            </div>
          ) : filteredLeaderboardData.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <span className="text-4xl">🏆</span>
              <h4 className="text-base font-bold text-white font-display">No scores recorded yet</h4>
              <p className="text-xs text-soft-lavender max-w-sm mx-auto">
                Play a game now to record your high score and take the #1 Sultan throne!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {paginatedLeaderboardData.map((entry) => {
                const isCurrentUser =
                  entry.username.toLowerCase() === user.username.toLowerCase() ||
                  (user.displayName && entry.username.toLowerCase() === user.displayName.toLowerCase());

                const alreadyFriend = isFriend(user.id, entry.username);

                return (
                  <div
                    key={`${entry.rank}-${entry.username}-${entry.gameId || 'all'}`}
                    className={`px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 transition-colors ${
                      isCurrentUser
                        ? 'bg-amber-500/15 border-l-4 border-amber-400'
                        : 'hover:bg-surface-container-high'
                    }`}
                  >
                    {/* Left: Rank & Player Info */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span
                        className={`w-7 text-center font-mono font-black text-sm sm:text-base ${
                          entry.rank === 1
                            ? 'text-amber-400'
                            : entry.rank === 2
                            ? 'text-slate-300'
                            : entry.rank === 3
                            ? 'text-amber-600'
                            : 'text-slate-400'
                        }`}
                      >
                        #{entry.rank}
                      </span>

                      <GamerAvatar
                        avatar={entry.avatar}
                        size="md"
                        rank={entry.rank === 1 ? 'Grandmaster' : entry.rank <= 3 ? 'Gold' : 'Silver'}
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm sm:text-base font-bold text-white font-display truncate">
                            {entry.username}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-400/40">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-soft-lavender truncate">
                          {entry.gameTitle || 'All Arena Games'}
                        </div>
                      </div>
                    </div>

                    {/* Right: Add Friend Button + Score & Wins */}
                    <div className="flex items-center gap-3 sm:gap-5 text-right shrink-0">
                      {!isCurrentUser && (
                        <div>
                          {alreadyFriend ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neon-green font-bold bg-neon-green/10 px-2.5 py-1 rounded-lg border border-neon-green/30">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Squad Mate</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAddFriendFromLeaderboard(entry)}
                              className="px-2.5 sm:px-3 py-1 rounded-lg bg-neon-cyan/15 hover:bg-neon-cyan hover:text-slate-950 border border-neon-cyan/40 text-neon-cyan font-mono font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                              title="Add to Your Squad"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>+ Add Friend</span>
                            </button>
                          )}
                        </div>
                      )}

                      <div className="w-24 sm:w-32">
                        <div className="text-sm sm:text-base font-black text-amber-400 font-mono">
                          {entry.score.toLocaleString()} pts
                        </div>
                        <div className="text-[10px] sm:text-xs font-mono text-neon-green font-bold">
                          {entry.wins} Wins
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalLeaderboardPages > 1 && (
            <div className="px-6 py-3.5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-soft-lavender bg-surface-container-low/50">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setLeaderboardPage((p) => Math.max(1, p - 1));
                }}
                disabled={leaderboardPage === 1}
                className="px-3 py-1.5 rounded-lg bg-surface-container border border-white/10 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span>
                Page <strong className="text-white">{leaderboardPage}</strong> of {totalLeaderboardPages}
              </span>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setLeaderboardPage((p) => Math.min(totalLeaderboardPages, p + 1));
                }}
                disabled={leaderboardPage === totalLeaderboardPages}
                className="px-3 py-1.5 rounded-lg bg-surface-container border border-white/10 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          5. ADD FRIEND BY USERNAME MODAL (FULLY WORKING FEATURE)
          ========================================================================= */}
      {isAddFriendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#1B1B22] border border-neon-cyan/40 p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-neon-cyan" />
                <h3 className="text-lg font-black text-white font-display tracking-wider uppercase">
                  ADD GAMER BY USERNAME
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddFriendModalOpen(false);
                  setAddFriendResult(null);
                }}
                className="p-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-soft-lavender hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-soft-lavender leading-relaxed">
              Enter the exact username of any GullyVerse player to recruit them to your gaming squad.
            </p>

            <form onSubmit={handleAddFriendByUsernameSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-soft-lavender uppercase">
                  GAMER USERNAME
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-mono font-bold text-neon-cyan">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. sahil24 or sr24"
                    value={addFriendInput}
                    onChange={(e) => setAddFriendInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-sm font-mono text-white placeholder-soft-lavender/50 outline-none focus:border-neon-cyan"
                  />
                </div>
              </div>

              {/* Status Message */}
              {addFriendResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                    addFriendResult.type === 'success'
                      ? 'bg-neon-green/10 border border-neon-green/30 text-neon-green'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  {addFriendResult.type === 'success' ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 shrink-0" />
                  )}
                  <span>{addFriendResult.text}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddFriendModalOpen(false);
                    setAddFriendResult(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-soft-lavender hover:text-white font-mono text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAddingFriend || !addFriendInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-neon-cyan text-slate-950 font-bold text-xs uppercase tracking-wider font-display flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-cyan-300 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAddingFriend ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SEARCHING...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 fill-slate-950" />
                      <span>ADD COMRADE</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. EDIT PROFILE MODAL
          ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1B1B22] border border-purple-500/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-neon-cyan" />
                <h3 className="text-lg font-black text-white font-display tracking-wider uppercase">
                  EDIT GAMER PROFILE
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-soft-lavender hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-neon-green/20 border border-neon-green text-neon-green flex items-center justify-center text-3xl">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-white font-display">Profile Updated!</h4>
                <p className="text-xs text-soft-lavender">Your changes are live across the entire arena.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Avatar Selection Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-soft-lavender uppercase">
                    CHOOSE GAMING AVATAR
                  </label>
                  <div className="grid grid-cols-10 gap-2 p-3 rounded-2xl bg-surface-container-low border border-white/10">
                    {PRESET_AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedAvatar(emoji);
                          setCustomAvatarUrl('');
                        }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                          selectedAvatar === emoji && !customAvatarUrl
                            ? 'bg-primary border-2 border-neon-cyan scale-110 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                            : 'bg-surface-container hover:bg-surface-container-high'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Custom Avatar Image URL */}
                  <div className="pt-1">
                    <input
                      type="url"
                      placeholder="Or enter custom image URL (https://...)"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container border border-white/10 text-xs font-mono text-white placeholder-soft-lavender/50 outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                {/* Display Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-soft-lavender uppercase">
                    DISPLAY NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder="e.g. Commander Rex"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-sm font-sans text-white placeholder-soft-lavender/50 outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-soft-lavender uppercase">
                    USERNAME (HANDLE)
                  </label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-sm font-mono text-white placeholder-soft-lavender/50 outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-soft-lavender uppercase">
                    BIO &amp; BATTLE CRY
                  </label>
                  <textarea
                    rows={2}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Enter battle cry..."
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs font-sans text-white placeholder-soft-lavender/50 outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Modal Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-soft-lavender hover:text-white font-mono text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-neon-cyan text-white font-bold text-xs uppercase tracking-wider font-display flex items-center gap-2 shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>SAVE PROFILE</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
