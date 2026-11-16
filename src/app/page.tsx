'use client';

import React from 'react';
import { GullyHeroSection } from '@/components/GullyHeroSection';
import { HeroTrendingCarousel } from '@/components/HeroTrendingCarousel';
import { PickYourVibeSection } from '@/components/PickYourVibeSection';
import { GullyMultiplayerZone } from '@/components/GullyMultiplayerZone';
import { LegendsLeaderboardSection } from '@/components/LegendsLeaderboardSection';
import { ViralSquadBanner } from '@/components/ViralSquadBanner';
import { MultiplayerLobbyModal } from '@/components/MultiplayerLobbyModal';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full relative">
      {/* Real-time Multiplayer Modal */}
      <MultiplayerLobbyModal />

      {/* 1. SECTION 2: HERO EXPERIENCE — India Ka Apna Gaming Adda & 3D Street Arcade */}
      <GullyHeroSection />

      {/* 2. SECTION 3: TRENDING GAMES — "Aaj Kya Khelein?" */}
      <HeroTrendingCarousel />

      {/* 3. SECTION 4: GAME CATEGORIES — Choose Your Gully Vibe */}
      <PickYourVibeSection />

      {/* 4. SECTION 5 & 6: MULTIPLAYER ZONE — "Apna Squad Banao!" & "Gully Mein Kaun Online Hai?" */}
      <GullyMultiplayerZone />

      {/* 5. SECTION 7: LEADERBOARD — "Gully Ke Top Players" */}
      <LegendsLeaderboardSection />

      {/* 6. SECTION 8: VIRAL BANNER — "Bas Ek Aur Match" */}
      <ViralSquadBanner />
    </div>
  );
}
