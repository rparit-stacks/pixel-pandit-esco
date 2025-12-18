"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileCard, type EscortListItem } from "@/components/profile-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import useSWR from "swr"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

// Services list
const SERVICES = [
  "Dinner Dates",
  "Events",
  "Travel Companion",
  "Massage",
  "Girlfriend Experience",
  "Photoshoots",
  "Video Calls",
  "VIP Experience",
]

// Card skeleton
function ProfileCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden animate-pulse">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function ListingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get initial values from URL
  const initialCity = searchParams.get("city") || ""
  const initialService = searchParams.get("service") || ""
  const initialVerified = searchParams.get("verified") === "true"
  const initialVip = searchParams.get("vip") === "true"
  const initialOnline = searchParams.get("online") === "true"
  const initialSort = searchParams.get("sort") || "newest"
  const initialSearch = searchParams.get("q") || ""
  
  // Filter states
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [selectedService, setSelectedService] = useState(initialService)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [verifiedOnly, setVerifiedOnly] = useState(initialVerified)
  const [vipOnly, setVipOnly] = useState(initialVip)
  const [onlineOnly, setOnlineOnly] = useState(initialOnline)
  const [sortBy, setSortBy] = useState(initialSort)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  
  // Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [nearbyMode, setNearbyMode] = useState(false)
  
  // Favorites
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  
  // Fetch cities
  const { data: citiesData } = useSWR<{ cities: { slug: string; name: string }[] }>(
    "/api/cities",
    fetcher
  )
  
  // Build API URL with filters
  const buildApiUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedCity) params.set("city", selectedCity)
    if (verifiedOnly) params.set("verified", "true")
    if (vipOnly) params.set("vip", "true")
    if (searchQuery) params.set("q", searchQuery)
    // Add location params if nearby mode is enabled
    if (nearbyMode && userLocation) {
      params.set("lat", userLocation.lat.toString())
      params.set("lng", userLocation.lng.toString())
      params.set("radius", "50") // 50km default radius
    }
    params.set("limit", "50")
    return `/api/escorts?${params.toString()}`
  }, [selectedCity, verifiedOnly, vipOnly, searchQuery, nearbyMode, userLocation])
  
  // Fetch escorts
  const { data: escortsData, isLoading, mutate } = useSWR<{ results: EscortListItem[], count: number }>(
    buildApiUrl(),
    fetcher
  )
  
  // Get user location
  const getUserLocation = () => {
    setLoadingLocation(true)
    setLocationError(null)
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setLoadingLocation(false)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setNearbyMode(true)
        setLoadingLocation(false)
      },
      (error) => {
        setLocationError("Unable to get your location. Please enable location services.")
        setLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCity) params.set("city", selectedCity)
    if (selectedService) params.set("service", selectedService)
    if (verifiedOnly) params.set("verified", "true")
    if (vipOnly) params.set("vip", "true")
    if (onlineOnly) params.set("online", "true")
    if (sortBy !== "newest") params.set("sort", sortBy)
    if (searchQuery) params.set("q", searchQuery)
    
    const newUrl = params.toString() ? `/listings?${params.toString()}` : "/listings"
    router.replace(newUrl, { scroll: false })
  }, [selectedCity, selectedService, verifiedOnly, vipOnly, onlineOnly, sortBy, searchQuery, router])
  
  // Filter and sort escorts
  const getFilteredEscorts = () => {
    let escorts = escortsData?.results || []
    
    // Filter by service
    if (selectedService) {
      escorts = escorts.filter(e => e.services?.includes(selectedService))
    }
    
    // Filter by price range
    escorts = escorts.filter(e => {
      const rate = e.rateHourly || 0
      return rate >= priceRange[0] && rate <= priceRange[1]
    })
    
    // Filter online only (simulate with index for now)
    if (onlineOnly) {
      escorts = escorts.filter((_, i) => i % 3 !== 2) // Simulated
    }
    
    // Sort
    switch (sortBy) {
      case "price_low":
        escorts = [...escorts].sort((a, b) => (a.rateHourly || 0) - (b.rateHourly || 0))
        break
      case "price_high":
        escorts = [...escorts].sort((a, b) => (b.rateHourly || 0) - (a.rateHourly || 0))
        break
      case "rating":
        // Simulated rating sort
        escorts = [...escorts].sort(() => Math.random() - 0.5)
        break
      case "distance":
        if (nearbyMode && userLocation) {
          // Sort by distance (already sorted by API when location params are provided)
          escorts = [...escorts].sort((a, b) => {
            const distA = a.distance ?? Infinity
            const distB = b.distance ?? Infinity
            return distA - distB
          })
        }
        break
      default: // newest
        break
    }
    
    return escorts
  }
  
  const filteredEscorts = getFilteredEscorts()
  const cities = citiesData?.cities || []
  
  // Toggle favorite
  const toggleFavorite = async (id: string, isFav: boolean) => {
    try {
      const res = await fetch("/api/favorites", {
        method: isFav ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: id }),
      })
      if (res.ok) {
        setFavorites(prev => ({ ...prev, [id]: isFav }))
      }
    } catch (error) {
      console.error("Failed to update favorite:", error)
    }
  }
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCity("")
    setSelectedService("")
    setPriceRange([0, 50000])
    setVerifiedOnly(false)
    setVipOnly(false)
    setOnlineOnly(false)
    setSortBy("newest")
    setSearchQuery("")
    setNearbyMode(false)
  }
  
  const activeFiltersCount = [
    selectedCity,
    selectedService,
    verifiedOnly,
    vipOnly,
    onlineOnly,
    nearbyMode,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8">
        <div className="mx-auto max-w-[1600px]">
          {/* Breadcrumb */}
          <div className="mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <i className="fa-solid fa-chevron-right text-[10px]"></i>
              <span>All Profiles</span>
            </p>
          </div>

          {/* Page Header */}
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-serif flex items-center gap-3">
                All Companions
                <Badge className="bg-green-500 text-white border-0 animate-pulse">
                  <i className="fa-solid fa-circle text-[8px] mr-1.5"></i>
                  Live
                </Badge>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                {filteredEscorts.length} profiles available
                {selectedCity && ` in ${cities.find(c => c.slug === selectedCity)?.name || selectedCity}`}
              </p>
            </div>
            
            {/* Location Button */}
            <Button
              variant={nearbyMode ? "default" : "outline"}
              className="rounded-xl gap-2"
              onClick={getUserLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                <i className="fa-solid fa-location-crosshairs"></i>
              )}
              {nearbyMode ? "Nearby Mode Active" : "Find Near Me"}
            </Button>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-6 md:mb-8 space-y-4">
            {/* Search */}
            <div className="relative">
              <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
              <Input
                placeholder="Search by name, city, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-xl text-base"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                >
                  <i className="fa-solid fa-xmark"></i>
                </Button>
              )}
            </div>
            
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* City Filter */}
              <Select value={selectedCity || "all"} onValueChange={(v) => setSelectedCity(v === "all" ? "" : v)}>
                <SelectTrigger className="w-auto min-w-[140px] rounded-xl">
                  <i className="fa-solid fa-location-dot mr-2 text-primary"></i>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.slug} value={city.slug}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Service Filter */}
              <Select value={selectedService || "all"} onValueChange={(v) => setSelectedService(v === "all" ? "" : v)}>
                <SelectTrigger className="w-auto min-w-[160px] rounded-xl">
                  <i className="fa-solid fa-concierge-bell mr-2 text-primary"></i>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {SERVICES.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-auto min-w-[140px] rounded-xl">
                  <i className="fa-solid fa-arrow-up-wide-short mr-2 text-primary"></i>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  {userLocation && <SelectItem value="distance">Nearest First</SelectItem>}
                </SelectContent>
              </Select>
              
              {/* Quick Filters */}
              <Button
                variant={verifiedOnly ? "default" : "outline"}
                size="sm"
                className="rounded-xl gap-2"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
              >
                <i className="fa-solid fa-shield-check"></i>
                <span className="hidden sm:inline">Verified</span>
              </Button>
              
              <Button
                variant={vipOnly ? "default" : "outline"}
                size="sm"
                className="rounded-xl gap-2"
                onClick={() => setVipOnly(!vipOnly)}
              >
                <i className="fa-solid fa-crown"></i>
                <span className="hidden sm:inline">VIP</span>
              </Button>
              
              <Button
                variant={onlineOnly ? "default" : "outline"}
                size="sm"
                className="rounded-xl gap-2"
                onClick={() => setOnlineOnly(!onlineOnly)}
              >
                <i className="fa-solid fa-circle text-green-500"></i>
                <span className="hidden sm:inline">Online</span>
              </Button>
              
              {/* More Filters */}
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl gap-2">
                    <i className="fa-solid fa-sliders"></i>
                    <span className="hidden sm:inline">More Filters</span>
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[320px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <i className="fa-solid fa-filter text-primary"></i>
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="py-6 space-y-6">
                    {/* Price Range */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <i className="fa-solid fa-indian-rupee-sign text-primary"></i>
                        Price Range (per hour)
                      </Label>
                      <Slider
                        value={priceRange}
                        onValueChange={(v) => setPriceRange(v as [number, number])}
                        min={0}
                        max={50000}
                        step={500}
                        className="mt-2"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>₹{priceRange[0].toLocaleString()}</span>
                        <span>₹{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Checkboxes */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold">Quick Filters</Label>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="verified"
                          checked={verifiedOnly}
                          onCheckedChange={(c) => setVerifiedOnly(c as boolean)}
                        />
                        <label htmlFor="verified" className="text-sm flex items-center gap-2 cursor-pointer">
                          <i className="fa-solid fa-shield-check text-green-500"></i>
                          Verified Profiles Only
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="vip"
                          checked={vipOnly}
                          onCheckedChange={(c) => setVipOnly(c as boolean)}
                        />
                        <label htmlFor="vip" className="text-sm flex items-center gap-2 cursor-pointer">
                          <i className="fa-solid fa-crown text-amber-500"></i>
                          VIP Only
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="online"
                          checked={onlineOnly}
                          onCheckedChange={(c) => setOnlineOnly(c as boolean)}
                        />
                        <label htmlFor="online" className="text-sm flex items-center gap-2 cursor-pointer">
                          <i className="fa-solid fa-circle text-green-500 text-xs"></i>
                          Online Now
                        </label>
                      </div>
                    </div>
                    
                    {/* Services */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <i className="fa-solid fa-concierge-bell text-primary"></i>
                        Services
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {SERVICES.map((service) => (
                          <Button
                            key={service}
                            variant={selectedService === service ? "default" : "outline"}
                            size="sm"
                            className="rounded-full text-xs"
                            onClick={() => setSelectedService(selectedService === service ? "" : service)}
                          >
                            {service}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <SheetFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={clearFilters}>
                      <i className="fa-solid fa-rotate-left mr-2"></i>
                      Clear All
                    </Button>
                    <Button className="flex-1" onClick={() => setFilterSheetOpen(false)}>
                      <i className="fa-solid fa-check mr-2"></i>
                      Apply
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              
              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-muted-foreground hover:text-foreground"
                  onClick={clearFilters}
                >
                  <i className="fa-solid fa-xmark mr-1"></i>
                  Clear
                </Button>
              )}
            </div>
            
            {/* Location Status */}
            {locationError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 text-sm">
                <i className="fa-solid fa-triangle-exclamation"></i>
                {locationError}
              </div>
            )}
            
            {nearbyMode && userLocation && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-600 text-sm">
                <i className="fa-solid fa-location-dot"></i>
                Showing escorts near your location
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-6 px-2 text-green-600"
                  onClick={() => setNearbyMode(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </Button>
              </div>
            )}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <ProfileCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredEscorts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                <i className="fa-solid fa-user-slash text-3xl text-muted-foreground"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">No profiles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={clearFilters} className="rounded-xl">
                <i className="fa-solid fa-rotate-left mr-2"></i>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredEscorts.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  isFavorited={favorites[profile.id]}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
          
          {/* Post Ad CTA */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-pink-500/10 border border-primary/20 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-500 mb-4">
              <i className="fa-solid fa-star text-2xl text-white"></i>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Want to be listed here?</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Join thousands of professionals earning on our platform. Get verified and start receiving bookings today.
            </p>
            <Button size="lg" className="rounded-xl" asChild>
              <Link href="/signup?role=escort">
                <i className="fa-solid fa-rocket mr-2"></i>
                Become an Escort
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
