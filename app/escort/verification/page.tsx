import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Upload, AlertCircle } from "lucide-react"

export default function EscortVerificationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Verification</h1>
          <p className="mt-2 text-muted-foreground">Complete verification to build trust with clients</p>
        </div>

        <div className="space-y-6">
          {/* ID Verification */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">ID Verification</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Government-issued ID verified</p>
                  <p className="mt-2 text-xs text-muted-foreground">Verified on Dec 15, 2024</p>
                </div>
              </div>
              <Badge className="bg-green-500 text-white">Verified</Badge>
            </div>
          </Card>

          {/* Phone Verification */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone Verification</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Phone number +1 (555) 123-4567 verified</p>
                  <p className="mt-2 text-xs text-muted-foreground">Verified on Dec 15, 2024</p>
                </div>
              </div>
              <Badge className="bg-green-500 text-white">Verified</Badge>
            </div>
          </Card>

          {/* Email Verification */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Verification</h3>
                  <p className="mt-1 text-sm text-muted-foreground">sophia@example.com verified</p>
                  <p className="mt-2 text-xs text-muted-foreground">Verified on Dec 15, 2024</p>
                </div>
              </div>
              <Badge className="bg-green-500 text-white">Verified</Badge>
            </div>
          </Card>

          {/* Background Check */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Background Check</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Optional verification for premium status</p>
                  <p className="mt-4 text-sm">
                    Complete a background check to earn a{" "}
                    <span className="font-medium text-primary">Premium Verified</span> badge
                  </p>
                </div>
              </div>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Start Check
              </Button>
            </div>
          </Card>

          {/* Photo Verification */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Photo Verification</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Profile photos match ID verification</p>
                  <p className="mt-2 text-xs text-muted-foreground">Verified on Dec 16, 2024</p>
                </div>
              </div>
              <Badge className="bg-green-500 text-white">Verified</Badge>
            </div>
          </Card>
        </div>

        {/* Benefits Card */}
        <Card className="mt-8 bg-primary/5 p-6">
          <h3 className="mb-4 font-semibold">Verification Benefits</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Increased trust and credibility with clients</li>
            <li>• Higher search ranking and visibility</li>
            <li>• Access to premium features and clients</li>
            <li>• Verified badge on your profile</li>
            <li>• Priority support and account protection</li>
          </ul>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
