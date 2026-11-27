import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppDashboardLayout } from '@/components/AppDashboardLayout';

export const viewport: Viewport = {
  themeColor: '#080D1B',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "MASTIVERSE — Apna Game. Apni Duniya. | India's Premium Gaming Universe",
  description: "Experience MASTIVERSE — the ultimate Indian gaming entertainment ecosystem. Play original 3D action, street racing, arcade brawls and squad multiplayer instantly with zero downloads. Apna Game. Apni Duniya.",
  keywords: [
    'MASTIVERSE',
    'Apna Game Apni Duniya',
    'Mastiverse Originals',
    'Mastiverse Arcade',
    'Mastiverse Racing',
    'Mastiverse Multiplayer',
    'Indian gaming ecosystem',
    'desi browser games',
    'Jelly Jalwa',
    'Gully Race',
    'Pehelwan Rush',
    'Turri Run',
    'Tirri Run',
    'GenZ Protest Run',
    'Book Cricket',
    'Spin Cricket',
    'online multiplayer India',
    'room codes gaming'
  ],
  icons: {
    icon: [
      { url: '/brand/mastiverse-icon.png?v=4', type: 'image/png' },
      { url: '/icon.png?v=4', type: 'image/png' },
      { url: '/favicon.ico?v=4', sizes: 'any' }
    ],
    shortcut: '/brand/mastiverse-icon.png?v=4',
    apple: [
      { url: '/brand/mastiverse-icon.png?v=4' },
      { url: '/apple-icon.png?v=4' }
    ],
  },
  openGraph: {
    title: "MASTIVERSE — Apna Game. Apni Duniya.",
    description: "India's premier gaming universe. Play Mastiverse Originals, street racers, and multiplayer battles with friends worldwide.",
    images: ['/brand/mastiverse-logo.png'],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MASTIVERSE — Apna Game. Apni Duniya.",
    description: "India's premier gaming universe. Play free 3D games instantly. Zero downloads, pure masti.",
    images: ['/brand/mastiverse-logo.png'],
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Russo+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased selection:bg-amber-500 selection:text-slate-950 font-body">
        <AppDashboardLayout>{children}</AppDashboardLayout>
      </body>
    </html>
  );
}
