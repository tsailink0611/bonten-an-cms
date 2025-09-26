'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/lib/auth'
import { auth } from '@/lib/firebase'
import { logout } from '@/lib/auth'
import { ContentManagerEnhanced, type SiteContent } from '@/lib/content-manager-enhanced'
import ImageUpload from '@/components/ImageUpload'

export default function DashboardPage() {
  const { user, loading } = useAuthState()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>(null)
  const [showSEOModal, setShowSEOModal] = useState(false)
  const [showDataModal, setShowDataModal] = useState(false)
  const [seoData, setSeoData] = useState({
    title: '梵天庵 - 伝統の和菓子',
    description: '季節の移ろいを表現した伝統の和菓子。職人の技と心が込められた逸品をお届けします。',
    keywords: '和菓子,梵天庵,伝統,職人,季節,お菓子',
    ogImage: '/images/og-image.jpg'
  })
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null)
  const [productFormData, setProductFormData] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    cta: '詳細を見る',
    reverse: false
  })
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
      return
    }

    if (user) {
      loadContent()
      loadSEOSettings()
    }
  }, [user, loading, router])

  const loadContent = async () => {
    try {
      const siteContent = await ContentManagerEnhanced.getContent()
      setContent(siteContent)
      setLastUpdated(new Date(siteContent.lastUpdated).toLocaleString('ja-JP'))
    } catch (error) {
      console.error('コンテンツ読み込みエラー:', error)
    }
  }

  const loadSEOSettings = () => {
    try {
      const savedSEO = localStorage.getItem('seoSettings')
      if (savedSEO) {
        setSeoData(JSON.parse(savedSEO))
      }
    } catch (error) {
      console.error('SEO設定読み込みエラー:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/admin/login')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  const handleResetContent = async () => {
    if (confirm('コンテンツをデフォルトにリセットしますか？')) {
      try {
        await ContentManagerEnhanced.resetToDefault()
        await loadContent()
        alert('コンテンツをリセットしました')
      } catch (error) {
        console.error('リセットエラー:', error)
        alert('リセットに失敗しました')
      }
    }
  }

  const handleEditPage = (pageType: string) => {
    if (!content) return

    console.log('編集開始:', pageType)
    setEditingPage(pageType)

    switch (pageType) {
      case 'home':
        setEditData({
          hero: content.hero,
          products: content.products,
          news: content.news
        })
        break
      case 'tradition':
        setEditData(content.tradition)
        break
      case 'company':
        setEditData(content.company)
        break
      case 'contact':
        setEditData(content.contact)
        break
      case 'access':
        setEditData(content.access)
        break
      default:
        console.log('未対応のページタイプ:', pageType)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingPage || !editData) return

    try {
      console.log('保存開始:', editingPage, editData)

      switch (editingPage) {
        case 'tradition':
          await ContentManagerEnhanced.updateTradition(editData)
          break
        case 'company':
          await ContentManagerEnhanced.updateCompany(editData)
          break
        case 'contact':
          await ContentManagerEnhanced.updateContact(editData)
          break
        case 'access':
          await ContentManagerEnhanced.updateAccess(editData)
          break
        case 'home':
          await ContentManagerEnhanced.updateHero(editData.hero)
          break
      }

      await loadContent()
      setEditingPage(null)
      setEditData(null)
      alert('保存しました！')
    } catch (error) {
      console.error('保存エラー:', error)
      alert('保存に失敗しました')
    }
  }

  const handleCancelEdit = () => {
    setEditingPage(null)
    setEditData(null)
  }

  const handleSEOSettings = () => {
    setShowSEOModal(true)
  }

  const handleDataManagement = () => {
    setShowDataModal(true)
  }

  const handleSaveSEO = () => {
    // SEO設定を保存（LocalStorageに保存）
    localStorage.setItem('seoSettings', JSON.stringify(seoData))
    alert('SEO設定を保存しました！')
    setShowSEOModal(false)
  }

  const handleExportData = () => {
    try {
      const dataToExport = {
        content: content,
        seoSettings: seoData,
        exportDate: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cms-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      alert('データをエクスポートしました！')
    } catch (error) {
      alert('エクスポートに失敗しました')
    }
  }

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string)
            if (importedData.content) {
              setContent(importedData.content)
              // ContentManagerを通じて保存
              ContentManagerEnhanced.saveContent(importedData.content)
            }
            if (importedData.seoSettings) {
              setSeoData(importedData.seoSettings)
              localStorage.setItem('seoSettings', JSON.stringify(importedData.seoSettings))
            }
            alert('データをインポートしました！')
            loadContent()
          } catch (error) {
            alert('インポートに失敗しました。ファイル形式を確認してください。')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleAddProduct = () => {
    setProductFormData({
      id: '',
      title: '',
      description: '',
      image: '',
      cta: '詳細を見る',
      reverse: false
    })
    setSelectedProductIndex(null)
    setEditingPage('add-product')
  }

  const handleEditProduct = (index: number) => {
    if (content && content.products[index]) {
      const product = content.products[index]
      setProductFormData({
        ...product,
        reverse: product.reverse || false  // undefinedの場合はfalseにする
      })
      setSelectedProductIndex(index)
      setEditingPage('edit-product')
    }
  }

  const handleDeleteProduct = async (index: number) => {
    if (!content || !confirm('この商品を削除しますか？')) return

    try {
      const updatedProducts = content.products.filter((_, i) => i !== index)
      const updatedContent = { ...content, products: updatedProducts }

      await ContentManagerEnhanced.saveContent(updatedContent)
      setContent(updatedContent)

      // リアルタイム更新イベントを発火
      window.dispatchEvent(new CustomEvent('content-updated', { detail: updatedContent }))

      alert('商品を削除しました')
    } catch (error) {
      console.error('商品削除エラー:', error)
      alert('削除に失敗しました')
    }
  }

  const handleSaveProduct = async () => {
    if (!content) return

    try {
      let updatedProducts = [...content.products]

      if (selectedProductIndex !== null) {
        // 編集の場合
        updatedProducts[selectedProductIndex] = productFormData
      } else {
        // 新規追加の場合
        if (updatedProducts.length >= 12) {
          alert('商品は最大12個まで登録できます')
          return
        }
        // IDが空の場合は自動生成
        if (!productFormData.id.trim()) {
          productFormData.id = `product-${Date.now()}`
        }
        updatedProducts.push(productFormData)
      }

      const updatedContent = { ...content, products: updatedProducts }

      console.log('商品保存前: 商品数:', updatedProducts.length)
      console.log('商品保存前: 商品一覧:', updatedProducts)

      await ContentManagerEnhanced.saveContent(updatedContent)
      setContent(updatedContent)

      console.log('商品保存後: イベント発火前:', updatedContent.products.length)
      // リアルタイム更新イベントを発火
      window.dispatchEvent(new CustomEvent('content-updated', { detail: updatedContent }))

      setEditingPage(null)
      setSelectedProductIndex(null)
      alert('商品を保存しました')
    } catch (error) {
      console.error('商品保存エラー:', error)
      alert('保存に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CMSサイトスタジオ</h1>
              <p className="text-sm text-gray-600">管理ダッシュボード</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 概要カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">総ページ数</h3>
            <p className="text-3xl font-bold text-blue-600">7</p>
            <p className="text-sm text-gray-600">メイン + 4つの専用ページ</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">商品・サービス</h3>
            <p className="text-3xl font-bold text-green-600">
              {content ? content.products.length : 0}
            </p>
            <p className="text-sm text-gray-600">アイテム</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">お知らせ</h3>
            <p className="text-3xl font-bold text-purple-600">
              {content ? content.news.length : 0}
            </p>
            <p className="text-sm text-gray-600">投稿</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">更新状況</h3>
            <p className="text-3xl font-bold text-stone-600">✓</p>
            <p className="text-sm text-gray-600">全ページ管理対応</p>
          </div>
        </div>

        {/* ページ管理メニュー */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">ページコンテンツ管理</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
              <h3 className="text-lg font-medium text-gray-900 mb-3">ホームページ</h3>
              <p className="text-gray-600 mb-4 text-sm">ヒーローセクション・商品・お知らせ</p>
              <button
                onClick={() => handleEditPage('home')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                編集する
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-stone-500">
              <h3 className="text-lg font-medium text-gray-900 mb-3">伝統ページ</h3>
              <p className="text-gray-600 mb-4 text-sm">伝統・技術・職人の心を編集</p>
              <button
                onClick={() => handleEditPage('tradition')}
                className="w-full bg-stone-600 text-white py-2 px-4 rounded-lg hover:bg-stone-700 transition-colors text-sm"
              >
                編集する
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
              <h3 className="text-lg font-medium text-gray-900 mb-3">会社概要</h3>
              <p className="text-gray-600 mb-4 text-sm">企業情報・沿革・代表メッセージ</p>
              <button
                onClick={() => handleEditPage('company')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                編集する
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
              <h3 className="text-lg font-medium text-gray-900 mb-3">お問い合わせ</h3>
              <p className="text-gray-600 mb-4 text-sm">連絡先・フォーム・FAQ</p>
              <button
                onClick={() => handleEditPage('contact')}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                編集する
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
              <h3 className="text-lg font-medium text-gray-900 mb-3">アクセス</h3>
              <p className="text-gray-600 mb-4 text-sm">所在地・交通・周辺施設</p>
              <button
                onClick={() => handleEditPage('access')}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                編集する
              </button>
            </div>
          </div>
        </div>

        {/* 商品管理メニュー */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">商品管理</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
              <h3 className="text-lg font-medium text-gray-900 mb-3">商品一覧</h3>
              <p className="text-gray-600 mb-4 text-sm">商品の表示・編集・削除</p>
              <button
                onClick={() => setEditingPage('products')}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                管理する
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-teal-500">
              <h3 className="text-lg font-medium text-gray-900 mb-3">新規商品追加</h3>
              <p className="text-gray-600 mb-4 text-sm">新しい商品を追加</p>
              <button
                onClick={handleAddProduct}
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors text-sm"
              >
                追加する
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-cyan-500">
              <h3 className="text-lg font-medium text-gray-900 mb-3">商品プレビュー</h3>
              <p className="text-gray-600 mb-4 text-sm">商品ページを確認</p>
              <button
                onClick={() => window.open('/products', '_blank')}
                className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
              >
                確認する
              </button>
            </div>
          </div>
        </div>

        {/* システム管理メニュー */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">システム管理</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">SEO設定</h3>
              <p className="text-gray-600 mb-4">メタタグとSEO最適化</p>
              <button
                onClick={handleSEOSettings}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                設定する
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">サイトプレビュー</h3>
              <p className="text-gray-600 mb-4">公開サイトをプレビュー</p>
              <button
                onClick={() => window.open('/', '_blank')}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                確認する
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">データ管理</h3>
              <p className="text-gray-600 mb-4">バックアップ・復元・リセット</p>
              <button
                onClick={handleDataManagement}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                管理する
              </button>
            </div>
          </div>
        </div>

        {/* システム情報とページ状況 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">システム情報</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">最終更新</span>
                <span className="text-gray-900 font-medium">{lastUpdated}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">データ保存先</span>
                <span className="text-gray-900 font-medium">LocalStorage + Firestore</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">システムバージョン</span>
                <span className="text-gray-900 font-medium">v1.1.0</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">管理対応ページ</span>
                <span className="text-gray-900 font-medium">7ページ完全対応</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ページ管理状況</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-800">ホームページ</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">管理対応</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <span className="text-sm font-medium text-stone-800">伝統ページ</span>
                <span className="text-xs text-stone-600 bg-stone-100 px-2 py-1 rounded">管理対応</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-800">会社概要</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">管理対応</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-800">お問い合わせ</span>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">管理対応</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-orange-800">アクセス</span>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">管理対応</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 編集モーダル */}
      {editingPage && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingPage === 'home' && 'ホームページ編集'}
                {editingPage === 'tradition' && '伝統ページ編集'}
                {editingPage === 'company' && '会社概要編集'}
                {editingPage === 'contact' && 'お問い合わせ編集'}
                {editingPage === 'access' && 'アクセス編集'}
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* 伝統ページ編集フォーム */}
              {editingPage === 'tradition' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ヒーロータイトル</label>
                    <input
                      type="text"
                      value={editData.heroTitle || ''}
                      onChange={(e) => setEditData({...editData, heroTitle: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ヒーローサブタイトル</label>
                    <textarea
                      value={editData.heroSubtitle || ''}
                      onChange={(e) => setEditData({...editData, heroSubtitle: e.target.value})}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">セクションタイトル</label>
                    <textarea
                      value={editData.sectionTitle || ''}
                      onChange={(e) => setEditData({...editData, sectionTitle: e.target.value})}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">最終メッセージ</label>
                    <textarea
                      value={editData.finalMessage || ''}
                      onChange={(e) => setEditData({...editData, finalMessage: e.target.value})}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* 会社概要編集フォーム */}
              {editingPage === 'company' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ヒーロータイトル</label>
                    <input
                      type="text"
                      value={editData.heroTitle || ''}
                      onChange={(e) => setEditData({...editData, heroTitle: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">会社名</label>
                    <input
                      type="text"
                      value={editData.companyName || ''}
                      onChange={(e) => setEditData({...editData, companyName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">設立年</label>
                      <input
                        type="text"
                        value={editData.establishedYear || ''}
                        onChange={(e) => setEditData({...editData, establishedYear: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">従業員数</label>
                      <input
                        type="text"
                        value={editData.employees || ''}
                        onChange={(e) => setEditData({...editData, employees: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">企業理念</label>
                    <textarea
                      value={editData.philosophy || ''}
                      onChange={(e) => setEditData({...editData, philosophy: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">代表メッセージ</label>
                    <textarea
                      value={editData.representativeMessage || ''}
                      onChange={(e) => setEditData({...editData, representativeMessage: e.target.value})}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* お問い合わせ編集フォーム */}
              {editingPage === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ヒーロータイトル</label>
                    <input
                      type="text"
                      value={editData.heroTitle || ''}
                      onChange={(e) => setEditData({...editData, heroTitle: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
                      <input
                        type="text"
                        value={editData.phone || ''}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">営業時間</label>
                      <input
                        type="text"
                        value={editData.phoneHours || ''}
                        onChange={(e) => setEditData({...editData, phoneHours: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">住所</label>
                    <textarea
                      value={editData.address || ''}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* アクセス編集フォーム */}
              {editingPage === 'access' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ヒーロータイトル</label>
                    <input
                      type="text"
                      value={editData.heroTitle || ''}
                      onChange={(e) => setEditData({...editData, heroTitle: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">住所</label>
                    <textarea
                      value={editData.address || ''}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
                      <input
                        type="text"
                        value={editData.phone || ''}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">営業時間</label>
                      <input
                        type="text"
                        value={editData.hours || ''}
                        onChange={(e) => setEditData({...editData, hours: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">休業日</label>
                    <input
                      type="text"
                      value={editData.holidays || ''}
                      onChange={(e) => setEditData({...editData, holidays: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* ホームページ編集フォーム */}
              {editingPage === 'home' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">基本ヒーロー設定</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ヒーロータイトル</label>
                        <input
                          type="text"
                          value={editData.hero?.title || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            hero: { ...editData.hero, title: e.target.value }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ヒーローサブタイトル</label>
                        <textarea
                          value={editData.hero?.subtitle || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            hero: { ...editData.hero, subtitle: e.target.value }
                          })}
                          rows={2}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CTAボタンテキスト</label>
                        <input
                          type="text"
                          value={editData.hero?.ctaText || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            hero: { ...editData.hero, ctaText: e.target.value }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-3">高級ヒーロー設定（HeroLuxury用）</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">メインタイトル（大きく表示）</label>
                        <input
                          type="text"
                          value={editData.hero?.luxuryTitle || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            hero: { ...editData.hero, luxuryTitle: e.target.value }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="梵天庵"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">サブタイトル</label>
                        <input
                          type="text"
                          value={editData.hero?.luxurySubtitle || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            hero: { ...editData.hero, luxurySubtitle: e.target.value }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="古き良き日本の心を、今に伝える"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">メッセージ1</label>
                        <input
                          type="text"
                          value={editData.hero?.luxuryMessage1 || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            hero: { ...editData.hero, luxuryMessage1: e.target.value }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="季節の移ろいを映す、繊細な和菓子"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">メッセージ2</label>
                        <input
                          type="text"
                          value={editData.hero?.luxuryMessage2 || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            hero: { ...editData.hero, luxuryMessage2: e.target.value }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="職人の技と心が織りなす、一期一会のおもてなし"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">商品・ニュース編集は個別管理画面で対応中</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEO設定モーダル */}
      {showSEOModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">SEO設定</h3>
              <button
                onClick={() => setShowSEOModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">サイトタイトル</label>
                <input
                  type="text"
                  value={seoData.title}
                  onChange={(e) => setSeoData({...seoData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="サイトのタイトル"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">メタディスクリプション</label>
                <textarea
                  value={seoData.description}
                  onChange={(e) => setSeoData({...seoData, description: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="サイトの説明文（160文字以内推奨）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">キーワード</label>
                <input
                  type="text"
                  value={seoData.keywords}
                  onChange={(e) => setSeoData({...seoData, keywords: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="キーワード（カンマ区切り）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OG画像URL</label>
                <input
                  type="text"
                  value={seoData.ogImage}
                  onChange={(e) => setSeoData({...seoData, ogImage: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="/images/og-image.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSEOModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveSEO}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 商品一覧管理モーダル */}
      {editingPage === 'products' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">商品一覧管理</h3>
              <button
                onClick={() => setEditingPage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content?.products.map((product, index) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="aspect-square bg-stone-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{product.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description?.split('\n')[0]}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(index)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(index)}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}

              {/* 新規追加カード（12個未満の場合） */}
              {content && content.products.length < 12 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px] hover:border-gray-400 transition-colors">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-4">新しい商品を追加</p>
                    <button
                      onClick={handleAddProduct}
                      className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      追加する
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                商品数: {content?.products.length || 0} / 12
              </p>
              <button
                onClick={() => setEditingPage(null)}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 商品追加・編集モーダル */}
      {(editingPage === 'add-product' || editingPage === 'edit-product') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingPage === 'add-product' ? '新規商品追加' : '商品編集'}
              </h3>
              <button
                onClick={() => setEditingPage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">商品名</label>
                <input
                  type="text"
                  value={productFormData.title}
                  onChange={(e) => setProductFormData({...productFormData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="商品名を入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">商品説明</label>
                <textarea
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="商品の詳細説明を入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">商品画像</label>
                <ImageUpload
                  value={productFormData.image}
                  onChange={(imageData) => setProductFormData({...productFormData, image: imageData})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTAテキスト</label>
                <input
                  type="text"
                  value={productFormData.cta}
                  onChange={(e) => setProductFormData({...productFormData, cta: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="詳細を見る"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">商品ID（自動生成されます）</label>
                <input
                  type="text"
                  value={productFormData.id}
                  onChange={(e) => setProductFormData({...productFormData, id: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="空白の場合、自動生成されます"
                />
                <p className="text-xs text-gray-500 mt-1">商品の一意識別子。空白の場合は自動で生成されます。</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reverse"
                  checked={productFormData.reverse}
                  onChange={(e) => setProductFormData({...productFormData, reverse: e.target.checked})}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="reverse" className="ml-2 block text-sm text-gray-700">
                  レイアウトを反転させる
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingPage(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                {editingPage === 'add-product' ? '追加する' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* データ管理モーダル */}
      {showDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">データ管理</h3>
              <button
                onClick={() => setShowDataModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">📦 データエクスポート</h4>
                <p className="text-sm text-blue-600 mb-3">全てのコンテンツとSEO設定をJSONファイルでダウンロード</p>
                <button
                  onClick={handleExportData}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  エクスポート
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">📥 データインポート</h4>
                <p className="text-sm text-green-600 mb-3">エクスポートしたJSONファイルから復元</p>
                <button
                  onClick={handleImportData}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  インポート
                </button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">🗑️ データリセット</h4>
                <p className="text-sm text-red-600 mb-3">全てのデータをデフォルトに戻します（取り消し不可）</p>
                <button
                  onClick={() => {
                    if (confirm('本当に全てのデータをリセットしますか？この操作は取り消せません。')) {
                      handleResetContent()
                      setShowDataModal(false)
                    }
                  }}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  リセット
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}