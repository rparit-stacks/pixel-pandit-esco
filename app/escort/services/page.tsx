"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useRef } from "react"
import useSWR from "swr"
import { LoadingPage } from "@/components/ui/loading-spinner"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "@/components/rich-text-editor"
import { LocationPicker } from "@/components/location-picker"
import {
  LayoutDashboard,
  Sparkles,
  Plus,
  Trash2,
  Pencil,
  Clock,
  MapPin,
  IndianRupee,
  Search,
  Filter,
} from "lucide-react"
import Link from "next/link"

type Service = {
  id: string
  name: string
  description: string
  price: number
  duration: string | null
  locationLat: number | null
  locationLng: number | null
  locationRadius: number | null
  locationAddress: string | null
  conditions: string | null
  status: "ACTIVE" | "INACTIVE"
  createdAt: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load")
  return res.json()
}

export default function EscortServicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL")

  const { data, isLoading, mutate } = useSWR<{ services: Service[] }>(
    status === "authenticated" ? "/api/escort/services" : null,
    fetcher
  )

  const services = data?.services ?? []

  // Form state
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("")
  const [locationLat, setLocationLat] = useState<number | null>(null)
  const [locationLng, setLocationLng] = useState<number | null>(null)
  const [locationRadius, setLocationRadius] = useState<number>(10)
  const [locationAddress, setLocationAddress] = useState("")
  const [conditions, setConditions] = useState("")
  const [description, setDescription] = useState("")
  const [serviceStatus, setServiceStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE")

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRedirecting(true)
      router.replace("/login")
    }
  }, [status, router])

  useEffect(() => {
    // load selected service into form
    if (!selectedId) {
      setName("")
      setPrice("")
      setDuration("")
      setLocationLat(null)
      setLocationLng(null)
      setLocationRadius(10)
      setLocationAddress("")
      setConditions("")
      setDescription("")
      setServiceStatus("ACTIVE")
      return
    }
    const svc = services.find((s) => s.id === selectedId)
    if (!svc) return
    setName(svc.name)
    setPrice(svc.price.toString())
    setDuration(svc.duration || "")
    setLocationLat(svc.locationLat)
    setLocationLng(svc.locationLng)
    setLocationRadius(svc.locationRadius || 10)
    setLocationAddress(svc.locationAddress || "")
    setConditions(svc.conditions || "")
    setDescription(svc.description || "")
    setServiceStatus(svc.status || "ACTIVE")
  }, [selectedId, services])

  const handleNew = () => {
    setSelectedId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return
    try {
      const res = await fetch(`/api/escort/services/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Delete failed")
      await mutate()
      if (selectedId === id) setSelectedId(null)
      toast.success("Service deleted")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete service")
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Service name is required")
      return
    }
    const html = description.trim()
    if (!html) {
      toast.error("Description is required")
      return
    }
    const numericPrice = Number(price || 0)
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      toast.error("Price must be a number")
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        description: html,
        price: numericPrice,
        duration: duration.trim() || null,
        locationLat: locationLat,
        locationLng: locationLng,
        locationRadius: locationRadius,
        locationAddress: locationAddress.trim() || null,
        conditions: conditions || null,
        status: serviceStatus,
      }

      const res = await fetch(
        selectedId ? `/api/escort/services/${selectedId}` : "/api/escort/services",
        {
          method: selectedId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) throw new Error("Save failed")

      await mutate()
      if (!selectedId) {
        const json = await res.json()
        setSelectedId(json.service.id)
      }
      toast.success("Service saved")
    } catch (err) {
      console.error(err)
      toast.error("Failed to save service")
    } finally {
      setSaving(false)
    }
  }

  const filteredAndSortedServices = useMemo(() => {
    let filtered = services

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.locationAddress?.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((s) => s.status === statusFilter)
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [services, searchQuery, statusFilter])

  // Loading / auth states
  if (status === "loading" || isLoading) {
    return <LoadingPage message="Loading your services..." />
  }

  if (status === "unauthenticated" || isRedirecting) {
    return <LoadingPage message="Redirecting to login..." />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar with list of services */}
        <aside className="w-72 flex-shrink-0 rounded-2xl bg-card border border-border/60 shadow-sm flex flex-col">
          <div className="p-4 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">My Services</p>
                <p className="text-xs text-muted-foreground">
                  Create custom offerings
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 border-b border-border/40 space-y-2">
            <Button
              size="sm"
              className="w-full gap-2"
              onClick={handleNew}
            >
              <Plus className="h-3.5 w-3.5" />
              New Service
            </Button>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
                className="flex-1 h-8 text-xs rounded-md border border-input bg-background px-2 py-1"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredAndSortedServices.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                {searchQuery || statusFilter !== "ALL" 
                  ? "No services match your filters."
                  : 'No services yet. Click "New Service" to create one.'}
              </p>
            ) : (
              filteredAndSortedServices.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => setSelectedId(svc.id)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs border transition-colors ${
                    selectedId === svc.id
                      ? "border-primary/60 bg-primary/5"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-semibold truncate flex-1">{svc.name}</p>
                    <Badge
                      variant={svc.status === "ACTIVE" ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {svc.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                      <IndianRupee className="h-3 w-3" />
                      {svc.price}
                    </span>
                    {svc.duration && (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{svc.duration}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="p-3 border-t border-border/40 text-[11px] text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-3 w-3" />
              <Link href="/escort/dashboard" className="hover:underline">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </aside>

        {/* Main editor */}
        <section className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Service Manager
              </h1>
              <p className="text-sm text-muted-foreground">
                Define your own services with full control over name, description, price and location.
              </p>
            </div>
          </div>

          <Card className="border border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {selectedId ? "Edit Service" : "Create New Service"}
              </CardTitle>
              <CardDescription className="text-xs">
                Everything here is custom – no predefined templates. Describe your service exactly as you like.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Luxury Dinner Date, 2 hours"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 2 hours, 1 night, 3 shots, 120 mins"
                    />
                  </div>
                </div>
              </div>

              {/* Location Picker */}
              <div className="space-y-2">
                <Label>Service Location & Radius</Label>
                <LocationPicker
                  lat={locationLat}
                  lng={locationLng}
                  radius={locationRadius}
                  address={locationAddress}
                  onLocationChange={(data) => {
                    setLocationLat(data.lat)
                    setLocationLng(data.lng)
                    setLocationRadius(data.radius)
                    setLocationAddress(data.address)
                  }}
                  disabled={saving}
                />
                <p className="text-[11px] text-muted-foreground">
                  Set the location where you provide this service and the radius you&apos;re willing to travel.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">Conditions / Notes</Label>
                <Textarea
                  id="conditions"
                  rows={2}
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="Any extra conditions, boundaries, or custom notes."
                />
              </div>

              {/* Rich text editor */}
              <div className="space-y-2">
                <Label>Detailed Description</Label>
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  placeholder="Describe your service in detail. Use formatting to highlight important information..."
                />
                <p className="text-[11px] text-muted-foreground">
                  You can use headings, bullet points, and formatting to describe exactly what is included.
                </p>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-sm">Status</Label>
                  <p className="text-xs text-muted-foreground">
                    {serviceStatus === "ACTIVE" 
                      ? "Service is visible to clients" 
                      : "Service is hidden from clients"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Inactive</span>
                  <Switch
                    checked={serviceStatus === "ACTIVE"}
                    onCheckedChange={(checked) => setServiceStatus(checked ? "ACTIVE" : "INACTIVE")}
                  />
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 gap-2">
                {selectedId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => handleDelete(selectedId)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                )}
                <div className="flex-1" />
                <Button
                  type="button"
                  size="sm"
                  className="gap-1 min-w-[120px]"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Pencil className="h-3.5 w-3.5" />
                      Save Service
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview section */}
          {description && (
            <Card className="border border-dashed border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    Live Preview
                  </Badge>
                  {name || "Service title"}
                </CardTitle>
                <CardDescription className="text-xs flex items-center gap-3">
                  {price && (
                    <span className="inline-flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {price}
                    </span>
                  )}
                  {duration && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {duration}
                    </span>
                  )}
                  {locationAddress && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground" title={locationAddress}>
                      <MapPin className="h-3 w-3" />
                      {locationRadius ? `${locationRadius}km - ` : ""}
                      {locationAddress.length > 30 ? `${locationAddress.substring(0, 30)}...` : locationAddress}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}


