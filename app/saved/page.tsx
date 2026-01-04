"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, MessageSquare, X, Loader2 } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useTransition } from "react"
import { LoadingGrid } from "@/components/ui/loading-spinner"
import { toast } from "sonner"

type FavoriteProfile = {
  id: string
  displayName: string
  city?: { name: string; slug: string }
  rateHourly?: string | null
  isVerified: boolean
  isVip: boolean
  mainPhotoUrl: string | null
  services: string[]
  listingTitle?: string | null
  about?: string | null
  isOnline?: boolean
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (res.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/login"
    throw new Error("Unauthorized")
  }
  const text = await res.text()
  if (!res.ok) throw new Error(text || "Failed to load favorites")
  return text ? JSON.parse(text) : { results: [] }
}

export default function SavedEscortsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { data, error, isLoading, mutate } = useSWR<{ results: FavoriteProfile[] }>("/api/favorites", fetcher)

  const { data: subData } = useSWR(
    status === "authenticated" ? "/api/user/subscription" : null,
    fetcher
  )

  const isLoggedIn = status === "authenticated" && !!session?.user
  const userRole = (session?.user as any)?.role
  const subscription = subData?.subscription
  const canChat = subscription?.isUnlimited || (subscription?.chatBalance > 0)

  const handleMessageRequest = async (escortId: string) => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    if (userRole === "ESCORT") {
      toast.error("Escorts cannot initiate chats with other escorts.")
      return
    }

    if (!subscription || subscription.status !== "ACTIVE") {
      toast.error("Active subscription required to send messages.")
      router.push("/settings")
      return
    }

    if (!canChat) {
      toast.error("You have run out of chat credits. Please top up.")
      router.push("/settings")
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/chats/threads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ escortProfileId: escortId }),
        })

        const result = await res.json()

        if (res.ok) {
          toast.success("Message request sent!")
          router.push("/chats")
        } else {
          toast.error(result.error || "Failed to send message request")
          if (res.status === 403 && result.error?.includes("subscription")) {
            router.push("/settings")
          }
        }
      } catch (e) {
        console.error("Failed to send message request:", e)
        toast.error("An error occurred. Please try again.")
      }
    })
  }

  const handleRemove = async (profileId: string) => {
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId }),
    })
    mutate()
  }

  const clearAll = async () => {
    if (!data?.results) return
    await Promise.all(
      data.results.map((item) =>
        fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId: item.id }),
        })
      )
    )
    mutate()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full px-6 py-8 md:px-12 lg:px-16 xl:px-20">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Saved Escorts</h1>
            <p className="mt-2 text-muted-foreground">Your favorite profiles in one place</p>
          </div>
          <LoadingGrid count={6} />
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full px-6 py-8 md:px-12 lg:px-16 xl:px-20">
          <p className="text-sm text-red-500">Failed to load favorites</p>
        </main>
        <Footer />
      </div>
    )
  }

  const savedEscorts = data?.results ?? []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full px-6 py-8 md:px-12 lg:px-16 xl:px-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Saved Escorts</h1>
          <p className="mt-2 text-muted-foreground">Your favorite profiles in one place</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{savedEscorts.length} saved profiles</p>
          <Button variant="outline" size="sm" onClick={clearAll} disabled={savedEscorts.length === 0}>
            Clear All
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {savedEscorts.map((escort) => (
            <Card key={escort.id} className="group overflow-hidden">
              <div className="relative">
                <img
                  src={escort.mainPhotoUrl || "/placeholder.jpg"}
                  alt={escort.displayName}
                  className="h-[400px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {escort.isOnline && <Badge className="absolute right-3 top-3 bg-green-500 text-white">Online</Badge>}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-3 top-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white"
                  onClick={() => handleRemove(escort.id)}
                >
                  <Heart className="h-5 w-5 fill-primary text-primary" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-3 bottom-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                  onClick={() => handleRemove(escort.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{escort.displayName}</h3>
                      {escort.isVip && <Badge className="h-5 px-2 text-xs">VIP</Badge>}
                      {escort.isVerified && <Badge className="h-5 px-2 text-xs">Verified</Badge>}
                    </div>
                    {escort.city && <p className="mt-1 text-sm text-muted-foreground">{escort.city.name}</p>}
                  </div>
                  <div className="text-right">
                    {escort.rateHourly && <p className="text-lg font-bold text-primary">₹{escort.rateHourly}/hr</p>}
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{escort.city?.name || "—"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/profile/${escort.id}`} className="w-full">
                    <Button size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleMessageRequest(escort.id)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquare className="mr-2 h-4 w-4" />
                    )}
                    Message
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
