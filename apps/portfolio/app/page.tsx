import EpilogueSection from '@/src/features/home/EpilogueSection';
import ExperienceSection from '@/src/features/home/ExperienceSection';
import FAQSection from '@/src/features/home/FAQSection';
import HeroSection from '@/src/features/home/HeroSection';
import SkillsSection from '@/src/features/home/SkillsSection';
import WorksSection from '@/src/features/home/WorksSection';
import { getFeaturedProjectCards } from '@/src/lib/mdx';

export default function Home() {
  // MDX를 단일 소스로 삼는다(P0-6). 홈에는 FEATURED_SLUGS에서 직접 고른 6개만 노출한다.
  const projects = getFeaturedProjectCards();

  return (
    <div className='flex w-full flex-col'>
      <HeroSection />
      <WorksSection projects={projects} />
      <SkillsSection />
      <ExperienceSection />
      <FAQSection />
      <EpilogueSection />
    </div>
  );
}
