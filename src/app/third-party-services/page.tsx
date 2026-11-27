import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Third-Party Services Disclosure – Mastiverse',
  description: 'Full transparency regarding third-party cloud infrastructure, analytics, and authentication providers used by Mastiverse.',
  openGraph: {
    title: 'Third-Party Services Disclosure – Mastiverse',
    description: 'Full transparency regarding third-party cloud infrastructure, analytics, and authentication providers used by Mastiverse.',
    url: 'https://gully24verse.vercel.app/third-party-services'
  }
};

export default function ThirdPartyServicesPage() {
  const toc = [
    { id: 'overview', title: '1. Transparency Overview' },
    { id: 'providers', title: '2. List of Active Providers' },
    { id: 'data-sharing', title: '3. Data Sharing & Privacy' },
    { id: 'updates', title: '4. Infrastructure Changes' }
  ];

  return (
    <LegalPageLayout
      title="Third-Party Services Disclosure"
      subtitle="Complete architectural transparency regarding external cloud services, authentication APIs, and CDN networks supporting Mastiverse."
      category="Compliance"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      <section id="overview" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          1. Transparency Overview
        </h2>
        <p>
          In accordance with the Digital Personal Data Protection Act, 2023, Mastiverse discloses all external services and Data Processors utilized to deliver instant gameplay, host multiplayer sync, and protect platform security.
        </p>
      </section>

      <section id="providers" className="flex flex-col gap-4 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          2. List of Active Infrastructure Providers
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-white text-sm">Google Firebase (Google Cloud Platform)</strong>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/20">Data Processor</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong>Purpose:</strong> User authentication (Google OAuth &amp; Email), cloud NoSQL database (Firestore) for user profiles and national leaderboards.
            </p>
            <p className="text-[11px] text-slate-400">
              <strong>Data Processed:</strong> Email, username, profile picture URL, game scores.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-white text-sm">Vercel Inc.</strong>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/20">Hosting &amp; Edge CDN</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong>Purpose:</strong> Web application hosting, static asset caching, DDoS mitigation, and serverless API execution.
            </p>
            <p className="text-[11px] text-slate-400">
              <strong>Data Processed:</strong> IP addresses, HTTP request headers, browser user-agents.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-white text-sm">Google Fonts</strong>
              <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/20">Font Delivery</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong>Purpose:</strong> Serving web fonts (Russo One, Space Grotesk, JetBrains Mono).
            </p>
          </div>
        </div>
      </section>

      <section id="data-sharing" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          3. Data Sharing &amp; Non-Sale Guarantee
        </h2>
        <p>
          Mastiverse <strong>never sells or trades personal user data</strong> to third-party data brokers, advertising aggregators, or marketing firms. External providers are strictly engaged under contractual data processing agreements to perform technical hosting and database operations.
        </p>
      </section>

      <section id="updates" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          4. Updates to Providers
        </h2>
        <p>
          Whenever we integrate or replace an infrastructure provider, this page will be updated with the provider details, purpose, and data categories processed.
        </p>
      </section>
    </LegalPageLayout>
  );
}
