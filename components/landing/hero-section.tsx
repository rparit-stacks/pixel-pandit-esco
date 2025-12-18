"use client"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Full-width animated background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-rose-950/30" />
        
        {/* Animated gradient blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-pink-400/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/15 to-primary/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-br from-pink-300/15 to-rose-400/15 rounded-full blur-[130px] animate-blob animation-delay-4000" />
        
        {/* Vector wave pattern - SVG */}
        <svg className="absolute bottom-0 left-0 w-full h-auto opacity-10 dark:opacity-5" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" className="text-primary" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-auto opacity-5 dark:opacity-[0.02]" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" className="text-pink-500" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        
        {/* Geometric shapes */}
        <div className="absolute top-[15%] left-[10%] w-20 h-20 border-2 border-primary/20 rounded-full animate-float-slow" />
        <div className="absolute top-[25%] right-[15%] w-12 h-12 bg-primary/10 rotate-45 animate-float-medium" />
        <div className="absolute bottom-[30%] left-[20%] w-16 h-16 border-2 border-pink-400/20 rounded-lg rotate-12 animate-float-fast" />
        <div className="absolute top-[60%] right-[10%] w-24 h-24 border border-purple-400/15 rounded-full animate-float-slow" />
        <div className="absolute top-[40%] left-[5%] w-8 h-8 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full animate-float-medium" />
        <div className="absolute bottom-[20%] right-[25%] w-14 h-14 border border-primary/15 rotate-45 animate-float-fast" />
        
        {/* Floating hearts */}
        <div className="absolute top-[20%] right-[30%] text-3xl text-primary/20 animate-float-slow">
          <i className="fa-solid fa-heart"></i>
        </div>
        <div className="absolute bottom-[40%] left-[15%] text-2xl text-pink-500/15 animate-float-medium">
          <i className="fa-solid fa-heart"></i>
        </div>
        <div className="absolute top-[50%] right-[5%] text-4xl text-primary/10 animate-float-fast">
          <i className="fa-solid fa-heart"></i>
        </div>
        
        {/* Sparkles */}
        <div className="absolute top-[30%] left-[30%] text-2xl text-yellow-500/20 animate-pulse">
          <i className="fa-solid fa-sparkles"></i>
        </div>
        <div className="absolute bottom-[25%] right-[20%] text-xl text-yellow-400/15 animate-pulse animation-delay-2000">
          <i className="fa-solid fa-sparkles"></i>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <Header />

      {/* Hero Content - Full Width */}
      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-8 pb-20 md:pt-12 md:pb-28 lg:pt-16 lg:pb-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-20 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-2 text-xs sm:text-sm mb-4 md:mb-6 w-fit shadow-lg shadow-primary/5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <i className="fa-solid fa-shield-check text-primary"></i>
                <span className="font-medium">100% Verified Profiles</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight text-balance font-serif leading-[1.1]">
                Discover Elite
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-500 to-rose-500"> Companions</span>
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path d="M0,6 Q50,0 100,6 T200,6" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                </span>
              </h1>
              
              <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed max-w-xl">
                Connect with verified premium companions in your city. Discreet, safe, and sophisticated experiences tailored for discerning clients.
              </p>

              {/* Search Bar */}
              <div className="mt-6 md:mt-8 flex flex-col gap-3 sm:flex-row max-w-xl">
                <div className="relative flex-1 group">
                  <i className="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground group-focus-within:text-primary transition-colors"></i>
                  <input
                    type="text"
                    placeholder="Enter your city..."
                    className="h-12 sm:h-14 w-full rounded-2xl border-2 border-border bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm pl-12 pr-4 text-sm sm:text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-lg"
                  />
                </div>
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105" asChild>
                  <Link href="/listings">
                    <i className="fa-solid fa-magnifying-glass mr-2"></i>
                    Browse Now
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-lock text-green-500"></i>
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-bolt text-yellow-500"></i>
                  <span>Instant Connect</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-star text-primary"></i>
                  <span>Premium Quality</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 md:mt-10 grid grid-cols-3 gap-4 md:gap-6 max-w-lg">
                <div className="text-center p-3 md:p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    2.5K+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Verified</div>
                </div>
                <div className="text-center p-3 md:p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    50+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Cities</div>
                </div>
                <div className="text-center p-3 md:p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    4.9
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Rating</div>
                </div>
              </div>
            </div>

            {/* Right - Hero Images */}
            <div className="relative order-1 lg:order-2">
              {/* Main image grid with floating effect */}
              <div className="relative grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto lg:max-w-none">
                <div className="space-y-3 sm:space-y-4">
                  <div className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl shadow-primary/10 ring-1 ring-white/20 transform hover:scale-105 hover:rotate-1 transition-all duration-500">
                    <img
                      src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop"
                      alt="Elite companion"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl shadow-pink-500/10 ring-1 ring-white/20 transform hover:scale-105 hover:-rotate-1 transition-all duration-500">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop"
                      alt="Premium escort"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-10">
                  <div className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl shadow-purple-500/10 ring-1 ring-white/20 transform hover:scale-105 hover:-rotate-1 transition-all duration-500">
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
                      alt="Luxury companion"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl shadow-rose-500/10 ring-1 ring-white/20 transform hover:scale-105 hover:rotate-1 transition-all duration-500">
                    <img
                      src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop"
                      alt="VIP escort"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge - Online Now */}
              <div className="absolute -top-2 -right-2 sm:top-4 sm:right-4 z-10">
                <div className="flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-full px-4 py-2 shadow-xl border border-green-500/20">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">500+ Online</span>
                </div>
              </div>

              {/* Floating Card - 24/7 */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 sm:-bottom-6 z-10">
                <div className="flex items-center gap-3 sm:gap-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-2xl border border-primary/10">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-500 shadow-lg shadow-primary/30">
                    <i className="fa-solid fa-heart text-lg sm:text-xl text-white animate-pulse"></i>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">24/7</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Available</div>
                  </div>
                </div>
              </div>

              {/* Floating rating */}
              <div className="absolute top-1/2 -left-4 sm:-left-8 z-10 hidden md:block">
                <div className="flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-xl border border-yellow-500/20 rotate-[-8deg]">
                  <i className="fa-solid fa-star text-yellow-500"></i>
                  <span className="text-sm font-bold">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
