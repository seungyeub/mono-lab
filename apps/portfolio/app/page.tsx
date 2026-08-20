// import BrandSection from '@/src/features/home/BrandSection';
import EpilogueSection from '@/src/features/home/EpilogueSection';
import ExperienceSection from '@/src/features/home/ExperienceSection';
import FAQSection from '@/src/features/home/FAQSection';
import HeroSection from '@/src/features/home/HeroSection';
import SkillsSection from '@/src/features/home/SkillsSection';
// import ServicesSection from '@/src/features/home/ServicesSection';
import WorksSection from '@/src/features/home/WorksSection';
import { getProjectCards } from '@/src/lib/mdx';

export default function Home() {
  // MDX를 단일 소스로 삼는다 — 카드 데이터를 따로 두면 상세 페이지와 어긋난다(P0-6)
  const projects = getProjectCards();

  return (
    <div className='flex w-full flex-col'>
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

      <WorksSection projects={projects} />

      {/* <EditorialDivider
        left='Capabilities サービス内容'
        center='Services 業務'
        right='Strategy · Design · Identity 戦略'
      /> */}

      <SkillsSection />

      {/* <ServicesSection /> */}

      {/* <EditorialDivider
        left='Personal Info 個人情報'
        center='Profile プロフィール'
        right='Seoul, 한국 ソウル'
      /> */}

      <ExperienceSection />
      <FAQSection />
      <EpilogueSection />
    </div>
  );
}
