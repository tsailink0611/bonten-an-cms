'use client'

import { useEffect, useState } from 'react'
import { ContentManagerEnhanced, type HeroContent } from '@/lib/content-manager-enhanced'

interface HeroLuxuryProps {
  title: string
  subtitle: string
}

export default function HeroLuxury({ title, subtitle }: HeroLuxuryProps) {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [mounted, setMounted] = useState(false)
  const [bgAnimationStarted, setBgAnimationStarted] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showLine, setShowLine] = useState(false)
  const [showMessage1, setShowMessage1] = useState(false)
  const [showMessage2, setShowMessage2] = useState(false)

  useEffect(() => {
    setMounted(true)

    // CMSデータを読み込み
    const loadHeroContent = async () => {
      try {
        const content = await ContentManagerEnhanced.getContent()
        setHeroContent(content.hero)
      } catch (error) {
        console.error('Hero content loading error:', error)
      }
    }

    loadHeroContent()

    // リアルタイム更新を監視
    const handleContentUpdate = (event: CustomEvent) => {
      setHeroContent(event.detail.hero)
    }

    window.addEventListener('content-updated', handleContentUpdate as EventListener)

    // より洗練された段階的アニメーション開始
    const timer0 = setTimeout(() => setBgAnimationStarted(true), 300)
    const timer1 = setTimeout(() => setShowTitle(true), 1000)
    const timer2 = setTimeout(() => setShowSubtitle(true), 3500)
    const timer3 = setTimeout(() => setShowLine(true), 5500)
    const timer4 = setTimeout(() => setShowMessage1(true), 7000)
    const timer5 = setTimeout(() => setShowMessage2(true), 9000)

    return () => {
      window.removeEventListener('content-updated', handleContentUpdate as EventListener)
      clearTimeout(timer0)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [])

  if (!mounted) return null

  // CMSデータから取得、フォールバック付き
  const titleChars = (heroContent?.luxuryTitle || "梵天庵").split('')
  const subtitleText = heroContent?.luxurySubtitle || "古き良き日本の心を、今に伝える"
  const message1Text = heroContent?.luxuryMessage1 || "季節の移ろいを映す、繊細な和菓子"
  const message2Text = heroContent?.luxuryMessage2 || "職人の技と心が織りなす、一期一会のおもてなし"

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 洗練されたモダン背景 */}
      <div className="absolute inset-0">
        {/* ベースグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-gray-800"></div>

        {/* 動的で洗練された背景エフェクト */}
        <div className={`absolute inset-0 transition-opacity duration-4000 ${bgAnimationStarted ? 'opacity-100' : 'opacity-0'}`}>
          {/* 複数の大きな波紋エフェクト */}
          <div
            className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-gradient-radial from-slate-600/12 via-slate-500/6 to-transparent"
            style={{ animation: 'modernRipple1 6s ease-in-out infinite' }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-gradient-radial from-gray-600/10 via-gray-500/5 to-transparent"
            style={{ animation: 'modernRipple2 8s ease-in-out infinite 1s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-gradient-radial from-slate-500/8 via-slate-400/4 to-transparent"
            style={{ animation: 'modernRipple3 10s ease-in-out infinite 2s' }}
          ></div>

          {/* 明確に見える桜の花びらエフェクト */}
          <div
            className="absolute top-1/4 left-1/4 w-8 h-8 bg-pink-200/60 rounded-full"
            style={{ animation: 'gentleDrift1 3s ease-in-out infinite' }}
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-7 h-7 bg-pink-100/55 rounded-full"
            style={{ animation: 'gentleDrift2 3.5s ease-in-out infinite 0.5s' }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/3 w-9 h-9 bg-pink-300/50 rounded-full"
            style={{ animation: 'gentleDrift3 4s ease-in-out infinite 1s' }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-pink-200/55 rounded-full"
            style={{ animation: 'gentleDrift4 3.2s ease-in-out infinite 0.3s' }}
          ></div>
          <div
            className="absolute top-1/6 left-1/2 w-7 h-7 bg-pink-100/50 rounded-full"
            style={{ animation: 'gentleDrift1 3.8s ease-in-out infinite 1.5s' }}
          ></div>
          <div
            className="absolute bottom-1/5 right-1/2 w-8 h-8 bg-pink-300/45 rounded-full"
            style={{ animation: 'gentleDrift2 4.2s ease-in-out infinite 2s' }}
          ></div>

          {/* 明確に見える金粉エフェクト */}
          <div
            className="absolute top-1/5 left-1/5 w-5 h-5 bg-yellow-300/70 rounded-full"
            style={{ animation: 'shimmer1 3s ease-in-out infinite' }}
          ></div>
          <div
            className="absolute top-3/5 right-1/5 w-4 h-4 bg-yellow-200/65 rounded-full"
            style={{ animation: 'shimmer2 3.5s ease-in-out infinite 0.5s' }}
          ></div>
          <div
            className="absolute bottom-1/6 left-1/3 w-4 h-4 bg-yellow-400/60 rounded-full"
            style={{ animation: 'shimmer1 4s ease-in-out infinite 1s' }}
          ></div>
          <div
            className="absolute top-2/3 right-1/3 w-5 h-5 bg-yellow-300/55 rounded-full"
            style={{ animation: 'shimmer2 3.2s ease-in-out infinite 0.3s' }}
          ></div>

          {/* より多くの浮遊幾何学要素 */}
          <div
            className="absolute top-1/5 left-1/6 w-4 h-4 bg-slate-400/20 rotate-45"
            style={{ animation: 'floatGeometric1 8s ease-in-out infinite' }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/5 w-6 h-6 bg-gray-400/16 rounded-full"
            style={{ animation: 'floatGeometric2 10s ease-in-out infinite 2s' }}
          ></div>
          <div
            className="absolute top-2/3 left-1/2 w-2 h-16 bg-slate-500/12"
            style={{ animation: 'floatGeometric3 12s ease-in-out infinite 4s' }}
          ></div>
          <div
            className="absolute top-1/6 right-1/4 w-3 h-3 bg-slate-300/18"
            style={{ animation: 'floatGeometric4 9s ease-in-out infinite 1s' }}
          ></div>
          <div
            className="absolute bottom-1/5 left-1/3 w-5 h-5 bg-gray-300/14 rotate-12"
            style={{ animation: 'floatGeometric5 11s ease-in-out infinite 5s' }}
          ></div>
          <div
            className="absolute top-3/4 right-1/6 w-1 h-12 bg-slate-400/10"
            style={{ animation: 'floatGeometric6 13s ease-in-out infinite 6s' }}
          ></div>

          {/* 新しい動的エフェクト - 螺旋状の要素 */}
          <div
            className="absolute top-1/3 left-1/5 w-32 h-32 border border-slate-500/8 rounded-full"
            style={{ animation: 'spiralRotate1 25s linear infinite' }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/3 w-24 h-24 border border-gray-500/6 rounded-full"
            style={{ animation: 'spiralRotate2 30s linear infinite 8s' }}
          ></div>
        </div>

        {/* 緩やかな霧のような背景エフェクト */}
        <div className={`absolute inset-0 transition-opacity duration-6000 ${bgAnimationStarted ? 'opacity-40' : 'opacity-0'}`}>
          {/* 大きな霧のような雲 */}
          <div
            className="absolute top-1/6 left-1/5 w-96 h-48 bg-gradient-to-r from-slate-500/8 via-slate-400/12 to-transparent rounded-full blur-3xl"
            style={{ animation: 'gentleFloat1 20s ease-in-out infinite' }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/6 w-80 h-40 bg-gradient-to-l from-gray-500/6 via-gray-400/10 to-transparent rounded-full blur-3xl"
            style={{ animation: 'gentleFloat2 25s ease-in-out infinite 5s' }}
          ></div>
          <div
            className="absolute top-2/3 left-2/5 w-64 h-32 bg-gradient-to-r from-slate-600/5 via-slate-500/8 to-transparent rounded-full blur-3xl"
            style={{ animation: 'gentleFloat3 18s ease-in-out infinite 10s' }}
          ></div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
        {/* メインタイトル - 梵天庵 (洗練された1文字ずつアニメーション) */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-thin tracking-[0.25em] text-slate-100 mb-2">
            {titleChars.map((char, index) => (
              <span
                key={index}
                className={`inline-block transition-all ease-out transform ${
                  showTitle
                    ? 'opacity-100 translate-y-0 scale-100 blur-0'
                    : 'opacity-0 translate-y-12 scale-75 blur-sm'
                }`}
                style={{
                  transitionDuration: '1.8s',
                  transitionDelay: showTitle ? `${index * 0.6}s` : '0s',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  filter: showTitle ? 'drop-shadow(0 6px 25px rgba(148, 163, 184, 0.25))' : 'none',
                  textShadow: showTitle ? '0 0 20px rgba(148, 163, 184, 0.2), 0 0 40px rgba(148, 163, 184, 0.1)' : 'none',
                  transform: showTitle
                    ? `translateY(0px) scale(1) rotateX(0deg)`
                    : `translateY(12px) scale(0.75) rotateX(10deg)`
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* サブタイトル (洗練された文字表示) */}
        <div className="mb-8">
          <p className="text-lg md:text-xl lg:text-2xl font-light tracking-[0.2em] text-slate-300/90">
            {subtitleText.split('').map((char, index) => (
              <span
                key={index}
                className={`inline-block transition-all ease-out transform ${
                  showSubtitle
                    ? 'opacity-100 translate-y-0 blur-0'
                    : 'opacity-0 translate-y-6 blur-sm'
                }`}
                style={{
                  transitionDuration: '1.2s',
                  transitionDelay: showSubtitle ? `${index * 0.08}s` : '0s',
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  textShadow: showSubtitle ? '0 0 12px rgba(148, 163, 184, 0.15), 0 0 24px rgba(148, 163, 184, 0.08)' : 'none',
                  filter: showSubtitle ? 'drop-shadow(0 2px 8px rgba(148, 163, 184, 0.1))' : 'none'
                }}
              >
                {char === '、' ? char : char}
              </span>
            ))}
          </p>
        </div>

        {/* 装飾的な線 */}
        <div className={`flex justify-center mb-10 transition-all duration-2000 ease-out ${
          showLine ? 'opacity-60 scale-x-100' : 'opacity-0 scale-x-0'
        }`}>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-400/40 to-transparent animate-lineGlow"></div>
        </div>

        {/* メッセージ1 */}
        <div className="mb-4">
          <p className="text-base md:text-lg lg:text-xl font-light text-slate-200/80 tracking-wider leading-relaxed">
            {message1Text.split('').map((char, index) => (
              <span
                key={index}
                className={`inline-block transition-all ease-out transform ${
                  showMessage1
                    ? 'opacity-100 translate-y-0 blur-0'
                    : 'opacity-0 translate-y-6 blur-sm'
                }`}
                style={{
                  transitionDuration: '1.0s',
                  transitionDelay: showMessage1 ? `${index * 0.06}s` : '0s',
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  textShadow: showMessage1 ? '0 0 10px rgba(148, 163, 184, 0.12), 0 0 20px rgba(148, 163, 184, 0.06)' : 'none',
                  filter: showMessage1 ? 'drop-shadow(0 2px 6px rgba(148, 163, 184, 0.08))' : 'none'
                }}
              >
                {char}
              </span>
            ))}
          </p>
        </div>

        {/* メッセージ2 */}
        <div>
          <p className="text-base md:text-lg lg:text-xl font-light text-slate-200/80 tracking-wider leading-relaxed">
            {message2Text.split('').map((char, index) => (
              <span
                key={index}
                className={`inline-block transition-all ease-out transform ${
                  showMessage2
                    ? 'opacity-100 translate-y-0 blur-0'
                    : 'opacity-0 translate-y-6 blur-sm'
                }`}
                style={{
                  transitionDuration: '1.0s',
                  transitionDelay: showMessage2 ? `${index * 0.06}s` : '0s',
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  textShadow: showMessage2 ? '0 0 10px rgba(148, 163, 184, 0.12), 0 0 20px rgba(148, 163, 184, 0.06)' : 'none',
                  filter: showMessage2 ? 'drop-shadow(0 2px 6px rgba(148, 163, 184, 0.08))' : 'none'
                }}
              >
                {char}
              </span>
            ))}
          </p>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }

        @keyframes modernRipple1 {
          0%, 100% {
            transform: scale(0.5) rotate(0deg);
            opacity: 0.08;
          }
          50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0.25;
          }
        }

        @keyframes modernRipple2 {
          0%, 100% {
            transform: scale(0.6) rotate(0deg);
            opacity: 0.06;
          }
          50% {
            transform: scale(1.6) rotate(-180deg);
            opacity: 0.22;
          }
        }

        @keyframes modernRipple3 {
          0%, 100% {
            transform: scale(0.4) rotate(0deg);
            opacity: 0.05;
          }
          33% {
            transform: scale(1.2) rotate(120deg);
            opacity: 0.18;
          }
          66% {
            transform: scale(1.7) rotate(240deg);
            opacity: 0.20;
          }
        }

        @keyframes flowLine1 {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes flowLine2 {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes flowLine3 {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          40% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes flowLine4 {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          60% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes floatGeometric1 {
          0%, 100% {
            transform: translateY(0px) rotate(45deg);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-12px) rotate(225deg);
            opacity: 0.25;
          }
        }

        @keyframes floatGeometric2 {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.12;
          }
          50% {
            transform: translateY(-8px) scale(1.1);
            opacity: 0.2;
          }
        }

        @keyframes floatGeometric3 {
          0%, 100% {
            transform: translateY(0px) scaleY(1);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-10px) scaleY(1.2);
            opacity: 0.18;
          }
        }

        @keyframes floatGeometric4 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
            opacity: 0.18;
          }
          33% {
            transform: translateY(-6px) rotate(120deg) scale(1.1);
            opacity: 0.25;
          }
          66% {
            transform: translateY(-3px) rotate(240deg) scale(0.9);
            opacity: 0.22;
          }
        }

        @keyframes floatGeometric5 {
          0%, 100% {
            transform: translateY(0px) rotate(12deg) scale(1);
            opacity: 0.14;
          }
          50% {
            transform: translateY(-8px) rotate(192deg) scale(1.15);
            opacity: 0.2;
          }
        }

        @keyframes floatGeometric6 {
          0%, 100% {
            transform: translateY(0px) scaleY(1) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-12px) scaleY(1.3) rotate(5deg);
            opacity: 0.16;
          }
        }

        @keyframes particle {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-8px) scale(1.1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-4px) scale(0.9);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-12px) scale(1.05);
            opacity: 0.35;
          }
        }

        @keyframes gentleFloat1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.08;
          }
          33% {
            transform: translateY(-15px) translateX(8px) scale(1.05);
            opacity: 0.12;
          }
          66% {
            transform: translateY(-8px) translateX(-5px) scale(0.98);
            opacity: 0.10;
          }
        }

        @keyframes gentleFloat2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.06;
          }
          40% {
            transform: translateY(-12px) translateX(-6px) scale(1.03);
            opacity: 0.10;
          }
          80% {
            transform: translateY(-6px) translateX(4px) scale(0.97);
            opacity: 0.08;
          }
        }

        @keyframes gentleFloat3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.05;
          }
          50% {
            transform: translateY(-10px) translateX(3px) scale(1.02);
            opacity: 0.08;
          }
        }

        @keyframes gentleDrift1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translateY(-25px) translateX(20px) scale(1.3);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-15px) translateX(30px) scale(0.8);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-35px) translateX(15px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes gentleDrift2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-20px) translateX(-18px) scale(1.4);
            opacity: 0.8;
          }
          70% {
            transform: translateY(-30px) translateX(-10px) scale(0.7);
            opacity: 0.6;
          }
        }

        @keyframes gentleDrift3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.3;
          }
          40% {
            transform: translateY(-18px) translateX(25px) scale(1.5);
            opacity: 0.6;
          }
          80% {
            transform: translateY(-28px) translateX(8px) scale(0.9);
            opacity: 0.4;
          }
        }

        @keyframes gentleDrift4 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-22px) translateX(-15px) scale(1.3);
            opacity: 0.7;
          }
        }

        @keyframes shimmer1 {
          0%, 100% {
            transform: scale(1) translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          25% {
            transform: scale(2.2) translateY(-8px) translateX(12px);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.8) translateY(-15px) translateX(-5px);
            opacity: 0.7;
          }
          75% {
            transform: scale(2.5) translateY(-3px) translateX(8px);
            opacity: 1;
          }
        }

        @keyframes shimmer2 {
          0%, 100% {
            transform: scale(1) translateY(0px) translateX(0px);
            opacity: 0.5;
          }
          33% {
            transform: scale(1.9) translateY(-12px) translateX(-8px);
            opacity: 0.8;
          }
          66% {
            transform: scale(2.3) translateY(-6px) translateX(10px);
            opacity: 0.9;
          }
        }

        @keyframes spiralRotate1 {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 0.08;
          }
          50% {
            transform: rotate(180deg) scale(1.1);
            opacity: 0.15;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 0.08;
          }
        }

        @keyframes spiralRotate2 {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 0.06;
          }
          33% {
            transform: rotate(-120deg) scale(0.9);
            opacity: 0.12;
          }
          66% {
            transform: rotate(-240deg) scale(1.15);
            opacity: 0.1;
          }
          100% {
            transform: rotate(-360deg) scale(1);
            opacity: 0.06;
          }
        }

        @keyframes lineGlow {
          0%, 100% {
            opacity: 0.4;
            box-shadow: 0 0 10px rgba(148, 163, 184, 0.1);
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 20px rgba(148, 163, 184, 0.2);
          }
        }

        .animate-modernRipple1 {
          animation: modernRipple1 4s ease-in-out infinite;
        }

        .animate-modernRipple2 {
          animation: modernRipple2 5s ease-in-out infinite 1s;
        }

        .animate-modernRipple3 {
          animation: modernRipple3 6s ease-in-out infinite 2s;
        }

        .animate-flowLine1 {
          animation: flowLine1 4s linear infinite;
        }

        .animate-flowLine2 {
          animation: flowLine2 5s linear infinite 1s;
        }

        .animate-flowLine3 {
          animation: flowLine3 6s linear infinite 2s;
        }

        .animate-flowLine4 {
          animation: flowLine4 7s linear infinite 3s;
        }

        .animate-floatGeometric1 {
          animation: floatGeometric1 8s ease-in-out infinite;
        }

        .animate-floatGeometric2 {
          animation: floatGeometric2 10s ease-in-out infinite 2s;
        }

        .animate-floatGeometric3 {
          animation: floatGeometric3 12s ease-in-out infinite 4s;
        }

        .animate-floatGeometric4 {
          animation: floatGeometric4 9s ease-in-out infinite 1s;
        }

        .animate-floatGeometric5 {
          animation: floatGeometric5 11s ease-in-out infinite 5s;
        }

        .animate-floatGeometric6 {
          animation: floatGeometric6 13s ease-in-out infinite 6s;
        }

        .animate-particle {
          animation: particle 10s ease-in-out infinite;
        }

        .animate-lineGlow {
          animation: lineGlow 4s ease-in-out infinite;
        }

        .animate-gentleFloat1 {
          animation: gentleFloat1 20s ease-in-out infinite;
        }

        .animate-gentleFloat2 {
          animation: gentleFloat2 25s ease-in-out infinite 5s;
        }

        .animate-gentleFloat3 {
          animation: gentleFloat3 18s ease-in-out infinite 10s;
        }

        .animate-spiralRotate1 {
          animation: spiralRotate1 25s linear infinite;
        }

        .animate-spiralRotate2 {
          animation: spiralRotate2 30s linear infinite 8s;
        }
      `}</style>
    </section>
  )
}