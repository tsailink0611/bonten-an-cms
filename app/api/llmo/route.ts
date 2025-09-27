import { NextRequest, NextResponse } from 'next/server'
import { ContentManagerEnhanced } from '@/lib/content-manager-enhanced'
import { llmoData } from '@/app/llmo-data'

// LLM向け構造化データAPI
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const format = url.searchParams.get('format') || 'json'

  try {
    const content = await ContentManagerEnhanced.getContent()

    // LLM向けに最適化された構造化データ
    const llmoResponse = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': '梵天庵',
      'description': '東京銀座の伝統和菓子店。季節の移ろいを表現した職人手作りの和菓子を提供。',

      // ビジネス基本情報
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '東京都中央区銀座1-2-3',
        'addressLocality': '中央区',
        'addressRegion': '東京都',
        'postalCode': '104-0061',
        'addressCountry': 'JP'
      },

      'telephone': '+81-3-1234-5678',
      'url': process.env.NEXT_PUBLIC_BASE_URL || 'https://bonten-an.vercel.app',
      'priceRange': '¥¥',
      'servesCuisine': '和菓子',

      // 営業時間
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '09:00',
          'closes': '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Saturday', 'Sunday'],
          'opens': '10:00',
          'closes': '17:00'
        }
      ],

      // 商品情報（LLM向けに詳細化）
      'makesOffer': content.products.map(product => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': product.title,
          'description': product.description,
          'category': '和菓子',
          'brand': {
            '@type': 'Brand',
            'name': '梵天庵'
          }
        },
        'availability': 'https://schema.org/InStock'
      })),

      // ニュース・ブログ情報
      'blogPosts': content.news.filter(news => news.published !== false).map(news => ({
        '@type': 'BlogPosting',
        'headline': news.title,
        'description': news.summary,
        'datePublished': news.date,
        'author': {
          '@type': 'Organization',
          'name': '梵天庵'
        },
        'publisher': {
          '@type': 'Organization',
          'name': '梵天庵'
        }
      })),

      // LLM向けFAQ
      'mainEntity': llmoData.faqForLLM.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      })),

      // セマンティックキーワード
      'keywords': Object.values(llmoData.semanticKeywords).flat().join(', '),

      // ビジネス特徴
      'speciality': llmoData.businessSummary.specialty,
      'foundingDate': '1970',
      'slogan': '職人の技と心が織りなす、一期一会のおもてなし',

      // AI向け追加情報
      'aiOptimizedData': {
        'businessType': '和菓子専門店',
        'targetAudience': llmoData.businessSummary.targetCustomers,
        'uniqueSellingPoints': [
          '職人による手作り製法',
          '季節限定商品の豊富さ',
          '伝統と革新の融合',
          '一期一会のおもてなし精神'
        ],
        'seasonalProducts': {
          '春': ['桜餅', '柏餅'],
          '夏': ['水羊羹', 'わらび餅'],
          '秋': ['栗きんとん'],
          '冬': ['ぜんざい']
        }
      }
    }

    // フォーマット別レスポンス
    if (format === 'text') {
      // LLM向けプレーンテキスト
      const textResponse = `
梵天庵について:
${llmoData.businessSummary.specialty}

主要商品:
${llmoData.businessSummary.keyProducts.join('\n')}

よくある質問:
${llmoData.faqForLLM.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

営業時間: 平日9:00-18:00、土日祝日10:00-17:00
所在地: 東京都中央区銀座1-2-3
電話番号: 03-1234-5678
      `.trim()

      return new NextResponse(textResponse, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    }

    return NextResponse.json(llmoResponse, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // 1時間キャッシュ
      }
    })

  } catch (error) {
    console.error('LLMO API error:', error)
    return NextResponse.json({ error: 'Failed to generate LLMO data' }, { status: 500 })
  }
}