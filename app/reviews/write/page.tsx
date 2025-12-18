import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Star, Upload } from "lucide-react"
import Link from "next/link"

export default function WriteReviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-12 md:px-8">
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
            / Write Review
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-8">
          <h1 className="mb-2 text-3xl font-bold">Write a Review</h1>
          <p className="text-muted-foreground">Share your experience with Sarah Johnson</p>

          <Separator className="my-8" />

          {/* Service Provider Info */}
          <div className="mb-8 flex items-center gap-4 rounded-xl bg-muted/50 p-4">
            <img src="/profile-avatar-sarah.jpg" alt="Sarah Johnson" className="h-16 w-16 rounded-xl object-cover" />
            <div>
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-sm text-muted-foreground">Professional House Cleaner</div>
              <div className="mt-1 text-xs text-muted-foreground">Service Date: January 15, 2025</div>
            </div>
          </div>

          <form className="space-y-8">
            {/* Rating Section */}
            <div>
              <Label className="mb-4 block text-lg font-semibold">Overall Rating</Label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button key={index} type="button" className="group">
                    <Star className="h-10 w-10 text-muted-foreground transition-colors hover:fill-primary hover:text-primary" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">(Click to rate)</span>
              </div>
            </div>

            <Separator />

            {/* Detailed Ratings */}
            <div>
              <Label className="mb-4 block text-lg font-semibold">Rate Specific Aspects</Label>
              <div className="space-y-4">
                {[
                  { label: "Quality of Service", key: "quality" },
                  { label: "Professionalism", key: "professionalism" },
                  { label: "Communication", key: "communication" },
                  { label: "Value for Money", key: "value" },
                  { label: "Punctuality", key: "punctuality" },
                ].map((aspect) => (
                  <div key={aspect.key} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">{aspect.label}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <button key={index} type="button" className="group">
                          <Star className="h-6 w-6 text-muted-foreground transition-colors hover:fill-primary hover:text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Review Text */}
            <div>
              <Label htmlFor="review" className="mb-2 block text-lg font-semibold">
                Your Review
              </Label>
              <p className="mb-4 text-sm text-muted-foreground">
                Share details of your experience. What went well? What could be improved?
              </p>
              <Textarea
                id="review"
                placeholder="Write your review here..."
                className="min-h-[200px] resize-none"
                required
              />
              <div className="mt-2 text-right text-xs text-muted-foreground">Minimum 50 characters</div>
            </div>

            {/* Photo Upload */}
            <div>
              <Label className="mb-2 block text-lg font-semibold">Add Photos (Optional)</Label>
              <p className="mb-4 text-sm text-muted-foreground">Help others by showing the results</p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload Photo</span>
                </button>
              </div>
            </div>

            <Separator />

            {/* Recommendations */}
            <div>
              <Label className="mb-4 block text-lg font-semibold">Would you recommend this professional?</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-xl border-2 border-primary bg-primary/5 p-4 text-center font-semibold transition-colors"
                >
                  Yes, I recommend
                </button>
                <button
                  type="button"
                  className="rounded-xl border-2 border-border p-4 text-center font-semibold transition-colors hover:border-primary hover:bg-primary/5"
                >
                  No, I don't recommend
                </button>
              </div>
            </div>

            {/* Service Tags */}
            <div>
              <Label className="mb-4 block text-lg font-semibold">Highlight Key Aspects</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Punctual",
                  "Professional",
                  "Great Value",
                  "Excellent Quality",
                  "Friendly",
                  "Thorough",
                  "Respectful",
                  "Reliable",
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="rounded-full border-2 border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Privacy Notice */}
            <div className="rounded-xl bg-muted/50 p-4">
              <h4 className="mb-2 font-semibold">Review Guidelines</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Be honest and constructive in your feedback</li>
                <li>• Focus on your personal experience</li>
                <li>• Avoid offensive language or personal attacks</li>
                <li>• Your review will be public and visible to everyone</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" size="lg" className="flex-1">
                Submit Review
              </Button>
              <Button type="button" variant="outline" size="lg" className="flex-1 bg-transparent" asChild>
                <Link href="/profile/sarah-johnson">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
