"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Mail, Lock, User, ArrowLeft } from "lucide-react"
import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { LoadingPage } from "@/components/ui/loading-spinner"

export default function SignupPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [role, setRole] = useState<"CLIENT" | "ESCORT">("CLIENT")
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setIsRedirecting(true)
      const userRole = (session.user as any).role
      if (userRole === "ESCORT") {
        router.replace("/escort/dashboard")
      } else if (userRole === "ADMIN") {
        router.replace("/admin")
      } else {
        router.replace("/dashboard")
      }
    }
  }, [status, session, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      // Step 1: Create the account
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
          displayName: role === "ESCORT" ? displayName : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")

      // Step 2: Auto-login after successful signup
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        // Account created but login failed - redirect to login
        router.push("/login?message=Account created. Please sign in.")
        return
      }

      // Step 3: Redirect to appropriate dashboard based on role
      setIsRedirecting(true)
      if (role === "ESCORT") {
        router.replace("/escort/dashboard")
      } else {
        router.replace("/dashboard")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while session is being fetched
  if (status === "loading") {
    return <LoadingPage message="Checking session..." />
  }

  // Show redirecting state only when actually authenticated
  if (isRedirecting || (status === "authenticated" && session?.user)) {
    return <LoadingPage message="Redirecting to dashboard..." />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen max-w-screen-xl">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="relative h-full w-full bg-muted">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&h=800&fit=crop"
              alt="Signup illustration"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Join Our Community</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">✓</div>
                    <span>Access to 10,000+ verified professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">✓</div>
                    <span>Secure payment processing & protection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">✓</div>
                    <span>24/7 customer support when you need it</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
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
              <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
              <p className="mt-2 text-muted-foreground">Get started with your free account today</p>
            </div>

            {/* Account Type Selection */}
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole("CLIENT")}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all ${
                  role === "CLIENT" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <User className="h-6 w-6 text-primary" />
                <div className="text-sm font-semibold">I&apos;m a Customer</div>
                <div className="text-xs text-muted-foreground">Looking for services</div>
              </button>
              <button
                type="button"
                onClick={() => setRole("ESCORT")}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all ${
                  role === "ESCORT" ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"
                }`}
              >
                <User className="h-6 w-6" />
                <div className="text-sm font-semibold">I&apos;m a Professional</div>
                <div className="text-xs text-muted-foreground">Offering services</div>
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {role === "ESCORT" && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your public display name"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
              )}

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
                <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
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
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="relative my-8">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                OR SIGN UP WITH
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" type="button">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </Button>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
