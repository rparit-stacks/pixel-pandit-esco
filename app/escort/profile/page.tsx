"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { 
  Upload, 
  Save, 
  Camera, 
  User, 
  MapPin, 
  DollarSign,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { LoadingPage } from "@/components/ui/loading-spinner"
import { toast } from "sonner"

type ProfileData = {
  id: string
  displayName: string
  bio: string | null
  age: number | null
  cityId: string | null
  cityName: string | null
  rateHourly: number | null
  rateTwoHours: number | null
  rateOvernight: number | null
  mainPhotoUrl: string | null
  isVerified: boolean
  isVip: boolean
  services: string[]
  whatsappNumber?: string | null
  phoneNumber?: string | null
}

type City = {
  id: string
  name: string
  slug: string
}

const AVAILABLE_SERVICES = [
  "Dinner Dates",
  "Social Events",
  "Travel Companion",
  "GFE Experience",
  "Business Events",
  "Private Parties",
  "Weekend Getaways",
  "Massage",
  "Video Calls",
  "Phone Calls"
]

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load")
  return res.json()
}

export default function EscortProfileManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [age, setAge] = useState("")
  const [cityId, setCityId] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [rateHourly, setRateHourly] = useState("")
  const [rateTwoHours, setRateTwoHours] = useState("")
  const [rateOvernight, setRateOvernight] = useState("")
  const [services, setServices] = useState<string[]>([])
  
  const { data: profile, isLoading: profileLoading, mutate } = useSWR<ProfileData>(
    status === "authenticated" ? "/api/escort/profile" : null,
    fetcher
  )

  const { data: citiesData } = useSWR<{ cities: City[] }>(
    "/api/cities",
    fetcher
  )

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "")
      setBio(profile.bio || "")
      setAge(profile.age?.toString() || "")
      setCityId(profile.cityId || "")
      setWhatsappNumber(profile.whatsappNumber || "")
      setPhoneNumber(profile.phoneNumber || "")
      setRateHourly(profile.rateHourly?.toString() || "")
      setRateTwoHours(profile.rateTwoHours?.toString() || "")
      setRateOvernight(profile.rateOvernight?.toString() || "")
      setServices(profile.services || [])
    }
  }, [profile])

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRedirecting(true)
      router.replace("/login")
    }
  }, [status, router])

  const toggleService = (service: string) => {
    setServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/escort/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          bio,
          age: age ? parseInt(age) : null,
          cityId: cityId || null,
          whatsappNumber: whatsappNumber || null,
          phoneNumber: phoneNumber || null,
          rateHourly: rateHourly ? parseInt(rateHourly) : null,
          rateTwoHours: rateTwoHours ? parseInt(rateTwoHours) : null,
          rateOvernight: rateOvernight ? parseInt(rateOvernight) : null,
          services
        })
      })

      if (!res.ok) throw new Error("Failed to save")
      
      await mutate()
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to save changes", {
        description: "Please try again later"
      })
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || profileLoading) {
    return <LoadingPage message="Loading your profile..." />
  }

  if (status === "unauthenticated" || isRedirecting) {
    return <LoadingPage message="Redirecting to login..." />
  }

  const cities = citiesData?.cities || []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Saving Overlay */}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-card shadow-2xl">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-lg font-medium">Saving changes...</p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-6 py-8 md:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <i className="fa-solid fa-user-pen mr-3 text-primary"></i>
              Edit Profile
            </h1>
            <p className="mt-2 text-muted-foreground">
              Update your profile information and services
            </p>
          </div>
          <div className="flex items-center gap-3">
            {profile?.isVerified && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
            {profile?.isVip && (
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                <Sparkles className="mr-1 h-3 w-3" />
                VIP
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Profile Photo
              </CardTitle>
              <CardDescription>
                Your main photo appears on listings and search results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={profile?.mainPhotoUrl || undefined} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {displayName.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button asChild>
                    <Link href="/escort/photos">
                      <Upload className="mr-2 h-4 w-4" />
                      Manage Photos
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG. Min 1200x1600px recommended
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Contact & Location
              </CardTitle>
              <CardDescription>
                Where you are based and how clients can reach you (shown only to approved users if you want).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input 
                    id="whatsapp"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This can be used for quick WhatsApp contact (optional).
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Direct call number (optional).
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Base City / Location</Label>
                <Select value={cityId} onValueChange={setCityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your main working city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input 
                    id="displayName" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your age"
                    min="18"
                    max="99"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={cityId} onValueChange={setCityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your main city / location" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={6}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell clients about yourself, your personality, and what makes you special..."
                />
                <p className="text-xs text-muted-foreground">
                  {bio.length}/1000 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Rates
              </CardTitle>
              <CardDescription>
                Set your hourly and package rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                  <Input 
                    id="hourlyRate" 
                    type="number" 
                    value={rateHourly}
                    onChange={(e) => setRateHourly(e.target.value)}
                    placeholder="500"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twoHourRate">2 Hour Rate (₹)</Label>
                  <Input 
                    id="twoHourRate" 
                    type="number" 
                    value={rateTwoHours}
                    onChange={(e) => setRateTwoHours(e.target.value)}
                    placeholder="900"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overnightRate">Overnight (₹)</Label>
                  <Input 
                    id="overnightRate" 
                    type="number" 
                    value={rateOvernight}
                    onChange={(e) => setRateOvernight(e.target.value)}
                    placeholder="2500"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Services Offered
              </CardTitle>
              <CardDescription>
                Select the services you provide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {AVAILABLE_SERVICES.map((service) => (
                  <div key={service} className="flex items-center space-x-3">
                    <Checkbox 
                      id={service} 
                      checked={services.includes(service)}
                      onCheckedChange={() => toggleService(service)}
                    />
                    <Label htmlFor={service} className="font-normal cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {services.length} services selected
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => router.push("/escort/dashboard")}
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving || !displayName.trim()}
              className="min-w-[140px]"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
