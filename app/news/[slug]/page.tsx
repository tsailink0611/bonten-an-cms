'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ContentManagerEnhanced, type NewsContent } from '@/lib/content-manager-enhanced'
import Link from 'next/link'

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<NewsContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const content = await ContentManagerEnhanced.getContent()
        const newsItem = content.news.find(
          n => n.slug === params.slug || n.id === params.slug
        )

        if (newsItem) {
          setArticle(newsItem)
        } else {
          router.push('/news')
        }
      } catch (error) {
        console.error('記事読み込みエラー:', error)
        router.push('/news')
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [params.slug, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    )
  }

  if (!article) {
    return null
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

      {/* 記事詳細 */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/news"
          className="inline-flex items-center text-[#8B4513] hover:text-[#A0522D] mb-8"
        >
          ← お知らせ一覧へ戻る
        </Link>

        <article className="bg-white rounded-lg shadow-md p-8">
          {/* カテゴリー */}
          {article.category && (
            <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-[#8B4513] rounded-full mb-4">
              {article.category}
            </span>
          )}

          {/* タイトル */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* 日付・著者 */}
          <div className="flex items-center text-gray-500 text-sm mb-8">
            <span>{article.date}</span>
            {article.author && (
              <>
                <span className="mx-2">・</span>
                <span>{article.author}</span>
              </>
            )}
          </div>

          {/* アイキャッチ画像 */}
          {article.featuredImage && (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
          )}

          {/* 概要 */}
          <div className="text-lg text-gray-700 font-medium mb-6 pb-6 border-b">
            {article.summary}
          </div>

          {/* 本文 */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: article.content || article.summary
            }}
          />

          {/* タグ */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}