import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Shield, DollarSign, TrendingUp, Users } from "lucide-react"

export default function AdminSubscriptionsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="mt-2 text-muted-foreground">Monitor subscription revenue and members</p>
        </div>

        {/* Revenue Stats */}
        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MRR</p>
                <p className="mt-2 text-3xl font-bold">$248K</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+12% from last month</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscribers</p>
                <p className="mt-2 text-3xl font-bold">1,247</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">+48 this month</div>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Basic Plan</p>
            <p className="mt-2 text-3xl font-bold">345</p>
            <p className="mt-4 text-sm text-muted-foreground">$16,905/mo</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground">VIP Plan</p>
            <p className="mt-2 text-3xl font-bold">456</p>
            <p className="mt-4 text-sm text-muted-foreground">$67,944/mo</p>
          </Card>
        </div>

        {/* Subscription Breakdown */}
        <Card className="mb-6 p-6">
          <h2 className="mb-6 text-xl font-semibold">Subscription Breakdown</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { plan: "Basic", subscribers: 345, mrr: "$16,905", growth: "+5%" },
              { plan: "VIP", subscribers: 456, mrr: "$67,944", growth: "+15%" },
              { plan: "Elite", subscribers: 446, mrr: "$133,354", growth: "+8%" },
            ].map((plan) => (
              <Card key={plan.plan} className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{plan.plan} Plan</h3>
                  <Badge className="bg-green-500 text-white">{plan.growth}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subscribers</span>
                    <span className="font-medium">{plan.subscribers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                    <span className="font-medium">{plan.mrr}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h2 className="mb-6 text-xl font-semibold">Recent Transactions</h2>
          <div className="divide-y divide-border">
            {[
              { user: "Sophia Martinez", plan: "VIP", amount: 149, date: "Dec 20, 2024", status: "completed" },
              { user: "Emma Johnson", plan: "Elite", amount: 299, date: "Dec 20, 2024", status: "completed" },
              { user: "Isabella Garcia", plan: "Basic", amount: 49, date: "Dec 19, 2024", status: "completed" },
              { user: "Jessica Chen", plan: "VIP", amount: 149, date: "Dec 19, 2024", status: "failed" },
            ].map((transaction, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{transaction.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.plan} Plan • {transaction.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium">${transaction.amount}</p>
                  <Badge variant={transaction.status === "completed" ? "default" : "destructive"}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
