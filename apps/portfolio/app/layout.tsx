import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SmoothScroll from "@/src/features/layout/SmoothScroll";
import CustomCursor from "@/src/features/layout/CustomCursor";
import Header from "@/src/features/layout/Header";
import Footer from "@/src/features/layout/Footer";
import PageLoader from "@/src/components/PageLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brand Designer Portfolio",
  description: "Logo & Brand Designer based in Seoul, 한국. Crafting identities and systems that define and build lasting brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-white min-h-screen antialiased selection:bg-white selection:text-black`}>
        <PageLoader />
        <CustomCursor />
        <SmoothScroll>
          <Header />
          <main className="site-container min-h-screen w-full">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
