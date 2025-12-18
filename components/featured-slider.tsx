"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Profile {
  id: string
  displayName: string
  age: number | null
  mainPhotoUrl: string | null
  isVerified: boolean
  isVip: boolean
  rateHourly: number | null
  services: string[]
  city: {
    id: string
    name: string
    slug: string
  } | null
}

export function FeaturedSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const { data, isLoading } = useSWR<{ results: Profile[], count: number }>(
    '/api/escorts?limit=4',
    fetcher,
    { revalidateOnFocus: false }
  )

  const profiles = data?.results || []

  useEffect(() => {
    if (isPaused || profiles.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % profiles.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, profiles.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + profiles.length) % profiles.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % profiles.length)
  }

  if (isLoading) {
    return (
      <section className="relative overflow-hidden border-y bg-gradient-to-b from-muted/20 to-background py-16 md:py-20">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 md:mb-12 text-center">
              <Skeleton className="h-8 w-32 mx-auto mb-4" />
              <Skeleton className="h-12 w-64 mx-auto" />
            </div>
            <Skeleton className="h-[500px] w-full rounded-3xl" />
          </div>
        </div>
      </section>
    )
  }

  if (profiles.length === 0) {
    return null
  }

  return (
    <section className="relative overflow-hidden border-y bg-gradient-to-b from-muted/20 to-background py-16 md:py-20">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 md:mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm mb-4 shadow-sm">
              <i className="fa-solid fa-crown text-primary animate-pulse"></i>
              <span className="font-medium">Top Rated</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-serif">
              Featured <span className="text-primary">Companions</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">Meet our most popular and highly-rated companions</p>
          </div>

          <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            {/* Slider Container */}
            <div className="relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden rounded-3xl bg-card">
              {profiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentIndex
                      ? "opacity-100 translate-x-0"
                      : index < currentIndex
                        ? "opacity-0 -translate-x-full"
                        : "opacity-0 translate-x-full"
                  }`}
                >
                  <div className="grid h-full gap-4 md:gap-8 lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-full overflow-hidden rounded-3xl">
                      <Image
                        src={profile.mainPhotoUrl || "/placeholder.jpg"}
                        alt={profile.displayName}
                        fill
                        className="object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Badges on Image */}
                      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex gap-2">
                        {profile.isVerified && (
                          <Badge className="bg-green-500 text-white border-0">
                            <i className="fa-solid fa-shield-check mr-1"></i>
                            Verified
                          </Badge>
                        )}
                        {profile.isVip && (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                            <i className="fa-solid fa-crown mr-1"></i>
                            VIP
                          </Badge>
                        )}
                      </div>

                      {/* Like Button */}
                      <button className="absolute top-4 sm:top-6 right-4 sm:right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110">
                        <i className="fa-solid fa-heart text-primary text-xl"></i>
                      </button>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center p-4 sm:p-6 md:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif">{profile.displayName}</h3>
                          {profile.age && (
                            <p className="mt-1 sm:mt-2 text-lg sm:text-xl text-muted-foreground">{profile.age} years old</p>
                          )}
                        </div>
                        {profile.rateHourly && (
                          <div className="text-left sm:text-right">
                            <div className="text-2xl sm:text-3xl font-bold text-primary">₹{profile.rateHourly}</div>
                            <div className="text-sm text-muted-foreground">per hour</div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-4 sm:gap-6">
                        {profile.city && (
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-location-dot text-primary text-lg"></i>
                            <span className="text-sm sm:text-base">{profile.city.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-star text-primary text-lg"></i>
                          <span className="text-sm sm:text-base font-semibold">4.9</span>
                          <span className="text-muted-foreground text-sm">(127 reviews)</span>
                        </div>
                      </div>

                      <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed line-clamp-3">
                        Sophisticated and elegant companion available for dinner dates, social events, and private
                        encounters. Enjoy premium experiences tailored to your preferences.
                      </p>

                      <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                        {profile.services.slice(0, 4).map((service) => (
                          <Badge key={service} variant="secondary" className="rounded-full text-xs sm:text-sm">
                            {service}
                          </Badge>
                        ))}
                        {profile.services.length > 4 && (
                          <Badge variant="secondary" className="rounded-full text-xs sm:text-sm">
                            +{profile.services.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Button size="lg" className="flex-1 rounded-xl" asChild>
                          <Link href={`/profile/${profile.id}`}>
                            <i className="fa-solid fa-user mr-2"></i>
                            View Profile
                          </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="flex-1 rounded-xl bg-transparent" asChild>
                          <Link href={`/profile/${profile.id}`}>
                            <i className="fa-solid fa-message mr-2"></i>
                            Message
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110 hover:bg-white z-10"
            >
              <i className="fa-solid fa-chevron-left text-lg sm:text-xl"></i>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110 hover:bg-white z-10"
            >
              <i className="fa-solid fa-chevron-right text-lg sm:text-xl"></i>
            </button>

            {/* Dots Indicator */}
            <div className="absolute -bottom-8 sm:-bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
              {profiles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-6 sm:w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
