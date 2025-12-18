"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { 
  MessageSquare, 
  Settings, 
  User,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  Camera,
  Shield,
  LayoutDashboard,
  ImageIcon,
  Star,
  Inbox,
} from "lucide-react"
import { LoadingPage } from "@/components/ui/loading-spinner"

type EscortDashboardData = {
  profile: {
    id: string
    displayName: string
    isOnline: boolean
    callsEnabled: boolean
    isVerified: boolean
    isVip: boolean
    mainPhotoUrl: string | null
  }
  stats: {
    profileViews: number
    unreadMessages: number
    pendingCalls: number
    favoritedBy: number
    totalChats: number
  }
  recentChats: {
    id: string
    clientEmail: string
    lastMessage: string
    isFromClient: boolean
    date: string
  }[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load dashboard")
  return res.json()
}

export default function EscortDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  const { data: dashboardData, isLoading: dashboardLoading, mutate } = useSWR<EscortDashboardData>(
    status === "authenticated" ? "/api/dashboard/escort" : null,
    fetcher
  )

  const [isOnline, setIsOnline] = useState(false)
  const [callsEnabled, setCallsEnabled] = useState(true)

  // Sync state with fetched data
  useEffect(() => {
    if (dashboardData?.profile) {
      setIsOnline(dashboardData.profile.isOnline)
      setCallsEnabled(dashboardData.profile.callsEnabled)
    }
  }, [dashboardData])

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRedirecting(true)
      router.replace("/login")
    }
  }, [status, router])

  const toggleOnline = async () => {
    const newValue = !isOnline
    setIsOnline(newValue)
    try {
      await fetch("/api/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOnline: newValue }),
      })
      mutate()
    } catch (error) {
      setIsOnline(!newValue) // Revert on error
      console.error("Failed to update status:", error)
    }
  }

  const toggleCalls = async () => {
    const newValue = !callsEnabled
    setCallsEnabled(newValue)
    try {
      await fetch("/api/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callsEnabled: newValue }),
      })
      mutate()
    } catch (error) {
      setCallsEnabled(!newValue) // Revert on error
      console.error("Failed to update calls:", error)
    }
  }

  // Show loading while session is being fetched
  if (status === "loading") {
    return <LoadingPage message="Loading your dashboard..." />
  }

  // Show redirecting state
  if (status === "unauthenticated" || isRedirecting) {
    return <LoadingPage message="Redirecting to login..." />
  }

  // No session - don't render anything
  if (!session?.user) {
    return <LoadingPage message="Loading..." />
  }

  const profile = dashboardData?.profile
  const stats = dashboardData?.stats || { profileViews: 0, unreadMessages: 0, pendingCalls: 0, favoritedBy: 0, totalChats: 0 }
  const recentChats = dashboardData?.recentChats || []

  const quickActions = [
    {
      title: "Edit Profile",
      description: "Update your bio and details",
      icon: User,
      href: "/escort/profile",
      color: "bg-blue-500",
    },
    {
      title: "Upload Photos",
      description: "Manage your gallery",
      icon: Camera,
      href: "/escort/photos",
      color: "bg-pink-500",
    },
    {
      title: "Messages",
      description: `${stats.unreadMessages} unread`,
      icon: MessageSquare,
      href: "/chats",
      color: "bg-green-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col rounded-2xl bg-gradient-to-b from-primary/10 via-background to-background border border-border/60 shadow-lg">
          <div className="p-4 border-b border-border/40 flex items-center gap-3">
            <Avatar className="h-11 w-11 ring-2 ring-primary/30">
              <AvatarImage src={profile?.mainPhotoUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {(profile?.displayName || session.user?.name || session.user?.email || "E")[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {profile?.displayName || session.user?.name || session.user?.email?.split("@")[0]}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                <span className="text-xs text-muted-foreground">
                  {isOnline ? "Online & visible" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-3 space-y-1 text-sm">
            <Link href="/escort/dashboard">
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 bg-primary/10 text-primary font-medium">
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </button>
            </Link>
            <Link href="/escort/profile">
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors">
                <User className="h-4 w-4" />
                Profile
              </button>
            </Link>
            <Link href="/escort/photos">
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors">
                <ImageIcon className="h-4 w-4" />
                Photos
              </button>
            </Link>
            <Link href="/chats">
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors">
                <MessageSquare className="h-4 w-4" />
                Messages
                {stats.unreadMessages > 0 && (
                  <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground px-1">
                    {stats.unreadMessages}
                  </span>
                )}
              </button>
            </Link>
            <Link href="/escort/billing">
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors">
                <DollarSign className="h-4 w-4" />
                Billing
              </button>
            </Link>
            <Link href="/escort/services">
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors">
                <Star className="h-4 w-4" />
                Services
              </button>
            </Link>
            <Link href="/settings">
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </Link>
          </nav>

          <div className="px-4 py-3 border-t border-border/40 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center justify-between">
              <span>Online</span>
              <Switch checked={isOnline} onCheckedChange={toggleOnline} />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1 space-y-6">
          {/* Welcome + Status */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Escort Dashboard
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Welcome back, {profile?.displayName || session.user?.name || session.user?.email?.split("@")[0]}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Track your performance, manage your profile and respond to clients.
                </p>
              </div>
              <div className="flex md:hidden items-center gap-2">
                <Switch checked={isOnline} onCheckedChange={toggleOnline} />
                <span className="text-xs text-muted-foreground">{isOnline ? "Online" : "Offline"}</span>
              </div>
            </div>

            <Card className={`overflow-hidden border ${isOnline ? "border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/40" : ""}`}>
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                  <span className="font-medium text-sm">
                    {isOnline
                      ? "You are online and visible in listings right now."
                      : "You are currently offline and hidden from clients."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant={isOnline ? "outline" : "default"} onClick={toggleOnline}>
                    {isOnline ? "Go Offline" : "Go Online"}
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/escort/profile">
                      <User className="h-3.5 w-3.5 mr-1" />
                      View Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Profile Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? <span className="animate-pulse">...</span> : stats.profileViews}
                </div>
                <p className="text-[11px] text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? <span className="animate-pulse">...</span> : stats.unreadMessages}
                </div>
                <p className="text-[11px] text-muted-foreground">Unread conversations</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Favorites</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? <span className="animate-pulse">...</span> : stats.favoritedBy}
                </div>
                <p className="text-[11px] text-muted-foreground">Clients saved your profile</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick actions & account status */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Quick Actions</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 h-full">
                      <CardHeader className="pb-3">
                        <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${action.color} text-white`}>
                          <action.icon className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-sm">{action.title}</CardTitle>
                        <CardDescription className="text-xs">{action.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Status
                </CardTitle>
                <CardDescription>Your verification and subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Verification</span>
                  <Badge variant={profile?.isVerified ? "default" : "outline"}>
                    {profile?.isVerified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">VIP Status</span>
                  <Badge variant={profile?.isVip ? "default" : "secondary"}>
                    {profile?.isVip ? "VIP" : "Standard"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Profile</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Active
                  </Badge>
                </div>
                <Button variant="outline" className="w-full mt-2" asChild>
                  <Link href="/escort/subscription">
                    <DollarSign className="mr-2 h-3.5 w-3.5" />
                    Upgrade Plan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent chats */}
          {recentChats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Inbox className="h-4 w-4" />
                  Recent Messages
                </CardTitle>
                <CardDescription>Your latest conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentChats.map((chat) => (
                    <Link key={chat.id} href="/chats" className="block">
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/60 transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {chat.clientEmail.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{chat.clientEmail}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.isFromClient ? "" : "You: "}
                            {chat.lastMessage}
                          </p>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(chat.date).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
