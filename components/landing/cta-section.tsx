import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CtaSection() {
  return (
    <section className="border-b bg-primary py-16 md:py-24 text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-[5%]">
          <i className="fa-solid fa-heart text-4xl sm:text-6xl"></i>
        </div>
        <div className="absolute top-20 right-[10%]">
          <i className="fa-solid fa-star text-3xl sm:text-4xl"></i>
        </div>
        <div className="absolute bottom-10 left-1/4">
          <i className="fa-solid fa-gem text-4xl sm:text-5xl"></i>
        </div>
        <div className="absolute bottom-20 right-1/3">
          <i className="fa-solid fa-crown text-2xl sm:text-3xl"></i>
        </div>
        <div className="absolute top-1/2 right-[5%]">
          <i className="fa-solid fa-sparkles text-3xl sm:text-4xl"></i>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <i className="fa-solid fa-rocket text-2xl sm:text-4xl"></i>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Ready to Get Started?
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-primary-foreground/90 text-pretty leading-relaxed">
            Join thousands of satisfied customers and professionals. Find the perfect companion or start growing
            your business today.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" className="h-12 px-6 sm:px-8 rounded-xl" asChild>
              <Link href="/signup">
                <i className="fa-solid fa-user-plus mr-2"></i>
                Sign Up Free
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-primary-foreground/20 bg-transparent px-6 sm:px-8 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl"
              asChild
            >
              <Link href="/listings">
                <i className="fa-solid fa-grid-2 mr-2"></i>
                Browse Escorts
              </Link>
            </Button>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-primary-foreground/70">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-credit-card"></i>
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-xmark"></i>
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-gift"></i>
              14-day free trial
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
