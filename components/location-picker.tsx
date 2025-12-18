"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Navigation, Search } from "lucide-react"
import { toast } from "sonner"

interface LocationPickerProps {
  lat?: number | null
  lng?: number | null
  radius?: number | null
  address?: string | null
  onLocationChange: (data: { lat: number; lng: number; radius: number; address: string }) => void
  disabled?: boolean
}

const RADIUS_OPTIONS = [
  { value: 1, label: "1 km" },
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 20, label: "20 km" },
  { value: 50, label: "50 km" },
  { value: 100, label: "100 km" },
]

export function LocationPicker({
  lat: initialLat,
  lng: initialLng,
  radius: initialRadius,
  address: initialAddress,
  onLocationChange,
  disabled = false,
}: LocationPickerProps) {
  const [lat, setLat] = useState<number | null>(initialLat ?? null)
  const [lng, setLng] = useState<number | null>(initialLng ?? null)
  const [radius, setRadius] = useState<number>(initialRadius ?? 10)
  const [address, setAddress] = useState<string>(initialAddress ?? "")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Update parent when location changes
  useEffect(() => {
    if (lat !== null && lng !== null && address) {
      onLocationChange({ lat, lng, radius, address })
    }
  }, [lat, lng, radius, address, onLocationChange])

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLat = position.coords.latitude
        const newLng = position.coords.longitude
        setLat(newLat)
        setLng(newLng)

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`
          )
          if (response.ok) {
            const data = await response.json()
            const addr = data.display_name || `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`
            setAddress(addr)
          } else {
            setAddress(`${newLat.toFixed(6)}, ${newLng.toFixed(6)}`)
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error)
          setAddress(`${newLat.toFixed(6)}, ${newLng.toFixed(6)}`)
        }
        setIsGettingLocation(false)
        toast.success("Location detected!")
      },
      (error) => {
        setIsGettingLocation(false)
        console.error("Geolocation error:", error)
        toast.error("Failed to get your location. Please enable location permissions.")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  // Search for location by address
  const searchLocation = async () => {
    if (!address.trim()) {
      toast.error("Please enter an address")
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      )
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          const result = data[0]
          const newLat = parseFloat(result.lat)
          const newLng = parseFloat(result.lon)
          setLat(newLat)
          setLng(newLng)
          setAddress(result.display_name || address)
          toast.success("Location found!")
        } else {
          toast.error("Address not found. Please try a different address.")
        }
      } else {
        toast.error("Failed to search location")
      }
    } catch (error) {
      console.error("Geocoding error:", error)
      toast.error("Failed to search location")
    }
    setIsSearching(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Location</Label>
        <div className="flex gap-2">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address or use 'My Location' button"
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                searchLocation()
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={searchLocation}
            disabled={disabled || isSearching}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            disabled={disabled || isGettingLocation}
          >
            <Navigation className="h-4 w-4 mr-2" />
            {isGettingLocation ? "Getting..." : "My Location"}
          </Button>
        </div>
        {lat !== null && lng !== null && (
          <p className="text-xs text-muted-foreground">
            Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Service Radius</Label>
        <Select
          value={radius.toString()}
          onValueChange={(value) => setRadius(parseFloat(value))}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select radius" />
          </SelectTrigger>
          <SelectContent>
            {RADIUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          I provide services within {radius} km from this location
        </p>
      </div>

      {lat !== null && lng !== null && (
        <div className="rounded-lg border p-3 bg-muted/40">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Selected Location</p>
              <p className="text-xs text-muted-foreground break-words">{address}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Radius: {radius} km
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

