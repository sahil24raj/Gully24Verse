'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore, GAMES_CATALOG } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import { isImageSource } from '@/components/profile/GamerAvatar';
import { normalizeRoomCode } from '@/lib/multiplayer/roomCodeGenerator';
import { GullyVerseLogo } from '@/components/GullyVerseLogo';
import {
  User,
  ShoppingBag,
  Sparkles,
  LogOut,
  LayoutDashboard,
  Users,
  Search,
  Bell
} from 'lucide-react';

export const TopHeaderBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, openMultiplayerModal, logout, openAuthModal } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut for search (/ or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close user dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    soundFx.playClick();
    const upper = q.toUpperCase();
    if (upper.length === 6 && /^[A-Z0-9]{6}$/.test(upper)) {
      router.push(`/play/room/${normalizeRoomCode(upper)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
      return;
    }

    const matched = GAMES_CATALOG.find(
      (g) =>
        g.title.toLowerCase().includes(q.toLowerCase()) ||
        g.slug.toLowerCase().includes(q.toLowerCase()) ||
        g.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
    );

    if (matched) {
      router.push(`/game/${matched.id}`);
    } else {
      router.push(`/games?q=${encodeURIComponent(q)}`);
    }
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  const currentLevel = user.level || 1;
  const currentXP = user.xp || 0;
  const currentCoins = user.coins || 0;
  const nextLevelXP = currentLevel * 1000;
  const xpPercent = Math.min(100, Math.floor((currentXP / nextLevelXP) * 100));

  // Determine Google account photo URL or custom uploaded avatar
  const effectiveAvatarSrc = isImageSource(user.photoURL)
    ? user.photoURL
    : isImageSource(user.avatar)
    ? user.avatar
    : null;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#101014]/90 backdrop-blur-xl border-b border-amber-500/20 select-none shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-14 h-16 flex items-center justify-between gap-4">
        
        {/* Left Section: GullyVerse 3D Brand Logo & Primary Navigation */}
        <div className="flex items-center gap-6 shrink-0">
          <GullyVerseLogo size="md" />

          {/* Desktop Navigation Bar (HOME | ALL GAMES | DASHBOARD) */}
          <nav className="hidden xl:flex items-center gap-2">
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className={`px-4 py-2 transition-all rounded-xl font-black text-xs uppercase tracking-wider ${
                pathname === '/'
                  ? 'bg-[#FFB703] text-slate-950 shadow-[0_0_18px_rgba(255,183,3,0.45)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 font-bold'
              }`}
            >
              HOME
            </Link>
            <Link
              href="/games"
              onClick={() => soundFx.playClick()}
              className={`px-4 py-2 transition-all rounded-xl text-xs uppercase tracking-wider ${
                pathname.startsWith('/games')
                  ? 'bg-[#FFB703] text-slate-950 font-black shadow-[0_0_18px_rgba(255,183,3,0.45)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 font-bold'
              }`}
            >
              ALL GAMES
            </Link>
            <Link
              href="/dashboard"
              onClick={() => soundFx.playClick()}
              className={`px-4 py-2 transition-all rounded-xl text-xs uppercase tracking-wider ${
                pathname.startsWith('/dashboard')
                  ? 'bg-[#FFB703] text-slate-950 font-black shadow-[0_0_18px_rgba(255,183,3,0.45)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 font-bold'
              }`}
            >
              DASHBOARD
            </Link>
          </nav>
        </div>

        {/* Center: Search Bar matching Reference Screenshot */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center bg-[#1B1B22]/90 hover:bg-[#1B1B22] px-4 py-2 rounded-2xl border border-white/10 focus-within:border-amber-500/60 transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search gully games, room code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none font-body text-xs text-white placeholder:text-slate-400 w-full"
            />
            <kbd className="font-mono text-[10px] text-slate-400 bg-black/60 px-2 py-0.5 rounded-lg border border-white/10 shrink-0 select-none">
              ⌘K
            </kbd>
          </form>
        </div>

        {/* Right Section: Level & XP, Coins, Notifications Bell, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Level & XP Progress Chip */}
          <Link
            href="/profile"
            onClick={() => soundFx.playClick()}
            className="hidden sm:flex flex-col gap-1 bg-[#1B1B22] px-3.5 py-1.5 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-colors"
            title="Gully Level & Progress"
          >
            <div className="flex items-center justify-between gap-3 leading-none">
              <span className="text-[11px] text-amber-400 font-black">LVL {currentLevel}</span>
              <span className="text-[10px] text-slate-400 font-bold">{currentXP.toLocaleString()} XP</span>
            </div>
            <div className="w-20 h-1.5 bg-black/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(10, xpPercent)}%` }}
              />
            </div>
          </Link>

          {/* Gully Coins Vault Counter */}
          <div
            className="flex items-center gap-1.5 bg-[#1B1B22] px-3.5 py-2 rounded-2xl border border-amber-500/30 text-amber-400 shadow-md select-none"
            title="Gully Coins"
          >
            <span className="text-sm leading-none">🪙</span>
            <span className="text-xs font-black">{currentCoins.toLocaleString()}</span>
          </div>

          {/* User Profile Avatar with Google Account Photo & direct My Profile menu */}
          <div className="relative" ref={userMenuRef}>
            <div
              onClick={() => {
                soundFx.playClick();
                setUserMenuOpen(!userMenuOpen);
              }}
              className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#1B1B22] border border-white/10 hover:border-amber-500/50 cursor-pointer transition-all shadow-md group"
              title="My Profile"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-500/80 group-hover:ring-teal-400 transition-all flex items-center justify-center bg-[#252530]">
                {effectiveAvatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={effectiveAvatarSrc}
                    alt={user.displayName || user.username || 'User Avatar'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-sm select-none">{user.avatar || '🚀'}</span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors pr-1">
                ▼
              </span>
            </div>

            {/* Dropdown Menu — STRICTLY My Profile & Sign Out (No Dashboard, No Shop) */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-[#1B1B22]/98 backdrop-blur-2xl border border-white/15 p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.85)] z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Profile Header Card */}
                <div className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 mb-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-amber-500/60 ring-2 ring-black/40">
                    {effectiveAvatarSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={effectiveAvatarSrc}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm bg-[#252530]">🚀</div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="font-black text-xs text-white truncate">
                      {user.displayName || user.username}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {user.email || `@${user.username}`}
                    </div>
                    <div className="text-[9px] text-teal-400 font-bold uppercase tracking-wider mt-0.5">
                      {user.authType === 'google' ? 'Google Gamer 🟢' : user.authType === 'guest' ? 'Desi Guest Player' : 'Verified Gamer'}
                    </div>
                  </div>
                </div>

                {/* Single Focused Action: My Profile */}
                <Link
                  href="/profile"
                  onClick={() => {
                    soundFx.playClick();
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black text-white hover:bg-amber-500/20 hover:text-amber-300 border border-transparent hover:border-amber-500/30 transition-all"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  <span>My Profile &amp; Stats</span>
                </Link>

                {/* Authentication Controls */}
                <div className="pt-1.5 mt-1.5 border-t border-white/10">
                  {user.authType === 'guest' ? (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setUserMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Sign In with Google</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/15 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="xl:hidden p-2.5 rounded-2xl bg-[#1B1B22] text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            aria-label="Toggle navigation"
          >
            <span className="text-lg">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#101014]/98 backdrop-blur-2xl border-b border-amber-500/20 px-4 py-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#1B1B22] px-3 py-2 rounded-xl border border-white/10">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gully games, room code..."
              className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-400"
            />
          </form>

          <Link
            href="/"
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(false);
            }}
            className="px-3 py-2 rounded-xl font-bold text-sm text-white hover:bg-white/10"
          >
            🏠 Home
          </Link>
          <Link
            href="/games"
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(false);
            }}
            className="px-3 py-2 rounded-xl font-bold text-sm text-white hover:bg-white/10"
          >
            🎮 All Games
          </Link>
          <Link
            href="/dashboard"
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(false);
            }}
            className="px-3 py-2 rounded-xl font-bold text-sm text-white hover:bg-white/10"
          >
            📊 Dashboard
          </Link>

          <button
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(false);
              openMultiplayerModal();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider mt-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            CREATE SQUAD ROOM
          </button>
        </div>
      )}
    </header>
  );
};
