const steps = [
  {
    icon: "fa-solid fa-magnifying-glass",
    step: "01",
    title: "Search & Discover",
    description: "Browse through our extensive directory of verified professionals in your area.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop"
  },
  {
    icon: "fa-solid fa-user-check",
    step: "02",
    title: "Compare & Review",
    description: "Read reviews, compare profiles, and find the perfect match for your needs.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop"
  },
  {
    icon: "fa-solid fa-calendar-check",
    step: "03",
    title: "Book Service",
    description: "Schedule your service at a time that works best for you with instant confirmation.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop"
  },
  {
    icon: "fa-solid fa-circle-check",
    step: "04",
    title: "Enjoy & Rate",
    description: "Enjoy professional service and leave a review to help others in the community.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop"
  },
]

export function HowItWorksSection() {
  return (
    <section className="border-b bg-muted/30 py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm mb-4 shadow-sm">
              <i className="fa-solid fa-route text-primary"></i>
              <span className="font-medium">Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">How It Works</h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">Get started in four simple steps</p>
          </div>

          <div className="mt-12 md:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  {/* Image */}
                  <div className="mb-4 w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {/* Icon Badge */}
                  <div className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg -mt-10 sm:-mt-12 relative z-10">
                    <i className={`${step.icon} text-xl sm:text-2xl`}></i>
                  </div>
                  <div className="mb-2 text-sm font-bold text-primary">{step.step}</div>
                  <h3 className="mb-2 text-lg sm:text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
