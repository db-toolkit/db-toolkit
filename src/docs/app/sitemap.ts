import { docsConfig } from '@/lib/config';

export const dynamic = 'force-static';

export default function sitemap() {
  const baseUrl = 'https://docs.dbtoolkit.app';
  
  const docs = docsConfig.sections.flatMap((section) =>
    section.items.map((item) => ({
      url: `${baseUrl}/docs/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...docs,
  ];
}
