import EpilogueSection from '@/src/features/home/EpilogueSection';
import ExperienceSection from '@/src/features/home/ExperienceSection';
import FAQSection from '@/src/features/home/FAQSection';
import HeroSection from '@/src/features/home/HeroSection';
import SkillsSection from '@/src/features/home/SkillsSection';
import WorksSection from '@/src/features/home/WorksSection';
import JsonLd from '@/src/components/JsonLd';
import { getFeaturedProjectCards } from '@/src/lib/mdx';
import { buildFaqSchema } from '@/src/lib/structuredData';

export default function Home() {
  // MDX를 단일 소스로 삼는다(P0-6). 홈에는 FEATURED_SLUGS에서 직접 고른 6개만 노출한다.
  const projects = getFeaturedProjectCards();

  return (
    <div className='flex w-full flex-col'>
      {/* 화면의 FAQ 섹션과 같은 데이터를 쓴다 — 답변 엔진이 그대로 인용할 수 있는 형태 */}
      <JsonLd data={buildFaqSchema()} />
      <HeroSection />
      <WorksSection projects={projects} />
      <SkillsSection />
      <ExperienceSection />
      <FAQSection />
      <EpilogueSection />
    </div>
  );
}
