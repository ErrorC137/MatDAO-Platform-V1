import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { StatsSection } from "@/components/home/stats-section"
import { FooterSection } from "@/components/home/footer-section"
import { TeamSection } from "@/components/home/team-section"
import { SolutionSection } from "@/components/home/solution-section"
import { PartnersCarousel } from "@/components/partners-carousel"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <SolutionSection />
      <FeaturesSection />
      <TeamSection />
      <StatsSection />
      <PartnersCarousel />
      <FooterSection />
    </div>
  )
}
