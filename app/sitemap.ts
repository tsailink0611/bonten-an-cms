import { MetadataRoute } from 'next'
import { ContentManagerEnhanced } from '@/lib/content-manager-enhanced'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bonten-an.vercel.app'

  // 基本ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tradition`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/company`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  // 動的ニュースページ
  try {
    const content = await ContentManagerEnhanced.getContent()
    const newsPages = content.news
      .filter(news => news.published !== false)
      .map(news => ({
        url: `${baseUrl}/news/${news.slug || news.id}`,
        lastModified: new Date(news.date),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))

    return [...staticPages, ...newsPages]
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return staticPages
  }
}