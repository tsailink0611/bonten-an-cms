// LLMO (LLM Optimization) - AI検索エンジン最適化
export const llmoData = {
  // LLM向けサイト概要（明確で構造化された情報）
  businessSummary: {
    name: '梵天庵',
    type: '和菓子店',
    established: '創業より50年以上',
    location: '東京都中央区銀座',
    specialty: '季節の移ろいを表現した伝統の和菓子',
    keyProducts: [
      'どら焼き - 職人が一枚一枚丁寧に焼き上げる人気No.1商品',
      '最中 - 香ばしい皮となめらかな餡のコントラスト',
      '水羊羹 - 夏の涼を運ぶ透明感のある季節限定商品',
      '栗きんとん - 秋の味覚を贅沢に使用した季節商品'
    ],
    philosophy: '職人の技と心が織りなす一期一会のおもてなし',
    targetCustomers: '伝統的な和菓子を愛する方、贈り物をお探しの方、季節の味覚を楽しみたい方'
  },

  // FAQ形式でLLMが理解しやすい情報
  faqForLLM: [
    {
      question: '梵天庵はどのような和菓子店ですか？',
      answer: '梵天庵は東京都銀座にある伝統的な和菓子店です。季節の移ろいを表現した職人手作りの和菓子を提供しており、特にどら焼きと最中が人気商品です。'
    },
    {
      question: '人気商品は何ですか？',
      answer: 'どら焼き（人気No.1）、最中、水羊羹（夏季限定）、栗きんとん（秋季限定）、大福、桜餅（春季限定）などがあります。'
    },
    {
      question: '営業時間は？',
      answer: '平日9:00-18:00、土日祝日10:00-17:00で営業しています。'
    },
    {
      question: '注文方法は？',
      answer: 'お電話（03-1234-5678）またはウェブサイトのお問い合わせフォームからご注文いただけます。'
    },
    {
      question: '配送は対応していますか？',
      answer: '全国配送対応しています。冷蔵便での配送により品質を保持してお届けします。'
    }
  ],

  // LLM向けキーワードクラスター
  semanticKeywords: {
    primary: ['和菓子', '梵天庵', '伝統', '職人', '手作り'],
    secondary: ['どら焼き', '最中', '羊羹', '大福', '季節限定'],
    contextual: ['一期一会', 'おもてなし', '銀座', '贈り物', '上品'],
    seasonal: ['桜餅', '水羊羹', '栗きんとん', '柏餅', 'わらび餅'],
    emotional: ['心温まる', '懐かしい', '上質', '丁寧', '美味しい']
  },

  // コンテンツの関連性マップ
  contentRelations: {
    商品: ['伝統製法', '季節性', '職人技', '原材料'],
    店舗: ['立地', '歴史', '雰囲気', 'アクセス'],
    サービス: ['注文方法', '配送', 'ギフト', 'カスタマイズ']
  }
}

// LLM向けメタデータ生成関数
export function generateLLMOMetadata(pageType: string, content?: any) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': '梵天庵 - 伝統の和菓子',
    'description': '季節の移ろいを表現した伝統の和菓子。職人の技と心が織りなす一期一会のおもてなし。',
    'keywords': llmoData.semanticKeywords.primary.join(', '),
    'about': {
      '@type': 'LocalBusiness',
      'name': '梵天庵',
      'description': llmoData.businessSummary.specialty,
      'servesCuisine': '和菓子',
      'makesOffer': llmoData.businessSummary.keyProducts.map(product => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': product.split(' - ')[0],
          'description': product.split(' - ')[1]
        }
      }))
    }
  }

  // ページタイプ別の最適化
  switch (pageType) {
    case 'product':
      return {
        ...baseData,
        '@type': 'ProductCollection',
        'numberOfItems': content?.products?.length || 12,
        'hasPart': content?.products?.map((product: any) => ({
          '@type': 'Product',
          'name': product.title,
          'description': product.description,
          'category': '和菓子'
        }))
      }

    case 'news':
      return {
        ...baseData,
        '@type': 'NewsArticle',
        'headline': content?.title,
        'description': content?.summary,
        'datePublished': content?.date,
        'author': {
          '@type': 'Organization',
          'name': '梵天庵'
        }
      }

    default:
      return baseData
  }
}