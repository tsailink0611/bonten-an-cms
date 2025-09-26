// 拡張版コンテンツ管理システム - LocalStorage + Cloud Sync + Firestore連携

import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
import { firestore } from './firebase'
import { CloudSync } from './cloud-sync'

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundImage?: string;
  // HeroLuxury用の拡張フィールド
  luxuryTitle?: string;
  luxurySubtitle?: string;
  luxuryMessage1?: string;
  luxuryMessage2?: string;
}

export interface ProductContent {
  id: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  reverse?: boolean;
}

export interface NewsContent {
  id: string;
  title: string;
  date: string;
  summary: string;
  content?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
  slug?: string;
  author?: string;
  featuredImage?: string;
}

export interface TraditionContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  sectionDescription: string;
  sectionDetail: string;
  finalTitle: string;
  finalMessage: string;
}

export interface CompanyContent {
  heroTitle: string;
  heroSubtitle: string;
  companyName: string;
  establishedYear: string;
  employees: string;
  capital: string;
  headquarters: string;
  business: string;
  philosophy: string;
  representativeMessage: string;
  representativeName: string;
  timeline: Array<{
    year: string;
    event: string;
  }>;
}

export interface ContactContent {
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  phoneHours: string;
  email: string;
  address: string;
  nearestStation: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface AccessContent {
  heroTitle: string;
  heroSubtitle: string;
  address: string;
  phone: string;
  hours: string;
  holidays: string;
  access: Array<{
    method: string;
    description: string;
  }>;
  facilities: Array<{
    name: string;
    description: string;
  }>;
}

export interface SiteContent {
  hero: HeroContent;
  products: ProductContent[];
  news: NewsContent[];
  tradition: TraditionContent;
  company: CompanyContent;
  contact: ContactContent;
  access: AccessContent;
  lastUpdated: string;
  siteId?: string;
}

// 梵天庵用のデフォルトコンテンツ
export const defaultContent: SiteContent = {
  hero: {
    title: "茶寮 梵天庵",
    subtitle: "伝統の逸品\n心を込めた一期一会",
    ctaText: "",  // CTAボタンを非表示に
    // HeroLuxury用のテキスト
    luxuryTitle: "梵天庵",
    luxurySubtitle: "古き良き日本の心を、今に伝える",
    luxuryMessage1: "季節の移ろいを映す、繊細な和菓子",
    luxuryMessage2: "職人の技と心が織りなす、一期一会のおもてなし"
  },
  products: [
    {
      id: "sakura-mochi",
      title: "桜餅",
      description: `春の代表的な和菓子。関西風の道明寺粉を使用した上品な仕上がり。

桜の葉の塩気が餡の甘さを引き立て、季節の美しさを表現します。

3月から4月限定の特別な逸品です。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23ffb3d9'/%3E%3Ctext x='50%25' y='50%25' font-size='36' fill='%23d63384' text-anchor='middle' dy='0.3em'%3E桜餅%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: false
    },
    {
      id: "dorayaki",
      title: "どら焼き",
      description: `ふんわりとした生地に粒あんをたっぷりと挟んだ定番商品。

職人が一枚一枚丁寧に焼き上げる生地は、しっとりとした食感。

老若男女問わず愛される梵天庵の人気No.1商品です。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23ffc107'/%3E%3Ctext x='50%25' y='50%25' font-size='32' fill='%23856404' text-anchor='middle' dy='0.3em'%3Eどら焼き%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: true
    },
    {
      id: "mizu-yokan",
      title: "水羊羹",
      description: `夏の涼を運ぶ透明感のある羊羹。つるりとした喉越しが特徴。

厳選した寒天と小豆で作る上品な甘さは、暑い季節にぴったり。

冷やしてお召し上がりいただくと一層美味しさが引き立ちます。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%2320c997'/%3E%3Ctext x='50%25' y='50%25' font-size='30' fill='%23146c43' text-anchor='middle' dy='0.3em'%3E水羊羹%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: false
    },
    {
      id: "kuri-kinton",
      title: "栗きんとん",
      description: `秋の味覚、栗を贅沢に使用した季節限定の和菓子。

丁寧に裏ごしした栗と上質な砂糖のみで仕上げる究極のシンプルさ。

口の中でほろりと崩れる食感と栗本来の甘さをお楽しみください。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23fd7e14'/%3E%3Ctext x='50%25' y='50%25' font-size='28' fill='%23a0440e' text-anchor='middle' dy='0.3em'%3E栗きんとん%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: true
    },
    {
      id: "daifuku",
      title: "大福",
      description: `もちもちの求肥にたっぷりの餡を包んだ伝統的な和菓子。

つきたてのようなお餅の食感と、甘さ控えめの粒あんが絶妙。

当日限りの美味しさを是非お楽しみください。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' font-size='36' fill='%23495057' text-anchor='middle' dy='0.3em'%3E大福%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: false
    },
    {
      id: "kashiwa-mochi",
      title: "柏餅",
      description: `端午の節句に欠かせない縁起の良い和菓子。

柏の葉に包まれた上新粉のお餅は、優しい甘さのこしあん入り。

5月限定の季節商品として、ご家族でお楽しみいただけます。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%2398fb98'/%3E%3Ctext x='50%25' y='50%25' font-size='32' fill='%232d5a27' text-anchor='middle' dy='0.3em'%3E柏餅%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: true
    },
    {
      id: "monaka",
      title: "最中",
      description: `香ばしい最中の皮に餡をたっぷりと詰めた上品な和菓子。

パリッとした食感の皮と、なめらかな餡のコントラストが楽しめます。

贈り物にも最適な、梵天庵を代表する銘菓です。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23ddd6fe'/%3E%3Ctext x='50%25' y='50%25' font-size='36' fill='%235b21b6' text-anchor='middle' dy='0.3em'%3E最中%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: false
    },
    {
      id: "taiyaki",
      title: "鯛焼き",
      description: `愛らしい鯛の形をした、昔ながらの人気和菓子。

一匹焼きで作る薄皮にぎっしりと詰まった餡が自慢。

焼きたての温かさと香ばしさをお楽しみください。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23fbbf24'/%3E%3Ctext x='50%25' y='50%25' font-size='32' fill='%23b45309' text-anchor='middle' dy='0.3em'%3E鯛焼き%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: true
    },
    {
      id: "warabi-mochi",
      title: "わらび餅",
      description: `プルプルとした食感が特徴的な夏の和菓子。

本わらび粉を使用した贅沢な仕上がりで、上質なきな粉をたっぷりと。

冷たく冷やして召し上がる涼感たっぷりの逸品です。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23c2f0c2'/%3E%3Ctext x='50%25' y='50%25' font-size='28' fill='%23166534' text-anchor='middle' dy='0.3em'%3Eわらび餅%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: false
    },
    {
      id: "imagawayaki",
      title: "今川焼き",
      description: `外はカリッと中はふんわりとした生地の中に餡がたっぷり。

焼きたてのアツアツを頬張る幸せをお届けします。

午後のおやつや小腹が空いた時に最適な一品です。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f59e0b'/%3E%3Ctext x='50%25' y='50%25' font-size='26' fill='%2392400e' text-anchor='middle' dy='0.3em'%3E今川焼き%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: true
    },
    {
      id: "zenzai",
      title: "ぜんざい",
      description: `厳選した小豆をじっくりと炊き上げた温かいスイーツ。

ふっくらとした白玉と小豆の優しい甘さが心も体も温めます。

寒い季節にほっと一息つける、心温まる逸品です。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23dc2626'/%3E%3Ctext x='50%25' y='50%25' font-size='32' fill='%23fecaca' text-anchor='middle' dy='0.3em'%3Eぜんざい%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: false
    },
    {
      id: "kuzu-mochi",
      title: "葛餅",
      description: `滑らかで上品な食感の葛粉を使用した夏限定の和菓子。

透明感のある美しい見た目と、つるりとした喉越しが特徴。

黒蜜ときな粉でお召し上がりいただく涼やかな逸品です。`,
      image: "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23e0f2fe'/%3E%3Ctext x='50%25' y='50%25' font-size='32' fill='%23164e63' text-anchor='middle' dy='0.3em'%3E葛餅%3C/text%3E%3C/svg%3E",
      cta: "詳細を見る",
      reverse: true
    }
  ],
  news: [
    {
      id: "news1",
      title: "梵天庵 v1.0 リリース",
      date: "2024.09.21",
      summary: "ヘッドレスCMSシステムの初回安定版をリリースしました。"
    },
    {
      id: "news2",
      title: "新テンプレート追加",
      date: "2024.09.20",
      summary: "ビジネス向けテンプレートを新たに追加いたしました。"
    },
    {
      id: "news3",
      title: "パフォーマンス向上アップデート",
      date: "2024.09.19",
      summary: "サイト表示速度を30%向上させるアップデートを実施。"
    }
  ],
  tradition: {
    heroTitle: "伝統",
    heroSubtitle: "受け継がれる技と心\n時を超えて愛される味わい",
    sectionTitle: "四季を纏う\n職人の技",
    sectionDescription: "創業以来変わらぬ製法で、一つひとつ丁寧に仕上げる和菓子。季節の移ろいを表現し、素材の持つ本来の美味しさを大切にしています。",
    sectionDetail: "熟練の職人が長年培った技術と感性により、伝統の味を現代に受け継いでいます。",
    finalTitle: "伝統は、未来への贈り物",
    finalMessage: "私たちは、先人から受け継いだ技術と心を大切にしながら、次世代に向けて新しい価値を創造し続けます。伝統とは、過去の遺産ではなく、未来への約束なのです。"
  },
  company: {
    heroTitle: "会社概要",
    heroSubtitle: "私たちの歩みと理念\n確かな実績と未来への想い",
    companyName: "株式会社梵天庵",
    establishedYear: "1985年",
    employees: "120名",
    capital: "5,000万円",
    headquarters: "東京都千代田区千代田1-1-1",
    business: "和菓子の製造・販売、伝統工芸品の企画・開発",
    philosophy: "「伝統を守り、革新を創る」私たちは長年培った技術を大切にしながら、時代のニーズに応える新しい価値を提供し続けます。",
    representativeMessage: "創業以来、変わらぬ想いを胸に歩み続けてまいりました。これからも皆様に愛される企業として、伝統と革新の調和を追求してまいります。",
    representativeName: "代表取締役 田中 太郎",
    timeline: [
      { year: "1985", event: "東京都千代田区にて創業" },
      { year: "1992", event: "本社工場を拡張、生産体制を強化" },
      { year: "2001", event: "伝統工芸品事業に参入" },
      { year: "2010", event: "オンライン販売を開始" },
      { year: "2020", event: "サステナブル経営に本格転換" }
    ]
  },
  contact: {
    heroTitle: "お問い合わせ",
    heroSubtitle: "ご質問・ご相談はお気軽にお寄せください\n専門スタッフが丁寧にお答えいたします",
    phone: "03-1234-5678",
    phoneHours: "平日 9:00-18:00",
    email: "info@cms-site-studio.com",
    address: "〒100-0001\n東京都千代田区千代田1-1-1\nCMSビル 5F",
    nearestStation: "JR東京駅 徒歩5分\n地下鉄大手町駅 徒歩3分",
    faqs: [
      {
        question: "サポート体制について教えてください",
        answer: "専属カスタマーサクセスチームが導入から運用まで全面的にサポートいたします。"
      },
      {
        question: "料金プランについて",
        answer: "用途に応じた柔軟な料金プランをご用意しています。詳細はお問い合わせください。"
      },
      {
        question: "無料トライアルはありますか？",
        answer: "14日間の無料トライアルをご利用いただけます。クレジットカード登録は不要です。"
      }
    ]
  },
  access: {
    heroTitle: "アクセス",
    heroSubtitle: "ご来社をお待ちしております\n詳しいアクセス方法をご案内いたします",
    address: "〒100-0001\n東京都千代田区千代田1-1-1\nCMSビル 5F",
    phone: "03-1234-5678",
    hours: "平日 9:00-18:00",
    holidays: "土日祝日、年末年始",
    access: [
      {
        method: "JR東京駅から",
        description: "丸の内中央口より徒歩5分。皇居方面へ向かい、内堀通り沿いのCMSビルです。"
      },
      {
        method: "地下鉄大手町駅から",
        description: "C1出口より徒歩3分。地上に出て右折、最初の角を左折してすぐです。"
      },
      {
        method: "お車でお越しの場合",
        description: "首都高速都心環状線「竹橋」出口より約3分。近隣にコインパーキングがございます。"
      }
    ],
    facilities: [
      {
        name: "1階エントランス",
        description: "受付にてお名前をお伝えください。エレベーターで5階までお上がりください。"
      },
      {
        name: "周辺施設",
        description: "皇居東御苑まで徒歩2分。お打ち合わせ前後の散策にもおすすめです。"
      },
      {
        name: "駐車場",
        description: "ビル専用駐車場はございません。近隣のコインパーキングをご利用ください。"
      }
    ]
  },
  lastUpdated: new Date().toISOString()
};

// 拡張版コンテンツ管理クラス
export class ContentManagerEnhanced {
  private static STORAGE_KEY = 'cms-site-studio-content';

  // コンテンツを取得 (Cloud Sync優先、LocalStorageフォールバック)
  static async getContent(siteId?: string): Promise<SiteContent> {
    // ブラウザ環境でない場合はデフォルトコンテンツを返す
    if (typeof window === 'undefined') {
      return defaultContent;
    }

    try {
      console.log('ContentManager: データ読み込み開始');

      // 1. Cloud Syncから最新データを取得
      const cloudContent = await CloudSync.getFromCloud();
      if (cloudContent) {
        console.log('✅ ContentManager: Cloud Syncから読み込み成功 - 商品数:', cloudContent?.products?.length);
        console.log('✅ ContentManager: 読み込んだ商品:', cloudContent?.products?.map((p: ProductContent) => p.title));
        // LocalStorageも更新して次回の高速化
        this.saveToLocal(cloudContent);
        return cloudContent;
      } else {
        console.log('⚠️ ContentManager: Cloud Syncからデータなし、LocalStorageを確認');
      }

      // 2. LocalStorageから取得を試みる（フォールバック）
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const localContent = JSON.parse(stored);
        console.log('ContentManager: LocalStorageから読み込み（フォールバック） - 商品数:', localContent?.products?.length);

        // siteIdが指定されている場合は、Firestoreからも取得して比較
        if (siteId) {
          const firestoreContent = await this.getFromFirestore(siteId);
          if (firestoreContent && new Date(firestoreContent.lastUpdated) > new Date(localContent.lastUpdated)) {
            // Firestoreの方が新しい場合は、LocalStorageを更新
            this.saveToLocal(firestoreContent);
            return firestoreContent;
          }
        }

        return localContent;
      }

      // 3. LocalStorageにない場合、Firestoreから取得
      if (siteId) {
        const firestoreContent = await this.getFromFirestore(siteId);
        if (firestoreContent) {
          this.saveToLocal(firestoreContent);
          return firestoreContent;
        }
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }

    // 4. どこからも取得できない場合はデフォルトを返す
    return defaultContent;
  }

  // コンテンツを保存 (Cloud Sync + LocalStorage + Firestore)
  static async saveContent(content: SiteContent, siteId?: string): Promise<void> {
    content.lastUpdated = new Date().toISOString();
    console.log('🚀 ContentManager: 保存開始 - 商品数:', content.products.length);
    console.log('🚀 ContentManager: 保存する商品:', content.products.map((p: ProductContent) => p.title));

    // 1. Cloud Syncに保存（最優先）
    console.log('📡 Cloud Syncへの保存を試行中...');
    const cloudSaved = await CloudSync.saveToCloud(content);
    if (cloudSaved) {
      console.log('✅ ContentManager: Cloud Sync保存完了');
    } else {
      console.error('❌ ContentManager: Cloud Sync保存失敗、LocalStorageのみ使用');
    }

    // 2. LocalStorageに保存
    this.saveToLocal(content);
    console.log('ContentManager: LocalStorage保存完了');

    // 3. Firestoreに保存 (siteIdが指定されている場合)
    if (siteId) {
      await this.saveToFirestore(content, siteId);
    }

    // リアルタイム更新イベントを発火
    this.dispatchUpdateEvent(content);
    console.log('ContentManager: 保存処理完了');
  }

  // LocalStorageに保存
  private static saveToLocal(content: SiteContent): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(content));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Firestoreから取得
  private static async getFromFirestore(siteId: string): Promise<SiteContent | null> {
    try {
      const contentRef = firestore ? doc(firestore, 'content', siteId) : null;
      const contentSnap = contentRef ? await getDoc(contentRef) : null;

      if (contentSnap?.exists()) {
        return contentSnap.data() as SiteContent;
      }
    } catch (error) {
      console.error('Failed to load from Firestore:', error);
    }
    return null;
  }

  // Firestoreに保存
  private static async saveToFirestore(content: SiteContent, siteId: string): Promise<void> {
    try {
    if (!firestore) {
      console.log("Firestore not available");
      return;
    }
      const contentRef = doc(firestore, 'content', siteId);
      content.siteId = siteId;
      await setDoc(contentRef, content);
    } catch (error) {
      console.error('Failed to save to Firestore:', error);
      throw error;
    }
  }

  // リアルタイム更新イベントを発火
  private static dispatchUpdateEvent(content: SiteContent): void {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(new CustomEvent('content-updated', {
      detail: content
    }));
  }

  // Firestoreリアルタイム監視を開始
  static subscribeToUpdates(siteId: string, callback: (content: SiteContent) => void) {
    if (typeof window === 'undefined') return () => {};
    if (!firestore) {
      return () => {};
    }

    const contentRef = doc(firestore, 'content', siteId);

    return onSnapshot(contentRef, (doc) => {
      if (doc.exists()) {
        const content = doc.data() as SiteContent;
        this.saveToLocal(content); // LocalStorageも同期
        callback(content);
      }
    });
  }

  // 初期データリセット
  static async resetToDefault(siteId?: string): Promise<void> {
    await this.saveContent(defaultContent, siteId);
  }

  // ヒーローコンテンツ更新
  static async updateHero(hero: HeroContent, siteId?: string): Promise<void> {
    const current = await this.getContent(siteId);
    current.hero = hero;
    await this.saveContent(current, siteId);
  }

  // 商品更新
  static async updateProduct(productId: string, product: ProductContent, siteId?: string): Promise<void> {
    const current = await this.getContent(siteId);
    const index = current.products.findIndex(p => p.id === productId);
    if (index >= 0) {
      current.products[index] = product;
      await this.saveContent(current, siteId);
    }
  }

  // 商品追加
  static async addProduct(product: ProductContent, siteId?: string): Promise<void> {
    const current = await this.getContent(siteId);
    current.products.push(product);
    await this.saveContent(current, siteId);
  }

  // 商品削除
  static async removeProduct(productId: string, siteId?: string): Promise<void> {
    const current = await this.getContent(siteId);
    current.products = current.products.filter(p => p.id !== productId);
    await this.saveContent(current, siteId);
  }

  // ニュース更新
  static async updateNews(news: NewsContent[], siteId?: string): Promise<void> {
    const current = await this.getContent(siteId);
    current.news = news;
    await this.saveContent(current, siteId);
  }

  // 伝統ページ更新
  static async updateTradition(tradition: TraditionContent, siteId?: string): Promise<void> {
    const current = await this.getContent(siteId);
    current.tradition = tradition;
    await this.saveContent(current, siteId);
  }

  // 会社概要ページ更新
  static async updateCompany(company: CompanyContent, siteId?: string): Promise<void> {
    const current = await this.getContent(siteId);
    current.company = company;
    await this.saveContent(current, siteId);
  }

  // お問い合わせページ更新
  static async updateContact(contact: ContactContent, siteId?: string): Promise<void> {
    const current = await this.getContent(siteId);
    current.contact = contact;
    await this.saveContent(current, siteId);
  }

  // アクセスページ更新
  static async updateAccess(access: AccessContent, siteId?: string): Promise<void> {
    const current = await this.getContent(siteId);
    current.access = access;
    await this.saveContent(current, siteId);
  }
}