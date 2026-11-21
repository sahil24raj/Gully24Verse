import React from 'react';
import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import Link from 'next/link';
import { Gamepad2, Users, Flame, Heart, Code2, Globe2, Sparkles, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About GullyVerse – India’s Desi Browser Gaming Universe',
  description: 'Learn about GullyVerse, our story, mission, and how we bring nostalgic Indian street games to the digital world with zero downloads.',
  openGraph: {
    title: 'About GullyVerse – India’s Desi Browser Gaming Universe',
    description: 'Learn about GullyVerse, our story, mission, and how we bring nostalgic Indian street games to the digital world with zero downloads.',
    url: 'https://gully24verse.vercel.app/about'
  }
};

export default function AboutPage() {
  const toc = [
    { id: 'story', title: 'Our Story' },
    { id: 'mission', title: 'Our Mission' },
    { id: 'games-ecosystem', title: 'Desi Gaming Ecosystem' },
    { id: 'creator', title: 'Built by SR24Plus' },
    { id: 'future', title: 'The Future of GullyVerse' }
  ];

  return (
    <LegalPageLayout
      title="About GullyVerse"
      subtitle="Bringing the thrill, banter, and nostalgia of Indian street games into an instant, zero-download digital arena."
      category="Company"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      {/* Brand Statement Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-black/40 to-cyan-500/15 border border-amber-500/30 text-white font-medium text-base sm:text-lg leading-relaxed shadow-lg">
        &ldquo;GullyVerse brings the excitement of gaming, competition, and desi culture together in one digital universe. From hostel rooms to local gullies, gaming has always been about community.&rdquo;
      </div>

      {/* 1. Our Story */}
      <section id="story" className="flex flex-col gap-4 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl sm:text-2xl text-white uppercase tracking-wide flex items-center gap-2.5">
          <Flame className="w-5 h-5 text-amber-400" />
          <span>1. Our Story</span>
        </h2>
        <p>
          In every Indian neighborhood, the &ldquo;gully&rdquo; is where childhood legends are born. Whether it was betting a five-rupee coin on Book Cricket during boring lectures, dodging teachers in Chor Sipahi, or drifting an imaginary auto-rickshaw through chaotic traffic, desi games have their own distinct flavor of chaos, comedy, and skill.
        </p>
        <p>
          However, modern mobile gaming became plagued by 10-gigabyte downloads, mandatory pay-to-win microtransactions, and aggressive ad spam. We asked a simple question: <em>Why can&apos;t gaming be instant, fun, and culturally authentic?</em>
        </p>
        <p>
          <strong>GullyVerse was born out of this spirit.</strong> A high-performance WebGL and HTML5 gaming portal where you tap once and start playing in less than two seconds — on any phone, laptop, or low-spec browser. No installations. No waiting. Pure desi gaming.
        </p>
      </section>

      {/* 2. Our Mission */}
      <section id="mission" className="flex flex-col gap-4 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl sm:text-2xl text-white uppercase tracking-wide flex items-center gap-2.5">
          <Globe2 className="w-5 h-5 text-cyan-400" />
          <span>2. Our Mission</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2">
            <span className="text-amber-400 font-bold text-sm">⚡ 100% Zero Downloads</span>
            <p className="text-xs text-slate-400">
              Instant play via modern WebGL &amp; Canvas engines. Accessible from any modern browser with ultra-low latency.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2">
            <span className="text-cyan-400 font-bold text-sm">🇮🇳 Cultural Authenticity</span>
            <p className="text-xs text-slate-400">
              Original themes celebrating Indian street culture, folklore, memes, and classroom games.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2">
            <span className="text-emerald-400 font-bold text-sm">🛡️ Zero Real-Money Gambling</span>
            <p className="text-xs text-slate-400">
              Clean entertainment. 100% free-to-play with strictly virtual points, leaderboards, and fair play.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2">
            <span className="text-purple-400 font-bold text-sm">👥 Instant Multiplayer</span>
            <p className="text-xs text-slate-400">
              6-character instant room codes for hostel friends, colleges, and office breaks.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Desi Gaming Ecosystem */}
      <section id="games-ecosystem" className="flex flex-col gap-4 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl sm:text-2xl text-white uppercase tracking-wide flex items-center gap-2.5">
          <Gamepad2 className="w-5 h-5 text-amber-400" />
          <span>3. The Desi Gaming Ecosystem</span>
        </h2>
        <p>
          GullyVerse hosts a handcrafted lineup of 14+ instant games across 3D sports, racers, brawlers, and satirical party duels:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-sm ml-2">
          <li><strong>Turri Run 🛺:</strong> High-speed 3D auto-rickshaw drift racer through chaotic Chandni Chowk neon lanes.</li>
          <li><strong>Jelly Jalwa 🍬:</strong> Physics-based 3D 2048 runner with dynamic jelly squish mechanics.</li>
          <li><strong>Pehelwan Rush 🥊:</strong> 3D akhaada brawler where size equals power.</li>
          <li><strong>Chor Sipahi 👑:</strong> Classic 4-player hostel paper-chit game brought to real-time multiplayer.</li>
          <li><strong>Spin Cricket 🏏:</strong> The nostalgic school-day book cricket experience modernized for competitive leaderboards.</li>
          <li><strong>Indian Politics Arena ⚔️:</strong> Satirical battle royale featuring witty dialogue and political debates.</li>
        </ul>
      </section>

      {/* 4. Creator Attribution */}
      <section id="creator" className="flex flex-col gap-4 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl sm:text-2xl text-white uppercase tracking-wide flex items-center gap-2.5">
          <Code2 className="w-5 h-5 text-amber-400" />
          <span>4. Built by SR24Plus</span>
        </h2>
        <div className="p-6 rounded-2xl bg-black/60 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-lg shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/sr24plus-logo.jpg"
                alt="SR24Plus Official Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-mono text-amber-400 tracking-wider">Creator &amp; Architect</span>
              <h3 className="text-2xl font-black text-white font-['Russo_One',sans-serif]">SR24Plus</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                GullyVerse is engineered and designed by SR24Plus using the SR24Plus Engineering Toolkit, focusing on lightweight web performance, 60fps canvas rendering, and scalable cloud architecture.
              </p>
            </div>
          </div>
          <a
            href="https://sr24plus.base44.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 shrink-0 active:scale-95"
          >
            <span>Visit SR24Plus</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 5. The Future */}
      <section id="future" className="flex flex-col gap-4 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl sm:text-2xl text-white uppercase tracking-wide flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>5. The Future of GullyVerse</span>
        </h2>
        <p>
          We are continuously developing new multiplayer experiences, tournament brackets for college fests, community custom rooms, and creator tools. We believe that gaming belongs in the browser, accessible to every Indian gamer regardless of device specs or internet speed.
        </p>
        <div className="pt-4 flex items-center gap-4 flex-wrap">
          <Link
            href="/games"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            Play Games Now
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/10"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </LegalPageLayout>
  );
}
