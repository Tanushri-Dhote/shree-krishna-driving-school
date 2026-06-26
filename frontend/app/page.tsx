import AboutStory from "@/components/about/AboutStory";
import FeaturesSection from "@/components/sections/FeaturesSection";
import { HeroSection } from "@/components/sections/herosection";
import ServicesSection from "@/components/sections/ServicesSection";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection/>
      <AboutStory showReadMore />
      <ServicesSection/>
    </>


  );
}
