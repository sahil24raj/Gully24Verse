'use client';

import React from 'react';
import { useAppStore, GAMES_CATALOG } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import { Sparkles, Users } from 'lucide-react';

export const ViralSquadBanner: React.FC = () => {
  const { openMultiplayerModal } = useAppStore();

  return (
    <section className="w-full px-4 sm:px-8 xl:px-14 py-14 select-none">
      <div className="max-w-[1720px] mx-auto rounded-3xl bg-gradient-to-r from-[#101A33] via-[#172344] to-[#2446D8] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(49,92,255,0.35)] flex flex-col md:flex-row items-center justify-between gap-8 border border-[#315CFF]/40">
        <div className="flex flex-col gap-3 max-w-xl z-10 text-center md:text-left">
          <span className="px-3.5 py-1 rounded-full bg-[#080D1B]/90 text-[#FF8A35] text-xs font-black uppercase self-center md:self-start border border-[#FF8A35]/40 shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            THE MASTIVERSE CODE
          </span>
          <h2 className="font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight">
            &ldquo;BAS EK AUR MATCH.&rdquo;
          </h2>
          <p className="font-body-lg text-slate-200 font-medium text-base sm:text-lg">
            Who in your hostel group chat always refuses to sleep? Drop a 6-character room code into WhatsApp right now and settle the score once and for all.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 z-10">
          <button
            onClick={() => {
              soundFx.playPowerUp();
              openMultiplayerModal(GAMES_CATALOG[0]);
            }}
            className="px-8 py-4 rounded-2xl bg-[#FF8A35] hover:bg-[#FFA959] text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,138,53,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-white/20"
          >
            <Users className="w-4 h-4 text-slate-950" />
            <span>DROP INTO SQUAD</span>
          </button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#315CFF]/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
};

export default ViralSquadBanner;
