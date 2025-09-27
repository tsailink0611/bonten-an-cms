import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJp = Noto_Sans_JP({ subsets: ['latin'] })

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bonten-an.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: '梵天庵 - 伝統の和菓子',
    template: '%s | 梵天庵'
  },
  description: '季節の移ろいを表現した伝統の和菓子。職人の技と心が込められた逸品をお届けします。創業以来、変わらぬ味と品質でお客様に愛され続けています。',
  keywords: '和菓子,梵天庵,伝統,職人,季節,お菓子,どら焼き,最中,羊羹,大福,手作り,老舗',
  authors: [{ name: '梵天庵' }],
  creator: '梵天庵',
  publisher: '梵天庵',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '梵天庵 - 伝統の和菓子',
    description: '季節の移ろいを表現した伝統の和菓子。職人の技と心が込められた逸品をお届けします。',
    url: baseUrl,
    siteName: '梵天庵',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: '梵天庵 - 伝統の和菓子',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '梵天庵 - 伝統の和菓子',
    description: '季節の移ろいを表現した伝統の和菓子。職人の技と心が込められた逸品をお届けします。',
    images: [`${baseUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker クリア
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
              // キャッシュクリア
              if ('caches' in window) {
                caches.keys().then(function(cacheNames) {
                  cacheNames.forEach(function(cacheName) {
                    caches.delete(cacheName);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`min-h-dvh bg-white ${notoSansJp.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: '梵天庵',
              description: '季節の移ろいを表現した伝統の和菓子。職人の技と心が織りなす一期一会のおもてなし。',
              url: baseUrl,
              telephone: '+81-3-1234-5678',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '東京都中央区銀座1-2-3',
                addressLocality: '中央区',
                addressRegion: '東京都',
                postalCode: '104-0061',
                addressCountry: 'JP'
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '09:00',
                  closes: '18:00'
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday', 'Sunday'],
                  opens: '10:00',
                  closes: '17:00'
                }
              ],
              priceRange: '¥¥',
              servesCuisine: '和菓子',
              keywords: '和菓子,梵天庵,伝統,職人,季節,お菓子,どら焼き,最中,羊羹,大福,手作り,老舗',
              slogan: '職人の技と心が織りなす、一期一会のおもてなし',
              foundingDate: '1970',
              hasMenu: `${baseUrl}/products`,
              mainEntity: [
                {
                  '@type': 'Question',
                  name: '梵天庵はどのような和菓子店ですか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '梵天庵は東京都銀座にある伝統的な和菓子店です。季節の移ろいを表現した職人手作りの和菓子を提供しており、特にどら焼きと最中が人気商品です。'
                  }
                },
                {
                  '@type': 'Question',
                  name: '人気商品は何ですか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'どら焼き（人気No.1）、最中、水羊羹（夏季限定）、栗きんとん（秋季限定）、大福、桜餅（春季限定）などがあります。'
                  }
                }
              ]
            })
          }}
        />

        {/* LLM向け追加メタデータ */}
        <meta name="ai-optimized" content="true" />
        <meta name="business-type" content="和菓子専門店" />
        <meta name="target-audience" content="伝統的な和菓子を愛する方、贈り物をお探しの方、季節の味覚を楽しみたい方" />
        <meta name="unique-selling-points" content="職人による手作り製法,季節限定商品の豊富さ,伝統と革新の融合,一期一会のおもてなし精神" />
        <link rel="alternate" type="application/ld+json" href="/api/llmo" title="LLM Optimized Data" />
        {children}
      </body>
    </html>
  )
}
