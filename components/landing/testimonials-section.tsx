const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Executive",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    text: "Absolutely incredible experience! The service was top-notch and the booking process was seamless. Highly recommend this platform.",
  },
  {
    name: "Michael Chen",
    role: "Entrepreneur",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    text: "As a frequent traveler, this platform has transformed how I connect with companions. Quality leads and reliable service every time.",
  },
  {
    name: "Emily Rodriguez",
    role: "Tech Executive",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    rating: 5,
    text: "Best platform for finding quality companions! The reviews helped me choose perfectly, and scheduling is so convenient.",
  },
  {
    name: "David Park",
    role: "Investment Banker",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    text: "The quality of professionals on this platform is outstanding. Every companion I've met has been reliable and professional.",
  },
  {
    name: "Lisa Thompson",
    role: "Film Producer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    rating: 5,
    text: "Finding a trusted companion for events was so easy. The verification process gives me peace of mind every time.",
  },
  {
    name: "James Wilson",
    role: "Real Estate Developer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5,
    text: "I attend multiple events and this platform has been a game-changer. Quick response times and reliable companions every time.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="border-b bg-background py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm mb-4 shadow-sm">
              <i className="fa-solid fa-quote-left text-primary"></i>
              <span className="font-medium">Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">Trusted by Thousands</h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">See what our community has to say</p>
          </div>

          <div className="mt-12 md:mt-16 grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mb-3 sm:mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-primary text-sm sm:text-base"></i>
                  ))}
                </div>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <i className="fa-solid fa-quote-left text-primary/30 mr-2"></i>
                  {testimonial.text}
                  <i className="fa-solid fa-quote-right text-primary/30 ml-2"></i>
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                      <i className="fa-solid fa-briefcase text-xs"></i>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
