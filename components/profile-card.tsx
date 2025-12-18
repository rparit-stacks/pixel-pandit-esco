"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"

export type EscortListItem = {
  id: string
  displayName: string
  age?: number | null
  city?: { name: string; slug: string } | null
  rateHourly?: number | string | null
  isVerified: boolean
  isVip: boolean
  isOnline?: boolean
  callsEnabled?: boolean
  mainPhotoUrl: string | null
  services: string[]
  listingTitle?: string | null
  about?: string | null
  distance?: number | null // Distance in kilometers
  locationAddress?: string | null
}

interface ProfileCardProps {
  profile: EscortListItem
  onToggleFavorite?: (id: string, isFav: boolean) => Promise<void> | void
  isFavorited?: boolean
}

export function ProfileCard({ profile, onToggleFavorite, isFavorited }: ProfileCardProps) {
  const [fav, setFav] = useState(Boolean(isFavorited))
  const [isPending, startTransition] = useTransition()

  const toggleFavorite = () => {
    if (!onToggleFavorite) return
    const next = !fav
    setFav(next)
    startTransition(async () => {
      try {
        await onToggleFavorite(profile.id, next)
      } catch {
        setFav(!next)
      }
    })
  }

  return (
    <Card className="group overflow-hidden border-border transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] md:hover:scale-[1.03] hover:-translate-y-1 md:hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4">
      <Link href={`/profile/${profile.id}`} className="block">
        <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <Image
            src={profile.mainPhotoUrl || "/placeholder.jpg"}
            alt={profile.displayName}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* VIP Badge */}
          {profile.isVip && (
            <div className="absolute left-2 top-2 md:left-4 md:top-4 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg animate-pulse">
              <Star className="h-4 w-4 md:h-5 md:w-5 fill-white text-white" />
            </div>
          )}

          {/* Verified Badge */}
          {profile.isVerified && (
            <Badge className="absolute right-2 top-2 md:right-4 md:top-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 shadow-lg border-0 animate-in slide-in-from-right">
              <i className="fa-solid fa-circle-check mr-0.5 md:mr-1"></i>
              Verified
            </Badge>
          )}

          {/* Online Badge */}
          {profile.isOnline && (
            <Badge className="absolute bottom-2 left-2 md:bottom-4 md:left-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 shadow-lg border-0 flex items-center gap-1">
              <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white animate-pulse"></span>
              Online
            </Badge>
          )}

          {/* Favorite Button */}
          <div className="absolute right-2 bottom-2 md:right-4 md:bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  toggleFavorite()
                }}
                disabled={isPending}
                className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-xl transition-all hover:scale-110 hover:bg-white disabled:opacity-60"
              >
                <Heart className={`h-4 w-4 md:h-5 md:w-5 transition-all ${fav ? "fill-red-500 text-red-500 scale-110" : "text-gray-700"}`} />
              </button>
            )}
          </div>
        </div>

        <div className="p-3 md:p-5 space-y-2 md:space-y-3 bg-gradient-to-br from-card to-card/50">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base md:text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">{profile.displayName}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {profile.city && (
                  <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                    <i className="fa-solid fa-location-dot text-[10px] md:text-xs"></i>
                    {profile.city.name}
                  </p>
                )}
                {profile.distance !== null && profile.distance !== undefined && (
                  <p className="text-xs md:text-sm text-primary font-semibold flex items-center gap-1">
                    <i className="fa-solid fa-route text-[10px] md:text-xs"></i>
                    {profile.distance < 1 
                      ? `${Math.round(profile.distance * 1000)}m away`
                      : `${profile.distance.toFixed(1)}km away`
                    }
                  </p>
                )}
              </div>
            </div>
            {profile.rateHourly && (
              <div className="text-right flex-shrink-0">
                <p className="text-base md:text-lg font-bold text-primary">₹{profile.rateHourly}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">/hour</p>
              </div>
            )}
          </div>
          
          {profile.about && (
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed hidden sm:block">
              {profile.about}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 md:gap-1.5">
            {profile.services.slice(0, 2).map((s) => (
              <Badge key={s} variant="secondary" className="text-[10px] md:text-xs px-1.5 md:px-2.5 py-0.5 hover:bg-primary hover:text-primary-foreground transition-colors">
                {s}
              </Badge>
            ))}
            {profile.services.length > 2 && (
              <Badge variant="secondary" className="text-[10px] md:text-xs px-1.5 md:px-2.5 py-0.5">
                +{profile.services.length - 2}
              </Badge>
            )}
          </div>
          
          <div className="pt-1 md:pt-2 flex items-center justify-between text-xs md:text-sm">
            <span className="font-semibold text-primary group-hover:underline flex items-center gap-1">
              View Profile
              <i className="fa-solid fa-arrow-right text-[10px] md:text-xs transform group-hover:translate-x-1 transition-transform"></i>
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 md:h-3.5 md:w-3.5 fill-amber-500 text-amber-500" />
              <span className="text-[10px] md:text-xs font-medium">4.9</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
