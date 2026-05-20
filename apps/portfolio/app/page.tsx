import HeroSection from '@/src/features/home/HeroSection';
import FeaturedWorks from '@/src/features/home/FeaturedWorks';
import ServicesSection from '@/src/features/home/ServicesSection';
import ProfileSection from '@/src/features/home/ProfileSection';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#0a0a0a]">
      <HeroSection />
      <FeaturedWorks />
      <ServicesSection />
      <ProfileSection />
    </div>
  );
}
