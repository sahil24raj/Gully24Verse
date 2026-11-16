'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GAMES_CATALOG, useAppStore } from '@/store/useAppStore';
import { GameCard } from '@/components/GameCard';
import { MultiplayerLobbyModal } from '@/components/MultiplayerLobbyModal';
import { soundFx } from '@/lib/audio';
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
  const initialCat = searchParams.get('cat') || 'ALL';
  const initialQuery = searchParams.get('q') || '';

  const { openMultiplayerModal } = useAppStore();
  const [selectedFilter, setSelectedFilter] = useState<string>(initialCat);
  const [search, setSearch] = useState(initialQuery);
  const [onlyMultiplayer, setOnlyMultiplayer] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'plays' | 'duration'>('popular');

  const filterTabs = [
    { id: 'ALL', label: '🌟 ALL GULLY GAMES', count: GAMES_CATALOG.length },
    { id: 'meme', label: '🔥 MEME & ACTION', count: 3 },
    { id: 'school', label: '🎒 SCHOOL NOSTALGIA', count: 3 },
    { id: 'squad', label: '👥 MULTIPLAYER MASTI', count: 3 }
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
      return game.categoryKey === selectedFilter;
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 sm:p-8 rounded-3xl bg-[#1B1B22] border border-amber-500/25 shadow-xl relative overflow-hidden">
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

        {/* Search Bar */}
        <div className="relative w-full md:w-80 z-10">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search titles, tags, memes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Tabs, Multiplayer Toggle & Sort Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#1B1B22]/60 p-3 rounded-2xl border border-white/10">
        {/* Pills */}
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedFilter(tab.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-black/30 border border-white/5 text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="p-16 rounded-3xl bg-[#1B1B22] border border-white/10 text-center space-y-4">
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
