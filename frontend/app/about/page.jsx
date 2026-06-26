import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutStats from "@/components/about/AboutStats";
import AboutInstructors from "@/components/about/AboutInstructors";
import AboutCTA from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <main className="bg-white">
      <AboutHero />
       <AboutStats />
      <AboutStory />
     
      {/* <AboutInstructors /> */}
      <AboutCTA />
    </main>
  );
}