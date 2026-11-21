import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Community Guidelines – GullyVerse',
  description: 'Community standards, social code of conduct, and player safety guidelines for GullyVerse.',
  openGraph: {
    title: 'Community Guidelines – GullyVerse',
    description: 'Community standards, social code of conduct, and player safety guidelines for GullyVerse.',
    url: 'https://gully24verse.vercel.app/community-guidelines'
  }
};

export default function CommunityGuidelinesPage() {
  const toc = [
    { id: 'spirit', title: '1. The Gully Spirit' },
    { id: 'conduct', title: '2. Positive Conduct' },
    { id: 'prohibited', title: '3. Zero Tolerance Behaviors' },
    { id: 'usernames', title: '4. Usernames & Profiles' },
    { id: 'reporting', title: '5. Reporting Community Violations' }
  ];

  return (
    <LegalPageLayout
      title="Community Guidelines"
      subtitle="Fostering an inclusive, welcoming, and banter-filled gaming environment for all Indian players and hostel squads."
      category="Compliance"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      <section id="spirit" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          1. The Gully Spirit
        </h2>
        <p>
          GullyVerse is inspired by the vibrant camaraderie of Indian street gaming: where friends play hard, roast each other with desi banter, and celebrate every victory together. While friendly rivalry and humor are warmly embraced, mutual respect is the foundation of our entire community.
        </p>
      </section>

      <section id="conduct" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          2. Positive Conduct
        </h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm pl-2">
          <li><strong>Good Sportsmanship:</strong> Win with humility, lose with grace. Celebrate fellow players&apos; skill.</li>
          <li><strong>Help Newcomers:</strong> Welcome new hostel comrades and explain game mechanics to beginner players.</li>
          <li><strong>Keep Lobbies Clean:</strong> Create fun, engaging custom room names and enjoy wholesome competition.</li>
        </ul>
      </section>

      <section id="prohibited" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          3. Zero Tolerance Behaviors
        </h2>
        <p>The following will result in immediate suspension or permanent bans:</p>
        <div className="space-y-2 text-xs my-2">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-rose-400 block mb-1">Harassment &amp; Hate Speech:</strong>
            Attacking, threatening, or disparaging anyone based on religion, caste, gender, sexual orientation, disability, or regional background.
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-rose-400 block mb-1">Doxxing &amp; Privacy Invasion:</strong>
            Sharing personal phone numbers, addresses, social media links, or confidential private information of other players without consent.
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-rose-400 block mb-1">Spamming &amp; Commercial Solicitation:</strong>
            Flooding multiplayer rooms with promotional links, affiliate scams, or betting group invitations.
          </div>
        </div>
      </section>

      <section id="usernames" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          4. Username &amp; Profile Standards
        </h2>
        <p>
          Your gamer tag represents you on public leaderboards. Usernames containing sexually explicit content, religious slurs, abuse, or impersonation of official GullyVerse administrators will be forcibly renamed or deleted.
        </p>
      </section>

      <section id="reporting" className="flex flex-col gap-3 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide">
          5. Reporting Violations
        </h2>
        <p>
          If you encounter inappropriate behavior in any game room or profile, report it immediately through our{' '}
          <Link href="/report-problem" className="text-amber-400 underline font-semibold">
            Report a Problem portal
          </Link>
          . Our safety team reviews all reports.
        </p>
      </section>
    </LegalPageLayout>
  );
}
