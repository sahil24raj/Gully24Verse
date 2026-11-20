'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Trophy, Zap, Shield, HelpCircle } from 'lucide-react';
import { FunRaceGame } from '@/components/games/fun-race/FunRaceGame';
import { soundFx } from '@/lib/audio';

export default function FunRacePage() {
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
            ⚡ 3D HYPER-CASUAL
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            🏆 PARKOUR RACING
          </span>
        </div>
      </div>

      {/* Main Game Card Container */}
      <div className="w-full">
        <FunRaceGame />
      </div>

      {/* Game Details, Lore & Controls Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏃💨</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                Fun Race 3D
              </h1>
              <p className="text-xs font-mono text-cyan-400">
                Single-Touch 3D Parkour Obstacle Racing
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            The definitive 3D parkour obstacle racing game! Hold your touch or click to sprint along vibrant elevated tracks over turquoise lagoons. Time your stops to evade spinning windmills, sinusoidal hammers, rotating drums, and pneumatic crushers. Outrun intelligent AI opponents and cross the finish line first!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Control
              </span>
              <p className="text-xs font-bold text-white">Hold to Run / Release</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-cyan-400" /> Objective
              </span>
              <p className="text-xs font-bold text-white">Finish 1st Place</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" /> Checkpoints
              </span>
              <p className="text-xs font-bold text-white">Auto-Save Progress</p>
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
                <span><strong>Hold Down:</strong> Press and hold mouse/screen or Spacebar to run forward.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Release to Stop:</strong> Let go immediately to brake and wait for rotating blades to pass safely.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Watch AI Rivals:</strong> They know obstacle cycles well, but occasionally take risks and get knocked into the water!</span>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Beat all 3 Levels to become the Lagoon Champion!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
