'use client'

import { useState, useEffect } from 'react'
import { ContentManagerEnhanced, type NewsContent } from '@/lib/content-manager-enhanced'
import Link from 'next/link'

export default function NewsListPage() {
  const [news, setNews] = useState<NewsContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const loadNews = async () => {
      try {
        const content = await ContentManagerEnhanced.getContent()
        // 公開されているニュースのみを表示
        const publishedNews = content.news.filter(n => n.published !== false)
        setNews(publishedNews.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ))
      } catch (error) {
        console.error('ニュース読み込みエラー:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNews()

    // リアルタイム更新のリスナー
    const unsubscribe = ContentManagerEnhanced.subscribe(() => {
      loadNews()
    })

    return () => unsubscribe()
  }, [])

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(n => n.category === selectedCategory)

  const categories = Array.from(new Set(news.map(n => n.category).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-[#8B4513]">
            梵天庵
          </Link>
        </div>
      </header>

      {/* ページヘッダー */}
      <div className="bg-gradient-to-b from-[#8B4513] to-[#A0522D] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">お知らせ</h1>
          <p className="text-xl opacity-90">梵天庵の最新情報をお届けします</p>
        </div>
      </div>

      {/* カテゴリーフィルター */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === 'all'
                  ? 'bg-[#8B4513] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              すべて
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat || '')}
                className={`px-4 py-2 rounded-full transition ${
                  selectedCategory === cat
                    ? 'bg-[#8B4513] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ニュース一覧 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">お知らせはありません</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* アイキャッチ画像 */}
                {item.featuredImage && (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  {/* カテゴリー */}
                  {item.category && (
                    <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-[#8B4513] rounded-full mb-3">
                      {item.category}
                    </span>
                  )}

                  {/* タイトル */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link
                      href={`/news/${item.slug || item.id}`}
                      className="hover:text-[#8B4513] transition"
                    >
                      {item.title}
                    </Link>
                  </h2>

                  {/* 日付 */}
                  <time className="text-sm text-gray-500 block mb-3">
                    {item.date}
                  </time>

                  {/* 概要 */}
                  <p className="text-gray-700 line-clamp-3 mb-4">
                    {item.summary}
                  </p>

                  {/* 続きを読む */}
                  <Link
                    href={`/news/${item.slug || item.id}`}
                    className="text-[#8B4513] font-medium hover:text-[#A0522D] transition"
                  >
                    続きを読む →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}