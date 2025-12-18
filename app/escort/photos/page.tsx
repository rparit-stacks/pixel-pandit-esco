"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import useSWR from "swr"
import { 
  Upload, 
  X, 
  Star, 
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react"
import { LoadingPage } from "@/components/ui/loading-spinner"
import { toast } from "sonner"

type Photo = {
  id: string
  url: string
  isMain: boolean
  order: number
}

type ProfileData = {
  id: string
  displayName: string
  mainPhotoUrl: string | null
  photos: Photo[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load")
  return res.json()
}

export default function EscortPhotosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { data: profile, isLoading, mutate } = useSWR<ProfileData>(
    status === "authenticated" ? "/api/escort/photos" : null,
    fetcher
  )

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRedirecting(true)
      router.replace("/login")
    }
  }, [status, router])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    try {
      const formData = new FormData()
      // For now upload only first file; can extend to multiple
      formData.append("file", files[0])

      const res = await fetch("/api/escort/photos", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Upload failed")
      }
      
      await mutate()
      toast.success("Upload complete!")
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error?.message || "Please try again later"
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const setMainPhoto = async (photoId: string) => {
    try {
      const res = await fetch("/api/escort/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, setMain: true })
      })

      if (!res.ok) throw new Error("Failed to update")
      
      await mutate()
      toast.success("Main photo updated!")
    } catch (error) {
      toast.error("Failed to set main photo")
    }
  }

  const deletePhoto = async (photoId: string) => {
    setDeletingId(photoId)
    try {
      const res = await fetch("/api/escort/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId })
      })

      if (!res.ok) throw new Error("Failed to delete")
      
      await mutate()
      toast.success("Photo deleted!")
    } catch (error) {
      toast.error("Failed to delete photo")
    } finally {
      setDeletingId(null)
    }
  }

  if (status === "loading" || isLoading) {
    return <LoadingPage message="Loading your photos..." />
  }

  if (status === "unauthenticated" || isRedirecting) {
    return <LoadingPage message="Redirecting to login..." />
  }

  const photos = profile?.photos || []
  const maxPhotos = 12

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-8 md:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <i className="fa-solid fa-images mr-3 text-primary"></i>
              Photo Gallery
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage your portfolio photos • {photos.length} of {maxPhotos} photos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              <i className="fa-solid fa-star mr-2 text-amber-500"></i>
              Main photo is highlighted
            </Badge>
          </div>
        </div>

        {/* Tips Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardContent className="flex items-start gap-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Photo Tips</h3>
              <ul className="mt-1 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Upload high-quality photos (min 1200x1600px)</li>
                <li>• Use good lighting and professional poses</li>
                <li>• Your main photo appears on listings and search results</li>
                <li>• Maximum {maxPhotos} photos allowed</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Photos
            </CardTitle>
            <CardDescription>
              Add new photos to your gallery. JPG, PNG formats supported.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-primary/50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
                id="photo-upload"
                disabled={uploading || photos.length >= maxPhotos}
              />
              <label
                htmlFor="photo-upload"
                className={`flex flex-col items-center cursor-pointer ${photos.length >= maxPhotos ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="mt-4 text-sm font-medium">Uploading...</p>
                  </>
                ) : (
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <ImageIcon className="h-8 w-8 text-primary" />
                    </div>
                    <p className="mt-4 text-sm font-medium">
                      {photos.length >= maxPhotos 
                        ? "Maximum photos reached" 
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG up to 5MB each
                    </p>
                  </>
                )}
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Photo Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-grip"></i>
                Your Photos
              </span>
              <Badge variant="secondary">{photos.length} photos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No photos yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload your first photo to get started
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`group relative aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all ${
                      photo.isMain 
                        ? 'border-amber-500 ring-2 ring-amber-500/20' 
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Main Photo Badge */}
                    {photo.isMain && (
                      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-xs font-medium text-white shadow-lg">
                        <Star className="h-3 w-3 fill-white" />
                        Main
                      </div>
                    )}

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                        {!photo.isMain && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setMainPhoto(photo.id)}
                            className="h-8 text-xs"
                          >
                            <Star className="mr-1 h-3 w-3" />
                            Set Main
                          </Button>
                        )}
                        {photo.isMain && (
                          <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/50">
                            <Check className="mr-1 h-3 w-3" />
                            Primary
                          </Badge>
                        )}
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => deletePhoto(photo.id)}
                          disabled={deletingId === photo.id}
                          className="h-8 w-8"
                        >
                          {deletingId === photo.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8 flex justify-start">
          <Button variant="outline" onClick={() => router.push("/escort/dashboard")}>
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}

