import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Platform Disclaimer – GullyVerse',
  description: 'Official legal disclaimer regarding gameplay, zero real-money gaming, virtual points, and third-party content on GullyVerse.',
  openGraph: {
    title: 'Platform Disclaimer – GullyVerse',
    description: 'Official legal disclaimer regarding gameplay, zero real-money gaming, virtual points, and third-party content on GullyVerse.',
    url: 'https://gully24verse.vercel.app/disclaimer'
  }
};

export default function DisclaimerPage() {
  const toc = [
    { id: 'entertainment-only', title: '1. Entertainment & Casual Gaming' },
    { id: 'no-gambling', title: '2. Zero Real-Money Gambling Statement' },
    { id: 'availability', title: '3. Technical Availability & Bugs' },
    { id: 'satire', title: '4. Satire, Parody & Fiction Disclaimer' },
    { id: 'external-links', title: '5. External Links & Third Parties' }
  ];

  return (
    <LegalPageLayout
      title="Platform Disclaimer"
      subtitle="Important legal disclaimers regarding the recreational nature of GullyVerse, zero real-money betting, and satirical representations."
      category="Legal"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      <section id="entertainment-only" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          1. Entertainment &amp; Casual Gaming
        </h2>
        <p>
          GullyVerse is an independent web-based casual gaming portal created purely for recreation, fun, and competitive skill-based entertainment. All games provided on this platform are played directly in your browser with zero downloads.
        </p>
      </section>

      <section id="no-gambling" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          2. Zero Real-Money Gambling Statement
        </h2>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm leading-relaxed">
          <strong className="text-white block mb-1">Strict Prohibition of Wagering:</strong>
          GullyVerse is strictly a free-to-play social entertainment platform. We do not offer, encourage, facilitate, or host real-money betting, gambling, casino gaming, fantasy betting, or lotteries. All coins, XP, and badges accumulated on the platform are purely digital gameplay markers with zero monetary value and cannot be redeemed for legal tender.
        </div>
      </section>

      <section id="availability" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          3. Technical Availability &amp; WebGL Performance
        </h2>
        <p>
          While we strive for continuous 60fps performance and high availability, browser performance may vary based on your device hardware, GPU capabilities, WebGL support, and internet stability. GullyVerse disclaims all warranties regarding continuous server uptime or multiplayer latency.
        </p>
      </section>

      <section id="satire" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          4. Satire, Parody &amp; Fiction Disclaimer
        </h2>
        <p>
          Certain games on the platform (such as <em>Indian Politics Arena</em>) are works of political satire, humor, and creative parody intended solely for comedy and public entertainment. Any resemblance to real public figures, political parties, living or deceased persons, or actual historical events is purely coincidental or presented in the exercise of artistic humor and free expression under Article 19(1)(a) of the Constitution of India.
        </p>
      </section>

      <section id="external-links" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          5. External Links &amp; Third Parties
        </h2>
        <p>
          GullyVerse may contain links to external third-party sites (such as creator portfolio links, social media channels, or open-source repositories). We have no control over the content, privacy policies, or practices of any third-party websites and assume no responsibility for them.
        </p>
      </section>
    </LegalPageLayout>
  );
}
