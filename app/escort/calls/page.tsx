"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { 
  Phone, 
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  Clock,
  Check,
  X,
  Calendar,
  User,
  MessageSquare,
  Loader2
} from "lucide-react"
import { LoadingPage } from "@/components/ui/loading-spinner"
import { toast } from "sonner"

type CallRequest = {
  id: string
  clientId: string
  clientEmail: string
  clientName: string | null
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED"
  scheduledAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

type CallsData = {
  pending: CallRequest[]
  accepted: CallRequest[]
  history: CallRequest[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load")
  return res.json()
}

export default function EscortCallsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  const { data: callsData, isLoading, mutate } = useSWR<CallsData>(
    status === "authenticated" ? "/api/call-requests?role=escort" : null,
    fetcher
  )

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRedirecting(true)
      router.replace("/login")
    }
  }, [status, router])

  const handleAction = async (callId: string, action: "accept" | "reject" | "complete") => {
    setProcessingId(callId)
    try {
      const res = await fetch("/api/call-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId, action })
      })

      if (!res.ok) throw new Error("Failed to update")
      
      await mutate()
      toast.success(`Call request ${action}ed!`)
    } catch (error) {
      toast.error(`Failed to ${action} call request`)
    } finally {
      setProcessingId(null)
    }
  }

  if (status === "loading" || isLoading) {
    return <LoadingPage message="Loading call requests..." />
  }

  if (status === "unauthenticated" || isRedirecting) {
    return <LoadingPage message="Redirecting to login..." />
  }

  const pending = callsData?.pending || []
  const accepted = callsData?.accepted || []
  const history = callsData?.history || []

  const getStatusBadge = (status: CallRequest["status"]) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      ACCEPTED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
    return (
      <Badge className={styles[status]}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    )
  }

  const CallRequestCard = ({ call, showActions = false }: { call: CallRequest; showActions?: boolean }) => (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {call.clientName?.charAt(0) || call.clientEmail.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold truncate">
                {call.clientName || call.clientEmail.split("@")[0]}
              </h4>
              {getStatusBadge(call.status)}
            </div>
            <p className="text-sm text-muted-foreground truncate">{call.clientEmail}</p>
            
            {call.scheduledAt && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(call.scheduledAt).toLocaleString()}</span>
              </div>
            )}
            
            {call.notes && (
              <div className="mt-2 flex items-start gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{call.notes}</span>
              </div>
            )}
            
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Requested {new Date(call.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {showActions && call.status === "PENDING" && (
          <div className="mt-4 flex items-center gap-2 pt-4 border-t">
            <Button
              size="sm"
              onClick={() => handleAction(call.id, "accept")}
              disabled={processingId === call.id}
              className="flex-1"
            >
              {processingId === call.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Accept
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction(call.id, "reject")}
              disabled={processingId === call.id}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Decline
            </Button>
          </div>
        )}

        {showActions && call.status === "ACCEPTED" && (
          <div className="mt-4 flex items-center gap-2 pt-4 border-t">
            <Button
              size="sm"
              onClick={() => handleAction(call.id, "complete")}
              disabled={processingId === call.id}
              className="flex-1"
            >
              {processingId === call.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Mark Complete
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-8 md:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <i className="fa-solid fa-phone mr-3 text-primary"></i>
              Call Requests
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage incoming call requests from clients
            </p>
          </div>
          <div className="flex items-center gap-3">
            {pending.length > 0 && (
              <Badge variant="destructive" className="px-3 py-1 animate-pulse">
                <PhoneIncoming className="mr-2 h-4 w-4" />
                {pending.length} Pending
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pending.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <PhoneCall className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{accepted.length}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{history.length}</p>
                <p className="text-sm text-muted-foreground">Total Calls</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending
              {pending.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-2">
              <PhoneCall className="h-4 w-4" />
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Phone className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pending.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <PhoneOff className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No pending requests</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    New call requests will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              pending.map(call => (
                <CallRequestCard key={call.id} call={call} showActions />
              ))
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            {accepted.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No scheduled calls</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Accepted calls will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              accepted.map(call => (
                <CallRequestCard key={call.id} call={call} showActions />
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {history.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Phone className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No call history</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your completed and cancelled calls will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              history.map(call => (
                <CallRequestCard key={call.id} call={call} />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Back Button */}
        <div className="mt-8 flex justify-start">
          <Button variant="outline" onClick={() => router.push("/escort/dashboard")}>
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}

