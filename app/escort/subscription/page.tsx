import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

export default function EscortSubscriptionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-16 md:px-8 flex items-center justify-center">
        <Card className="w-full p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscriptions Coming Soon</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Premium subscription plans for escorts (VIP, boosts, top placements) are not active yet. 
            Once we enable billing & subscriptions, you&apos;ll be able to upgrade your account from here.
          </p>
          <Badge variant="outline" className="mt-2">
            Not available in current version
          </Badge>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
