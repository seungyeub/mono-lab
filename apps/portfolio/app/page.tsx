// import BrandSection from '@/src/features/home/BrandSection';
import ExperienceSection from '@/src/features/home/ExperienceSection';
import FAQSection from '@/src/features/home/FAQSection';
import HeroSection from '@/src/features/home/HeroSection';
// import ServicesSection from '@/src/features/home/ServicesSection';
import WorksSection from '@/src/features/home/WorksSection';

export default function Home() {
  return (
    <div className='flex flex-col w-full'>
      <HeroSection />

      {/* <EditorialDivider
        left='© CURATED INTERFACES ビジュアル'
        center='LOGO DESIGNER ロゴデザイン'
        right='BRAND DESIGNER ブランド'
      /> */}

      {/* <BrandSection /> */}

      {/* <EditorialDivider
        left='Selected Works 選ばれた作品'
        center='Portfolio ポートフォリオ'
        right='Brand Identity ブランドアイデンティティ'
      /> */}

      <WorksSection />

      {/* <EditorialDivider
        left='Capabilities サービス内容'
        center='Services 業務'
        right='Strategy · Design · Identity 戦略'
      /> */}

      {/* <ServicesSection /> */}

      {/* <EditorialDivider
        left='Personal Info 個人情報'
        center='Profile プロフィール'
        right='Seoul, 한국 ソウル'
      /> */}

      <ExperienceSection />
      <FAQSection />
    </div>
  );
}
