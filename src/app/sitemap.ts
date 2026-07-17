import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.sungabha.org.np';

  // Core pages
  const staticPages = [
    '',
    '/about',
    '/projects',
    '/gallery',
    '/news',
    '/events',
    '/contact',
    '/volunteer',
    '/donate',
    '/reports',
    '/publication',
    '/success-stories',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticPages];
}
