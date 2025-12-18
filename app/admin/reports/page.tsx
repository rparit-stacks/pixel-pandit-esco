import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, Filter, Shield, Flag, AlertTriangle } from "lucide-react"

export default function AdminReportsPage() {
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
            <Link href="/admin/reports" className="text-sm font-medium">
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
          <h1 className="text-3xl font-bold tracking-tight">Reports & Safety</h1>
          <p className="mt-2 text-muted-foreground">Monitor and resolve safety issues</p>
        </div>

        {/* Filters */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search reports..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline">Priority</Button>
              <Button variant="outline">Status</Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Reports</p>
            <p className="mt-1 text-2xl font-bold">247</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Open</p>
            <p className="mt-1 text-2xl font-bold">23</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">High Priority</p>
            <p className="mt-1 text-2xl font-bold text-destructive">5</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Resolved (30d)</p>
            <p className="mt-1 text-2xl font-bold">189</p>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <div className="divide-y divide-border">
            {[
              {
                id: "#R2847",
                type: "Inappropriate Content",
                reporter: "User #12453",
                target: "Sophia Martinez",
                description: "Profile photos contain inappropriate content",
                date: "Dec 20, 2024",
                status: "open",
                priority: "high",
              },
              {
                id: "#R2846",
                type: "Harassment",
                reporter: "User #12398",
                target: "Michael Smith",
                description: "Received threatening messages from user",
                date: "Dec 20, 2024",
                status: "investigating",
                priority: "high",
              },
              {
                id: "#R2845",
                type: "Fake Profile",
                reporter: "User #12301",
                target: "Emma Johnson",
                description: "Profile photos appear to be stolen",
                date: "Dec 19, 2024",
                status: "open",
                priority: "medium",
              },
              {
                id: "#R2844",
                type: "Spam",
                reporter: "User #12287",
                target: "Alex Johnson",
                description: "User sending spam messages to escorts",
                date: "Dec 19, 2024",
                status: "resolved",
                priority: "low",
              },
            ].map((report) => (
              <div key={report.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                        report.priority === "high"
                          ? "bg-red-500/10"
                          : report.priority === "medium"
                            ? "bg-yellow-500/10"
                            : "bg-muted"
                      }`}
                    >
                      {report.priority === "high" ? (
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                      ) : (
                        <Flag className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{report.id}</h3>
                        <Badge variant={report.priority === "high" ? "destructive" : "secondary"}>
                          {report.priority}
                        </Badge>
                        <Badge variant="outline">{report.status}</Badge>
                      </div>
                      <p className="mt-1 text-sm font-medium">{report.type}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Reporter: {report.reporter}</span>
                        <span>Target: {report.target}</span>
                        <span>{report.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {report.status !== "resolved" && (
                      <>
                        <Button size="sm" variant="outline">
                          Dismiss
                        </Button>
                        <Button size="sm">Take Action</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
