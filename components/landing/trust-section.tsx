export function TrustSection() {
  return (
    <section className="border-b bg-muted/30 py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm mb-4 shadow-sm">
                <i className="fa-solid fa-shield-halved text-primary"></i>
                <span className="font-medium">Safety First</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">Your Safety is Our Priority</h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                We take trust and safety seriously. Every professional on our platform undergoes rigorous verification to
                ensure you get the best service possible.
              </p>

              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <i className="fa-solid fa-user-shield text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Background Checks</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Comprehensive verification including identity, credentials, and references
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <i className="fa-solid fa-award text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Quality Assurance</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Regular quality checks and customer satisfaction monitoring
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <i className="fa-solid fa-lock text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Secure Platform</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Bank-level encryption and secure payment processing</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <i className="fa-solid fa-circle-check text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Money-Back Guarantee</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Not satisfied? Get your money back with our satisfaction guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop"
                    alt="Trust and safety"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop"
                    alt="Verified companion"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
                    alt="Professional service"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop"
                    alt="Premium companion"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              
              {/* Trust Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-3 sm:p-4 shadow-2xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-green-500">
                    <i className="fa-solid fa-shield-check text-white text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold">100%</div>
                    <div className="text-xs text-muted-foreground">Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
