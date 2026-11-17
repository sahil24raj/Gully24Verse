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
  Users
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
  };

  const currentLevel = user.level || 1;
  const currentXP = user.xp || 0;
  const currentCoins = user.coins || 0;
  const nextLevelXP = currentLevel * 1000;
  const xpPercent = Math.min(100, Math.floor((currentXP / nextLevelXP) * 100));

  return (
    <header className="sticky top-0 z-50 w-full bg-[#101014]/90 backdrop-blur-xl border-b border-amber-500/20 select-none shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-14 h-16 flex items-center justify-between gap-4">
        {/* Left Section: GullyVerse 3D Brand Logo + Left-Aligned Navigation Links */}
        <div className="flex items-center gap-5 lg:gap-7">
          <GullyVerseLogo size="md" />

          {/* Desktop Navigation Links aligned to logo side */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#1B1B22]/90 backdrop-blur-md rounded-xl border border-white/10 shadow-sm">
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className={`px-4 py-1.5 transition-all rounded-lg font-bold text-xs uppercase tracking-wider ${
                pathname === '/'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_16px_rgba(255,159,28,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              href="/games"
              onClick={() => soundFx.playClick()}
              className={`px-4 py-1.5 transition-all rounded-lg font-bold text-xs uppercase tracking-wider ${
                pathname.startsWith('/games')
                  ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_16px_rgba(255,159,28,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              All Games
            </Link>
            <Link
              href="/dashboard"
              onClick={() => soundFx.playClick()}
              className={`px-4 py-1.5 transition-all rounded-lg font-bold text-xs uppercase tracking-wider ${
                pathname.startsWith('/dashboard')
                  ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_16px_rgba(255,159,28,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Right Section: Tools (Search, LVL XP, Coins, Bell, Avatar) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search with ⌘K badge - Expanded Searchbar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center bg-[#1B1B22] px-4 py-2 rounded-2xl border border-white/10 focus-within:border-amber-400 focus-within:shadow-[0_0_20px_rgba(255,159,28,0.25)] transition-all"
          >
            <span className="material-symbols-outlined text-amber-400 text-xl mr-2">search</span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search gully games, room code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder:text-slate-400/70 w-52 lg:w-72 xl:w-96 text-sm font-medium"
            />
            <kbd className="font-label-sm text-slate-300 bg-black/60 px-2 py-0.5 rounded-lg ml-2 border border-white/15 text-[11px] font-semibold">
              ⌘K
            </kbd>
          </form>

          {/* Level & XP Progress Chip */}
          <Link
            href="/profile"
            onClick={() => soundFx.playClick()}
            className="hidden sm:flex flex-col gap-1 bg-[#1B1B22] px-3 py-1.5 rounded-xl border border-white/10 hover:border-amber-500/40 transition-colors"
            title="Gully Level & Progress"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-label-sm text-amber-400 font-bold">LVL {currentLevel}</span>
              <span className="font-label-sm text-slate-400">{currentXP.toLocaleString()} XP</span>
            </div>
            <div className="w-24 h-1.5 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </Link>

          {/* Coin Badge Chip */}
          <Link
            href="/shop"
            onClick={() => soundFx.playCoin()}
            className="flex items-center gap-1.5 bg-[#1B1B22] px-3 py-1.5 rounded-xl border border-amber-500/30 hover:border-amber-400 transition-colors"
            title="Gully Coins"
          >
            <span className="text-base leading-none">🪙</span>
            <span className="font-label-md text-amber-400 font-black">{currentCoins.toLocaleString()}</span>
          </Link>

          {/* Daily Spin / Notifications Trigger with Pulsing Neon Dot */}
          <button
            onClick={() => {
              soundFx.playClick();
              useAppStore.getState().openSpinModal();
            }}
            className="relative p-2 rounded-xl bg-[#1B1B22] text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            title="Daily Free Spin"
            aria-label="Daily Spin"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#00BFA6]" />
          </button>

          {/* User Profile Avatar with safe image check & ring */}
          <div className="relative" ref={userMenuRef}>
            <div
              onClick={() => {
                soundFx.playClick();
                setUserMenuOpen(!userMenuOpen);
              }}
              className="flex items-center gap-1 pl-1 cursor-pointer group"
              title="User Menu"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-500/80 group-hover:ring-teal-400 transition-all flex items-center justify-center bg-[#1B1B22]">
                {isImageSource(user.avatar) || isImageSource(user.photoURL) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar || user.photoURL}
                    alt={user.displayName || user.username || 'User Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm select-none">{user.avatar || '🕹️'}</span>
                )}
              </div>
              <span className="material-symbols-outlined text-slate-400 text-sm group-hover:text-white transition-transform duration-200">
                {userMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </div>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#1B1B22]/95 backdrop-blur-2xl border border-white/15 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.85)] z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <div className="font-label-lg text-white font-bold truncate">
                    {user.displayName || user.username}
                  </div>
                  <div className="font-label-sm text-teal-400 font-bold">
                    {user.authType === 'guest' ? 'Desi Guest Player' : 'Verified Gully Gamer'}
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => {
                    soundFx.playClick();
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-white hover:bg-white/10 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>Gamer Dashboard</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => {
                    soundFx.playClick();
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-white hover:bg-white/10 transition-colors"
                >
                  <User className="w-4 h-4 text-teal-400" />
                  <span>My Profile &amp; Stats</span>
                </Link>

                <Link
                  href="/shop"
                  onClick={() => {
                    soundFx.playClick();
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-white hover:bg-white/10 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Rewards Shop</span>
                </Link>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setUserMenuOpen(false);
                    openMultiplayerModal(GAMES_CATALOG[0]);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <Users className="w-4 h-4 text-teal-400" />
                  <span>Host Squad Lobby</span>
                </button>

                <div className="pt-1 mt-1 border-t border-white/10">
                  {user.authType === 'guest' ? (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setUserMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-slate-950 bg-amber-500 hover:bg-amber-400 font-bold transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Sign In / Save Progress</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-red-400 hover:bg-red-500/20 transition-colors text-left cursor-pointer"
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
            className="xl:hidden p-2 rounded-xl bg-[#1B1B22] text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#101014]/98 backdrop-blur-2xl border-b border-amber-500/20 px-4 py-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#1B1B22] px-3 py-2 rounded-xl border border-white/10">
            <span className="material-symbols-outlined text-slate-400 text-lg mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gully games, rooms..."
              className="bg-transparent border-none outline-none font-body-sm text-white w-full placeholder:text-slate-400"
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
