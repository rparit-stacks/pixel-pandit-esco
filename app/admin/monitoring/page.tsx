import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Shield, MessageSquare, AlertCircle } from "lucide-react"

export default function AdminMonitoringPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Admin Portal</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/admin/dashboard" className="text-sm font-medium text-muted-foreground">
              Dashboard
            </Link>
            <Link href="/admin/escorts" className="text-sm font-medium text-muted-foreground">
              Escorts
            </Link>
            <Link href="/admin/users" className="text-sm font-medium text-muted-foreground">
              Users
            </Link>
            <Link href="/admin/reports" className="text-sm font-medium text-muted-foreground">
              Reports
            </Link>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Communication Monitoring</h1>
          <p className="mt-2 text-muted-foreground">Monitor flagged conversations for safety</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Flagged Messages</p>
            <p className="mt-1 text-2xl font-bold">47</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Under Review</p>
            <p className="mt-1 text-2xl font-bold">12</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">High Priority</p>
            <p className="mt-1 text-2xl font-bold text-destructive">3</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Resolved Today</p>
            <p className="mt-1 text-2xl font-bold">18</p>
          </Card>
        </div>

        {/* Flagged Conversations */}
        <Card className="p-6">
          <h2 className="mb-6 text-xl font-semibold">Flagged Conversations</h2>
          <div className="space-y-4">
            {[
              {
                id: "#C4721",
                participants: "Alex Johnson → Sophia Martinez",
                reason: "Inappropriate language detected",
                excerpt: "Message contains potentially offensive content...",
                flagged: "2h ago",
                priority: "high",
              },
              {
                id: "#C4720",
                participants: "Michael Smith → Emma Johnson",
                reason: "Spam detection",
                excerpt: "Repeated messages with external links...",
                flagged: "4h ago",
                priority: "medium",
              },
              {
                id: "#C4719",
                participants: "David Brown → Isabella Garcia",
                reason: "Harassment reported",
                excerpt: "User reported threatening behavior...",
                flagged: "6h ago",
                priority: "high",
              },
            ].map((conversation) => (
              <Card key={conversation.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                        conversation.priority === "high" ? "bg-red-500/10" : "bg-yellow-500/10"
                      }`}
                    >
                      {conversation.priority === "high" ? (
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      ) : (
                        <MessageSquare className="h-6 w-6 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{conversation.id}</h3>
                        <Badge variant={conversation.priority === "high" ? "destructive" : "secondary"}>
                          {conversation.priority}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{conversation.participants}</p>
                      <p className="mt-2 text-sm font-medium">{conversation.reason}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{conversation.excerpt}</p>
                      <p className="mt-2 text-xs text-muted-foreground">Flagged {conversation.flagged}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Full
                    </Button>
                    <Button size="sm">Take Action</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
