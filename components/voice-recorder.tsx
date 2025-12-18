"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Play, Square, X, Send } from "lucide-react"
import { toast } from "sonner"

interface VoiceRecorderProps {
  onSend: (blob: Blob) => Promise<void>
  disabled?: boolean
}

export function VoiceRecorder({ onSend, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Voice recording is not supported in this browser")
        return
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch((error) => {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          toast.error("Microphone permission denied. Please enable microphone access in your browser settings.")
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          toast.error("No microphone found. Please connect a microphone and try again.")
        } else {
          toast.error("Unable to access microphone. Please check your browser settings.")
        }
        throw error
      })
      
      streamRef.current = stream
      
      const recorder = new MediaRecorder(stream)
      recordedChunksRef.current = []
      
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) {
          recordedChunksRef.current.push(ev.data)
        }
      }
      
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" })
        setRecordedBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        // Get duration
        const audio = new Audio(url)
        audio.onloadedmetadata = () => {
          setDuration(audio.duration)
        }
      }
      
      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Timer for recording duration
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Error starting recording:", err)
      toast.error("Unable to access microphone")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setRecordedBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setDuration(0)
    setIsPlaying(false)
  }

  const togglePlayback = () => {
    if (!audioUrl) return
    
    if (!audioRef.current) {
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      
      audio.onended = () => {
        setIsPlaying(false)
        setRecordingTime(0)
      }
      
      audio.ontimeupdate = () => {
        setRecordingTime(audio.currentTime)
      }
    }
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current)
      }
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleSend = async () => {
    if (!recordedBlob) return
    await onSend(recordedBlob)
    deleteRecording()
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (durationTimerRef.current) clearInterval(durationTimerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [audioUrl])

  // Recording state - show record button
  if (!isRecording && !recordedBlob) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-[#8696a0] hover:bg-[#2a3942] rounded-full"
        onClick={startRecording}
        disabled={disabled}
      >
        <Mic className="h-4 w-4" />
      </Button>
    )
  }

  // Recording in progress
  if (isRecording) {
    return (
      <div className="flex items-center gap-2 bg-[#2a3942] rounded-full px-3 py-1.5">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs text-white">{formatTime(recordingTime)}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:bg-[#3a4a52] rounded-full"
          onClick={stopRecording}
        >
          <Square className="h-3 w-3 fill-white" />
        </Button>
      </div>
    )
  }

  // Preview state - show playback controls
  if (recordedBlob && audioUrl) {
    return (
      <div className="flex items-center gap-2 bg-[#2a3942] rounded-lg px-3 py-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:bg-[#3a4a52] rounded-full"
          onClick={togglePlayback}
        >
          {isPlaying ? (
            <Square className="h-3 w-3 fill-white" />
          ) : (
            <Play className="h-3 w-3 fill-white" />
          )}
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-[#3a4a52] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00a884] transition-all"
                style={{
                  width: duration > 0 ? `${(recordingTime / duration) * 100}%` : "0%",
                }}
              />
            </div>
            <span className="text-xs text-[#8696a0] whitespace-nowrap">
              {formatTime(recordingTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-red-400 hover:bg-red-500/20 rounded-full"
          onClick={deleteRecording}
        >
          <X className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-6 px-2 bg-[#00a884] hover:bg-[#00a884]/90 text-white rounded-full text-xs"
          onClick={handleSend}
        >
          <Send className="h-3 w-3 mr-1" />
          Send
        </Button>
      </div>
    )
  }

  return null
}

