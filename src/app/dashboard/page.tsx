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
  Volume2
} from 'lucide-react';
import { useAppStore, GAMES_CATALOG, GameItem } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import { GamerAvatar, isImageSource } from '@/components/profile/GamerAvatar';
import { subscribeToCloudLeaderboard } from '@/lib/firebaseService';
import { LeaderboardEntry } from '@/types';
import { MultiplayerLobbyModal } from '@/components/MultiplayerLobbyModal';
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
  '🤖', '🕹️', '👾', '🛺', '🚛', '🐯', '🦅', '☕', '📱', '🎯'
];

interface FrequentFriend {
  id: string;
  username: string;
  avatar: string;
  level: number;
  status: 'online' | 'away' | 'offline';
  currentlyPlaying?: string;
  lastSeen: string;
  gamesTogether: number;
  gameId?: string;
}

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

  // Cloud Leaderboard Top Champions
  const [cloudChamps, setCloudChamps] = useState<LeaderboardEntry[]>([]);
  const usernameDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync Form State when user updates or modal opens
  useEffect(() => {
    setDisplayNameInput(user.displayName || user.username);
    setUsernameInput(user.username);
    setBioInput(user.bio || '');
    setSelectedAvatar(user.avatar || '🚀');
    setSelectedInterests(user.interests || ['racing', 'truck', 'meme']);
  }, [user, isEditModalOpen]);

  // Subscribe to real-time Leaderboard champions
  useEffect(() => {
    const unsub = subscribeToCloudLeaderboard((entries) => {
      if (entries && entries.length > 0) {
        const sorted = [...entries].sort((a, b) => b.score - a.score);
        setCloudChamps(sorted.slice(0, 3).map((e, idx) => ({ ...e, rank: idx + 1 })));
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

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

  // Member Since Date
  const memberSince = useMemo(() => {
    try {
      if (user.createdAt) {
        const d = new Date(user.createdAt);
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
    } catch {
      // fallback
    }
    return 'Nov 2026';
  }, [user.createdAt]);

  // Copy Player ID
  const handleCopyId = useCallback(() => {
    soundFx.playClick();
    navigator.clipboard.writeText(displayPlayerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }, [displayPlayerId]);

  // Handle Username change with debounced uniqueness validation
  const handleUsernameChange = (val: string) => {
    const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20);
    setUsernameInput(cleaned);
    setUsernameError(null);

    if (cleaned === user.username.toLowerCase()) {
      setUsernameStatus('idle');
      return;
    }

    if (cleaned.length < 3) {
      setUsernameStatus('taken');
      setUsernameError('Username must be at least 3 characters');
      return;
    }

    setUsernameStatus('checking');
    if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);

    usernameDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(cleaned)}&uid=${user.uid || user.id}`);
        const data = await res.json();
        if (data.available) {
          setUsernameStatus('available');
          setUsernameError(null);
        } else {
          setUsernameStatus('taken');
          setUsernameError(data.error || 'Username already taken');
        }
      } catch {
        setUsernameStatus('available');
      }
    }, 450);
  };

  // Toggle interest tag
  const toggleInterest = (id: string) => {
    soundFx.playClick();
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus === 'taken') return;

    setIsSaving(true);
    soundFx.playClick();

    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;

    try {
      const res = await updateProfileData({
        displayName: displayNameInput.trim() || usernameInput.trim(),
        username: usernameInput.trim(),
        bio: bioInput.trim(),
        avatar: finalAvatar,
        interests: selectedInterests
      });

      if (res.success) {
        setSaveSuccess(true);
        soundFx.playLevelUp();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          setSaveSuccess(false);
          setIsEditModalOpen(false);
        }, 1200);
      } else {
        alert(res.error || 'Failed to update profile. Please try again.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 3. RECENTLY PLAYED GAMES COMPUTATION
  // ---------------------------------------------------------------------------
  const recentlyPlayedList = useMemo(() => {
    const list: Array<{
      game: GameItem;
      lastPlayedText: string;
      sessions: number;
      bestScore: number;
      lastScore: number;
    }> = [];

    // Prioritize recently played IDs
    const seenIds = new Set<string>();

    (recentlyPlayedIds || []).forEach((id, idx) => {
      const g = GAMES_CATALOG.find((game) => game.id === id);
      if (g && !seenIds.has(g.id)) {
        seenIds.add(g.id);
        const score = highScores[g.id] || 0;
        list.push({
          game: g,
          lastPlayedText: idx === 0 ? '15 minutes ago' : idx === 1 ? 'Today' : `${idx + 1} days ago`,
          sessions: Math.max(1, Math.round((gamesPlayed || 12) / (idx + 2))),
          bestScore: score > 0 ? score : 4500 - idx * 600,
          lastScore: score > 0 ? Math.round(score * 0.85) : 3800 - idx * 500
        });
      }
    });

    // Also include any game with a recorded high score
    Object.keys(highScores).forEach((id) => {
      if (!seenIds.has(id)) {
        const g = GAMES_CATALOG.find((game) => game.id === id);
        if (g) {
          seenIds.add(g.id);
          const score = highScores[id] || 0;
          list.push({
            game: g,
            lastPlayedText: 'This week',
            sessions: Math.max(3, Math.round(score / 500)),
            bestScore: score,
            lastScore: Math.round(score * 0.9)
          });
        }
      }
    });

    // If fewer than 4 games, pad with featured favorites
    const fallbackFavorites = ['auto-rush', 'auto-rush', 'genz-protest-run', 'indian-politics-arena', 'chor-sipahi'];
    for (const favId of fallbackFavorites) {
      if (list.length >= 6) break;
      if (!seenIds.has(favId)) {
        const g = GAMES_CATALOG.find((game) => game.id === favId);
        if (g) {
          seenIds.add(g.id);
          list.push({
            game: g,
            lastPlayedText: list.length === 0 ? 'Featured arena' : 'Recommended',
            sessions: list.length === 0 ? 0 : 5 + list.length,
            bestScore: highScores[g.id] || (list.length === 0 ? 0 : 3200 + list.length * 350),
            lastScore: highScores[g.id] || (list.length === 0 ? 0 : 2800)
          });
        }
      }
    }

    return list.slice(0, 6);
  }, [recentlyPlayedIds, highScores, gamesPlayed]);

  // ---------------------------------------------------------------------------
  // 4. YOUR SQUAD – SOCIAL GAMING SYSTEM
  // ---------------------------------------------------------------------------
  const squadFriends: FrequentFriend[] = useMemo(() => {
    const list: FrequentFriend[] = [];
    const seenNames = new Set<string>();

    // Extract players from actual multiplayer match history
    (recentMatches || []).forEach((match) => {
      [match.player1, match.player2].forEach((p) => {
        if (p && p.name && p.name !== user.username && !seenNames.has(p.name)) {
          seenNames.add(p.name);
          list.push({
            id: `f_${p.name.toLowerCase()}`,
            username: p.name,
            avatar: p.avatar || '🎮',
            level: 15 + (p.name.length % 20),
            status: 'online',
            currentlyPlaying: match.gameTitle || 'Auto Rush 🚛',
            lastSeen: 'Active now',
            gamesTogether: 12 + (p.score % 25),
            gameId: match.gameId
          });
        }
      });
    });

    // Default frequent squad mates if history is fresh
    const defaultSquad: FrequentFriend[] = [
      {
        id: 'f_shadowx',
        username: 'ShadowX',
        avatar: '🥷',
        level: 18,
        status: 'online',
        currentlyPlaying: 'Auto Rush 🚛',
        lastSeen: 'Playing now',
        gamesTogether: 42,
        gameId: 'auto-rush'
      },
      {
        id: 'f_delhiracer',
        username: 'DelhiRacer_99',
        avatar: '🛺',
        level: 24,
        status: 'online',
        currentlyPlaying: 'Tirri Run 🛺💨',
        lastSeen: 'Playing now',
        gamesTogether: 31,
        gameId: 'auto-rush'
      },
      {
        id: 'f_chaimaster',
        username: 'ChaiMaster_99',
        avatar: '☕',
        level: 21,
        status: 'away',
        currentlyPlaying: 'GenZ Protest Run 🏃',
        lastSeen: '14m ago',
        gamesTogether: 19,
        gameId: 'genz-protest-run'
      },
      {
        id: 'f_netaslayer',
        username: 'KursiKing_RJ',
        avatar: '⚔️',
        level: 32,
        status: 'online',
        currentlyPlaying: 'Indian Politics Arena ⚔️',
        lastSeen: 'In Lobby',
        gamesTogether: 27,
        gameId: 'indian-politics-arena'
      },
      {
        id: 'f_veer',
        username: 'VeerHostel',
        avatar: '👑',
        level: 29,
        status: 'offline',
        currentlyPlaying: undefined,
        lastSeen: '2h ago',
        gamesTogether: 15,
        gameId: 'chor-sipahi'
      }
    ];

    defaultSquad.forEach((df) => {
      if (!seenNames.has(df.username) && list.length < 5) {
        seenNames.add(df.username);
        list.push(df);
      }
    });

    return list;
  }, [recentMatches, user.username]);

  // Invite Friend to Play
  const handleInviteToPlay = (friend: FrequentFriend) => {
    soundFx.playClick();
    const game = GAMES_CATALOG.find((g) => g.id === friend.gameId) || GAMES_CATALOG[0];
    openMultiplayerModal(game);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Real-time Multiplayer Modal */}
      <MultiplayerLobbyModal />

      {/* Top Banner Navigation & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-[#1B1B22]/60 border border-white/10 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-soft-lavender uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 text-neon-green animate-pulse" />
            <span>GULLYVERSE // GAMER DASHBOARD</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-display tracking-wide uppercase mt-1">
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
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider font-display flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 fill-slate-950" />
            <span>CREATE SQUAD ROOM</span>
          </button>

          <Link
            href="/leaderboard"
            onClick={() => soundFx.playClick()}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright border border-amber-500/30 text-white font-bold text-xs uppercase tracking-wider font-display flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
          >
            <Crown className="w-4 h-4 text-tertiary" />
            <span>GLOBAL LEADERBOARD</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          2. GAMER PROFILE CARD (A)
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-purple/95 via-[#13112a]/90 to-surface-purple/95 border border-amber-500/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
        {/* Cyber Neon Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-neon-cyan/15 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          {/* Avatar & User Details */}
          <div className="flex items-start sm:items-center gap-5 sm:gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-primary-container/40 to-neon-cyan/30 border-2 border-neon-cyan p-1 shadow-[0_0_30px_rgba(0,240,255,0.4)] overflow-hidden flex items-center justify-center">
                {isImageSource(user.avatar) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.avatar}
                    alt={user.displayName || user.username}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl select-none">{user.avatar || '🚀'}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-primary-container text-white font-black text-[10px] tracking-wider uppercase border border-purple-500/50 shadow-lg font-mono">
                LVL {currentLevel}
              </div>
              <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-neon-green border-2 border-slate-950 shadow-[0_0_10px_#48F078]" title="Online" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase drop-shadow-md">
                  {user.displayName || user.username}
                </h2>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-[11px] font-mono text-neon-green font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#48F078] animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Username & Player ID */}
              <div className="flex items-center gap-3 text-xs font-mono text-soft-lavender flex-wrap">
                <span className="text-primary font-bold">@{user.username}</span>
                <span>•</span>
                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/10 text-soft-lavender hover:text-white transition-colors cursor-pointer"
                  title="Click to copy unique Player ID"
                >
                  <span>ID: {displayPlayerId}</span>
                  {copiedId ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
                </button>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3 h-3 text-tertiary" />
                  <span>Joined {memberSince}</span>
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-xl pt-1">
                {user.bio || 'Dominating the Grand Trunk Highway in Auto Rush & claiming the Supreme Kursi in GullyVerse.'}
              </p>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsEditModalOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-surface-container-high hover:bg-surface-bright border border-purple-500/40 text-white font-bold text-xs uppercase tracking-wider font-display flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(139,44,255,0.4)] active:scale-95 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-neon-cyan" />
              <span>EDIT PROFILE</span>
            </button>
          </div>
        </div>

        {/* Gaming Interests Chips */}
        <div className="pt-4 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-soft-lavender font-bold mr-1">GAMING VIBES:</span>
          {(user.interests && user.interests.length > 0 ? user.interests : ['racing', 'truck', 'meme', 'squad']).map((intId) => {
            const found = AVAILABLE_INTERESTS.find((i) => i.id === intId);
            return (
              <span
                key={intId}
                className="px-3 py-1 rounded-full bg-surface-container border border-purple-500/25 text-[11px] font-mono text-white flex items-center gap-1.5 shadow-sm"
              >
                <span>{found?.icon || '🎮'}</span>
                <span>{found?.label || intId}</span>
              </span>
            );
          })}
        </div>

        {/* 6-Metric Gaming Progression Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-6 mt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-surface-container-low/80 border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold">LEVEL &amp; XP</span>
            <div className="mt-1">
              <span className="text-xl font-black text-white font-display">LVL {currentLevel}</span>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-gradient-to-r from-primary to-neon-cyan transition-all"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-soft-lavender mt-1 block">
                {currentXP.toLocaleString()} XP
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low/80 border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold">COINS BALANCE</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl">🪙</span>
              <span className="text-xl font-black text-tertiary font-display">
                {(user.coins || 0).toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-mono text-soft-lavender mt-1">Ready for Shop</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low/80 border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold">GAMES PLAYED</span>
            <div className="mt-1">
              <span className="text-xl font-black text-white font-display">{gamesPlayed}</span>
            </div>
            <span className="text-[10px] font-mono text-soft-lavender mt-1">Total Sessions</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low/80 border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold">TOTAL WINS</span>
            <div className="mt-1">
              <span className="text-xl font-black text-neon-green font-display">{totalWins}</span>
            </div>
            <span className="text-[10px] font-mono text-soft-lavender mt-1">Match Victories</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low/80 border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold">WIN RATE</span>
            <div className="mt-1">
              <span className="text-xl font-black text-neon-cyan font-display">{winRate}%</span>
            </div>
            <span className="text-[10px] font-mono text-soft-lavender mt-1">Combat Precision</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low/80 border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-soft-lavender uppercase font-bold">BEST SCORE</span>
            <div className="mt-1">
              <span className="text-xl font-black text-amber-400 font-display">
                {bestScore.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-mono text-soft-lavender mt-1">High Record</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. RECENTLY PLAYED GAMES SECTION (B)
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
            href="/categories"
            onClick={() => soundFx.playClick()}
            className="text-xs font-mono font-bold text-soft-lavender hover:text-white transition-colors flex items-center gap-1"
          >
            <span>VIEW ALL 11 GAMES</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentlyPlayedList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentlyPlayedList.map(({ game, lastPlayedText, sessions, bestScore: gScore, lastScore }) => (
              <div
                key={game.id}
                className="group rounded-3xl bg-[#1B1B22]/70 border border-white/10 hover:border-neon-cyan/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,240,255,0.2)]"
              >
                {/* Banner Thumbnail */}
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

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white font-display group-hover:text-neon-cyan transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-soft-lavender line-clamp-2 mt-1">
                      {game.tagline}
                    </p>
                  </div>

                  {/* Sessions and Best Score Stats */}
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

                  {/* Play Again Button */}
                  <Link
                    href={`/game/${game.id}`}
                    onClick={() => soundFx.playClick()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container hover:from-primary hover:to-neon-cyan text-white font-bold text-xs font-display uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-[0_0_15px_rgba(139,44,255,0.4)] transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
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
              Jump into Auto Rush or race Tirri auto-rickshaws to start recording high scores!
            </p>
            <Link
              href="/categories"
              className="inline-flex px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider font-display"
            >
              BROWSE GAMES
            </Link>
          </div>
        )}
      </div>

      {/* =========================================================================
          4. YOUR SQUAD – SOCIAL GAMING SYSTEM (C)
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-neon-green" />
            <h2 className="text-lg sm:text-xl font-black text-white font-display tracking-wider uppercase">
              YOUR SQUAD
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-[10px] font-mono text-neon-green font-bold">
              FREQUENT GAMING FRIENDS
            </span>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              openMultiplayerModal(GAMES_CATALOG[0]);
            }}
            className="text-xs font-mono font-bold text-neon-cyan hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>INVITE NEW COMRADE</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {squadFriends.map((friend) => (
            <div
              key={friend.id}
              className="p-5 rounded-3xl bg-[#1B1B22]/70 border border-white/10 hover:border-purple-500/50 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-3">
                {/* Friend Avatar & Status */}
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container border border-amber-500/30 flex items-center justify-center text-2xl shadow-md">
                      {friend.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                        friend.status === 'online'
                          ? 'bg-neon-green shadow-[0_0_8px_#48F078]'
                          : friend.status === 'away'
                          ? 'bg-yellow-400 shadow-[0_0_8px_#FACC15]'
                          : 'bg-gray-500'
                      }`}
                      title={friend.status.toUpperCase()}
                    />
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-[10px] font-mono text-soft-lavender font-bold">
                    LVL {friend.level}
                  </span>
                </div>

                {/* Friend Info */}
                <div>
                  <h4 className="text-sm font-bold text-white font-display truncate">
                    {friend.username}
                  </h4>
                  <div className="text-[11px] font-mono mt-1 space-y-0.5">
                    {friend.currentlyPlaying ? (
                      <p className="text-neon-cyan truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                        <span>{friend.currentlyPlaying}</span>
                      </p>
                    ) : (
                      <p className="text-slate-400">Last seen: {friend.lastSeen}</p>
                    )}
                    <p className="text-soft-lavender font-semibold">
                      {friend.gamesTogether} matches together
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
      </div>

      {/* =========================================================================
          5. SQUAD LOBBY & LEADERBOARD PORTALS (D & E)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Host Instant Squad Room Portal */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#1B1B22]/80 border border-purple-500/25 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold uppercase mb-2">
              <Users className="w-4 h-4" />
              <span>INSTANT SQUAD MULTIPLAYER</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              HOST A 6-CHARACTER SQUAD ROOM
            </h3>
            <p className="text-xs sm:text-sm text-soft-lavender mt-2 leading-relaxed">
              Create a custom private lobby for Chor Sipahi, Indian Politics Arena, or Tirri Run. Share your instant room code with friends—no downloads required.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                openMultiplayerModal(GAMES_CATALOG[0]);
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-neon-cyan text-white font-bold text-xs uppercase tracking-wider font-display flex items-center gap-2 shadow-[0_0_20px_rgba(139,44,255,0.4)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>CREATE INSTANT ROOM</span>
            </button>
          </div>
        </div>

        {/* Global Leaderboard Portal */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#1B1B22]/80 border border-purple-500/25 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/10 rounded-full blur-[80px] pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-tertiary font-bold uppercase">
                <Crown className="w-4 h-4" />
                <span>TOP VIBE ARENA CHAMPIONS</span>
              </div>
              <Link
                href="/leaderboard"
                onClick={() => soundFx.playClick()}
                className="text-xs font-mono text-neon-cyan hover:underline"
              >
                FULL LEADERBOARD →
              </Link>
            </div>

            <h3 className="text-xl font-bold text-white font-display">
              GLOBAL RANKINGS &amp; PODIUM
            </h3>

            {/* Top 3 Champions Ticker */}
            <div className="grid grid-cols-3 gap-2.5 mt-3">
              {(cloudChamps.length > 0
                ? cloudChamps
                : [
                    { rank: 1, username: 'Aarav', score: 2450, avatar: '👑' },
                    { rank: 2, username: 'Priya', score: 1820, avatar: '⚡' },
                    { rank: 3, username: 'Kabir', score: 1350, avatar: '🔥' }
                  ]
              ).map((champ) => (
                <div
                  key={champ.rank}
                  className="p-3 rounded-2xl bg-surface-container-low border border-white/10 text-center"
                >
                  <span className="text-xs font-mono font-bold text-amber-400">#{champ.rank}</span>
                  <div className="text-lg my-0.5">{champ.avatar}</div>
                  <div className="text-xs font-bold text-white truncate">{champ.username}</div>
                  <div className="text-[10px] font-mono text-soft-lavender">{champ.score} pts</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/leaderboard"
              onClick={() => soundFx.playClick()}
              className="w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright border border-amber-500/30 text-white font-bold text-xs uppercase tracking-wider font-display flex items-center justify-center gap-2 transition-all block text-center"
            >
              <span>VIEW ALL STANDINGS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. EDIT PROFILE MODAL
          ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1B1B22] border border-purple-500/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-6">
            {/* Modal Header */}
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

                  {/* Or Custom Avatar Image URL */}
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

                {/* Username with real-time uniqueness validation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-soft-lavender uppercase">
                      USERNAME (HANDLE)
                    </label>
                    {usernameStatus === 'checking' && (
                      <span className="text-[10px] font-mono text-soft-lavender flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                      </span>
                    )}
                    {usernameStatus === 'available' && (
                      <span className="text-[10px] font-mono text-neon-green">Available ✓</span>
                    )}
                    {usernameStatus === 'taken' && (
                      <span className="text-[10px] font-mono text-red-400">
                        {usernameError || 'Taken ✕'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-soft-lavender font-mono text-sm">@</span>
                    <input
                      type="text"
                      required
                      value={usernameInput}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="username"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-sm font-mono text-white placeholder-soft-lavender/50 outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                {/* Bio Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-soft-lavender uppercase">
                    GAMER BIO
                  </label>
                  <textarea
                    rows={2}
                    maxLength={160}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Tell your squad what games you dominate..."
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs font-sans text-white placeholder-soft-lavender/50 outline-none focus:border-neon-cyan resize-none"
                  />
                  <div className="text-right text-[10px] font-mono text-soft-lavender">
                    {bioInput.length}/160
                  </div>
                </div>

                {/* Gaming Interests Tags Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-soft-lavender uppercase">
                    SELECT GAMING INTERESTS (FAVORITE MODES)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_INTERESTS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => toggleInterest(interest.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-neon-cyan/20 border border-neon-cyan text-white shadow-sm'
                              : 'bg-surface-container border border-white/10 text-soft-lavender hover:text-white'
                          }`}
                        >
                          <span>{interest.icon}</span>
                          <span>{interest.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-soft-lavender hover:text-white text-xs font-bold font-display uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || usernameStatus === 'taken'}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-teal-400 text-slate-950 font-black text-xs font-display uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SAVING...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 fill-slate-950" />
                        <span>SAVE CHANGES</span>
                      </>
                    )}
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
