import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedSlider } from "@/components/featured-slider"
import { EscortsListingSection } from "@/components/landing/escorts-listing-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { CategoriesSection } from "@/components/landing/categories-section"
import { StatsSection } from "@/components/landing/stats-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { TrustSection } from "@/components/landing/trust-section"
import { FaqSection } from "@/components/landing/faq-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Global floating icons for sections below hero */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 via-white to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        
        {/* Subtle pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Icons - Below hero for other sections */}
        <div className="absolute top-[120vh] left-[5%] text-4xl text-pink-500/10 animate-float-slow">
          <i className="fa-solid fa-heart"></i>
        </div>
        <div className="absolute top-[150vh] right-[8%] text-3xl text-pink-500/8 animate-float-medium">
          <i className="fa-solid fa-heart"></i>
        </div>
        <div className="absolute top-[180vh] right-[15%] text-5xl text-yellow-500/8 animate-float-medium">
          <i className="fa-solid fa-star"></i>
        </div>
        <div className="absolute top-[200vh] left-[12%] text-3xl text-yellow-500/6 animate-float-slow">
          <i className="fa-solid fa-star"></i>
        </div>
        <div className="absolute top-[130vh] right-[25%] text-4xl text-primary/10 animate-float-fast">
          <i className="fa-solid fa-crown"></i>
        </div>
        <div className="absolute top-[220vh] left-[20%] text-3xl text-primary/8 animate-float-medium">
          <i className="fa-solid fa-crown"></i>
        </div>
        <div className="absolute top-[160vh] left-[8%] text-5xl text-purple-500/8 animate-float-medium">
          <i className="fa-solid fa-gem"></i>
        </div>
        <div className="absolute top-[250vh] right-[20%] text-4xl text-purple-500/6 animate-float-slow">
          <i className="fa-solid fa-gem"></i>
        </div>
        <div className="absolute top-[140vh] right-[5%] text-3xl text-cyan-500/10 animate-float-fast">
          <i className="fa-solid fa-sparkles"></i>
        </div>
        <div className="absolute top-[190vh] left-[18%] text-4xl text-cyan-500/8 animate-float-slow">
          <i className="fa-solid fa-sparkles"></i>
        </div>
        <div className="absolute top-[170vh] left-[40%] text-3xl text-orange-500/8 animate-float-medium">
          <i className="fa-solid fa-fire"></i>
        </div>
        <div className="absolute top-[240vh] left-[45%] text-4xl text-orange-500/6 animate-float-fast">
          <i className="fa-solid fa-fire"></i>
        </div>
        
        {/* Glowing orbs for depth */}
        <div className="absolute top-[150vh] left-[30%] w-96 h-96 bg-primary/3 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute top-[200vh] right-[25%] w-[500px] h-[500px] bg-pink-500/3 rounded-full blur-[180px] animate-pulse-slower" />
        <div className="absolute top-[250vh] left-[50%] w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-[150px] animate-pulse-slow" />
      </div>

      {/* Page content */}
      <HeroSection />
      <FeaturedSlider />
      <EscortsListingSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CategoriesSection />
      <StatsSection />
      <TestimonialsSection />
      <TrustSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
