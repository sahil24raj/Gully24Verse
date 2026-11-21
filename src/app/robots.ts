import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://gully24verse.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/admin/',
        '/profile/',
        '/_next/'
      ]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
