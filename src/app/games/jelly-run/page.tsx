'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Zap, Shield, HelpCircle, Split } from 'lucide-react';
import { JellyRunGame } from '@/components/games/jelly-run/JellyRunGame';
import { soundFx } from '@/lib/audio';

export default function JellyRunPage() {
  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href="/games"
          onClick={() => soundFx.playClick()}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO GAMES ARENA</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            ⚡ 3D 2048 RUNNER
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            🍮 SPLIT & MERGE
          </span>
        </div>
      </div>

      {/* Main Game Card Container */}
      <div className="w-full">
        <JellyRunGame />
      </div>

      {/* Game Details, Lore & Controls Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🍮✨</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                Jelly Jalwa
              </h1>
              <p className="text-xs font-mono text-cyan-400">
                Desi 3D Split & Merge 2048 Runner
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            The definitive 3D jelly runner puzzle! Guide your squishy, glowing numbered cubes down high-speed elevated aquatic tracks. Drag to steer into matching number cubes to merge into higher powers of 2. Tap or press Space to dynamically split your cube in two to bypass center pillars and deadly rotating sawblades, then fuse back together to double your score and launch down the multiplier runway!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Controls
              </span>
              <p className="text-xs font-bold text-white">Drag / A-D to Steer</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Split className="w-3 h-3 text-cyan-400" /> Signature
              </span>
              <p className="text-xs font-bold text-white">Tap / Space to Split</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-emerald-400" /> Goal
              </span>
              <p className="text-xs font-bold text-white">Reach 2048 & Multipliers</p>
            </div>
          </div>
        </div>

        {/* Pro Tips Sidebar */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>HOW TO PLAY & WIN</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Merge Numbers:</strong> Collide with collectible cubes sharing your cube&apos;s number (2+2=4, 4+4=8...) to double its value!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">•</span>
                <span><strong>Split Around Dividers:</strong> Center pillars will destroy single cubes! Tap or press Space to split into twin cubes that pass cleanly on each side.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Multiplier Runway:</strong> Blast past the finish line to reach up to 50x multipliers based on your final number!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
