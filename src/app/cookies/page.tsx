import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Cookie Policy – Mastiverse',
  description: 'Learn about how Mastiverse uses browser cookies and local storage to preserve your game progress, audio settings, and authentication.',
  openGraph: {
    title: 'Cookie Policy – Mastiverse',
    description: 'Learn about how Mastiverse uses browser cookies and local storage to preserve your game progress, audio settings, and authentication.',
    url: 'https://gully24verse.vercel.app/cookies'
  }
};

export default function CookiesPage() {
  const toc = [
    { id: 'what-are-cookies', title: '1. What Are Cookies & Local Storage?' },
    { id: 'types-used', title: '2. Technologies Used by Mastiverse' },
    { id: 'purposes', title: '3. Purposes of Cookie Usage' },
    { id: 'third-party', title: '4. Third-Party Cookies' },
    { id: 'managing-cookies', title: '5. How to Manage or Disable Cookies' }
  ];

  return (
    <LegalPageLayout
      title="Cookie Policy"
      subtitle="This policy explains how Mastiverse uses HTTP cookies, browser local storage, and session identifiers to power instant browser gameplay and preserve your stats."
      category="Legal"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      <section id="what-are-cookies" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          1. What Are Cookies &amp; Local Storage?
        </h2>
        <p>
          Cookies are small text files placed on your computer or mobile device when you visit a website. In addition to standard HTTP cookies, modern web applications like Mastiverse utilize HTML5 <strong>Web Storage (localStorage and sessionStorage)</strong>. These storage mechanisms allow your browser to remember your preferences (like sound mute states, active game high scores, and user avatars) between sessions without requiring server round-trips.
        </p>
      </section>

      <section id="types-used" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          2. Technologies Used by Mastiverse
        </h2>
        <div className="space-y-3 my-2">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <h4 className="text-amber-400 font-bold text-xs uppercase mb-1">A. Strictly Essential Cookies</h4>
            <p className="text-xs text-slate-300">
              Necessary for the technical operation of the platform, including Firebase Auth session verification and CSRF protection.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <h4 className="text-cyan-400 font-bold text-xs uppercase mb-1">B. Functional Local Storage</h4>
            <p className="text-xs text-slate-300">
              Stored under <code>localStorage</code> keys such as <code>chill_arena_device_user_id</code> and <code>gullyverse_friends</code>. These enable guest play, remember your chosen sound volume, preserve unlocked skins, and save high scores offline.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <h4 className="text-emerald-400 font-bold text-xs uppercase mb-1">C. Performance &amp; Security Cookies</h4>
            <p className="text-xs text-slate-300">
              Set by our CDN provider (Vercel) to balance server load, detect automated bot traffic, and optimize asset delivery.
            </p>
          </div>
        </div>
      </section>

      <section id="purposes" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          3. Purposes of Cookie Usage
        </h2>
        <ul className="list-disc list-inside space-y-1 text-sm pl-2">
          <li>To keep you logged into your Google or email account.</li>
          <li>To save your sound effects volume and mute preferences.</li>
          <li>To verify fair-play scores during high-score submissions.</li>
          <li>To cache 3D textures, WebGL assets, and audio sprites for lightning-fast 1-tap play.</li>
        </ul>
      </section>

      <section id="third-party" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          4. Third-Party Cookies
        </h2>
        <p>
          When you use Google Sign-In, Google may set cookies on its authentication domain (<code>accounts.google.com</code>) to authenticate your Google profile securely. Mastiverse does not control Google&apos;s authentication cookies. We do not use third-party behavioral advertising cookies or commercial tracking pixels.
        </p>
      </section>

      <section id="managing-cookies" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          5. How to Manage or Disable Cookies
        </h2>
        <p>
          You can restrict or block cookies through your browser settings. However, please note that disabling essential cookies and local storage will reset your local game progress, logout active sessions, and restore default audio settings upon page refresh.
        </p>
        <p className="text-xs text-slate-400">
          To clear Mastiverse local storage manually, open your browser Developer Tools (F12) &gt; Application &gt; Local Storage &gt; Clear All.
        </p>
      </section>
    </LegalPageLayout>
  );
}
