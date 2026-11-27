import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQs) – Mastiverse',
  description: 'Find answers to common questions about games, multiplayer rooms, account syncing, and browser performance on Mastiverse.',
  openGraph: {
    title: 'Frequently Asked Questions (FAQs) – Mastiverse',
    description: 'Find answers to common questions about games, multiplayer rooms, account syncing, and browser performance on Mastiverse.',
    url: 'https://gully24verse.vercel.app/faqs'
  }
};

export default function FAQsPage() {
  const faqs = [
    {
      q: 'Do I need to download or install anything to play?',
      a: 'Absolutely not! All 14+ games on Mastiverse run directly in your web browser using HTML5, WebGL, and Three.js. You can play on mobile, tablet, laptop, or desktop with 1 tap.'
    },
    {
      q: 'Is Mastiverse free to play?',
      a: 'Yes, 100% free! There are zero paywalls, zero subscription fees, and no real-money gambling. All points, coins, and levels are purely virtual for fun and competitive rankings.'
    },
    {
      q: 'How do multiplayer rooms work?',
      a: 'You can create an instant private room from the Multiplayer section, which generates a unique 6-character room code (e.g. GV-7890). Share this code with your friends or hostel squad via WhatsApp, and they can join instantly.'
    },
    {
      q: 'How do I save my progress and high scores?',
      a: 'Guest play saves your scores and settings locally in your browser. To sync your scores across devices, safeguard your stats, and compete on the global leaderboard, simply sign in using Google or email.'
    },
    {
      q: 'Why is a 3D game lagging or showing a black screen?',
      a: 'Make sure "Hardware Acceleration" is enabled in your browser settings (Chrome: Settings > System > Use hardware acceleration when available). Updating your graphics drivers also ensures 60fps WebGL rendering.'
    },
    {
      q: 'How do I add friends to "Your Squad"?',
      a: 'Visit the Dashboard or Leaderboard, and click "+ Add Friend" next to any player row or podium champion. You can also click "+ Add By Username" to search and add any registered player directly!'
    },
    {
      q: 'Can I request a new game or suggest features?',
      a: 'Yes! We love hearing from our community. Visit our Contact & Support page and submit a message under "General Inquiry / Feedback".'
    }
  ];

  const toc = [
    { id: 'general-faqs', title: 'Frequently Asked Questions' },
    { id: 'need-more-help', title: 'Need Further Assistance?' }
  ];

  return (
    <LegalPageLayout
      title="Frequently Asked Questions"
      subtitle="Quick answers to common questions about gameplay, multiplayer rooms, account data, and technical requirements."
      category="Support"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      <section id="general-faqs" className="flex flex-col gap-4 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          Got Questions? We Have Answers.
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2">
              <h3 className="text-sm sm:text-base font-bold text-amber-300 font-['Russo_One',sans-serif]">
                {idx + 1}. {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="need-more-help" className="flex flex-col gap-3 scroll-mt-28 pt-6 border-t border-white/10">
        <h2 className="font-['Russo_One',sans-serif] text-lg text-white uppercase tracking-wide">
          Still Have Questions?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          If you didn&apos;t find what you were looking for, reach out to our dedicated support team:
        </p>
        <div className="flex items-center gap-4 flex-wrap pt-2">
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            Contact Support
          </Link>
          <Link
            href="/report-problem"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/10"
          >
            Report an Issue
          </Link>
        </div>
      </section>
    </LegalPageLayout>
  );
}
