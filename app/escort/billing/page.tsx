import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

export default function EscortBillingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-16 md:px-8 flex items-center justify-center">
        <Card className="w-full p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Billing Coming Soon</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Wallet, payouts and earnings tracking are not enabled yet. Once we connect billing with the live system,
            you&apos;ll be able to see real balances and transaction history here.
          </p>
          <Badge variant="outline" className="mt-2">
            Beta feature • Not active
          </Badge>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
