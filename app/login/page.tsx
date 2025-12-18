"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail, Lock, ArrowLeft, MessageCircle } from "lucide-react"
import { FormEvent, useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoadingPage } from "@/components/ui/loading-spinner"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [step, setStep] = useState<"password" | "otp">("password")
  const [sendingOtp, setSendingOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(searchParams.get("message"))
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setIsRedirecting(true)
      const role = (session.user as any).role
      if (role === "ESCORT") {
        router.replace("/escort/dashboard")
      } else if (role === "ADMIN") {
        router.replace("/admin")
      } else {
        router.replace("/dashboard")
      }
    }
  }, [status, session, router])

  const redirectToDashboard = async () => {
    setIsRedirecting(true)
    // Fetch fresh session to get role
    const res = await fetch("/api/auth/session")
    const data = await res.json()
    const role = data?.user?.role
    if (role === "ESCORT") {
      router.replace("/escort/dashboard")
    } else if (role === "ADMIN") {
      router.replace("/admin")
    } else {
      router.replace("/dashboard")
    }
  }

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setLoading(true)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })
    setLoading(false)
    if (res?.error) {
      setError("Invalid email or password")
    } else {
      await redirectToDashboard()
    }
  }

  const handleSendOtp = async () => {
    setError(null)
    setMessage(null)
    if (!email) {
      setError("Email is required")
      return
    }
    setSendingOtp(true)
    try {
      const resp = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || "Failed to send OTP")
      setMessage("OTP sent to your email (check console in dev).")
      setStep("otp")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP"
      setError(message)
    } finally {
      setSendingOtp(false)
    }
  }

  const handleOtpLogin = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setLoading(true)
    // Use NextAuth credentials with OTP code as password (authorize handles OTP)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password: otpCode,
    })
    setLoading(false)
    if (res?.error) {
      setError("Invalid or expired code")
    } else {
      await redirectToDashboard()
    }
  }

  // Show loading while checking session
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
              <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="mt-2 text-muted-foreground">Sign in to your account</p>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("password")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  step === "password" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setStep("otp")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  step === "otp" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                OTP Login (Email)
              </button>
            </div>

            {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
            {message && <p className="mb-3 text-sm text-green-600">{message}</p>}

            {step === "password" ? (
              <form className="space-y-6" onSubmit={handlePasswordLogin}>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleOtpLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email-otp">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email-otp"
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
                  <Label htmlFor="otp">6-digit code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={handleSendOtp} disabled={sendingOtp}>
                      {sendingOtp ? "Sending..." : "Send OTP"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    We&apos;ll email a 6-digit code. Enter it to sign in.
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in with OTP"}
                </Button>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="relative h-full w-full bg-muted">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=800&fit=crop"
              alt="Login illustration"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
              <blockquote className="space-y-2">
                <p className="text-lg font-medium leading-relaxed">
                  &quot;This platform has completely transformed how I find reliable professionals. The verification process
                  gives me complete peace of mind.&quot;
                </p>
                <footer className="text-sm opacity-90">— Sarah Johnson, Happy Customer</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
