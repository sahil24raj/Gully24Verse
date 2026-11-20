'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, GAMES_CATALOG } from '@/store/useAppStore';
import { soundFx } from '@/lib/audio';
import { normalizeRoomCode } from '@/lib/multiplayer/roomCodeGenerator';
import {
  Users,
  KeyRound,
  Share2,
  Play,
  Sparkles,
  Zap,
  Check,
  Send,
  Radio,
  Flame
} from 'lucide-react';

export const GullyMultiplayerZone: React.FC = () => {
  const router = useRouter();
  const { user, openMultiplayerModal } = useAppStore();
  const [joinCode, setJoinCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeRoomCode(joinCode.trim().toUpperCase());
    if (clean.length === 6) {
      soundFx.playGameStart();
      router.push(`/play/room/${clean}`);
    } else {
      soundFx.playError();
    }
  };

  const handleCreateRoom = () => {
    soundFx.playPowerUp();
    // Pre-select Chor Sipahi (classic 4-player multiplayer)
    const multiplayerGame =
      GAMES_CATALOG.find((g) => g.id === 'chor-sipahi') || GAMES_CATALOG[0];
    openMultiplayerModal(multiplayerGame);
  };

  const handleShareInvite = () => {
    soundFx.playClick();
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://vibe24arena.vercel.app';
    const text = `Aaja GullyVerse pe squad battle khelte hain! Room code bana diya hai: ${url}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const multiplayerGames = GAMES_CATALOG.filter((g) => g.multiplayer).slice(0, 4);

  return (
    <section className="w-full px-4 sm:px-8 xl:px-14 py-14 select-none">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-12">
        {/* --- SECTION 5: APNA SQUAD BANAO! --- */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-black uppercase tracking-wider border border-teal-500/30">
                <Users className="w-3.5 h-3.5" />
                <span>MULTIPLAYER ZONE</span>
              </div>
              <h2 className="font-headline-xl uppercase text-white tracking-tight mt-2 text-3xl sm:text-4xl font-black">
                APNA SQUAD BANAO!
              </h2>
              <p className="font-body-lg text-slate-300 max-w-xl">
                Dost bulao. Game lagao. Play private multiplayer battles with 6-character room codes. Zero installs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateRoom}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(0,191,166,0.35)] cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>+ CREATE SQUAD ROOM</span>
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Action 1: Create Room */}
            <div className="rounded-3xl bg-[#1B1B22] p-6 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-6 group">
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl border border-amber-500/30">
                  01
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                  Instant Room Creation
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generate a private room in 1 second. Pick your favorite game mode and get a shareable 6-char code.
                </p>
              </div>
              <button
                onClick={handleCreateRoom}
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                CREATE ROOM NOW
              </button>
            </div>

            {/* Action 2: Join with Code */}
            <div className="rounded-3xl bg-[#1B1B22] p-6 border border-white/10 hover:border-teal-500/40 transition-all flex flex-col justify-between gap-6 group">
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-xl border border-teal-500/30">
                  02
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-teal-400 transition-colors">
                  Join With Room Code
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Got a 6-character room code from your squad on WhatsApp or Discord? Enter it below to join instantly.
                </p>
              </div>
              <form onSubmit={handleJoinByCode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. CS104P"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono font-bold text-center uppercase tracking-widest text-sm focus:border-teal-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={joinCode.trim().length !== 6}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                >
                  JOIN
                </button>
              </form>
            </div>

            {/* Action 3: 1-Tap Invite Link */}
            <div className="rounded-3xl bg-[#1B1B22] p-6 border border-white/10 hover:border-orange-500/40 transition-all flex flex-col justify-between gap-6 group">
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-xl border border-orange-500/30">
                  03
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                  Call Your Squad
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Share a direct 1-tap game invite link to your hostel WhatsApp group or college Discord server.
                </p>
              </div>
              <button
                onClick={handleShareInvite}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">COPIED INVITE LINK!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-orange-400" />
                    <span>COPY SQUAD INVITE LINK</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 6: SQUAD MATCHMAKING & ACTIVE SQUAD INVITE --- */}
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>REAL-TIME MATCHMAKING</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
                SQUAD LOBBIES & ROOM CODES
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Invite friends via 1-tap WhatsApp link or copy your private 6-character room code.
              </p>
            </div>

            <span className="text-xs text-emerald-400 font-bold px-3.5 py-1.5 rounded-xl bg-black/40 border border-emerald-500/30 w-fit flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ROOM NETWORK LIVE 🟢</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Quick Share WhatsApp */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  💬
                </div>
                <h4 className="text-base font-black text-white">WhatsApp 1-Tap Invite</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Send an instant room invite link directly to your college, hostel or gaming WhatsApp group.
                </p>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  const url = encodeURIComponent(window.location.origin + '/games');
                  const text = encodeURIComponent('Aaja GullyVerse pe squad match khelte hai! Room link: ');
                  window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-emerald-500/30 cursor-pointer"
              >
                <span>SHARE ON WHATSAPP</span>
              </button>
            </div>

            {/* Copy Room Link */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                  🔗
                </div>
                <h4 className="text-base font-black text-white">Copy Match Link</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Copy direct multiplayer invite URL to your clipboard for Discord, Telegram or Instagram DMs.
                </p>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.origin + '/games');
                    alert('Match link copied to clipboard!');
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-cyan-500/30 cursor-pointer"
              >
                <span>COPY INVITE LINK</span>
              </button>
            </div>

            {/* Instant Room Matchmaking */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                  ⚡
                </div>
                <h4 className="text-base font-black text-white">Instant Room Host</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generate a private room in 1 second. Play Chor Sipahi, Politics Arena, or Pen Flip online.
                </p>
              </div>
              <button
                onClick={handleCreateRoom}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>+ HOST ROOM NOW</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GullyMultiplayerZone;
