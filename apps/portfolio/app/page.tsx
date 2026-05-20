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
        center="LOGO DESIGNER"
        right="BRAND DESIGNER"
      />

      <BrandSection />

      <EditorialDivider
        left="Selected Works"
        center="Portfolio"
        right="Brand Identity"
      />

      <FeaturedWorks />

      <EditorialDivider
        left="Capabilities"
        center="Services"
        right="Strategy · Design · Identity"
      />

      <ServicesSection />

      <EditorialDivider
        left="Personal Info"
        center="Profile"
        right="Seoul, 한국"
      />

      <ProfileSection />

      <EditorialDivider
        left="FAQ"
        center="Clarifications"
        right="Before We Start"
      />

      <FAQSection />
    </div>
  );
}
