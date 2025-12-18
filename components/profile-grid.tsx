"use client"

import { ProfileCard, type EscortListItem } from "@/components/profile-card"
import useSWR from "swr"
import { useState } from "react"
import { LoadingGrid } from "@/components/ui/loading-spinner"

async function fetcher(url: string) {
  const res = await fetch(url)
  if (res.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/login"
    throw new Error("Unauthorized")
  }
  const text = await res.text()
  if (!res.ok) throw new Error(text || "Failed to fetch escorts")
  return text ? JSON.parse(text) : { results: [] }
}

export function ProfileGrid() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const { data, error, isLoading } = useSWR<{ results: EscortListItem[] }>("/api/escorts", fetcher)

  const toggleFavorite = async (id: string, isFav: boolean) => {
    const method = isFav ? "POST" : "DELETE"
    const res = await fetch("/api/favorites", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: id }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || "Failed to update favorite")
    }
    setFavorites((prev) => ({ ...prev, [id]: isFav }))
    // Optionally refresh saved list; we leave escorts list as-is
  }

  if (isLoading) return <LoadingGrid count={10} />
  if (error) return <p className="text-sm text-red-500">Failed to load escorts</p>
  if (!data?.results?.length) return <p className="text-sm text-muted-foreground">No escorts found</p>

  const items = data?.results ?? []

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          isFavorited={favorites[profile.id]}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  )
}
