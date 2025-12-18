"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"
import { Skeleton } from "@/components/ui/skeleton"

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
  listingTitle: string | null
  about: string | null
}

function EscortCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden animate-pulse">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

export function EscortsListingSection() {
  const { data, isLoading } = useSWR<{ results: Profile[], count: number }>(
    '/api/escorts?limit=8',
    fetcher,
    { revalidateOnFocus: false }
  )

  const profiles = data?.results || []

  return (
    <section className="border-b bg-muted/10 py-16 md:py-24 relative">
      {/* Section floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-3xl text-pink-500/10 animate-float-slow">
          <i className="fa-solid fa-heart"></i>
        </div>
        <div className="absolute bottom-10 right-10 text-4xl text-primary/10 animate-float-medium">
          <i className="fa-solid fa-fire"></i>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm mb-4 shadow-sm">
                <i className="fa-solid fa-fire text-primary animate-pulse"></i>
                <span className="font-medium">Hot Picks</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight font-serif sm:text-4xl md:text-5xl">
                Available <span className="text-primary">Escorts</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                Browse our selection of verified premium companions
              </p>
            </div>
            <Button variant="outline" className="mt-6 md:mt-0 rounded-xl" asChild>
              <Link href="/listings">
                <i className="fa-solid fa-arrow-right mr-2"></i>
                View All Escorts
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoading ? (
              // Skeleton loading
              Array.from({ length: 8 }).map((_, i) => (
                <EscortCardSkeleton key={i} />
              ))
            ) : profiles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">👋</div>
                <h3 className="text-xl font-semibold mb-2">No escorts available yet</h3>
                <p className="text-muted-foreground">Check back soon for new profiles!</p>
              </div>
            ) : (
              profiles.map((profile, index) => (
                <Link
                  key={profile.id}
                  href={`/profile/${profile.id}`}
                  className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <Image
                      src={profile.mainPhotoUrl || "/placeholder.jpg"}
                      alt={profile.displayName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {profile.isVerified && (
                        <Badge className="bg-green-500 text-white border-0 text-xs">
                          <i className="fa-solid fa-shield-check mr-1"></i>
                          Verified
                        </Badge>
                      )}
                      {profile.isVip && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                          <i className="fa-solid fa-crown mr-1"></i>
                          VIP
                        </Badge>
                      )}
                    </div>

                    {/* Availability - randomly show online for visual variety */}
                    <div className="absolute top-3 right-3">
                      {index % 3 !== 2 ? (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                          Online
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-gray-500/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          <span className="h-2 w-2 rounded-full bg-white/70"></span>
                          Offline
                        </span>
                      )}
                    </div>

                    {/* Like Button */}
                    <button 
                      className="absolute top-12 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110 hover:bg-white"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fa-regular fa-heart text-primary"></i>
                    </button>

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                      <div className="flex items-end justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-bold truncate">
                            {profile.displayName}{profile.age ? `, ${profile.age}` : ''}
                          </h3>
                          {profile.city && (
                            <p className="text-xs sm:text-sm text-white/80 flex items-center gap-1 truncate">
                              <i className="fa-solid fa-location-dot text-[10px]"></i>
                              {profile.city.name}
                            </p>
                          )}
                        </div>
                        {profile.rateHourly && (
                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="text-base sm:text-lg font-bold text-primary">₹{profile.rateHourly}</div>
                            <div className="text-[10px] sm:text-xs text-white/70">/hour</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Bar */}
                  <div className="p-2 sm:p-3 flex items-center justify-between bg-card">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <i className="fa-solid fa-star text-xs sm:text-sm"></i>
                        <span className="font-semibold text-foreground text-xs sm:text-sm">4.9</span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">(127 reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-message text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"></i>
                      <i className="fa-solid fa-video text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"></i>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Load More */}
          <div className="mt-10 sm:mt-12 text-center">
            <Button size="lg" className="rounded-xl px-6 sm:px-8 group" asChild>
              <Link href="/listings">
                <i className="fa-solid fa-grid-2 mr-2 group-hover:rotate-90 transition-transform duration-300"></i>
                Browse All Escorts
                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">{data?.count || 0}+</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
