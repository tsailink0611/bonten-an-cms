'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/lib/auth'
import { ContentManagerEnhanced, type NewsContent, type SiteContent } from '@/lib/content-manager-enhanced'
import ImageUpload from '@/components/ImageUpload'
import Link from 'next/link'

export default function NewsManagementPage() {
  const { user, loading } = useAuthState()
  const router = useRouter()
  const [news, setNews] = useState<NewsContent[]>([])
  const [editingNews, setEditingNews] = useState<NewsContent | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [formData, setFormData] = useState<NewsContent>({
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    content: '',
    category: '',
    tags: [],
    published: true,
    slug: '',
    author: 'Admin',
    featuredImage: ''
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
      return
    }

    if (user) {
      loadNews()
    }
  }, [user, loading, router])

  const loadNews = async () => {
    try {
      const content = await ContentManagerEnhanced.getContent()
      setNews(content.news || [])
    } catch (error) {
      console.error('ニュース読み込みエラー:', error)
    }
  }

  const handleCreateNew = () => {
    setEditingNews(null)
    setFormData({
      id: `news-${Date.now()}`,
      title: '',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      content: '',
      category: '',
      tags: [],
      published: true,
      slug: '',
      author: 'Admin',
      featuredImage: ''
    })
    setTagInput('')
    setShowEditor(true)
  }

  const handleEdit = (item: NewsContent) => {
    setEditingNews(item)
    setFormData(item)
    setTagInput(item.tags?.join(', ') || '')
    setShowEditor(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('この記事を削除しますか？')) return

    try {
      const content = await ContentManagerEnhanced.getContent()
      const updatedNews = content.news.filter(n => n.id !== id)

      const updatedContent: SiteContent = {
        ...content,
        news: updatedNews
      }

      await ContentManagerEnhanced.saveContent(updatedContent)
      await loadNews()
      alert('記事を削除しました')
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.summary) {
      alert('タイトルと概要は必須です')
      return
    }

    try {
      const content = await ContentManagerEnhanced.getContent()

      // タグの処理
      const tags = tagInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      // スラッグの自動生成
      const slug = formData.slug || formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const newsItem: NewsContent = {
        ...formData,
        tags,
        slug,
        date: formData.date || new Date().toISOString().split('T')[0]
      }

      let updatedNews: NewsContent[]
      if (editingNews) {
        // 既存記事の更新
        updatedNews = content.news.map(n =>
          n.id === editingNews.id ? newsItem : n
        )
      } else {
        // 新規記事の追加
        updatedNews = [newsItem, ...content.news]
      }

      const updatedContent: SiteContent = {
        ...content,
        news: updatedNews
      }

      await ContentManagerEnhanced.saveContent(updatedContent)
      await loadNews()
      setShowEditor(false)
      alert(editingNews ? '記事を更新しました' : '記事を作成しました')
    } catch (error) {
      console.error('保存エラー:', error)
      alert('保存に失敗しました')
    }
  }

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">お知らせ・ブログ管理</h1>
              <p className="mt-1 text-sm text-gray-600">記事の作成・編集・管理</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                管理画面へ戻る
              </Link>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                新規作成
              </button>
            </div>
          </div>
        </div>

        {/* エディター */}
        {showEditor && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {editingNews ? '記事を編集' : '新規記事作成'}
            </h2>

            <div className="space-y-4">
              {/* タイトル */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="記事のタイトル"
                />
              </div>

              {/* 日付 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日付
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* カテゴリー */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリー
                </label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="お知らせ、イベント、新商品など"
                />
              </div>

              {/* タグ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タグ（カンマ区切り）
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="和菓子, 季節限定, お知らせ"
                />
              </div>

              {/* 概要 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  概要 *
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="記事の概要（一覧ページに表示されます）"
                />
              </div>

              {/* 本文 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  本文（HTMLタグ使用可）
                </label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows={10}
                  placeholder="<p>記事の本文...</p>"
                />
              </div>

              {/* アイキャッチ画像 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  アイキャッチ画像
                </label>
                <ImageUpload
                  value={formData.featuredImage || ''}
                  onChange={(image) => setFormData({...formData, featuredImage: image})}
                />
              </div>

              {/* 公開設定 */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published !== false}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  記事を公開する
                </label>
              </div>

              {/* ボタン */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  保存する
                </button>
                <button
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 記事一覧 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">記事一覧</h2>
          </div>

          <div className="divide-y">
            {news.length === 0 ? (
              <p className="p-6 text-gray-500">まだ記事がありません</p>
            ) : (
              news.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.title}
                        </h3>
                        {item.published === false && (
                          <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                            非公開
                          </span>
                        )}
                        {item.category && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.date}</p>
                      <p className="text-gray-700">{item.summary}</p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}