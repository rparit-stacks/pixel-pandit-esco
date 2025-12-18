import Link from "next/link"

const categories = [
  { icon: "fa-solid fa-gem", name: "VIP Experience", count: "2.4k pros", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop" },
  { icon: "fa-solid fa-champagne-glasses", name: "Dinner Dates", count: "1.8k pros", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop" },
  { icon: "fa-solid fa-plane", name: "Travel Companion", count: "950 pros", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop" },
  { icon: "fa-solid fa-calendar-star", name: "Events", count: "1.2k pros", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop" },
  { icon: "fa-solid fa-spa", name: "Massage", count: "780 pros", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop" },
  { icon: "fa-solid fa-camera", name: "Photoshoots", count: "640 pros", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop" },
  { icon: "fa-solid fa-heart", name: "Girlfriend Exp", count: "890 pros", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop" },
  { icon: "fa-solid fa-briefcase", name: "Business Events", count: "1.5k pros", image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=300&fit=crop" },
]

export function CategoriesSection() {
  return (
    <section className="border-b bg-background py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm mb-4 shadow-sm">
              <i className="fa-solid fa-grid-2 text-primary"></i>
              <span className="font-medium">Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">Browse by Category</h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">Find professionals across all services</p>
          </div>

          <div className="mt-12 md:mt-16 grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/listings?service=${encodeURIComponent(category.name)}`}
                className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:border-primary hover:shadow-xl hover:-translate-y-1"
              >
                {/* Background Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <div className="mb-2 sm:mb-3 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-transform group-hover:scale-110">
                    <i className={`${category.icon} text-lg sm:text-xl`}></i>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-white/80">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
