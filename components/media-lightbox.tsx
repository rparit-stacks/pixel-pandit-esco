"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface MediaLightboxProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  media: Array<{
    url: string
    kind: "image" | "video" | "audio"
    name?: string
  }>
  initialIndex?: number
}

export function MediaLightbox({
  open,
  onOpenChange,
  media,
  initialIndex = 0,
}: MediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const currentMedia = media[currentIndex]

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex, open])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0))
  }

  const handleDownload = () => {
    if (!currentMedia) return
    const link = document.createElement("a")
    link.href = currentMedia.url
    link.download = currentMedia.name || "download"
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === "ArrowLeft") handlePrevious()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "Escape") onOpenChange(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, currentIndex])

  if (!currentMedia) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation buttons */}
          {media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Download button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-50 text-white hover:bg-white/20 rounded-full"
            onClick={handleDownload}
          >
            <Download className="h-6 w-6" />
          </Button>

          {/* Media display */}
          <div className="w-full h-[95vh] flex items-center justify-center p-4">
            {currentMedia.kind === "image" ? (
              <img
                src={currentMedia.url}
                alt={currentMedia.name || "Media"}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : currentMedia.kind === "video" ? (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg"
              />
            ) : (
              <audio src={currentMedia.url} controls autoPlay className="w-full max-w-md" />
            )}
          </div>

          {/* Counter */}
          {media.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {media.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

