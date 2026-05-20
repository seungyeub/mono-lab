import HeroSection from '@/src/features/home/HeroSection';
import BrandSection from '@/src/features/home/BrandSection';
import FeaturedWorks from '@/src/features/home/FeaturedWorks';
import ServicesSection from '@/src/features/home/ServicesSection';
import ProfileSection from '@/src/features/home/ProfileSection';
import FAQSection from '@/src/features/home/FAQSection';
import EditorialDivider from '@/src/components/EditorialDivider';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#0a0a0a]">
      <HeroSection />

      <EditorialDivider
        left="© CURATED INTERFACES ビジュアル"
        center="LOGO DESIGNER ロゴデザイン"
        right="BRAND DESIGNER ブランド"
      />

      <BrandSection />

      <EditorialDivider
        left="Selected Works 選ばれた作品"
        center="Portfolio ポートフォリオ"
        right="Brand Identity ブランドアイデンティティ"
      />

      <FeaturedWorks />

      <EditorialDivider
        left="Capabilities サービス内容"
        center="Services 業務"
        right="Strategy · Design · Identity 戦略"
      />

      <ServicesSection />

      <EditorialDivider
        left="Personal Info 個人情報"
        center="Profile プロフィール"
        right="Seoul, 한국 ソウル"
      />

      <ProfileSection />

      <EditorialDivider
        left="FAQ よくある質問"
        center="Clarifications 説明"
        right="Before We Start 始める前に"
      />

      <FAQSection />
    </div>
  );
}
