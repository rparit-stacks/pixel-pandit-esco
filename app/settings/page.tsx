"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { User, Lock, Trash2, Shield, Save, Loader2, CheckCircle2, XCircle } from "lucide-react"

type UserSettings = {
  user: {
    id: string
    email: string
    role: string
    status: string
    createdAt: string
    profile?: {
      id: string
      displayName: string
      bio: string | null
      age: number | null
      mainPhotoUrl: string | null
      isOnline: boolean
      callsEnabled: boolean
      city?: {
        id: string
        name: string
        slug: string
      } | null
    } | null
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load settings")
  return res.json()
}

// Beautiful loading skeleton
function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-9 w-32 bg-muted rounded-lg mb-2" />
            <div className="h-5 w-64 bg-muted/60 rounded" />
          </div>

          {/* Cards skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="mb-6 rounded-2xl border bg-card p-6 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-muted rounded-lg" />
                <div>
                  <div className="h-5 w-40 bg-muted rounded mb-2" />
                  <div className="h-4 w-56 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-10 w-full bg-muted/40 rounded-lg" />
                <div className="h-10 w-full bg-muted/40 rounded-lg" />
                <div className="h-10 w-32 bg-primary/20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// Full page loading with animation
function FullPageLoader({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <div className="text-center">
        {/* Animated loader */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-500 animate-spin animation-delay-150" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-pink-500/20 animate-pulse" />
        </div>
        <p className="text-lg font-medium text-foreground animate-pulse">{message}</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait...</p>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  const { data: settingsData, isLoading, mutate } = useSWR<UserSettings>(
    status === "authenticated" ? "/api/user/settings" : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  // Form state
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [age, setAge] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Initialize form with data
  useEffect(() => {
    if (settingsData?.user?.profile) {
      setDisplayName(settingsData.user.profile.displayName || "")
      setBio(settingsData.user.profile.bio || "")
      setAge(settingsData.user.profile.age?.toString() || "")
    }
  }, [settingsData])

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRedirecting(true)
      router.replace("/login")
    }
  }, [status, router])

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleSaveProfile = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName || undefined,
          bio: bio || undefined,
          age: age ? parseInt(age) : undefined
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save")
      setMessage({ type: "success", text: "Profile updated successfully!" })
      mutate()
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to save" })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" })
      return
    }
    
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to change password")
      setMessage({ type: "success", text: "Password changed successfully!" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to change password" })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      const res = await fetch("/api/user/settings", { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete account")
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to delete account" })
      setDeleting(false)
    }
  }

  // Loading states with beautiful animations
  if (status === "loading") {
    return <FullPageLoader message="Checking authentication..." />
  }

  if (status === "unauthenticated" || isRedirecting) {
    return <FullPageLoader message="Redirecting to login..." />
  }

  if (isLoading) {
    return <SettingsSkeleton />
  }

  if (!session?.user) {
    return <FullPageLoader message="Loading session..." />
  }

  const user = settingsData?.user

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      {/* Saving overlay */}
      {saving && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card rounded-2xl p-8 shadow-2xl border flex flex-col items-center gap-4 animate-in fade-in zoom-in-95">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-lg font-medium">Saving changes...</p>
          </div>
        </div>
      )}

      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="mt-2 text-muted-foreground">Manage your account preferences</p>
          </div>

          {/* Toast message */}
          {message && (
            <div 
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 ${
                message.type === "success" 
                  ? "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800" 
                  : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Account Info */}
          <Card className="mb-6 rounded-2xl border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                Account Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">Account Type</span>
                <Badge className="bg-primary/10 text-primary border-0">{user?.role}</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-0">
                  {user?.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="mb-6 rounded-2xl border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                Profile Settings
              </CardTitle>
              <CardDescription>Update your public profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="rounded-xl resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  className="rounded-xl"
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving} className="rounded-xl">
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="mb-6 rounded-2xl border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-amber-500" />
                </div>
                Change Password
              </CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 chars)"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="rounded-xl"
                />
              </div>

              <Button 
                onClick={handleChangePassword} 
                disabled={saving || !currentPassword || !newPassword}
                className="rounded-xl"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                {saving ? "Updating..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-900/50 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </div>
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={deleting} className="rounded-xl">
                    {deleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    {deleting ? "Deleting..." : "Delete Account"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount} 
                      className="bg-red-600 hover:bg-red-700 rounded-xl"
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
