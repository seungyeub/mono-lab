import PageLoader from '@/src/components/PageLoader';
import CustomCursor from '@/src/features/layout/CustomCursor';
import Footer from '@/src/features/layout/Footer';
import Header from '@/src/features/layout/Header';
import SmoothScroll from '@/src/features/layout/SmoothScroll';
import '@repo/ui/styles.css';
import type { Metadata } from 'next';

import JsonLd from '@/src/components/JsonLd';
import { buildPersonSchema, buildWebSiteSchema } from '@/src/lib/structuredData';
import {
  OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from '@/src/lib/siteConfig';
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
      <body
        className={`${inter.variable} min-h-screen text-white antialiased selection:bg-white selection:text-black`}
      >
        {/* 모든 페이지가 공유하는 주체·사이트 정보. 개별 페이지 스키마가 @id로 이것을 참조한다 */}
        <JsonLd data={[buildPersonSchema(), buildWebSiteSchema()]} />
        <PageLoader />
        <CustomCursor />
        <SmoothScroll>
          <Header />
          <main className='min-h-screen w-full pt-24'>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
