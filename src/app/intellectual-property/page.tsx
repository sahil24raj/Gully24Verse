import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Intellectual Property Policy – Mastiverse',
  description: 'Understand the intellectual property rights, trademarks, open-source acknowledgments, and DMCA takedown process on Mastiverse.',
  openGraph: {
    title: 'Intellectual Property Policy – Mastiverse',
    description: 'Understand the intellectual property rights, trademarks, open-source acknowledgments, and DMCA takedown process on Mastiverse.',
    url: 'https://gully24verse.vercel.app/intellectual-property'
  }
};

export default function IntellectualPropertyPage() {
  const toc = [
    { id: 'ownership', title: '1. Mastiverse IP Ownership' },
    { id: 'third-party', title: '2. Third-Party Game Assets' },
    { id: 'open-source', title: '3. Open-Source Acknowledgments' },
    { id: 'notice-takedown', title: '4. Notice & Takedown Procedure' }
  ];

  return (
    <LegalPageLayout
      title="Intellectual Property Policy"
      subtitle="Outlining proprietary brand assets, open-source library acknowledgments, and our formal copyright complaint procedure under the Copyright Act, 1957."
      category="Legal"
      tableOfContents={toc}
      requiresOwnerInput={true}
    >
      <section id="ownership" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          1. Mastiverse IP Ownership
        </h2>
        <p>
          The Mastiverse brand name, wordmark, logo, tagline (&ldquo;Apni Gully, Apne Games!&rdquo;), custom graphics, user interface layouts, interactive components, audio management pipelines, and proprietary game code are the exclusive intellectual property of [Platform Operator / SR24Plus].
        </p>
        <p>
          Unauthorized copying, reproduction, re-hosting, scraping, framing, or distribution of Mastiverse platform code or branding without prior written consent is strictly prohibited under the Copyright Act, 1957 and applicable international treaties.
        </p>
      </section>

      <section id="third-party" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          2. Third-Party Game Assets &amp; Fair Use
        </h2>
        <p>
          Certain game themes and meme references are inspired by Indian pop culture and folklore. Mastiverse respects the intellectual property rights of all content creators. Where external third-party 3D models or royalty-free audio effects are incorporated, they are licensed under permissive CC-BY, CC0, or commercial developer asset licenses.
        </p>
      </section>

      <section id="open-source" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          3. Open-Source Acknowledgments
        </h2>
        <p>
          Mastiverse is built on top of incredible open-source technologies:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm pl-2">
          <li><strong>Three.js:</strong> MIT License – 3D WebGL rendering engine.</li>
          <li><strong>Matter.js:</strong> MIT License – 2D physics engine.</li>
          <li><strong>Howler.js:</strong> MIT License – Web Audio API abstraction.</li>
          <li><strong>Lucide Icons &amp; Next.js:</strong> MIT License.</li>
        </ul>
      </section>

      <section id="notice-takedown" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          4. Notice &amp; Takedown Procedure (Copyright Complaints)
        </h2>
        <p>
          If you are a copyright owner or authorized agent and believe that content hosted on Mastiverse infringes upon your copyright, please submit a formal notification containing:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300 pl-2">
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Direct URL or game title where the alleged material is located on Mastiverse.</li>
          <li>Your full legal name, organization, email address, and physical contact address.</li>
          <li>A statement affirming your good-faith belief that the disputed use is not authorized by the copyright owner.</li>
          <li>A statement, under penalty of perjury, that the information in the notification is accurate.</li>
        </ol>
        <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono mt-3">
          <strong className="text-amber-400 block mb-1">Submit Infringement Notices To:</strong>
          <span>Email: legal@mastiverse.in / grievance@mastiverse.in</span>
          <br />
          <span>Subject: &ldquo;FORMAL COPYRIGHT INFRINGEMENT NOTICE - MASTIVERSE&rdquo;</span>
        </div>
      </section>
    </LegalPageLayout>
  );
}
