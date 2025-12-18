"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Square, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceMessageCardProps {
  url: string
  mimeType?: string
  isMine?: boolean
}

export function VoiceMessageCard({ url, mimeType = "audio/webm", isMine = false }: VoiceMessageCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (!audioElementRef.current) return

    const audio = audioElementRef.current
    audio.src = url

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    
    audio.load()

    return () => {
      audio.pause()
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [url])

  const togglePlayback = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsPlaying(false)
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex items-center gap-3 py-1.5 px-2 min-w-[200px] max-w-[280px]">
      {/* Play/Pause Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full flex-shrink-0 ${
          isMine ? "bg-white/20 hover:bg-white/30" : "bg-white/10 hover:bg-white/20"
        }`}
        onClick={togglePlayback}
      >
        {isPlaying ? (
          <Square className="h-4 w-4 fill-white" />
        ) : (
          <Play className="h-4 w-4 fill-white" />
        )}
      </Button>

      {/* Waveform and Progress */}
      <div className="flex-1 min-w-0">
        {/* Waveform bars */}
        <div className="flex items-end gap-0.5 h-5 mb-1">
          {Array.from({ length: 32 }).map((_, idx) => {
            const barHeight = 4 + ((idx * 7) % 12)
            const isActive = idx / 32 < progress / 100
            return (
              <div
                key={idx}
                className={`w-[2px] rounded-full transition-all ${
                  isActive
                    ? isMine
                      ? "bg-white/90"
                      : "bg-[#00a884]"
                    : isMine
                    ? "bg-white/30"
                    : "bg-white/20"
                }`}
                style={{
                  height: `${barHeight}px`,
                }}
              />
            )
          })}
        </div>

        {/* Time and duration */}
        <div className="flex items-center justify-between text-[11px]">
          <span className={isMine ? "text-white/80" : "text-[#8696a0]"}>
            {formatTime(currentTime)}
          </span>
          <span className={isMine ? "text-white/60" : "text-[#8696a0]"}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioElementRef} preload="metadata" />
    </div>
  )
}

