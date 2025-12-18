"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Heart,
  Share2,
  MessageSquare,
  Award,
  Briefcase,
  Calendar,
  Shield,
  ThumbsUp,
  Phone,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { useParams, useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { LoadingPage } from "@/components/ui/loading-spinner"
import { ServiceCard } from "@/components/service-card"

type EscortDetail = {
  id: string
  displayName: string
  bio?: string | null
  age?: number | null
  city?: { name: string; slug: string }
  rateHourly?: string | null
  isVerified: boolean
  isVip: boolean
  isOnline?: boolean
  callsEnabled?: boolean
  whatsappNumber?: string | null
  phoneNumber?: string | null
  mainPhotoUrl: string | null
  services: string[]
  customServices?: {
    id: string
    name: string
    description: string
    price: number
    duration: string | null
    location: string | null
    conditions: string | null
  }[]
  listing?: { title: string | null; about: string | null }
  photos: { url: string; alt: string | null }[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
    if (res.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/login"
    throw new Error("Unauthorized")
  }
  const text = await res.text()
  if (!res.ok) throw new Error(text || "Failed to load profile")
  return text ? JSON.parse(text) : null
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const isLoggedIn = status === "authenticated" && !!session?.user
  const [isFav, setIsFav] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [requestSent, setRequestSent] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { data, error, isLoading } = useSWR<EscortDetail>(params?.id ? `/api/escorts/${params.id}` : null, fetcher)

  const profile = data

  const toggleFavorite = () => {
    if (!profile || !isLoggedIn) {
      router.push("/login")
      return
    }
    const next = !isFav
    setIsFav(next)
    startTransition(async () => {
      try {
        await fetch("/api/favorites", {
          method: next ? "POST" : "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId: profile.id }),
        })
      } catch {
        setIsFav(!next)
      }
    })
  }

  const sendMessageRequest = async () => {
    if (!profile) return
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/chats/threads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ escortProfileId: profile.id }),
        })
        if (res.ok) {
          setRequestSent(true)
          router.push("/chats")
        }
      } catch (e) {
        console.error("Failed to send message request:", e)
      }
    })
  }

  // Format phone number for WhatsApp link (remove spaces, dashes)
  const getWhatsAppLink = (number: string) => {
    const cleaned = number.replace(/[\s\-\(\)]/g, "")
    return `https://wa.me/${cleaned}`
  }

  // Format phone number for tel: link
  const getPhoneLink = (number: string) => {
    const cleaned = number.replace(/[\s\-\(\)]/g, "")
    return `tel:${cleaned}`
  }

  if (isLoading) {
    return <LoadingPage message="Loading profile..." />
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-8 md:px-8">
          <p className="text-sm text-red-500">Profile not found</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <main className="w-full">
        {/* Breadcrumb */}
        <div className="px-6 md:px-12 lg:px-16 xl:px-20 py-4">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/listings" className="hover:text-foreground transition-colors">
              All Profiles
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{profile.displayName}</span>
          </p>
        </div>

        {/* Hero Section with Cover Photo - Full Width */}
        <div className="relative mb-0 overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-purple-500/5 border-y border-border/30">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-40" />
          
          <div className="relative px-4 md:px-12 lg:px-16 xl:px-20 py-8 md:py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-12 items-start max-w-[1800px] mx-auto">
              {/* Profile Image - Responsive */}
              <div className="relative group flex-shrink-0 mx-auto lg:mx-0">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-700 animate-pulse"></div>
                <div className="relative">
                  <img
                    src={
                      profile.mainPhotoUrl ||
                      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop"
                    }
                    alt={profile.displayName}
                    className="h-48 w-48 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-80 lg:w-80 rounded-[2rem] object-cover ring-4 md:ring-8 ring-background shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  {/* Verified Badge */}
                  {profile.isVerified && (
                    <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-2 md:p-4 shadow-2xl ring-2 md:ring-4 ring-background animate-in zoom-in">
                      <CheckCircle2 className="h-5 w-5 md:h-8 md:w-8 text-white" />
                    </div>
                  )}
                  {/* Online Status */}
                  {profile.isOnline && (
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-full bg-green-500 shadow-lg ring-2 md:ring-4 ring-background animate-pulse">
                      <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-white animate-ping absolute"></div>
                      <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-white relative"></div>
                      <span className="text-white text-xs md:text-sm font-semibold">Online</span>
                    </div>
                  )}
                  {/* VIP Badge */}
                  {profile.isVip && (
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 px-2 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg ring-2 md:ring-4 ring-background">
                      <div className="flex items-center gap-1 md:gap-2">
                        <Star className="h-3 w-3 md:h-4 md:w-4 fill-white text-white" />
                        <span className="text-white text-xs md:text-sm font-bold">VIP</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4 md:space-y-8 min-w-0 w-full">
                <div className="space-y-3 md:space-y-4">
                  {/* Name and Badges */}
                  <div className="flex flex-wrap items-start gap-2 md:gap-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent leading-tight">
                      {profile.displayName}
                    </h1>
                    {profile.age && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base shadow-lg mt-1 md:mt-2">
                        {profile.age} years
                      </Badge>
                    )}
                  </div>
                  
                  {/* Title */}
                  {profile.listing?.title && (
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light">{profile.listing.title}</p>
                  )}
                  
                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Stats Pills - Responsive */}
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Star className="h-4 w-4 md:h-6 md:w-6 fill-amber-500 text-amber-500" />
                    <div className="flex items-baseline gap-1 md:gap-2">
                      <span className="text-lg md:text-2xl font-bold">4.9</span>
                      <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">(247)</span>
                    </div>
                  </div>
                  
                  {/* Location */}
                  {profile.city && (
                    <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <MapPin className="h-4 w-4 md:h-6 md:w-6 text-blue-500" />
                      <span className="text-sm md:text-lg font-semibold">{profile.city.name}</span>
                    </div>
                  )}
                  
                  {/* Rate */}
                  {profile.rateHourly && (
                    <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/30 to-primary/20 backdrop-blur-sm border border-primary/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-baseline gap-1 md:gap-2">
                        <span className="text-xl md:text-3xl font-bold text-primary">₹{profile.rateHourly}</span>
                        <span className="text-[10px] md:text-sm text-muted-foreground">/hr</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Mobile First */}
                <div className="space-y-3 pt-2 md:pt-4">
                  {/* Primary Action - Full Width on Mobile */}
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto px-6 md:px-10 py-4 md:py-6 text-base md:text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-r from-primary via-primary to-primary/80 md:hover:scale-105 group relative overflow-hidden" 
                    onClick={sendMessageRequest} 
                    disabled={isPending || requestSent}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <MessageSquare className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 relative z-10" />
                    <span className="relative z-10">{requestSent ? "Request Sent ✓" : isLoggedIn ? "Send Message" : "Login to Message"}</span>
                  </Button>
                  
                  {/* Secondary Actions Row */}
                  <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-4">
                    {/* WhatsApp Button */}
                    {isLoggedIn && profile.whatsappNumber && (
                      <Button 
                        size="lg" 
                        className="w-full md:w-auto px-4 md:px-8 py-4 md:py-6 text-sm md:text-lg font-semibold bg-gradient-to-r from-green-500 via-green-600 to-green-500 hover:from-green-600 hover:via-green-700 hover:to-green-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 md:hover:scale-105 group relative overflow-hidden"
                        asChild
                      >
                        <a href={getWhatsAppLink(profile.whatsappNumber)} target="_blank" rel="noopener noreferrer">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          <i className="fa-brands fa-whatsapp mr-2 text-lg md:text-2xl relative z-10"></i>
                          <span className="relative z-10">WhatsApp</span>
                        </a>
                      </Button>
                    )}
                    
                    {/* Call Button */}
                    {isLoggedIn && profile.phoneNumber && profile.callsEnabled && (
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="w-full md:w-auto px-4 md:px-8 py-4 md:py-6 text-sm md:text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 md:hover:scale-105 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        asChild
                      >
                        <a href={getPhoneLink(profile.phoneNumber)}>
                          <Phone className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                          <span>Call</span>
                        </a>
                      </Button>
                    )}
                    
                    {/* Favorite Button */}
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="px-4 md:px-6 py-4 md:py-6 shadow-2xl hover:shadow-3xl transition-all duration-500 md:hover:scale-105 border-2" 
                      onClick={toggleFavorite} 
                      disabled={isPending}
                    >
                      <Heart className={`h-5 w-5 md:h-6 md:w-6 transition-all duration-300 ${isFav ? "fill-red-500 text-red-500 scale-110" : ""}`} />
                    </Button>
                    
                    {/* Share Button */}
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="px-4 md:px-6 py-4 md:py-6 shadow-2xl hover:shadow-3xl transition-all duration-500 md:hover:scale-105 border-2"
                    >
                      <Share2 className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                  </div>
                  
                  {/* Login Prompt */}
                  {!isLoggedIn && (profile.whatsappNumber || profile.phoneNumber) && (
                    <div className="w-full mt-2">
                      <p className="text-base text-muted-foreground bg-muted/50 px-6 py-3 rounded-xl border border-border/50">
                        <Link href="/login" className="text-primary hover:underline font-semibold">Login</Link> to see all contact options and connect directly
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-12 lg:px-16 xl:px-20 pb-8 md:pb-16">
          {/* Quick Stats Banner - Responsive */}
          <div className="mb-6 md:mb-10 -mt-4 md:-mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-[1600px] mx-auto">
              {[
                { label: "Response Rate", value: "98%", icon: CheckCircle2, gradient: "from-green-500/20 to-emerald-500/20", iconColor: "text-green-500", borderColor: "border-green-500/30" },
                { label: "Avg Response", value: "24h", icon: Clock, gradient: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-500", borderColor: "border-blue-500/30" },
                { label: "On-Time Rate", value: "100%", icon: Award, gradient: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-500", borderColor: "border-purple-500/30" },
                { label: "Experience", value: "8 yrs", icon: Briefcase, gradient: "from-orange-500/20 to-amber-500/20", iconColor: "text-orange-500", borderColor: "border-orange-500/30" },
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className={`rounded-2xl md:rounded-3xl border ${stat.borderColor} bg-gradient-to-br ${stat.gradient} backdrop-blur-sm p-3 md:p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group animate-in fade-in slide-in-from-bottom-4`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`h-8 w-8 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.iconColor}`} />
                  </div>
                  <div className="text-xl md:text-3xl font-bold mb-0.5 md:mb-1">{stat.value}</div>
                  <div className="text-[10px] md:text-sm text-muted-foreground font-medium leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:gap-10 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] max-w-[1800px] mx-auto">
            {/* Main Content */}
            <div className="space-y-4 md:space-y-8">

              {/* Tabs Section - Modern Pill Design */}
              <Tabs defaultValue="about" className="space-y-4 md:space-y-8">
                <div className="relative">
                  {/* Decorative Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 blur-3xl -z-10"></div>
                  
                  <TabsList className="inline-flex items-center justify-start gap-1 md:gap-2 bg-muted/40 backdrop-blur-xl p-1.5 md:p-2 rounded-full border border-border/50 shadow-2xl overflow-x-auto w-full sm:w-auto">
                    <TabsTrigger 
                      value="about" 
                      className="relative rounded-full px-4 md:px-8 py-2.5 md:py-4 text-sm md:text-base font-bold whitespace-nowrap transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-2xl data-[state=active]:scale-105 hover:scale-105 group flex-1 sm:flex-none"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-data-[state=active]:animate-shimmer transition-opacity"></div>
                      <div className="flex items-center gap-1.5 md:gap-2 relative z-10">
                        <i className="fa-solid fa-user text-base md:text-lg"></i>
                        <span className="hidden sm:inline">About</span>
                      </div>
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="services" 
                      className="relative rounded-full px-4 md:px-8 py-2.5 md:py-4 text-sm md:text-base font-bold whitespace-nowrap transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-2xl data-[state=active]:scale-105 hover:scale-105 group flex-1 sm:flex-none"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-data-[state=active]:animate-shimmer transition-opacity"></div>
                      <div className="flex items-center gap-1.5 md:gap-2 relative z-10">
                        <i className="fa-solid fa-briefcase text-base md:text-lg"></i>
                        <span className="hidden sm:inline">Services</span>
                      </div>
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="portfolio" 
                      className="relative rounded-full px-4 md:px-8 py-2.5 md:py-4 text-sm md:text-base font-bold whitespace-nowrap transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-2xl data-[state=active]:scale-105 hover:scale-105 group flex-1 sm:flex-none"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-data-[state=active]:animate-shimmer transition-opacity"></div>
                      <div className="flex items-center gap-1.5 md:gap-2 relative z-10">
                        <i className="fa-solid fa-images text-base md:text-lg"></i>
                        <span className="hidden sm:inline">Portfolio</span>
                      </div>
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="reviews" 
                      className="relative rounded-full px-4 md:px-8 py-2.5 md:py-4 text-sm md:text-base font-bold whitespace-nowrap transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-2xl data-[state=active]:scale-105 hover:scale-105 group flex-1 sm:flex-none"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-data-[state=active]:animate-shimmer transition-opacity"></div>
                      <div className="flex items-center gap-1.5 md:gap-2 relative z-10">
                        <i className="fa-solid fa-star text-base md:text-lg"></i>
                        <span className="hidden sm:inline">Reviews</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>

              <TabsContent value="about" className="space-y-6">
                <div className="rounded-2xl border bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="mb-4 text-2xl font-bold flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                    About Me
                  </h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {profile.listing?.about ? (
                      <p>{profile.listing.about}</p>
                    ) : (
                      <>
                        <p>
                          With over 8 years of professional experience, I specialize in providing top-quality services.
                          My attention to detail and commitment to excellence has earned me a 4.9-star rating and hundreds of satisfied customers.
                        </p>
                        <p>
                          I follow industry best practices to ensure you receive the highest quality service. I'm fully verified and committed to your satisfaction.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="mb-6 text-2xl font-bold flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-primary" />
                    Services Offered
                  </h3>
                  {profile.customServices && profile.customServices.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {profile.customServices.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                  ) : profile.services && profile.services.length > 0 ? (
                    // Fallback to legacy tags if no custom services
                    <div className="flex flex-wrap gap-2">
                      {profile.services.map((service) => (
                        <Badge key={service} variant="secondary" className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No services listed yet.</p>
                  )}
                </div>

                <div className="rounded-2xl border bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="mb-6 text-2xl font-bold flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                    Verification & Safety
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-background transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <div className="font-semibold">Verified Profile</div>
                        <div className="text-sm text-muted-foreground">Identity confirmed</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-background transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                        <Shield className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-semibold">Safe & Secure</div>
                        <div className="text-sm text-muted-foreground">Privacy protected</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-background transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <Award className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <div className="font-semibold">Top Rated</div>
                        <div className="text-sm text-muted-foreground">Excellent reviews</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-background transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                        <ThumbsUp className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <div className="font-semibold">Trusted Provider</div>
                        <div className="text-sm text-muted-foreground">Reliable service</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <div className="space-y-6">
                  <div className="rounded-2xl border bg-card p-6">
                    <h3 className="mb-4 text-xl font-semibold">Custom Services</h3>
                    {profile.customServices && profile.customServices.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {profile.customServices.map((service) => (
                          <ServiceCard key={service.id} service={service} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Service details will be visible once this profile is fully configured by the provider.
                      </p>
                    )}
                  </div>

                  {profile.rateHourly && (
                    <div className="rounded-2xl border bg-card p-6">
                      <h3 className="mb-2 text-xl font-semibold">Typical Rates</h3>
                      <p className="text-sm text-muted-foreground">
                        This companion&apos;s typical rate is{" "}
                        <span className="font-semibold text-primary">₹{profile.rateHourly}/hr</span>. For exact pricing,
                        please confirm directly in chat.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {profile.photos.length > 0 ? (
                    profile.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index)
                          setLightboxOpen(true)
                        }}
                        className="group relative aspect-square overflow-hidden rounded-2xl border shadow-lg hover:shadow-2xl transition-all duration-300 cursor-zoom-in"
                      >
                        <img
                          src={photo.url}
                          alt={photo.alt || `Photo ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                            <ZoomIn className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-xs md:text-sm font-medium line-clamp-1">{photo.alt || `Photo ${index + 1}`}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 text-muted-foreground">
                      <p>No portfolio photos available</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Image Lightbox */}
              {lightboxOpen && profile.photos.length > 0 && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
                  {/* Close Button */}
                  <button
                    onClick={() => setLightboxOpen(false)}
                    className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
                    {currentImageIndex + 1} / {profile.photos.length}
                  </div>

                  {/* Previous Button */}
                  {profile.photos.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex((prev) => (prev === 0 ? profile.photos.length - 1 : prev - 1))
                      }}
                      className="absolute left-4 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft className="h-8 w-8 text-white" />
                    </button>
                  )}

                  {/* Next Button */}
                  {profile.photos.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex((prev) => (prev === profile.photos.length - 1 ? 0 : prev + 1))
                      }}
                      className="absolute right-4 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight className="h-8 w-8 text-white" />
                    </button>
                  )}

                  {/* Main Image */}
                  <div className="relative max-w-7xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
                    <img
                      src={profile.photos[currentImageIndex].url}
                      alt={profile.photos[currentImageIndex].alt || `Photo ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain rounded-2xl shadow-2xl"
                    />
                    {profile.photos[currentImageIndex].alt && (
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent rounded-b-2xl">
                        <p className="text-white text-lg font-medium">{profile.photos[currentImageIndex].alt}</p>
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {profile.photos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4">
                      {profile.photos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex(index)
                          }}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex ? 'border-primary scale-110' : 'border-white/30 hover:border-white/60'
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt={photo.alt || `Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <TabsContent value="reviews" className="space-y-6">
                {/* Reviews Summary */}
                <div className="rounded-2xl border bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-8 shadow-lg">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-4 border-amber-500/30">
                        <div className="text-5xl font-bold bg-gradient-to-br from-amber-500 to-orange-500 bg-clip-text text-transparent">4.9</div>
                      </div>
                      <div className="flex justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-6 w-6 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Based on 247 reviews</div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { stars: 5, count: 230 },
                        { stars: 4, count: 12 },
                        { stars: 3, count: 3 },
                        { stars: 2, count: 1 },
                        { stars: 1, count: 1 },
                      ].map((item) => (
                        <div key={item.stars} className="flex items-center gap-3">
                          <span className="w-14 text-sm font-medium">{item.stars} star</span>
                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" 
                              style={{ width: `${(item.count / 247) * 100}%` }} 
                            />
                          </div>
                          <span className="w-12 text-right text-sm text-muted-foreground font-medium">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {[
                    {
                      name: "Michael Chen",
                      date: "2 days ago",
                      rating: 5,
                      text: "Absolutely amazing experience! Professional, punctual, and very thorough. Highly recommend!",
                      helpful: 24,
                    },
                    {
                      name: "Emily Rodriguez",
                      date: "1 week ago",
                      rating: 5,
                      text: "Incredible service! Went above and beyond expectations. Will definitely book again.",
                      helpful: 18,
                    },
                    {
                      name: "David Park",
                      date: "2 weeks ago",
                      rating: 5,
                      text: "Best experience I've had. Very professional and detail-oriented. Highly satisfied!",
                      helpful: 15,
                    },
                    {
                      name: "Lisa Thompson",
                      date: "3 weeks ago",
                      rating: 5,
                      text: "Trustworthy, efficient, and excellent service. Worth every penny!",
                      helpful: 12,
                    },
                  ].map((review, index) => (
                    <div key={index} className="rounded-2xl border bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-lg font-bold">
                            {review.name[0]}
                          </div>
                          <div>
                            <div className="font-semibold">{review.name}</div>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">• {review.date}</span>
                            </div>
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                      </div>
                      <p className="mt-4 leading-relaxed text-muted-foreground">{review.text}</p>
                      <div className="mt-4 flex items-center gap-4">
                        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                          <ThumbsUp className="h-4 w-4 group-hover:fill-primary group-hover:text-primary transition-colors" />
                          <span>Helpful ({review.helpful})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-all">
                    Load More Reviews
                  </Button>
                </div>
              </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Response Time */}
              <div className="rounded-2xl border bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 lg:sticky lg:top-6">
              <h3 className="mb-4 text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Availability
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-sm text-muted-foreground">Typical response</span>
                  <span className="font-semibold text-green-500">Within 1 hour</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-sm text-muted-foreground">Response rate</span>
                  <span className="font-semibold">98%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-sm text-muted-foreground">Last active</span>
                  <span className="font-semibold">2 hours ago</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl border bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="mb-4 text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Service Area
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="font-medium">
                      {profile.city?.name || "Location not specified"}
                    </div>
                    {profile.city?.name && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Available in and around {profile.city.name}
                      </div>
                    )}
                  </div>
                </div>
                {profile.city?.name && (
                  <div className="aspect-video overflow-hidden rounded-xl bg-muted border">
                    <img
                      src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&h=800&fit=crop"
                      alt="Service area map"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Safety */}
            <div className="rounded-2xl border bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold">Verified & Safe</h3>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Background checked</span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Identity verified</span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Privacy protected</span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Secure platform</span>
                </li>
              </ul>
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
