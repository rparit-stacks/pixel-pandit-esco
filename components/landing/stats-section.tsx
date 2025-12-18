export function StatsSection() {
  const stats = [
    { value: "10,000+", label: "Verified Professionals", icon: "fa-solid fa-user-check" },
    { value: "50,000+", label: "Services Completed", icon: "fa-solid fa-circle-check" },
    { value: "4.9/5", label: "Average Rating", icon: "fa-solid fa-star" },
    { value: "200+", label: "Cities Covered", icon: "fa-solid fa-city" },
  ]

  return (
    <section className="border-b bg-primary py-16 md:py-24 text-primary-foreground">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <i className={`${stat.icon} text-xl sm:text-3xl`}></i>
                  </div>
                </div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-bold">{stat.value}</div>
                <div className="mt-1 sm:mt-2 text-sm sm:text-base text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
