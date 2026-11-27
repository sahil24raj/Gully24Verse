import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import Link from 'next/link';
import { Gamepad2, Users, Trophy, Cpu, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help Center & Guides – Mastiverse',
  description: 'Player guides, controls, multiplayer room setup, and troubleshooting for Mastiverse games.',
  openGraph: {
    title: 'Help Center & Guides – Mastiverse',
    description: 'Player guides, controls, multiplayer room setup, and troubleshooting for Mastiverse games.',
    url: 'https://gully24verse.vercel.app/help'
  }
};

export default function HelpCenterPage() {
  const guides = [
    {
      title: 'Controls & Gameplay Basics',
      icon: Gamepad2,
      desc: 'Master touch gestures on mobile and keyboard controls (WASD, Arrow Keys, Spacebar) for 3D racers and brawlers.'
    },
    {
      title: 'Multiplayer Rooms & Squad Play',
      icon: Users,
      desc: 'How to generate 6-character room codes, invite hostel friends, and manage live match lobbies.'
    },
    {
      title: 'Leaderboard Rankings & XP',
      icon: Trophy,
      desc: 'Understand how XP is calculated, daily challenge rewards, and how to reach the top #1 Sultan podium.'
    },
    {
      title: 'Browser & Hardware Optimization',
      icon: Cpu,
      desc: 'Troubleshooting WebGL crashes, enabling hardware acceleration, and achieving smooth 60fps on low-end laptops.'
    }
  ];

  const toc = [
    { id: 'player-guides', title: '1. Player Guides & Tutorials' },
    { id: 'troubleshooting', title: '2. Common Troubleshooting' },
    { id: 'contact-support', title: '3. Direct Support Channels' }
  ];

  return (
    <LegalPageLayout
      title="Mastiverse Help Center"
      subtitle="Comprehensive player manuals, controls, multiplayer instructions, and performance optimization guides."
      category="Support"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      <section id="player-guides" className="flex flex-col gap-4 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          1. Player Guides &amp; Mechanics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guides.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-['Russo_One',sans-serif] text-sm text-white">{g.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{g.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="troubleshooting" className="flex flex-col gap-3 scroll-mt-28 pt-4 border-t border-white/10">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          2. Performance &amp; Hardware Troubleshooting
        </h2>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <strong className="text-amber-400 block mb-1">Issue: Audio not playing on mobile tap</strong>
            <p className="text-slate-400">
              Modern mobile browsers require user interaction before playing audio. Tap anywhere on the game screen or click the sound icon in the top header to unlock Web Audio.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <strong className="text-cyan-400 block mb-1">Issue: Low framerate / stuttering on laptops</strong>
            <p className="text-slate-400">
              Ensure you do not have power saver mode throttling your GPU. In Chrome, go to <code>chrome://settings/system</code> and toggle on &ldquo;Use graphics acceleration when available&rdquo;.
            </p>
          </div>
        </div>
      </section>

      <section id="contact-support" className="flex flex-col gap-3 scroll-mt-28 pt-4 border-t border-white/10">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          3. Need Direct Assistance?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Our support team is available to assist with room code bugs, account inquiries, and fair-play reports:
        </p>
        <div className="flex items-center gap-4 flex-wrap pt-2">
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
          >
            <span>Open Support Ticket</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/faqs"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/10"
          >
            View FAQs
          </Link>
        </div>
      </section>
    </LegalPageLayout>
  );
}
