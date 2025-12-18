"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { LoadingGrid } from "@/components/ui/loading-spinner"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok) throw new Error(text || "Failed to load cities")
  return text ? JSON.parse(text) : { cities: [] }
}

export default function CitiesPage() {
  const { data, error, isLoading } = useSWR<{ cities: { id: string; name: string; slug: string; heroImg?: string | null }[] }>(
    "/api/cities",
    fetcher
  )

  const cities = data?.cities ?? []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Browse by City</h1>
          <p className="mt-2 text-muted-foreground">Find premium companions in your location</p>
        </div>

        {isLoading && <LoadingGrid count={6} />}
        {error && <p className="text-sm text-red-500">Failed to load cities</p>}
        {!isLoading && !error && cities.length === 0 && (
          <p className="text-sm text-muted-foreground">No cities found</p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link key={city.id} href={`/listings?city=${city.slug}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-[240px] overflow-hidden">
                  <img
                    src={
                      city.heroImg ||
                      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&h=600&fit=crop"
                    }
                    alt={city.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="text-2xl font-bold">{city.name}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Tap to browse escorts</span>
                    </div>
                    <Badge variant="outline">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      India
                    </Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
