const features = [
  {
    icon: "fa-solid fa-shield-check",
    title: "Verified Professionals",
    description: "All service providers undergo thorough background checks and verification processes.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
  },
  {
    icon: "fa-solid fa-star",
    title: "Quality Guaranteed",
    description: "Real reviews from real customers help you make informed decisions.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=200&fit=crop"
  },
  {
    icon: "fa-solid fa-clock",
    title: "Quick Booking",
    description: "Book services in minutes with our streamlined booking process.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=200&fit=crop"
  },
  {
    icon: "fa-solid fa-lock",
    title: "Secure Payments",
    description: "Safe and secure payment processing with buyer protection.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=200&fit=crop"
  },
  {
    icon: "fa-solid fa-users",
    title: "Trusted Community",
    description: "Join thousands of satisfied customers and service providers.",
    image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=300&h=200&fit=crop"
  },
  {
    icon: "fa-solid fa-headset",
    title: "24/7 Support",
    description: "Our dedicated support team is always here to help you.",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=200&fit=crop"
  },
]

export function FeaturesSection() {
  return (
    <section className="border-b bg-background py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm mb-4 shadow-sm">
              <i className="fa-solid fa-gem text-primary"></i>
              <span className="font-medium">Premium Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">Why Choose Our Platform</h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
              Everything you need to connect with the best professionals
            </p>
          </div>

          <div className="mt-12 md:mt-16 grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="group rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="h-32 sm:h-40 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <i className={`${feature.icon} text-lg sm:text-xl`}></i>
                  </div>
                  <h3 className="mb-2 text-lg sm:text-xl font-semibold">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
