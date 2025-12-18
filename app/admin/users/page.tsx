import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Search, Filter, Shield, MoreVertical } from "lucide-react"

export default function AdminUsersPage() {
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
            <Link href="/admin/users" className="text-sm font-medium">
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
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="mt-2 text-muted-foreground">Manage client accounts and activity</p>
        </div>

        {/* Filters */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline">Status</Button>
              <Button variant="outline">Activity</Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="mt-1 text-2xl font-bold">12,847</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Active Today</p>
            <p className="mt-1 text-2xl font-bold">2,847</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Premium Users</p>
            <p className="mt-1 text-2xl font-bold">1,456</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Banned</p>
            <p className="mt-1 text-2xl font-bold">34</p>
          </Card>
        </div>

        {/* User List */}
        <Card>
          <div className="divide-y divide-border">
            {[
              {
                name: "Alex Johnson",
                email: "alex@example.com",
                joined: "Nov 2023",
                bookings: 12,
                spent: 8400,
                status: "active",
              },
              {
                name: "Michael Smith",
                email: "michael@example.com",
                joined: "Dec 2023",
                bookings: 8,
                spent: 6200,
                status: "active",
              },
              {
                name: "David Brown",
                email: "david@example.com",
                joined: "Oct 2023",
                bookings: 24,
                spent: 15800,
                status: "premium",
              },
              {
                name: "James Wilson",
                email: "james@example.com",
                joined: "Dec 2024",
                bookings: 0,
                spent: 0,
                status: "suspended",
              },
            ].map((user, i) => (
              <div key={i} className="flex items-center gap-4 p-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/man.jpg" />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{user.name}</h3>
                    <Badge
                      variant={
                        user.status === "premium"
                          ? "default"
                          : user.status === "suspended"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{user.email}</span>
                    <span>Joined {user.joined}</span>
                    <span>{user.bookings} bookings</span>
                    <span>${user.spent.toLocaleString()} spent</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
