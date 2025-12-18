"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Check } from "lucide-react"
import { useState } from "react"

export default function EscortOnboardingPage() {
  const [step, setStep] = useState(1)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Complete Your Profile</h1>
          <p className="mt-2 text-muted-foreground">Let's get your profile ready to attract premium clients</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 4 && <div className={`h-0.5 w-12 ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <Card className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Basic Information</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" placeholder="The name clients will see" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Your age" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="e.g. New York" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="e.g. NY" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell clients about yourself..." rows={6} />
                <p className="text-sm text-muted-foreground">Minimum 100 characters</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Photos & Portfolio</h2>
              <p className="text-muted-foreground">Upload at least 5 professional photos</p>

              <div className="grid gap-4 md:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Upload Photo</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-medium">Photo Guidelines</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Professional quality images</li>
                  <li>• Clear face photos required</li>
                  <li>• No watermarks or logos</li>
                  <li>• Minimum resolution: 1200x1600px</li>
                </ul>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Services & Rates</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input id="hourlyRate" type="number" placeholder="e.g. 500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twoHourRate">2 Hour Rate ($)</Label>
                  <Input id="twoHourRate" type="number" placeholder="e.g. 900" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overnightRate">Overnight Rate ($)</Label>
                  <Input id="overnightRate" type="number" placeholder="e.g. 2500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Services Offered</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "Dinner Dates",
                    "Social Events",
                    "Travel Companion",
                    "GFE Experience",
                    "Business Events",
                    "Private Parties",
                  ].map((service) => (
                    <div key={service} className="flex items-center gap-2">
                      <input type="checkbox" id={service} className="h-4 w-4 rounded" />
                      <Label htmlFor={service} className="font-normal">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Verification</h2>
              <p className="text-muted-foreground">Complete verification to build trust with clients</p>

              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold">ID Verification</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload a government-issued ID to verify your identity
                  </p>
                  <Button className="mt-4 bg-transparent" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload ID
                  </Button>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold">Phone Verification</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Verify your phone number via SMS</p>
                  <Button className="mt-4 bg-transparent" variant="outline">
                    Verify Phone
                  </Button>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold">Background Check</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Optional but highly recommended for premium status
                  </p>
                  <Button className="mt-4 bg-transparent" variant="outline">
                    Start Background Check
                  </Button>
                </Card>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              Previous
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep(Math.min(4, step + 1))}>Continue</Button>
            ) : (
              <Button>Submit for Review</Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
