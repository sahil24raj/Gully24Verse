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
  Home,
  Gamepad2,
  Users,
  Trophy,
  BarChart3,
  MessageSquare,
  Search,
  Bell,
  X,
  Menu,
  ShoppingBag,
  Sparkles,
  LogOut,
  LayoutDashboard,
  User
} from 'lucide-react';

export const TopHeaderBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, openMultiplayerModal, logout, openAuthModal } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
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
        setSearchModalOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
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
      setSearchModalOpen(false);
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
    setSearchModalOpen(false);
  };

  const currentLevel = user.level || 12;
  const currentXP = user.xp || 7484;
  const currentCoins = user.coins || 4890;

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/games', label: 'Games', icon: Gamepad2 },
    { href: '/multiplayer', label: 'Multiplayer', icon: Users },
    {
      href: '/tournaments',
      label: 'Tournaments',
      icon: Trophy,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        soundFx.playPowerUp();
        openMultiplayerModal();
      }
    },
    { href: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
    {
      href: 'https://discord.gg',
      label: 'Community',
      icon: MessageSquare,
      isExternal: true
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#101014]/90 backdrop-blur-xl border-b border-white/10 select-none shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-14 h-16 flex items-center justify-between gap-4">
          
          {/* Left: GullyVerse 3D Brand Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <GullyVerseLogo size="md" />
          </div>

          {/* Center: Desktop Navigation Bar with exact Reference Mockup tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-[#1B1B22]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              if (item.isExternal) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    <Icon className="w-4 h-4 text-teal-400" />
                    <span>{item.label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={item.onClick ? item.onClick : () => soundFx.playClick()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#FFB703] text-slate-950 font-black shadow-[0_0_18px_rgba(255,183,3,0.45)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 font-bold'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'fill-slate-950 text-slate-950' : 'text-slate-300'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Search, Notification Bell, User Profile Pill */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            
            {/* Quick Search Trigger Icon */}
            <button
              onClick={() => {
                soundFx.playClick();
                setSearchModalOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 50);
              }}
              className="p-2 rounded-xl bg-[#1B1B22] text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10 flex items-center gap-1.5"
              title="Search games (⌘K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline text-xs font-semibold text-slate-400">⌘K</span>
            </button>

            {/* Notification Bell with Red Indicator Dot matching Reference Mockup */}
            <button
              onClick={() => {
                soundFx.playClick();
                useAppStore.getState().openDailySpinModal();
              }}
              className="relative p-2 rounded-xl bg-[#1B1B22] text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              title="Notifications & Daily Rewards"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-200" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]" />
            </button>

            {/* User Profile Pill matching Reference Mockup */}
            <div className="relative" ref={userMenuRef}>
              <div
                onClick={() => {
                  soundFx.playClick();
                  setUserMenuOpen(!userMenuOpen);
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#1B1B22]/90 border border-white/10 hover:border-amber-500/50 cursor-pointer transition-all shadow-md group select-none"
                title="User Profile"
              >
                {/* Circular Avatar with Orange Ring */}
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-orange-500 group-hover:ring-amber-400 transition-all flex items-center justify-center bg-[#252530] shrink-0">
                  {isImageSource(user.avatar) || isImageSource(user.photoURL) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar || user.photoURL}
                      alt={user.displayName || user.username || 'Sahil Raj'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm select-none">{user.avatar || '👦'}</span>
                  )}
                </div>

                {/* Name & Level Subtitle */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">
                    {user.displayName || user.username || 'Sahil Raj'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 leading-tight">
                    Lv. {currentLevel}
                  </span>
                </div>
              </div>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#1B1B22]/95 backdrop-blur-2xl border border-white/15 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.85)] z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <div className="font-label-lg text-white font-bold truncate">
                      {user.displayName || user.username || 'Sahil Raj'}
                    </div>
                    <div className="font-label-sm text-teal-400 font-bold">
                      {user.authType === 'guest' ? 'Desi Player' : 'Verified Gully Gamer'}
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
                    <span>My Profile</span>
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
                    <span>Gully Bazaar</span>
                  </Link>

                  <div className="h-px bg-white/10 my-1" />

                  {user.authType !== 'guest' ? (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        openAuthModal('login');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer text-left"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Sign In / Register</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#1B1B22] text-slate-300 hover:text-white border border-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#101014]/95 backdrop-blur-2xl px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              if (item.isExternal) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 font-bold text-sm"
                  >
                    <Icon className="w-4 h-4 text-teal-400" />
                    <span>{item.label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) item.onClick(e);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm ${
                    isActive ? 'bg-[#FFB703] text-slate-950 font-black' : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Quick Search Modal when ⌘K or search icon clicked */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#1B1B22] rounded-3xl border border-amber-500/30 p-4 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs uppercase font-black text-amber-400 tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                <span>Search Gully Games &amp; Rooms</span>
              </span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-black/50 px-4 py-3 rounded-2xl border border-white/10">
              <Search className="w-5 h-5 text-amber-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type game name or 6-digit room code..."
                className="bg-transparent border-none outline-none text-white placeholder:text-slate-400 w-full text-base font-medium"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase"
              >
                Go
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Press ESC to close</span>
              <span>Enter 6-char code to join room instantly</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopHeaderBar;
