"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import useSWR from "swr"
import { useRouter, useSearchParams } from "next/navigation"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok) throw new Error(text || "Failed to load")
  return text ? JSON.parse(text) : { cities: [] }
}

export function LocationFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const { data } = useSWR<{ cities: { slug: string; name: string }[] }>("/api/cities", fetcher)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(params.get("city"))

  useEffect(() => {
    setSelectedLocation(params.get("city"))
  }, [params])

  const apply = (slug: string | null) => {
    const qs = new URLSearchParams(params.toString())
    if (slug) qs.set("city", slug)
    else qs.delete("city")
    router.push(`/listings?${qs.toString()}`)
  }

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        {(data?.cities ?? []).map((location) => (
          <button
            key={location.slug}
            onClick={() => {
              const next = selectedLocation === location.slug ? null : location.slug
              setSelectedLocation(next)
              apply(next)
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedLocation === location.slug
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {location.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Want to be listed?{" "}
          <Button variant="link" className="h-auto p-0 text-primary">
            Post Your Ad Here
          </Button>
        </p>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>
    </div>
  )
}
