import PageLoader from '@/src/components/PageLoader';
import CustomCursor from '@/src/features/layout/CustomCursor';
import Footer from '@/src/features/layout/Footer';
import Header from '@/src/features/layout/Header';
import SmoothScroll from '@/src/features/layout/SmoothScroll';
import '@repo/ui/styles.css';
import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import './globals.css';

const inter = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Seungyeub Baek | Frontend Engineer',
  description:
    'Next.js, React, TypeScript 기반으로 인터페이스와 시스템을 구축하는 프론트엔드 엔지니어 백승엽의 포트폴리오입니다.',
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
    <html lang='en'>
      <body
        className={`${inter.variable} min-h-screen text-white antialiased selection:bg-white selection:text-black`}
      >
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
