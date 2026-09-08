import PageLoader from '@/components/PageLoader';
import CustomCursor from '@/features/layout/CustomCursor';
import Footer from '@/features/layout/Footer';
import Header from '@/features/layout/Header';
import SmoothScroll from '@/features/layout/SmoothScroll';
import '@repo/ui/styles.css';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

import JsonLd from '@/components/JsonLd';
import { buildPersonSchema, buildWebSiteSchema } from '@/lib/structuredData';
import {
  GA_MEASUREMENT_ID,
  GOOGLE_SITE_VERIFICATION,
  OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/siteConfig';
import { Inter_Tight } from 'next/font/google';
import './globals.css';

const inter = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  // 상대 경로 메타데이터(OG 이미지·canonical)를 절대 URL로 바꾸는 기준점.
  // 없으면 Next가 경고와 함께 상대 경로를 그대로 내보내 크롤러가 해석하지 못한다.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // 하위 페이지가 title을 문자열로 주면 이 형식으로 감싼다
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: `${SITE_NAME} — Frontend Engineer 포트폴리오`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Search Console 소유 확인. 하위 페이지가 verification을 정의하지 않으므로
  // 루트에서 전 페이지로 상속된다.
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  manifest: '/site.webmanifest',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE_LANG}>
      <head>
        {/* Pretendard는 globals.css의 @import가 아니라 여기서 싣는다 — @import는 발견이 늦고
            렌더를 차단한다. dynamic-subset 가변 폰트는 굵기 9종·woff2 27개를 선언하던 static
            빌드 대신 실제로 쓰이는 유니코드 범위의 파일만 받는다. preconnect로 연결을 먼저 연다. */}
        <link rel='preconnect' href='https://cdn.jsdelivr.net' crossOrigin='anonymous' />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'
        />
      </head>
      <body
        className={`${inter.variable} min-h-screen text-white antialiased selection:bg-white selection:text-black`}
      >
        {/* 모든 페이지가 공유하는 주체·사이트 정보. 개별 페이지 스키마가 @id로 이것을 참조한다 */}
        <JsonLd data={[buildPersonSchema(), buildWebSiteSchema()]} />
        {/* 키보드 사용자가 헤더 링크를 매번 지나지 않도록. 포커스될 때만 보인다 */}
        <a
          href='#main'
          className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black'
        >
          본문으로 건너뛰기
        </a>
        <PageLoader />
        <CustomCursor />
        <SmoothScroll>
          <Header />
          <main id='main' className='min-h-screen w-full pt-24'>
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        {/* 실사용자 Core Web Vitals. 대시보드에서 Speed Insights를 켜야 수집이 시작된다 */}
        <SpeedInsights />
      </body>
      {/* GA4. 문서 권장대로 body 밖에 둔다. 측정 ID가 없으면 아예 싣지 않는다 */}
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
