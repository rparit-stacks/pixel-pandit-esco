import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, UserCheck, AlertTriangle, DollarSign, TrendingUp, MessageSquare, Flag, Shield } from "lucide-react"

export default function AdminDashboardPage() {
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
            <Link href="/admin/dashboard" className="text-sm font-medium">
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
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="mt-2 text-3xl font-bold">12,847</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+12% this month</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Escorts</p>
                <p className="mt-2 text-3xl font-bold">1,247</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">248 pending approval</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue (MTD)</p>
                <p className="mt-2 text-3xl font-bold">$248K</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+8% from last month</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Reports</p>
                <p className="mt-2 text-3xl font-bold">23</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-4 text-sm text-destructive">5 high priority</div>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Reports</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/reports">View all</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: "#R2847",
                    type: "Inappropriate Content",
                    reporter: "User #12453",
                    target: "Sophia Martinez",
                    status: "open",
                    priority: "high",
                  },
                  {
                    id: "#R2846",
                    type: "Harassment",
                    reporter: "User #12398",
                    target: "Michael Smith",
                    status: "investigating",
                    priority: "medium",
                  },
                  {
                    id: "#R2845",
                    type: "Fake Profile",
                    reporter: "User #12301",
                    target: "Emma Johnson",
                    status: "open",
                    priority: "high",
                  },
                ].map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Flag className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{report.id}</p>
                          <Badge variant={report.priority === "high" ? "destructive" : "secondary"}>
                            {report.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.type} • Target: {report.target}
                        </p>
                      </div>
                    </div>
                    <Button size="sm">Review</Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pending Approvals */}
            <Card className="mt-6 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Pending Approvals</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/escorts?filter=pending">View all</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Isabella Rodriguez", type: "New Profile", submitted: "2 hours ago" },
                  { name: "Jessica Chen", type: "Photo Update", submitted: "5 hours ago" },
                  { name: "Amanda Taylor", type: "Profile Edit", submitted: "1 day ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.type} • {item.submitted}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link href="/admin/escorts">
                    <UserCheck className="mr-2 h-5 w-5" />
                    Manage Escorts
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link href="/admin/users">
                    <Users className="mr-2 h-5 w-5" />
                    Manage Users
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link href="/admin/reports">
                    <Flag className="mr-2 h-5 w-5" />
                    View Reports
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link href="/admin/subscriptions">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Subscriptions
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link href="/admin/monitoring">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Monitoring
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Platform Health */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Platform Health</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">System Status</span>
                  <Badge className="bg-green-500 text-white">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Response</span>
                  <span className="text-sm font-medium">45ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-medium">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Sessions</span>
                  <span className="text-sm font-medium">2,847</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
