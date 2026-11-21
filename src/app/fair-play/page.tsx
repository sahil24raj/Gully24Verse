import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Fair Play & Anti-Cheat Policy – GullyVerse',
  description: 'Understand the fair play rules, anti-cheat detection, and penalty guidelines for competitive matches and leaderboards on GullyVerse.',
  openGraph: {
    title: 'Fair Play & Anti-Cheat Policy – GullyVerse',
    description: 'Understand the fair play rules, anti-cheat detection, and penalty guidelines for competitive matches and leaderboards on GullyVerse.',
    url: 'https://gully24verse.vercel.app/fair-play'
  }
};

export default function FairPlayPage() {
  const toc = [
    { id: 'philosophy', title: '1. Fair Play Philosophy' },
    { id: 'violations', title: '2. Prohibited Exploits & Cheats' },
    { id: 'detection', title: '3. Detection & Telemetry' },
    { id: 'penalties', title: '4. Enforcement & Penalties' },
    { id: 'appeals', title: '5. Reporting & Appeals' }
  ];

  return (
    <LegalPageLayout
      title="Fair Play & Anti-Cheat Policy"
      subtitle="Ensuring honest competition, genuine leaderboards, and sportsmanship across all GullyVerse 3D hits and multiplayer lobbies."
      category="Compliance"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      <section id="philosophy" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          1. Fair Play Philosophy
        </h2>
        <p>
          At GullyVerse, we believe gaming is only enjoyable when victories are earned through reflexes, strategy, and skill. When you top the national leaderboard in <em>Turri Run</em> or outwit your squad in <em>Chor Sipahi</em>, you should know that your rank represents true achievement.
        </p>
      </section>

      <section id="violations" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          2. Prohibited Exploits &amp; Cheats
        </h2>
        <p>The following practices are strictly prohibited on GullyVerse:</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm pl-2">
          <li><strong>Memory Modification:</strong> Using Cheat Engine or browser memory inspectors to alter variables like speed, coins, or collision invulnerability.</li>
          <li><strong>Score Injection &amp; API Tampering:</strong> Directly crafting HTTP requests to submit falsified high scores or simulated multiplayer results.</li>
          <li><strong>Automated Bots:</strong> Utilizing macro recorders, headless browser scripts, or clickbots to farm XP or manipulate matches.</li>
          <li><strong>Lag Exploitation &amp; Disconnect Abuse:</strong> Intentionally disconnecting from multiplayer games to avoid score losses or nullify room stats.</li>
          <li><strong>Multi-Accounting &amp; Collusion:</strong> Creating duplicate accounts to artificially boost a primary account on the leaderboard.</li>
        </ul>
      </section>

      <section id="detection" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          3. Automated Detection &amp; Cryptographic Validation
        </h2>
        <p>
          GullyVerse employs real-time server-side and client-side anomaly detection:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2 text-xs">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-amber-400 block mb-1">Score Verification Checks:</strong>
            Scores submitted faster than physically possible or exceeding algorithmic run-time thresholds are automatically flagged and discarded.
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-cyan-400 block mb-1">State Integrity Hashing:</strong>
            Multiplayer moves in games like Chor Sipahi and Tic-Tac-Toe are validated against deterministic turn state machines.
          </div>
        </div>
      </section>

      <section id="penalties" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          4. Enforcement &amp; Penalties
        </h2>
        <p>Violations will result in escalating penalties depending on severity:</p>
        <div className="space-y-2 text-xs my-2">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300">
            <strong className="text-amber-300">Level 1 (Warning &amp; Score Reset):</strong> Invalidation of suspicious leaderboard scores and resetting of illegitimate XP.
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-slate-300">
            <strong className="text-rose-300">Level 2 (Temporary Suspension):</strong> 7 to 30-day suspension from multiplayer rooms and leaderboard participation.
          </div>
          <div className="p-3 rounded-xl bg-red-600/15 border border-red-600/30 text-slate-300">
            <strong className="text-red-400">Level 3 (Permanent Blacklist):</strong> Permanent ban of the user profile, device ID, and associated IP addresses.
          </div>
        </div>
      </section>

      <section id="appeals" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          5. Reporting &amp; Appeals
        </h2>
        <p>
          If you encounter a player violating fair play standards, or believe your account was mistakenly flagged, please file a report via our{' '}
          <Link href="/report-problem" className="text-amber-400 underline font-semibold">
            Report a Problem page
          </Link>{' '}
          or write to <span className="text-slate-100 font-mono text-xs">fairplay@gullyverse.com</span>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
