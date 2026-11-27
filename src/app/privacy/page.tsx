import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy – Mastiverse (DPDPA 2023 Compliant)',
  description: 'Understand how Mastiverse collects, processes, and protects your personal data in accordance with the Digital Personal Data Protection Act, 2023.',
  openGraph: {
    title: 'Privacy Policy – Mastiverse (DPDPA 2023 Compliant)',
    description: 'Understand how Mastiverse collects, processes, and protects your personal data in accordance with the Digital Personal Data Protection Act, 2023.',
    url: 'https://gully24verse.vercel.app/privacy'
  }
};

export default function PrivacyPage() {
  const toc = [
    { id: 'introduction', title: '1. Introduction & Overview' },
    { id: 'data-collected', title: '2. Information We Collect' },
    { id: 'purpose', title: '3. Legal Basis & Purpose' },
    { id: 'storage', title: '4. Storage & Security' },
    { id: 'third-party', title: '5. Third-Party Services' },
    { id: 'user-rights', title: '6. Your Rights Under DPDPA 2023' },
    { id: 'children', title: '7. Children’s Privacy' },
    { id: 'retention', title: '8. Data Retention' },
    { id: 'grievance', title: '9. Grievance Redressal Officer' }
  ];

  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Mastiverse is committed to safeguarding your personal data in strict compliance with India's Digital Personal Data Protection Act, 2023 (DPDPA 2023) and the Information Technology Act, 2000."
      category="Legal"
      tableOfContents={toc}
      requiresOwnerInput={true}
    >
      <section id="introduction" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          1. Introduction &amp; Overview
        </h2>
        <p>
          This Privacy Policy explains how Mastiverse (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, processes, stores, and protects personal data belonging to users (&ldquo;Data Principals&rdquo;) who access our casual browser gaming universe.
        </p>
        <p>
          We operate as a Data Fiduciary under the provisions of the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.
        </p>
      </section>

      <section id="data-collected" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          2. Information We Collect
        </h2>
        <p>
          In keeping with our commitment to privacy by design, Mastiverse strictly collects only the minimal data necessary to deliver instant browser gameplay and multiplayer leaderboards:
        </p>
        <div className="space-y-3 my-2">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <h4 className="text-amber-400 font-bold text-xs uppercase mb-1">A. Guest Session Data</h4>
            <p className="text-xs text-slate-300">
              For users playing without creating an account, we generate a pseudonymous device identifier (e.g. <code>usr_guest_xxxx</code>) stored locally in your browser&apos;s <code>localStorage</code> to maintain your unlocked skins, game scores, and audio preferences. No email, telephone number, or real identity is collected for guest play.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <h4 className="text-cyan-400 font-bold text-xs uppercase mb-1">B. Authenticated Profile Data</h4>
            <p className="text-xs text-slate-300">
              When you voluntarily sign in via Google Authentication or email signup, we receive your name, email address, profile picture URL, and a unique Firebase user ID (UID).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <h4 className="text-emerald-400 font-bold text-xs uppercase mb-1">C. Gameplay &amp; Social Telemetry</h4>
            <p className="text-xs text-slate-300">
              High scores, session counts, achievements, friend links in &ldquo;Your Squad&rdquo;, and public leaderboard standing.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <h4 className="text-purple-400 font-bold text-xs uppercase mb-1">D. Technical &amp; Diagnostic Logs</h4>
            <p className="text-xs text-slate-300">
              IP addresses, browser user-agent, operating system, and performance metrics collected via server logs to prevent DDoS attacks, mitigate botting, and ensure WebGL stability.
            </p>
          </div>
        </div>
      </section>

      <section id="purpose" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          3. Legal Basis &amp; Purpose of Processing
        </h2>
        <p>We process your personal data for specified, legitimate purposes:</p>
        <ul className="list-disc list-inside space-y-1 text-sm pl-2">
          <li><strong>Service Delivery:</strong> To authenticate your gaming session, host multiplayer lobbies, and sync leaderboards.</li>
          <li><strong>Fraud Prevention &amp; Fair Play:</strong> To detect and prevent automated scripts, cheating, and malicious server exploitation.</li>
          <li><strong>Customer Support:</strong> To respond to bug tickets and user grievances submitted through our Contact portal.</li>
          <li><strong>Compliance:</strong> To satisfy statutory record-keeping obligations under applicable Indian laws.</li>
        </ul>
      </section>

      <section id="storage" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          4. Data Storage &amp; Security Measures
        </h2>
        <p>
          User profiles and leaderboard records are securely hosted on Google Cloud Firebase Firestore infrastructure with TLS 1.3 encryption in transit and AES-256 encryption at rest. Strict Firebase Security Rules enforce that users can only modify their own authorized profile documents.
        </p>
      </section>

      <section id="third-party" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          5. Third-Party Service Providers
        </h2>
        <p>
          Mastiverse integrates with trusted third-party cloud infrastructure providers:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm pl-2">
          <li><strong>Google Firebase:</strong> Cloud authentication, Firestore database, and security rules.</li>
          <li><strong>Vercel Inc.:</strong> Global Edge CDN and application hosting.</li>
        </ul>
        <p className="text-xs text-slate-400">
          We do not sell, rent, or trade your personal data with third-party advertisers or data brokers. Review our{' '}
          <Link href="/third-party-services" className="text-amber-400 underline">
            Third-Party Disclosure
          </Link>{' '}
          for full details.
        </p>
      </section>

      <section id="user-rights" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          6. Your Rights Under DPDPA 2023
        </h2>
        <p>As a Data Principal under Indian law, you possess enforceable rights:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2 text-xs">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-white block mb-1">Right to Access:</strong>
            You may request a summary of the personal data held about your account.
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-white block mb-1">Right to Correction:</strong>
            You can update your username, avatar, and profile details anytime from your Profile page.
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-white block mb-1">Right to Erasure:</strong>
            You have the right to request full deletion of your account and cloud data via our{' '}
            <Link href="/account-deletion" className="text-amber-400 underline">
              Account Deletion Portal
            </Link>.
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-white block mb-1">Right to Grievance Redressal:</strong>
            You may submit privacy complaints to our Grievance Redressal Officer.
          </div>
        </div>
      </section>

      <section id="children" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          7. Children’s Privacy &amp; Age Restrictions
        </h2>
        <p>
          Mastiverse does not knowingly process personal data of children under 18 years of age without verifiable parental consent in accordance with Section 9 of the DPDPA 2023. Our casual games feature no gambling, no predatory purchasing loops, and no adult content.
        </p>
      </section>

      <section id="retention" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          8. Data Retention Policy
        </h2>
        <p>
          We retain active user profile data for as long as your account remains open. Inactive guest telemetry stored in your browser <code>localStorage</code> can be cleared at any time by resetting your browser cookies and site data. Upon receiving a valid account deletion request, user records are deleted from Firestore within 30 days.
        </p>
      </section>

      <section id="grievance" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          9. Grievance Redressal Officer (DPDPA 2023 &amp; IT Rules 2021)
        </h2>
        <p>
          If you have questions, concerns, or grievances regarding our privacy practices, you may contact our designated Grievance Officer:
        </p>
        <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono space-y-1">
          <div><strong className="text-white">Designation:</strong> Data Protection &amp; Grievance Officer</div>
          <div><strong className="text-white">Entity:</strong> Mastiverse (SR24Plus)</div>
          <div><strong className="text-white">Email:</strong> privacy@mastiverse.in / grievance@mastiverse.in</div>
          <div><strong className="text-white">Response Window:</strong> Within 15 calendar days as mandated by IT Rules 2021</div>
          <div><strong className="text-white">Country:</strong> Republic of India</div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
