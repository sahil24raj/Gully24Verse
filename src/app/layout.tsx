import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppDashboardLayout } from '@/components/AppDashboardLayout';

export const viewport: Viewport = {
  themeColor: '#101014',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "GullyVerse – India's Desi Browser Gaming Universe",
  description: "Play free Indian-style browser games instantly. Challenge friends, create squads and enjoy multiplayer gaming on GullyVerse. Zero downloads, unlimited masti. Gully Se Gaming Tak.",
  keywords: [
    'GullyVerse',
    'Gully Se Gaming Tak',
    'India Ka Apna Gaming Adda',
    'desi browser games',
    'Indian multiplayer games',
    'Truck Run 3D',
    'Chor Sipahi online',
    'Indian Politics Arena',
    'Auto Rush 3D',
    'Tirri Run',
    'Book Cricket',
    'Spin Cricket',
    'Pen Flip Battle',
    'hostel gaming',
    'free online games India',
    '6-character room codes'
  ],
  icons: {
    icon: '/brand/gullyverse-icon.png',
    shortcut: '/brand/gullyverse-icon.png',
    apple: '/brand/gullyverse-icon.png',
  },
  openGraph: {
    title: "GullyVerse – India's Desi Browser Gaming Universe",
    description: "Apni Gully. Apne Dost. Apne Games. Play free desi browser games instantly — no downloads, no waiting. Gully Se Gaming Tak.",
    images: ['/brand/gullyverse-logo.png'],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "GullyVerse – India's Desi Browser Gaming Universe",
    description: "Apni Gully. Apne Dost. Apne Games. Play free desi browser games instantly. Gully Se Gaming Tak.",
    images: ['/brand/gullyverse-logo.png'],
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased selection:bg-amber-500 selection:text-slate-950 font-body">
        <AppDashboardLayout>{children}</AppDashboardLayout>
      </body>
    </html>
  );
}
