"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { 
  Heart, 
  MessageSquare, 
  Settings, 
  User,
  Search,
  Clock,
  Shield
} from "lucide-react"
import { LoadingPage } from "@/components/ui/loading-spinner"

type DashboardData = {
  stats: {
    savedProfiles: number
    activeChats: number
    callRequests: number
  }
  recentActivity: {
    type: string
    escortName: string
    escortPhoto: string | null
    lastMessage: string
    date: string
  }[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load dashboard")
  return res.json()
}

export default function ClientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  const { data: dashboardData, isLoading: dashboardLoading } = useSWR<DashboardData>(
    status === "authenticated" ? "/api/dashboard/client" : null,
    fetcher
  )

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRedirecting(true)
      router.replace("/login")
    }
  }, [status, router])

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

  const stats = dashboardData?.stats || { savedProfiles: 0, activeChats: 0, callRequests: 0 }
  const recentActivity = dashboardData?.recentActivity || []

  const quickActions = [
    {
      title: "Browse Escorts",
      description: "Find verified companions in your city",
      icon: Search,
      href: "/listings",
      color: "bg-blue-500",
    },
    {
      title: "Saved Profiles",
      description: `${stats.savedProfiles} saved`,
      icon: Heart,
      href: "/saved",
      color: "bg-pink-500",
    },
    {
      title: "Messages",
      description: `${stats.activeChats} active chats`,
      icon: MessageSquare,
      href: "/chats",
      color: "bg-green-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full px-6 py-8 md:px-12 lg:px-16 xl:px-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.user?.name || session.user?.email?.split("@")[0]}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account and explore verified companions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saved Profiles</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardLoading ? "..." : stats.savedProfiles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardLoading ? "..." : stats.activeChats}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Account Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader>
                    <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{session.user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Type</span>
                <Badge>Client</Badge>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest interactions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  No recent activity
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.escortPhoto || undefined} />
                        <AvatarFallback>{activity.escortName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.escortName}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.lastMessage}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
