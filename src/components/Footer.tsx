'use client';

import React from 'react';
import Link from 'next/link';
import { soundFx } from '@/lib/audio';
import { GullyVerseLogo } from '@/components/GullyVerseLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0B0B0E] border-t border-amber-500/20 py-12 text-slate-400 mt-16 select-none">
      <div className="max-w-[1720px] px-4 sm:px-8 xl:px-14 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <GullyVerseLogo size="lg" />
          <p className="font-body-sm text-slate-400 max-w-sm leading-relaxed mt-2">
            India&apos;s premier browser gaming universe. Play free desi games, challenge your hostel squad, drift auto-rickshaws, and dominate the national street leaderboard. Zero downloads, instant 6-character room codes.
          </p>
          <div className="flex items-center gap-3 text-xs text-amber-400/90 font-bold tracking-wider uppercase">
            <span>🇮🇳 Made with pride for Indian Gamers</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-label-lg text-white font-black tracking-wider uppercase">Navigation</h4>
          <Link
            href="/"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-amber-400 transition-colors w-fit"
          >
            Gully Home
          </Link>
          <Link
            href="/games"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-amber-400 transition-colors w-fit"
          >
            All Games Vault
          </Link>
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-amber-400 transition-colors w-fit"
          >
            Gamer Dashboard
          </Link>
          <Link
            href="/leaderboard"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-amber-400 transition-colors w-fit"
          >
            Legends Leaderboard
          </Link>
          <Link
            href="/shop"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-amber-400 transition-colors w-fit"
          >
            Gully Coin Shop
          </Link>
        </div>

        {/* Desi Games Showcase */}
        <div className="flex flex-col gap-3">
          <h4 className="font-label-lg text-white font-black tracking-wider uppercase">Featured Games</h4>
          <Link
            href="/games/truck-run"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-amber-400 transition-colors w-fit"
          >
            🚛 Truck Run (3D)
          </Link>
          <Link
            href="/games/auto-rush"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-amber-400 transition-colors w-fit"
          >
            🛺 Auto Rush (3D)
          </Link>
          <Link
            href="/games/chor-sipahi"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-amber-400 transition-colors w-fit"
          >
            👑 Chor Sipahi (Multiplayer)
          </Link>
          <Link
            href="/games/indian-politics-arena"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-amber-400 transition-colors w-fit"
          >
            🗳️ Politics Arena (1v1)
          </Link>
          <Link
            href="/games/spin-cricket"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-amber-400 transition-colors w-fit"
          >
            🏏 Spin Cricket (Book Cricket)
          </Link>
        </div>

        {/* Community & Legal */}
        <div className="flex flex-col gap-3">
          <h4 className="font-label-lg text-white font-black tracking-wider uppercase">Community</h4>
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-teal-400 transition-colors w-fit flex items-center gap-1.5"
          >
            <span>💬 Gully Discord</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-teal-400 transition-colors w-fit flex items-center gap-1.5"
          >
            <span>📸 Instagram Reels</span>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="font-body-sm hover:text-teal-400 transition-colors w-fit flex items-center gap-1.5"
          >
            <span>🐦 Twitter / X</span>
          </a>
          <div className="pt-2 text-xs text-slate-500 flex flex-col gap-1">
            <span>Fair Play Certified</span>
            <span>Zero Real Money Gambling</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1720px] px-4 sm:px-8 xl:px-14 mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 GULLYVERSE. Gully Se Gaming Tak. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Play</Link>
          <Link href="/contact" className="hover:text-slate-300 transition-colors">Hostel Squad Support</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
