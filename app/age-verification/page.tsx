"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, Shield, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AgeVerificationPage() {
  const [agreed, setAgreed] = useState(false)
  const router = useRouter()

  const handleVerify = () => {
    if (agreed) {
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-2xl p-8 md:p-12">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Age Verification Required</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            You must be 18 years or older to access this website
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-border bg-muted/50 p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Adult Content Warning</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  This website contains adult-oriented content and services. By continuing, you confirm that you are of
                  legal age to view such content in your jurisdiction and agree to our terms of service.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-border p-6">
            <h3 className="font-semibold">Requirements</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">I am 18 years of age or older</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">I am legally permitted to view adult content in my location</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">I agree to the Terms of Service and Privacy Policy</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">I will not share this content with minors</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-input"
            />
            <label htmlFor="agree" className="text-sm leading-relaxed">
              I certify that I am at least 18 years old and I agree to the Terms of Service and Privacy Policy. I
              understand that this website contains adult content and I am legally permitted to view such content in my
              jurisdiction.
            </label>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => router.push("https://google.com")}
            >
              I am under 18 - Exit
            </Button>
            <Button className="flex-1" disabled={!agreed} onClick={handleVerify}>
              I am 18+ - Enter Site
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          By entering this site, you agree to our use of cookies and tracking technologies for analytics and
          personalization purposes.
        </p>
      </Card>
    </div>
  )
}
