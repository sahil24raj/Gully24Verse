'use client';

import React, { useState } from 'react';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import { soundFx } from '@/lib/audio';
import { Trash2, AlertTriangle, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AccountDeletionPage() {
  const [guestCleared, setGuestCleared] = useState(false);

  const handleClearGuestData = () => {
    try {
      soundFx.playClick();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('chill_arena_device_user_id');
        localStorage.removeItem('gullyverse_friends');
        localStorage.removeItem('vibe-arena-storage');
        sessionStorage.clear();
      }
      setGuestCleared(true);
      try {
        soundFx.playCorrect();
      } catch {}
    } catch {
      alert('Failed to clear local device data. Please clear cookies via browser settings.');
    }
  };

  const toc = [
    { id: 'dpdpa-right', title: '1. Right to Erasure (DPDPA 2023)' },
    { id: 'guest-deletion', title: '2. Instant Guest Data Clear' },
    { id: 'cloud-deletion', title: '3. Cloud Account Deletion' },
    { id: 'retention-timeline', title: '4. Deletion Timelines' }
  ];

  return (
    <LegalPageLayout
      title="Account Deletion & Data Rights"
      subtitle="In compliance with Section 12 of India's DPDPA 2023, you have the right to request the complete erasure of your personal data and gaming records."
      category="Compliance"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      <section id="dpdpa-right" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          1. Your Right to Erasure (DPDPA 2023)
        </h2>
        <p>
          Under the Digital Personal Data Protection Act, 2023, you have the right to withdraw consent and have your personal data, gameplay logs, and profile records permanently erased from our databases and cloud infrastructure.
        </p>
      </section>

      <section id="guest-deletion" className="flex flex-col gap-4 scroll-mt-28 p-6 rounded-2xl bg-black/40 border border-white/10">
        <h2 className="font-['Russo_One',sans-serif] text-lg text-amber-300 uppercase tracking-wide flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-amber-400" />
          <span>2. Instant Local Device Data Reset (Guest Players)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          If you play as a Guest, all your stats, unlocked skins, and sound preferences are stored strictly inside your browser&apos;s local storage. You can instantly erase all local device telemetry right now:
        </p>
        
        {guestCleared ? (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Local device data, guest ID, and cached settings have been completely cleared. A fresh guest ID will generate on your next game launch.</span>
          </div>
        ) : (
          <button
            onClick={handleClearGuestData}
            className="w-fit px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local Device Data Now</span>
          </button>
        )}
      </section>

      <section id="cloud-deletion" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          3. Authenticated Cloud Account Deletion (Google / Email)
        </h2>
        <p>
          If you have registered an account via Google Sign-In or email and wish to permanently delete your cloud profile and leaderboard entries:
        </p>
        <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs space-y-2 text-slate-300">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">Step 1:</span>
            <span>Submit a deletion ticket via our <Link href="/contact" className="text-amber-400 underline">Contact Portal</Link> selecting category &ldquo;Account &amp; Profile Support&rdquo;.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">Step 2:</span>
            <span>Or write directly to <span className="font-mono text-white">privacy@mastiverse.in</span> from the email address registered with your account.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">Step 3:</span>
            <span>Our security team will authenticate the request and purge your Firestore user document, match logs, and leaderboard records within 30 days.</span>
          </div>
        </div>
      </section>

      <section id="retention-timeline" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          4. Deletion Timelines &amp; Post-Deletion State
        </h2>
        <p>
          Once an account is deleted, your historical scores on public leaderboards will either be pseudonymized or removed. This action is irreversible. You may create a fresh account at any time in the future.
        </p>
      </section>
    </LegalPageLayout>
  );
}
