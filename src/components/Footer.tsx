'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { soundFx } from '@/lib/audio';
import { GullyVerseLogo } from '@/components/GullyVerseLogo';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#07090F]/95 backdrop-blur-xl border-t border-amber-500/20 pt-14 pb-8 text-slate-400 mt-16 select-none relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/3 w-[600px] h-32 bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1720px] px-4 sm:px-8 xl:px-14 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 relative z-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <GullyVerseLogo size="lg" />
          <p className="font-body-sm text-slate-400 max-w-sm leading-relaxed mt-2 text-xs sm:text-sm">
            India&apos;s premier browser gaming universe. Play 100% free desi games, challenge your hostel squad, drift auto-rickshaws, and dominate national street leaderboards with zero downloads.
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-400/90 font-bold tracking-wider uppercase">
            <span>🇮🇳 Built with pride for Indian Gamers</span>
          </div>

          {/* Creator Attribution Card */}
          <a
            href="https://sr24plus.base44.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="mt-2 inline-flex items-center gap-3 p-2.5 rounded-2xl bg-black/60 border border-amber-500/30 hover:border-amber-400 hover:bg-black/90 transition-all duration-300 w-fit group shadow-md"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-500/50 relative shadow-sm group-hover:scale-105 transition-transform shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/sr24plus-logo.jpg"
                alt="SR24Plus Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col pr-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
                Engineered By <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
              </span>
              <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
                SR24Plus <ExternalLink className="w-3 h-3 text-amber-400" />
              </span>
            </div>
          </a>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-['Russo_One',sans-serif] text-sm text-white tracking-wider uppercase mb-1">
            Navigation
          </h4>
          <Link
            href="/"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Gully Home
          </Link>
          <Link
            href="/games"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            All Games Vault (14+)
          </Link>
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Gamer Dashboard
          </Link>
          <Link
            href="/leaderboard"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Legends Leaderboard
          </Link>
          <Link
            href="/about"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            About GullyVerse
          </Link>
          <Link
            href="/contact"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Contact &amp; Support
          </Link>
        </div>

        {/* Legal & Compliance Column */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-['Russo_One',sans-serif] text-sm text-white tracking-wider uppercase mb-1">
            Legal &amp; Trust
          </h4>
          <Link
            href="/terms"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/privacy"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Privacy Policy (DPDPA 2023)
          </Link>
          <Link
            href="/cookies"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Cookie Policy
          </Link>
          <Link
            href="/disclaimer"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Platform Disclaimer
          </Link>
          <Link
            href="/community-guidelines"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Community Guidelines
          </Link>
          <Link
            href="/fair-play"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Fair Play &amp; Anti-Cheat
          </Link>
          <Link
            href="/intellectual-property"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors w-fit"
          >
            Intellectual Property Policy
          </Link>
        </div>

        {/* Support & Safety Column */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-['Russo_One',sans-serif] text-sm text-white tracking-wider uppercase mb-1">
            Support &amp; Help
          </h4>
          <Link
            href="/help"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-cyan-400 transition-colors w-fit"
          >
            Help Center &amp; Guides
          </Link>
          <Link
            href="/faqs"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-cyan-400 transition-colors w-fit"
          >
            Frequently Asked Questions
          </Link>
          <Link
            href="/report-problem"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-cyan-400 transition-colors w-fit"
          >
            Report a Problem / Bug
          </Link>
          <Link
            href="/account-deletion"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-rose-400 transition-colors w-fit"
          >
            Account Deletion &amp; Data Rights
          </Link>
          <Link
            href="/third-party-services"
            onClick={() => soundFx.playClick()}
            className="text-xs sm:text-sm text-slate-400 hover:text-cyan-400 transition-colors w-fit"
          >
            Third-Party Services
          </Link>
          <div className="pt-2 flex flex-col gap-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Free • No Real Money Gambling
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="max-w-[1720px] px-4 sm:px-8 xl:px-14 mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} GullyVerse. All rights reserved. Built for the desi gaming generation.
        </p>
        
        {/* Creator Attribution Links */}
        <div className="flex items-center gap-2">
          <span>Made with ❤️ by</span>
          <a
            href="https://sr24plus.base44.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-amber-400 hover:text-amber-300 transition-colors underline flex items-center gap-1 group"
          >
            <span>SR24Plus</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
