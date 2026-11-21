import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gully24verse.vercel.app';
  const lastModified = new Date();

  // Core Platform Pages
  const staticPages = [
    { url: `${baseUrl}`, lastModified, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/games`, lastModified, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/leaderboard`, lastModified, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/help`, lastModified, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/faqs`, lastModified, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/report-problem`, lastModified, changeFrequency: 'monthly' as const, priority: 0.6 },
    // Legal & Trust
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/cookies`, lastModified, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/disclaimer`, lastModified, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/community-guidelines`, lastModified, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/fair-play`, lastModified, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/intellectual-property`, lastModified, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/account-deletion`, lastModified, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/third-party-services`, lastModified, changeFrequency: 'monthly' as const, priority: 0.4 },
  ];

  // 14+ Games
  const gameRoutes = [
    'jelly-run',
    'fun-race',
    'auto-rush',
    'giant-rush',
    'indian-politics-arena',
    'chor-sipahi',
    'spin-cricket',
    'genz-protest-run',
    'escape-door',
    'fake-bomb',
    'tic-tac-toe',
    'word-builder',
    'pen-flip',
    'brain-pot'
  ].map((slug) => ({
    url: `${baseUrl}/game/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.85
  }));

  return [...staticPages, ...gameRoutes];
}
