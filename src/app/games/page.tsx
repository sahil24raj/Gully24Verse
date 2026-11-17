'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GAMES_CATALOG, useAppStore } from '@/store/useAppStore';
import { GameCard } from '@/components/GameCard';
import { MultiplayerLobbyModal } from '@/components/MultiplayerLobbyModal';
import { soundFx } from '@/lib/audio';
import {
  GULLY_CATEGORIES,
  normalizeCategoryKey,
  GullyCategoryKey
} from '@/lib/gullyCategories';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  Flame,
  Users,
  Trophy,
  Zap
} from 'lucide-react';

function GamesContent() {
  const searchParams = useSearchParams();
  const rawCat = searchParams.get('cat') || 'ALL';
  const initialCat = normalizeCategoryKey(rawCat);
  const initialQuery = searchParams.get('q') || '';

  const { openMultiplayerModal } = useAppStore();
  const [selectedFilter, setSelectedFilter] = useState<string>(initialCat);
  const [search, setSearch] = useState(initialQuery);
  const [onlyMultiplayer, setOnlyMultiplayer] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'plays' | 'duration'>('popular');

  // Unified categories mirroring the Home page exactly
  const filterTabs = [
    { id: 'ALL', label: '🌟 ALL GULLY GAMES', count: GAMES_CATALOG.length },
    ...GULLY_CATEGORIES.map((c) => ({
      id: c.key,
      label: `${c.emoji} ${c.label.toUpperCase()}`,
      count: c.gameIds.length
    }))
  ];

  const filteredGames = useMemo(() => {
    let list = GAMES_CATALOG.filter((game) => {
      const q = search.toLowerCase();
      const matchesSearch =
        game.title.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q) ||
        game.tags.some((t) => t.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (onlyMultiplayer && !game.multiplayer) return false;

      if (selectedFilter === 'ALL') return true;

      const norm = normalizeCategoryKey(selectedFilter);
      const category = GULLY_CATEGORIES.find((c) => c.key === norm);
      if (category) {
        return category.gameIds.includes(game.id);
      }
      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'plays') return b.playCount - a.playCount;
      if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.playCount - a.playCount;
      return 0;
    });

    return list;
  }, [selectedFilter, search, onlyMultiplayer, sortBy]);

  return (
    <div className="space-y-8 pb-16 px-4 sm:px-8 xl:px-14 select-none">
      <MultiplayerLobbyModal />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 sm:p-8 rounded-3xl bg-[#1B1B22]/90 backdrop-blur-md border border-amber-500/25 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-xs font-black text-amber-400 border border-amber-500/30 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DISCOVER 12+ INSTANT DESI BROWSER GAMES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            GULLY GAMES VAULT 🕹️
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Browse trending Indian memes, 3D highway racers, classroom nostalgia duels, and hostel squad battles. Zero downloads, instant play.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80 z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search titles, tags, memes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400/80 transition-colors shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded-full hover:bg-white/10"
            >
              ✕
            </button>
          )}
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Tabs, Multiplayer Toggle & Sort Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#1B1B22]/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-lg">
        {/* Pills - Exact same categories as Home */}
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => {
            const isSelected =
              selectedFilter === tab.id ||
              (selectedFilter !== 'ALL' && normalizeCategoryKey(selectedFilter) === tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedFilter(tab.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-black/30 border border-white/5 text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-black/20 text-slate-950' : 'bg-white/10 text-amber-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls: Multiplayer toggle + Sort */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300 self-end lg:self-auto">
          <label className="flex items-center gap-2 cursor-pointer select-none bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 hover:border-teal-400/40">
            <input
              type="checkbox"
              checked={onlyMultiplayer}
              onChange={(e) => {
                soundFx.playClick();
                setOnlyMultiplayer(e.target.checked);
              }}
              className="accent-teal-400 rounded cursor-pointer"
            />
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>Only Multiplayer ({GAMES_CATALOG.filter((g) => g.multiplayer).length})</span>
          </label>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="plays">Most Played</option>
            </select>
          </div>
        </div>
      </div>

      {/* Games Catalog Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              theme={game.categoryKey}
              onQuickPlay={() => openMultiplayerModal(game)}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-3xl bg-[#1B1B22]/80 backdrop-blur-md border border-white/10 text-center space-y-4 shadow-xl">
          <span className="text-5xl">🔍</span>
          <h3 className="text-lg font-black text-white uppercase">No Gully Games Matched Your Search</h3>
          <p className="text-xs text-slate-400">
            Try searching for &quot;Truck&quot;, &quot;Auto&quot;, &quot;Chor&quot;, &quot;Cricket&quot;, &quot;Politics&quot;, or &quot;Pen&quot;
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedFilter('ALL');
              setOnlyMultiplayer(false);
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-amber-500 uppercase tracking-wider hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading Gully Games Vault...</div>}>
      <GamesContent />
    </Suspense>
  );
}
