import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Search, Filter, Shield, MoreVertical, Star, MapPin } from "lucide-react"

export default function AdminEscortsPage() {
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
            <Link href="/admin/escorts" className="text-sm font-medium">
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Escort Management</h1>
            <p className="mt-2 text-muted-foreground">Manage and moderate escort profiles</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search escorts..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline">Status</Button>
              <Button variant="outline">Verification</Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Escorts</p>
            <p className="mt-1 text-2xl font-bold">1,247</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Pending Approval</p>
            <p className="mt-1 text-2xl font-bold">248</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">VIP Members</p>
            <p className="mt-1 text-2xl font-bold">456</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Suspended</p>
            <p className="mt-1 text-2xl font-bold">23</p>
          </Card>
        </div>

        {/* Escort List */}
        <Card>
          <div className="divide-y divide-border">
            {[
              {
                name: "Sophia Martinez",
                age: 24,
                location: "Manhattan, NY",
                rating: 4.9,
                reviews: 127,
                status: "active",
                verified: true,
                joined: "Dec 2023",
              },
              {
                name: "Isabella Rodriguez",
                age: 26,
                location: "Brooklyn, NY",
                rating: 0,
                reviews: 0,
                status: "pending",
                verified: false,
                joined: "Dec 2024",
              },
              {
                name: "Emma Johnson",
                age: 23,
                location: "Queens, NY",
                rating: 4.8,
                reviews: 94,
                status: "active",
                verified: true,
                joined: "Nov 2023",
              },
              {
                name: "Jessica Chen",
                age: 25,
                location: "Manhattan, NY",
                rating: 5.0,
                reviews: 156,
                status: "active",
                verified: true,
                joined: "Oct 2023",
              },
            ].map((escort, i) => (
              <div key={i} className="flex items-center gap-4 p-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/diverse-woman-portrait.png" />
                  <AvatarFallback>{escort.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{escort.name}</h3>
                    {escort.verified && <Badge className="h-5 px-2 text-xs">Verified</Badge>}
                    <Badge
                      variant={
                        escort.status === "active"
                          ? "default"
                          : escort.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {escort.status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{escort.age} years old</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {escort.location}
                    </span>
                    {escort.reviews > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        {escort.rating} ({escort.reviews} reviews)
                      </span>
                    )}
                    <span>Joined {escort.joined}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                  {escort.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                      <Button size="sm">Approve</Button>
                    </>
                  )}
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
