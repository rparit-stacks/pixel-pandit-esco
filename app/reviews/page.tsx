import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, CheckCircle2, Filter, Search } from "lucide-react"
import Link from "next/link"

export default function AllReviewsPage() {
  const reviews = [
    {
      id: 1,
      author: "Michael Chen",
      authorImage: "/reviewer-avatar-1.jpg",
      date: "2 days ago",
      rating: 5,
      verified: true,
      serviceType: "Deep Cleaning",
      text: "Sarah did an absolutely amazing job! My house has never looked this clean. She was professional, punctual, and very thorough. She even organized areas I didn't specifically ask for. The attention to detail was incredible. I'll definitely be booking her again and have already recommended her to my friends.",
      helpful: 24,
      aspects: {
        quality: 5,
        professionalism: 5,
        communication: 5,
        value: 5,
        punctuality: 5,
      },
      images: ["/review-photo-1.jpg", "/review-photo-2.jpg"],
      response:
        "Thank you so much, Michael! It was a pleasure working with you. I'm thrilled you're happy with the results!",
    },
    {
      id: 2,
      author: "Emily Rodriguez",
      authorImage: "/reviewer-avatar-2.jpg",
      date: "1 week ago",
      rating: 5,
      verified: true,
      serviceType: "Standard Cleaning",
      text: "Incredible service! Sarah went above and beyond my expectations. She's not only thorough but also very respectful of my home and belongings. The eco-friendly products she uses are a big plus for me. Highly recommend her to anyone looking for a reliable and trustworthy cleaner.",
      helpful: 18,
      aspects: {
        quality: 5,
        professionalism: 5,
        communication: 5,
        value: 5,
        punctuality: 5,
      },
      images: [],
      response: null,
    },
    {
      id: 3,
      author: "David Park",
      authorImage: "/reviewer-avatar-3.jpg",
      date: "2 weeks ago",
      rating: 5,
      verified: true,
      serviceType: "Move-Out Cleaning",
      text: "Best cleaning service I've ever used. Sarah is detail-oriented and doesn't cut corners. My landlord was extremely impressed with the move-out cleaning, and I got my full deposit back. She's worth every penny and more. Can't thank her enough!",
      helpful: 15,
      aspects: {
        quality: 5,
        professionalism: 5,
        communication: 5,
        value: 5,
        punctuality: 4,
      },
      images: ["/review-photo-3.jpg"],
      response: "I'm so glad I could help, David! Congratulations on getting your deposit back!",
    },
    {
      id: 4,
      author: "Lisa Thompson",
      authorImage: "/reviewer-avatar-4.jpg",
      date: "3 weeks ago",
      rating: 5,
      verified: true,
      serviceType: "Standard Cleaning",
      text: "Sarah is fantastic! Very professional, always on time, and does excellent work. I've been using her services for the past 6 months on a bi-weekly basis and I'm consistently impressed. My home always sparkles after she's done. Trustworthy and reliable - highly recommend!",
      helpful: 12,
      aspects: {
        quality: 5,
        professionalism: 5,
        communication: 5,
        value: 5,
        punctuality: 5,
      },
      images: [],
      response: "Thank you for your continued trust, Lisa! It's always a pleasure!",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/profile/sarah-johnson" className="hover:text-foreground">
              Sarah Johnson
            </Link>{" "}
            / All Reviews
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Customer Reviews</h1>
              <p className="mt-2 text-muted-foreground">See what customers say about Sarah Johnson</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border bg-card p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <img
                        src={review.authorImage || "/placeholder.svg"}
                        alt={review.author}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{review.author}</span>
                          {review.verified && (
                            <CheckCircle2 className="h-4 w-4 text-primary" title="Verified Purchase" />
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{review.date}</span>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            {review.serviceType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="mt-4 leading-relaxed text-muted-foreground">{review.text}</p>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="mt-4 flex gap-3">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Review photo ${index + 1}`}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}

                  {/* Detailed Ratings */}
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/50 p-4 sm:grid-cols-5">
                    {Object.entries(review.aspects).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-medium capitalize">{key}</div>
                        <div className="mt-1 flex justify-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < value ? "fill-primary text-primary" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Professional Response */}
                  {review.response && (
                    <div className="mt-4 rounded-xl border-l-4 border-primary bg-muted/30 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <img
                          src="/profile-avatar-sarah.jpg"
                          alt="Sarah Johnson"
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-semibold">Response from Sarah Johnson</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.response}</p>
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="mt-4 flex items-center gap-4 border-t pt-4">
                    <button className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                    <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                Load More Reviews
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Rating */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">Overall Rating</h3>
              <div className="text-center">
                <div className="text-5xl font-bold">4.9</div>
                <div className="mt-2 flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Based on 247 reviews</div>
              </div>

              <div className="mt-6 space-y-2">
                {[
                  { stars: 5, count: 230, percentage: 93 },
                  { stars: 4, count: 12, percentage: 5 },
                  { stars: 3, count: 3, percentage: 1 },
                  { stars: 2, count: 1, percentage: 0.5 },
                  { stars: 1, count: 1, percentage: 0.5 },
                ].map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="w-8 text-sm">{item.stars}★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className="w-12 text-right text-sm text-muted-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">Rating Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: "Quality of Service", rating: 4.9 },
                  { label: "Professionalism", rating: 5.0 },
                  { label: "Communication", rating: 4.9 },
                  { label: "Value for Money", rating: 4.8 },
                  { label: "Punctuality", rating: 4.9 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-semibold">{item.rating}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${(item.rating / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review CTA */}
            <div className="rounded-2xl border bg-primary/5 p-6">
              <h3 className="mb-2 text-lg font-semibold">Share Your Experience</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Have you worked with Sarah? Help others by sharing your review.
              </p>
              <Button className="w-full" asChild>
                <Link href="/reviews/write">Write a Review</Link>
              </Button>
            </div>

            {/* Verified Reviews Info */}
            <div className="rounded-2xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Verified Reviews</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                All reviews are from verified customers who have used this professional's services through our platform.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
