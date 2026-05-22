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
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Brand Designer Portfolio',
  description:
    'Logo & Brand Designer based in Seoul, 한국. Crafting identities and systems that define and build lasting brands.',
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
        className={`${inter.variable} text-white min-h-screen antialiased selection:bg-white selection:text-black`}
      >
        <PageLoader />
        <CustomCursor />
        <SmoothScroll>
          <Header />
          <main className='min-h-screen w-full'>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
