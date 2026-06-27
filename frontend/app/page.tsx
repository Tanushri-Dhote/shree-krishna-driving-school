import AboutStory from "@/components/about/AboutStory";
import FeaturesSection from "@/components/sections/FeaturesSection";
import { HeroSection } from "@/components/sections/herosection";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <AboutStory showReadMore />
      <WhyChooseUsSection />
      <TestimonialsSection />
    </>
  );
}
