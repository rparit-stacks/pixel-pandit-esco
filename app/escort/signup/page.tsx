"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail, Lock, ArrowLeft, User, Phone } from "lucide-react"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function EscortSignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmAge, setConfirmAge] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: "ESCORT",
          displayName: fullName,
          confirmAge,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")

      // Auto-login
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        router.push("/login?message=Account created. Please sign in.")
        return
      }

      router.replace("/escort/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen max-w-screen-xl">
        {/* Left Side - Form */}
        <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Become an Escort</h1>
              <p className="mt-2 text-muted-foreground">Join our premium platform and start earning</p>
            </div>

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    className="pl-10"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="pl-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="age-check"
                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                    required
                    checked={confirmAge}
                    onChange={(e) => setConfirmAge(e.target.checked)}
                  />
                  <Label htmlFor="age-check" className="text-sm font-normal leading-relaxed">
                    I confirm that I am <span className="font-bold text-foreground underline underline-offset-4 decoration-primary/50">18 years of age or older</span>.
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms & Conditions
                    </Link>{" "}
                    and understand the safety guidelines.
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>


            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:bg-muted lg:p-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Why Join Us?</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Join thousands of verified escorts earning premium income on our platform
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold">Premium Clients</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Access to verified, high-paying clients</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold">Safe & Secure</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Identity verification and safety tools included</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold">Flexible Schedule</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Work on your own terms and schedule</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold">24/7 Support</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Dedicated support team always available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
