import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions – Mastiverse',
  description: 'Read the official Terms of Service and Conditions governing the use of the Mastiverse online gaming platform.',
  openGraph: {
    title: 'Terms and Conditions – Mastiverse',
    description: 'Read the official Terms of Service and Conditions governing the use of the Mastiverse online gaming platform.',
    url: 'https://gully24verse.vercel.app/terms'
  }
};

export default function TermsPage() {
  const toc = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'eligibility', title: '2. Eligibility & Age Requirements' },
    { id: 'account', title: '3. User Accounts & Security' },
    { id: 'fair-play', title: '4. Game Rules & Fair Play' },
    { id: 'prohibited', title: '5. Prohibited Conduct' },
    { id: 'ip', title: '6. Intellectual Property' },
    { id: 'virtual-items', title: '7. Virtual Coins & Leaderboards' },
    { id: 'disclaimer', title: '8. Service Availability & Disclaimers' },
    { id: 'liability', title: '9. Limitation of Liability' },
    { id: 'termination', title: '10. Account Suspension & Termination' },
    { id: 'governing-law', title: '11. Governing Law & Dispute Resolution' },
    { id: 'contact', title: '12. Contact & Grievances' }
  ];

  return (
    <LegalPageLayout
      title="Terms and Conditions"
      subtitle="These Terms and Conditions govern your access to and use of Mastiverse, its browser games, real-time multiplayer services, and community features."
      category="Legal"
      tableOfContents={toc}
      requiresOwnerInput={true}
    >
      <section id="acceptance" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using Mastiverse (&ldquo;the Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), whether via desktop or mobile web browsers, you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions (&ldquo;Terms&rdquo;) and our Privacy Policy. If you do not agree to these Terms, you must immediately cease accessing or using the Platform.
        </p>
        <p>
          These Terms constitute an electronic record in accordance with the provisions of the Information Technology Act, 2000 and the Indian Contract Act, 1872, and the rules framed thereunder.
        </p>
      </section>

      <section id="eligibility" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          2. Eligibility &amp; Age Requirements
        </h2>
        <p>
          Mastiverse provides casual browser entertainment suitable for all ages. However, to register an authenticated account (via Google Auth or email) or engage in social multiplayer chat features, you must be at least 13 years old (or the legal age of consent in your jurisdiction). If you are under 18 years of age, you represent that you are accessing the Platform with the consent and supervision of a parent or legal guardian.
        </p>
      </section>

      <section id="account" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          3. User Accounts &amp; Security
        </h2>
        <p>
          Mastiverse supports guest sessions (persisted via local device storage) as well as cloud-synced accounts authenticated through Firebase Authentication. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm pl-2">
          <li>You must provide accurate, non-misleading information when choosing a username.</li>
          <li>Usernames containing profanity, hate speech, vulgarity, or impersonation of others are strictly prohibited.</li>
          <li>You must promptly notify Mastiverse support if you suspect unauthorized access to your account.</li>
        </ul>
      </section>

      <section id="fair-play" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          4. Game Rules &amp; Fair Play
        </h2>
        <p>
          Mastiverse prides itself on authentic competition. All players must adhere to our{' '}
          <Link href="/fair-play" className="text-amber-400 underline font-semibold">
            Fair Play Policy
          </Link>
          . Cheating, memory modification, speed hacks, automated score injection, packet spoofing, exploiting glitch states, or collaborating to manipulate leaderboard rankings is strictly forbidden.
        </p>
      </section>

      <section id="prohibited" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          5. Prohibited Conduct
        </h2>
        <p>While using Mastiverse, you agree that you will NOT:</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm pl-2">
          <li>Use automated scripts, bots, scrapers, or crawlers to access the platform.</li>
          <li>Attempt to reverse engineer, decompile, or disassemble any game code, shader, or engine binary.</li>
          <li>Disrupt the multiplayer server infrastructure, room synchronization, or denial-of-service (DoS) endpoints.</li>
          <li>Harass, threaten, or defame other players in chat rooms or multiplayer matches.</li>
          <li>Circumvent or tamper with security controls or leaderboard verification APIs.</li>
        </ul>
      </section>

      <section id="ip" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          6. Intellectual Property
        </h2>
        <p>
          The Mastiverse trademark, brand identity, logo, UI/UX designs, sound architecture, original software code, and editorial content are the intellectual property of [Platform Operator / SR24Plus] and protected under the Indian Copyright Act, 1957. Third-party open-source libraries (such as Three.js, Matter.js, Howler.js, and Lucide Icons) are acknowledged under their respective permissive open-source licenses.
        </p>
      </section>

      <section id="virtual-items" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          7. Virtual Points, XP &amp; Leaderboards
        </h2>
        <p>
          Mastiverse is <strong>100% free-to-play</strong>. Coins, XP, badges, and virtual skins are strictly in-game markers of progression. They carry <strong>no real-world monetary value</strong>, cannot be exchanged for cash, and do not constitute real-money wagering or gambling under any Indian state or central laws.
        </p>
      </section>

      <section id="disclaimer" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          8. Service Availability &amp; Disclaimers
        </h2>
        <p>
          Mastiverse is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express or implied. We do not warrant that the games will be uninterrupted, error-free, or compatible with every browser hardware configuration.
        </p>
      </section>

      <section id="liability" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          9. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by applicable Indian law, Mastiverse and its developers (SR24Plus) shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the platform.
        </p>
      </section>

      <section id="termination" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          10. Account Suspension &amp; Termination
        </h2>
        <p>
          We reserve the right to suspend, restrict, or terminate any user account or IP access without prior notice if we detect a breach of these Terms, fair play violations, abusive behavior, or fraudulent activity. Users may request account deletion at any time via our{' '}
          <Link href="/account-deletion" className="text-amber-400 underline">
            Account Deletion page
          </Link>
          .
        </p>
      </section>

      <section id="governing-law" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          11. Governing Law &amp; Dispute Resolution
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts in [Jurisdiction: New Delhi, India].
        </p>
      </section>

      <section id="contact" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          12. Contact &amp; Grievances
        </h2>
        <p>
          For queries regarding these Terms or to submit a formal grievance, please contact us at:
        </p>
        <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono space-y-1">
          <div><strong className="text-white">Legal Inquiry:</strong> legal@mastiverse.in</div>
          <div><strong className="text-white">Support Helpdesk:</strong> support@mastiverse.in</div>
          <div><strong className="text-white">Portal:</strong> <Link href="/contact" className="text-amber-400 underline">gully24verse.vercel.app/contact</Link></div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
