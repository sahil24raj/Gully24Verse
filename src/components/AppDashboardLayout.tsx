'use client';

import React, { useEffect } from 'react';
import { TopHeaderBar } from '@/components/TopHeaderBar';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { DailySpinModal } from '@/components/DailySpinModal';
import { GullySpotlightBackground } from '@/components/GullySpotlightBackground';
import { useAppStore } from '@/store/useAppStore';

interface AppDashboardLayoutProps {
  children: React.ReactNode;
}

export function AppDashboardLayout({ children }: AppDashboardLayoutProps) {
  const initAuthListener = useAppStore((state) => state.initAuthListener);

  useEffect(() => {
    const unsub = initAuthListener();
    return () => {
      if (unsub) unsub();
    };
  }, [initAuthListener]);

  return (
    <div className="min-h-screen w-full bg-[#101014] text-on-surface flex flex-col font-body selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden antialiased">
      {/* 3D Cinematic Indian Gully Environment with Interactive Cursor Spotlight Reveal */}
      <GullySpotlightBackground />

      {/* Pinned Top Navigation Bar */}
      <TopHeaderBar />

      {/* Main Full-Width Content Area Floating Elegantly Above Gully Environment */}
      <main className="flex-1 w-full pt-20 min-h-screen relative z-10">
        <div className="flex flex-col w-full relative">
          {children}
          <Footer />
        </div>
      </main>

      {/* Global Modals */}
      <AuthModal />
      <DailySpinModal />
    </div>
  );
}

export default AppDashboardLayout;
