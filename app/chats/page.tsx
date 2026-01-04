"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search, 
  Send, 
  ArrowLeft, 
  MoreVertical, 
  Check, 
  CheckCheck,
  CheckCircle2,
  X,
  Smile,
  Ban,
  Flag,
  Trash2,
  Shield,
  MessageSquare,
  Paperclip,
  MapPin,
  Mic,
  CheckSquare
} from "lucide-react"
import { useEffect, useState, useTransition, useRef } from "react"
import { useSession } from "next-auth/react"
import useSWR from "swr"
import { useSearchParams, useRouter } from "next/navigation"
import { LoadingPage, LoadingSpinner } from "@/components/ui/loading-spinner"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { VoiceRecorder } from "@/components/voice-recorder"
import { EmojiPickerWrapper } from "@/components/emoji-picker-wrapper"
import { MediaLightbox } from "@/components/media-lightbox"
import { VoiceMessageCard } from "@/components/voice-message-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { supabase } from "@/lib/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

type Thread = {
  id: string
  status: "PENDING" | "ACCEPTED" | "REJECTED"
  escortProfile?: { id: string; displayName: string; mainPhotoUrl?: string | null; isOnline?: boolean }
  client?: { id: string; email: string; name?: string | null }
  messages?: { body: string; createdAt: string; senderId?: string }[]
  updatedAt: string
}

type Subscription = {
  planId: string
  chatBalance: number
  isUnlimited: boolean
  status: "ACTIVE" | "EXPIRED" | "CANCELLED"
  expiresAt: string
}

type MessageStatusClient = "sending" | "sent" | "delivered" | "seen"

type Message = {
  id: string
  senderId: string
  body: string
  createdAt: string
  isMine?: boolean
  status?: MessageStatusClient
  type?: "TEXT" | "MEDIA" | "LOCATION" | "VOICE" | "OFFER" | "TODO"
  payload?: any
  // For parsed structured messages (offer, media, location, etc.)
  meta?: any
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load")
  return res.json()
}

export default function ChatsPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const escortFromQuery = searchParams.get("escort")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastMessageIdRef = useRef<string | null>(null)
  const typingChannelRef = useRef<RealtimeChannel | null>(null)
  
  const userRole = (session?.user as any)?.role
  const userId = session?.user?.id
  const isEscort = userRole === "ESCORT"
  
  const {
    data: threadsData,
    mutate: mutateThreads,
    isLoading: threadsLoading,
  } = useSWR<{ results: Thread[] }>(
    authStatus === "authenticated" ? "/api/chats/threads" : null,
    fetcher
  )

  const {
    data: subData,
    mutate: mutateSub,
  } = useSWR<{ subscription: Subscription | null }>(
    authStatus === "authenticated" ? "/api/user/subscription" : null,
    fetcher
  )

  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [showSidebar, setShowSidebar] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [offerOpen, setOfferOpen] = useState(false)
  const [offerTitle, setOfferTitle] = useState("")
  const [offerAmount, setOfferAmount] = useState("")
  const [offerDescription, setOfferDescription] = useState("")
  const [servicesOptions, setServicesOptions] = useState<
    { id: string; name: string; price: number; duration: string | null; location: string | null }[]
  >([])
  const [selectedServiceId, setSelectedServiceId] = useState<string | "custom">("custom")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxMedia, setLightboxMedia] = useState<Array<{ url: string; kind: "image" | "video"; name?: string }>>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [todoOpen, setTodoOpen] = useState(false)
  const [todoTitle, setTodoTitle] = useState("")
  
  const handleBlock = async (thread: Thread) => {
    if (!confirm("Are you sure you want to block this user?")) return
    try {
      // Get the other user's ID from thread
      const otherUserId = isEscort ? thread.client?.id : thread.escortProfile?.id
      if (!otherUserId) return
      
      await fetch("/api/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: otherUserId, reason: "Blocked from chat" }),
      })
      mutateThreads()
      alert("User blocked successfully")
    } catch (e) {
      console.error("Failed to block user:", e)
    }
  }
  
  const handleReport = async (thread: Thread) => {
    const reason = prompt("Please provide a reason for reporting:")
    if (!reason) return
    try {
      // Get the other user's ID from thread
      const otherUserId = isEscort ? thread.client?.id : thread.escortProfile?.id
      if (!otherUserId) return
      
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportedUserId: otherUserId, reason }),
      })
      alert("Report submitted successfully")
    } catch (e) {
      console.error("Failed to report:", e)
    }
  }
  
  const handleDeleteChat = async (threadId: string) => {
    if (!confirm("Delete this chat? This cannot be undone.")) return
    try {
      await fetch(`/api/chats/threads?threadId=${threadId}`, {
        method: "DELETE",
      })
      mutateThreads()
      if (selectedThread?.id === threadId) {
        setSelectedThread(null)
      }
    } catch (e) {
      console.error("Failed to delete chat:", e)
    }
  }

  // Auto-select first thread
  useEffect(() => {
    if (threadsData?.results?.length && !selectedThread) {
      setSelectedThread(threadsData.results[0])
    }
  }, [threadsData, selectedThread])

  // Create thread from query param
  useEffect(() => {
    if (!escortFromQuery || authStatus !== "authenticated") return
    startTransition(async () => {
      await fetch("/api/chats/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ escortProfileId: escortFromQuery }),
      })
      mutateThreads()
    })
  }, [escortFromQuery, authStatus, mutateThreads])

  const {
    data: messagesData,
    mutate: mutateMessages,
    isLoading: messagesLoading,
  } = useSWR<{ messages: Message[]; status: string }>(
    selectedThread ? `/api/chats/messages?threadId=${selectedThread.id}` : null,
    fetcher
  )

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesData?.messages])

  // Simple send/receive sound using Web Audio API
  const playBeep = (frequency: number) => {
    if (typeof window === "undefined") return
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.value = frequency
      osc.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc.start()
      osc.stop(ctx.currentTime + 0.18)
    } catch {
      // ignore audio errors
    }
  }

  const playSendSound = () => playBeep(900)
  const playReceiveSound = () => playBeep(600)

  // Supabase Realtime: threads (new / updated chats)
  useEffect(() => {
    if (!supabase || authStatus !== "authenticated" || !userId) return

    const channel = supabase
      .channel("chat-threads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ChatThread" },
        () => {
          // API enforces access; just revalidate list
          mutateThreads()
        }
      )
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [authStatus, userId, mutateThreads])

  // Supabase Realtime: messages for selected thread
  useEffect(() => {
    if (!supabase || !selectedThread) return

    const threadId = selectedThread.id

    const channel = supabase
      .channel(`chat-messages:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ChatMessage",
          filter: `threadId=eq.${threadId}`,
        },
        async (payload) => {
          const newMsg = payload.new as any

          // Re-fetch to keep parsing logic in API
          mutateMessages()
          mutateThreads()

          // Mark as delivered for receiver
          if (newMsg.senderId !== userId) {
            try {
              await fetch(`/api/chats/messages/${newMsg.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "delivered" }),
              })
            } catch {
              // ignore
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ChatMessage",
          filter: `threadId=eq.${threadId}`,
        },
        () => {
          mutateMessages()
        }
      )
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [selectedThread, userId, mutateMessages, mutateThreads])

  // Supabase Realtime: typing indicator (broadcast)
  useEffect(() => {
    if (!supabase || !selectedThread) return

    const threadId = selectedThread.id
    const channel = supabase
      .channel(`typing:${threadId}`, {
        config: { presence: { key: userId || "anonymous" } },
      })
      .on("broadcast", { event: "typing" }, (payload: any) => {
        if (payload.payload?.userId === userId) return

        setIsTyping(true)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      })

    channel.subscribe()
    typingChannelRef.current = channel

    return () => {
      typingChannelRef.current = null
      supabase?.removeChannel(channel)
    }
  }, [selectedThread, userId])

  // Mark messages as seen when visible in open thread
  useEffect(() => {
    if (!selectedThread || !messagesData?.messages || !userId) return

    const markSeen = async () => {
      const toSee = messagesData.messages.filter(
        (m) => !m.isMine && m.status !== "seen"
      )
      for (const msg of toSee) {
        try {
          await fetch(`/api/chats/messages/${msg.id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "seen" }),
          })
        } catch {
          // ignore
        }
      }
    }

    markSeen()
  }, [selectedThread, messagesData, userId])

  // Detect new incoming messages and play receive sound
  useEffect(() => {
    const msgs = messagesData?.messages ?? []
    if (!msgs.length) return
    const last = msgs[msgs.length - 1]
    if (!last) return
    if (lastMessageIdRef.current && lastMessageIdRef.current !== last.id && !last.isMine) {
      playReceiveSound()
    }
    lastMessageIdRef.current = last.id
  }, [messagesData])

  const sendMessage = async () => {
    if (!selectedThread || !message.trim()) return
    if (selectedThread.status !== "ACCEPTED") {
      return
    }
    const body = message.trim()
    setMessage("")
    // optimistic append
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      senderId: userId || "me",
      body,
      type: "TEXT",
      payload: body,
      createdAt: new Date().toISOString(),
      isMine: true,
      status: "sending",
    }
    mutateMessages(
      (current) => ({
        messages: [...(current?.messages ?? []), optimistic],
        status: current?.status ?? selectedThread.status,
      }),
      false
    )
    playSendSound()
    try {
      await sendMessageWithType("TEXT", body, body)
    } catch (error: any) {
      // Remove optimistic message on error
      mutateMessages((current) => ({
        messages: current?.messages.filter((m) => m.id !== optimistic.id) ?? [],
        status: current?.status ?? selectedThread.status,
      }), false)
      
      if (error?.blocked || error?.message?.includes("blocked") || error?.message?.includes("You are blocked")) {
        toast.error("You are blocked. Cannot send messages.")
      } else {
        toast.error(error?.message || "Failed to send message")
      }
    }
  }

  const handleMessageChange = (value: string) => {
    setMessage(value)

    // Local typing state
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    setIsTyping(true)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 2000)

    // Broadcast typing via Supabase Realtime
    if (typingChannelRef.current && userId) {
      typingChannelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { userId },
      })
    }
  }

  const handleAttachClick = () => {
    if (!fileInputRef.current) return
    fileInputRef.current.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedThread) return
    try {
      const formData = new FormData()
      formData.append("file", file)

      const uploadRes = await fetch("/api/chats/media", {
        method: "POST",
        body: formData,
      })
      if (!uploadRes.ok) {
        console.error("Upload failed")
        return
      }
      const media = await uploadRes.json()

      const payload = {
        kind: media.kind as "image" | "video" | "audio" | "file",
        url: media.url as string,
        name: media.name as string,
        mimeType: media.mimeType as string,
      }

      // optimistic media card
      const optimistic: Message = {
        id: `temp-${Date.now()}`,
        senderId: userId || "me",
        body: `MEDIA::${JSON.stringify(payload)}`,
        type: "MEDIA",
        payload,
        createdAt: new Date().toISOString(),
        isMine: true,
        status: "sending",
      }
      mutateMessages(
        (current) => ({
          messages: [...(current?.messages ?? []), optimistic],
          status: current?.status ?? selectedThread.status,
        }),
        false
      )
      playSendSound()
      await sendMessageWithType("MEDIA", payload)
    } catch (err) {
      console.error("handleFileChange error", err)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleLocationClick = () => {
    if (!selectedThread) return
    if (!navigator.geolocation) {
      alert("Location not supported in this browser.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const url = `https://maps.google.com/?q=${latitude},${longitude}`
        const payload = {
          lat: latitude,
          lng: longitude,
          url,
        }
        const optimistic: Message = {
          id: `temp-${Date.now()}`,
          senderId: userId || "me",
          body: `LOCATION::${JSON.stringify(payload)}`,
          type: "LOCATION",
          payload,
          createdAt: new Date().toISOString(),
          isMine: true,
          status: "sending",
        }
        mutateMessages(
          (current) => ({
            messages: [...(current?.messages ?? []), optimistic],
            status: current?.status ?? selectedThread.status,
          }),
          false
        )
        playSendSound()
        await sendMessageWithType("LOCATION", payload)
      },
      () => {
        alert("Unable to fetch location.")
      }
    )
  }

  // Voice recording handler for VoiceRecorder component
  const handleVoiceSend = async (blob: Blob) => {
    if (!selectedThread) return
    try {
      const formData = new FormData()
      formData.append("file", new File([blob], "voice-message.webm", { type: "audio/webm" }))
      const uploadRes = await fetch("/api/chats/media", {
        method: "POST",
        body: formData,
      })
      if (!uploadRes.ok) {
        toast.error("Voice upload failed")
        return
      }
      const media = await uploadRes.json()
      const payload = {
        kind: "audio" as const,
        url: media.url as string,
        name: media.name as string,
        mimeType: media.mimeType as string,
      }
      await sendMessageWithType("VOICE", payload)
    } catch (err) {
      console.error("voice send error", err)
      toast.error("Failed to send voice message")
    }
  }

  // Helper to send messages with type and payload
  const sendMessageWithType = async (type: "TEXT" | "MEDIA" | "LOCATION" | "VOICE" | "OFFER" | "TODO", payload: any, bodyText?: string) => {
    if (!selectedThread) return
    const response = await fetch("/api/chats/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId: selectedThread.id,
        type,
        payload,
        body: bodyText || (type === "TEXT" ? payload : `${type}::${JSON.stringify(payload)}`),
      }),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (errorData.blocked) {
        const err: any = new Error("You are blocked")
        err.blocked = true
        throw err
      }
      throw new Error(errorData.error || "Failed to send message")
    }
    mutateMessages()
    mutateThreads()
    mutateSub()
    playSendSound()
  }

  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji)
  }

  // Handle TODO message creation
  const handleSendTODO = async () => {
    if (!selectedThread || !todoTitle.trim()) return
    const payload = {
      title: todoTitle.trim(),
      status: "pending",
    }
    setTodoOpen(false)
    setTodoTitle("")
    
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      senderId: userId || "me",
      body: `TODO::${JSON.stringify(payload)}`,
      type: "TODO",
      payload,
      createdAt: new Date().toISOString(),
      isMine: true,
      status: "sending",
    }
    mutateMessages(
      (current) => ({
        messages: [...(current?.messages ?? []), optimistic],
        status: current?.status ?? selectedThread.status,
      }),
      false
    )
    playSendSound()
    await sendMessageWithType("TODO", payload)
  }

  // Handle TODO status update
  const handleToggleTODO = async (msgId: string, currentStatus: string) => {
    if (!selectedThread) return
    try {
      const newStatus = currentStatus === "pending" ? "completed" : "pending"
      // Update via API - would need a PATCH endpoint or we update payload in message
      // For now, send a new message with updated status
      const msg = messagesData?.messages.find((m) => m.id === msgId)
      if (msg && msg.payload) {
        const updatedPayload = { ...msg.payload, status: newStatus }
        await sendMessageWithType("TODO", updatedPayload)
      }
    } catch (e) {
      console.error("Failed to update TODO", e)
      toast.error("Failed to update task")
    }
  }

  // Handle media lightbox
  const openMediaLightbox = (url: string, kind: "image" | "video", allMedia?: Array<{ url: string; kind: "image" | "video"; name?: string }>) => {
    if (allMedia) {
      const index = allMedia.findIndex((m) => m.url === url)
      setLightboxMedia(allMedia)
      setLightboxIndex(index >= 0 ? index : 0)
    } else {
      setLightboxMedia([{ url, kind }])
      setLightboxIndex(0)
    }
    setLightboxOpen(true)
  }

  // Load escort services to use inside offer dialog (escort side)
  useEffect(() => {
    const loadServices = async () => {
      if (!isEscort) return
      try {
        const res = await fetch("/api/escort/services")
        if (!res.ok) return
        const json = await res.json()
        setServicesOptions(
          (json.services || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            price: s.price,
            duration: s.duration,
            location: s.location,
          }))
        )
      } catch {
        // ignore
      }
    }
    loadServices()
  }, [isEscort])

  const handleSendOffer = async () => {
    if (!selectedThread || !offerAmount.trim()) return
    let title = offerTitle || "Custom Offer"
    let amount = Number(offerAmount)
    let duration: string | undefined
    let loc: string | undefined

    if (selectedServiceId && selectedServiceId !== "custom") {
      const svc = servicesOptions.find((s) => s.id === selectedServiceId)
      if (svc) {
        if (!offerTitle) title = svc.name
        if (!offerAmount) amount = svc.price
        if (svc.duration) duration = svc.duration
        if (svc.location) loc = svc.location
      }
    }

    const payload = {
      title,
      amount,
      description: offerDescription || "",
      duration,
      location: loc,
    }
    setOfferOpen(false)
    setOfferTitle("")
    setOfferAmount("")
    setOfferDescription("")

    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      senderId: userId || "me",
      body: `OFFER::${JSON.stringify(payload)}`,
      type: "OFFER",
      payload,
      createdAt: new Date().toISOString(),
      isMine: true,
      status: "sending",
    }
    mutateMessages(
      (current) => ({
        messages: [...(current?.messages ?? []), optimistic],
        status: current?.status ?? selectedThread.status,
      }),
      false
    )
    playSendSound()
    await sendMessageWithType("OFFER", payload)
  }

  const handleAcceptOffer = async (msg: Message, meta: any) => {
    if (!selectedThread) return
    try {
      const payload = {
        offerMessageId: msg.id,
        title: meta?.title || "Custom Offer",
        amount: meta?.amount || 0,
        action: "ACCEPTED",
      }
      
      const optimistic: Message = {
        id: `temp-${Date.now()}`,
        senderId: userId || "me",
        body: `Offer accepted: ${payload.title} for ₹${payload.amount}`,
        type: "OFFER",
        payload: { ...meta, response: "ACCEPTED" },
        createdAt: new Date().toISOString(),
        isMine: true,
        status: "sending",
      }
      
      mutateMessages(
        (current) => ({
          messages: [...(current?.messages ?? []), optimistic],
          status: current?.status ?? selectedThread.status,
        }),
        false
      )
      
      playSendSound()
      toast.success(`Offer accepted: ${payload.title} for ₹${payload.amount}`)
      
      // Send proper message with type/payload
      await sendMessageWithType("OFFER", { ...meta, response: "ACCEPTED" }, `Offer accepted: ${payload.title} for ₹${payload.amount}`)
      
      // Also notify the other party via toast
      setTimeout(() => {
        toast.info("The other party has been notified", { duration: 3000 })
      }, 500)
    } catch (e) {
      console.error("Failed to accept offer", e)
      toast.error("Failed to accept offer. Please try again.")
    }
  }

  const handleAcceptReject = async (threadId: string, action: "ACCEPTED" | "REJECTED") => {
    await fetch("/api/chats/threads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, status: action }),
    })
    mutateThreads()
    mutateSub()
    if (selectedThread?.id === threadId) {
      setSelectedThread({ ...selectedThread, status: action })
    }
  }

  // Filter threads by search
  const filteredThreads = (threadsData?.results ?? []).filter(thread => {
    if (!searchQuery) return true
    const name = isEscort 
      ? thread.client?.email || "" 
      : thread.escortProfile?.displayName || ""
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Auth loading
  if (authStatus === "loading") {
    return <LoadingPage message="Loading..." />
  }

  // Redirect if not logged in
  if (authStatus === "unauthenticated") {
    router.push("/login")
    return <LoadingPage message="Redirecting to login..." />
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500"
      case "ACCEPTED": return "bg-green-500"
      case "REJECTED": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#0b141a] overflow-x-hidden w-full">
      {/* Full screen edge-to-edge chat layout like WhatsApp */}
      <div className="flex flex-1 overflow-hidden max-w-full w-full">
        {/* Sidebar - Chat List - Compact */}
        <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[380px] bg-[#111b21] border-r border-[#222d34]`}>
          {/* Sidebar Header - Compact */}
          <div className="flex items-center justify-between px-3 py-3 bg-[#202c33] border-b border-[#222d34]">
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 ring-2 ring-[#00a884]/20">
                <AvatarImage src={session?.user?.image || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-[#00a884] to-[#008f6f] text-white font-semibold text-sm">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-white font-semibold text-base">Chats</h1>
                <div className="flex items-center gap-2">
                  <p className="text-[#8696a0] text-[10px]">{isEscort ? "Escort" : "Client"}</p>
                  {subData?.subscription && (
                    <Badge variant="outline" className="h-4 px-1 text-[9px] border-[#00a884] text-[#00a884] bg-[#00a884]/5">
                      {subData.subscription.isUnlimited ? "Unlimited" : `${subData.subscription.chatBalance} Credits`}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#aebac1] hover:bg-[#2a3942] rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Search - Compact */}
          <div className="px-2 py-2 bg-[#111b21]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8696a0]" />
              <Input 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm bg-[#202c33] border-0 text-white placeholder:text-[#8696a0] focus-visible:ring-1 focus-visible:ring-[#00a884] rounded-lg transition-all"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {threadsLoading && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            )}
            
            {filteredThreads.map((thread) => {
              const name = isEscort 
                ? thread.client?.email?.split("@")[0] || "Client" 
                : thread.escortProfile?.displayName || "Escort"
              const avatar = isEscort ? null : thread.escortProfile?.mainPhotoUrl
              const lastMessage = thread.messages?.[0]?.body || (
                thread.status === "PENDING" ? "Chat request pending..." :
                thread.status === "REJECTED" ? "Chat request rejected" : "Start chatting"
              )
              const isSelected = selectedThread?.id === thread.id
              
              return (
                <button
                  key={thread.id}
                  onClick={() => {
                    setSelectedThread(thread)
                    setShowSidebar(false)
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 hover:bg-[#202c33] transition-all duration-200 border-b border-[#222d34]/20 ${
                    isSelected ? "bg-[#2a3942]" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12 ring-2 ring-transparent hover:ring-[#00a884]/30 transition-all">
                      <AvatarImage src={avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-[#00a884] to-[#008f6f] text-white text-base font-semibold">
                        {name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#111b21] ${getStatusColor(thread.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-white font-medium truncate text-sm">{name}</span>
                      <span className="text-[10px] text-[#8696a0] ml-2">{formatTime(thread.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {thread.status === "ACCEPTED" && thread.messages?.[0] && (
                        <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb] flex-shrink-0" />
                      )}
                      <span className="text-xs text-[#8696a0] truncate leading-tight">{lastMessage}</span>
                    </div>
                  </div>
                </button>
              )
            })}
            
            {!threadsLoading && filteredThreads.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-[#8696a0]">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#202c33] to-[#2a3942] flex items-center justify-center mb-6 shadow-lg">
                  <MessageSquare className="h-12 w-12 text-[#00a884]" />
                </div>
                <p className="text-xl font-medium text-[#d1d7db] mb-2">No chats yet</p>
                <p className="text-sm text-center max-w-xs leading-relaxed">
                  {isEscort 
                    ? "Your chat requests will appear here. Wait for clients to reach out." 
                    : "Start a conversation by browsing profiles and sending a message request."}
                </p>
                {!isEscort && (
                  <Link href="/listings">
                    <Button className="mt-6 bg-[#00a884] hover:bg-[#00a884]/90 text-white rounded-full px-6">
                      Browse Profiles
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-[#0b141a]`}>
          {selectedThread ? (
            <>
              {/* Chat Header - Compact */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#202c33] border-b border-[#222d34]">
                <div className="flex items-center gap-2.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden h-8 w-8 text-[#aebac1] hover:bg-[#2a3942] rounded-full"
                    onClick={() => setShowSidebar(true)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-9 w-9 ring-2 ring-[#00a884]/20 cursor-pointer hover:ring-[#00a884]/40 transition-all">
                    <AvatarImage src={isEscort ? undefined : selectedThread.escortProfile?.mainPhotoUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-[#00a884] to-[#008f6f] text-white font-semibold text-sm">
                      {(isEscort ? selectedThread.client?.email?.[0] : selectedThread.escortProfile?.displayName?.[0]) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {isEscort 
                        ? selectedThread.client?.email?.split("@")[0] 
                        : selectedThread.escortProfile?.displayName || "Escort"}
                    </p>
                    <p className="text-[10px] text-[#8696a0] flex items-center gap-1">
                      {selectedThread.status === "ACCEPTED" && <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />}
                      {selectedThread.status === "ACCEPTED" ? "Online" : 
                       selectedThread.status === "PENDING" ? "Pending" : "Offline"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-0.5">
                  {/* Accept/Reject for escorts */}
                  {isEscort && selectedThread.status === "PENDING" && (
                    <>
                      <Button 
                        size="sm"
                        className="bg-[#00a884] hover:bg-[#00a884]/90 text-white"
                        onClick={() => handleAcceptReject(selectedThread.id, "ACCEPTED")}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Accept
                      </Button>
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAcceptReject(selectedThread.id, "REJECTED")}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#aebac1] hover:bg-[#2a3942] rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-[#202c33] border-[#2a3942] text-white">
                      <DropdownMenuItem className="cursor-pointer text-white focus:bg-[#2a3942] focus:text-white">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Info
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#2a3942]" />
                      <DropdownMenuItem 
                        className="cursor-pointer text-white focus:bg-[#2a3942] focus:text-white"
                        onClick={() => handleBlock(selectedThread)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Block User
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer text-white focus:bg-[#2a3942] focus:text-white"
                        onClick={() => handleReport(selectedThread)}
                      >
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#2a3942]" />
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-400 focus:bg-[#2a3942] focus:text-red-400"
                        onClick={() => handleDeleteChat(selectedThread.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages Area - Compact */}
              <div 
                className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-3 md:px-12 py-3 w-full"
                style={{
                  backgroundImage: "url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')",
                  backgroundRepeat: "repeat",
                  backgroundSize: "412.5px 749.25px"
                }}
              >
                {/* Status Messages - Compact */}
                {selectedThread.status === "PENDING" && (
                  <div className="flex justify-center my-3">
                    <div className="bg-[#182229] text-[#8696a0] text-xs px-3 py-2 rounded-lg max-w-xs text-center">
                      {isEscort 
                        ? "New chat request! Accept or reject below."
                        : "Request pending. Waiting for approval..."}
                    </div>
                  </div>
                )}
                
                {selectedThread.status === "REJECTED" && (
                  <div className="flex justify-center my-3">
                    <div className="bg-[#182229] text-red-400 text-xs px-3 py-2 rounded-lg">
                      Chat request was rejected.
                    </div>
                  </div>
                )}
                
                {/* Messages */}
                {selectedThread.status === "ACCEPTED" && (
                  <>
                    {messagesLoading && (
                      <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <LoadingSpinner size="sm" />
                        <p className="text-sm text-muted-foreground">Loading messages...</p>
                      </div>
                    )}
                    
                    {(messagesData?.messages ?? []).map((msg, index) => {
                      const isMine = msg.isMine ?? (msg.senderId === userId)
                      const showDate = index === 0 || 
                        new Date(msg.createdAt).toDateString() !== 
                        new Date(messagesData!.messages[index - 1].createdAt).toDateString()

                      // Parse structured message types - prefer type/payload from API, fallback to body parsing
                      let contentType: "text" | "media" | "location" | "offer" | "offerResponse" | "todo" | "voice" = "text"
                      let meta: any = null
                      
                      // Parse from type/payload (new format)
                      if (msg.type && msg.payload) {
                        if (msg.type === "VOICE") {
                          contentType = "voice"
                          meta = typeof msg.payload === "string" ? JSON.parse(msg.payload) : msg.payload
                        } else if (msg.type === "MEDIA") {
                          contentType = "media"
                          meta = typeof msg.payload === "string" ? JSON.parse(msg.payload) : msg.payload
                        } else if (msg.type === "LOCATION") {
                          contentType = "location"
                          meta = typeof msg.payload === "string" ? JSON.parse(msg.payload) : msg.payload
                        } else if (msg.type === "OFFER") {
                          contentType = "offer"
                          meta = typeof msg.payload === "string" ? JSON.parse(msg.payload) : msg.payload
                        } else if (msg.type === "TODO") {
                          contentType = "todo"
                          meta = typeof msg.payload === "string" ? JSON.parse(msg.payload) : msg.payload
                        }
                      }
                      // Fallback to body string parsing (legacy format)
                      else if (msg.body) {
                        if (msg.body.startsWith("VOICE::")) {
                          contentType = "voice"
                          try { meta = JSON.parse(msg.body.slice(7)) } catch (e) { console.error("Failed to parse VOICE:", e) }
                        } else if (msg.body.startsWith("MEDIA::")) {
                          contentType = "media"
                          try { meta = JSON.parse(msg.body.slice(7)) } catch (e) { console.error("Failed to parse MEDIA:", e) }
                        } else if (msg.body.startsWith("LOCATION::")) {
                          contentType = "location"
                          try { meta = JSON.parse(msg.body.slice(10)) } catch (e) { console.error("Failed to parse LOCATION:", e) }
                        } else if (msg.body.startsWith("OFFER::")) {
                          contentType = "offer"
                          try { meta = JSON.parse(msg.body.slice(7)) } catch (e) { console.error("Failed to parse OFFER:", e) }
                        } else if (msg.body.startsWith("OFFER_RESPONSE::")) {
                          contentType = "offerResponse"
                          try { meta = JSON.parse(msg.body.slice(16)) } catch (e) { console.error("Failed to parse OFFER_RESPONSE:", e) }
                        } else if (msg.body.startsWith("TODO::")) {
                          contentType = "todo"
                          try { meta = JSON.parse(msg.body.slice(6)) } catch (e) { console.error("Failed to parse TODO:", e) }
                        }
                      }
                      
                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <div className="flex justify-center my-3">
                              <span className="bg-[#182229] text-[#8696a0] text-xs px-3 py-1 rounded-lg">
                                {new Date(msg.createdAt).toLocaleDateString([], { 
                                  weekday: 'long', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          )}
                          <div className={`flex mb-1.5 ${isMine ? "justify-end" : "justify-start"} px-2 sm:px-0 w-full`}>
                            <div
                              className={`max-w-[85%] sm:max-w-[80%] md:max-w-[65%] rounded-lg px-2.5 py-1.5 shadow-md break-words overflow-wrap-anywhere word-break-break-word ${
                                isMine 
                                  ? "bg-[#005c4b] text-white rounded-tr-none" 
                                  : "bg-[#202c33] text-white rounded-tl-none"
                              }`}
                            >
                              {contentType === "media" && meta ? (
                                <div className="space-y-1">
                                  {meta.kind === "image" && (
                                    <img
                                      src={meta.url}
                                      alt={meta.name}
                                      className="max-h-64 w-full object-cover rounded-md mb-1 cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => {
                                        // Collect all images from messages for lightbox
                                        const allImages = messagesData?.messages
                                          .filter((m) => {
                                            const isImg = m.type === "MEDIA" && m.payload?.kind === "image"
                                            if (!isImg && m.body?.startsWith("MEDIA::")) {
                                              try {
                                                const p = JSON.parse(m.body.slice(7))
                                                return p.kind === "image"
                                              } catch {}
                                            }
                                            return false
                                          })
                                          .map((m) => ({
                                            url: m.payload?.url || JSON.parse(m.body.slice(7))?.url,
                                            kind: "image" as const,
                                            name: m.payload?.name || JSON.parse(m.body.slice(7))?.name,
                                          })) || []
                                        openMediaLightbox(meta.url, "image", allImages)
                                      }}
                                    />
                                  )}
                                  {meta.kind === "video" && (
                                    <video
                                      src={meta.url}
                                      controls
                                      className="max-h-64 w-full rounded-md mb-1 cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => {
                                        const allVideos = messagesData?.messages
                                          .filter((m) => {
                                            const isVid = m.type === "MEDIA" && m.payload?.kind === "video"
                                            if (!isVid && m.body?.startsWith("MEDIA::")) {
                                              try {
                                                const p = JSON.parse(m.body.slice(7))
                                                return p.kind === "video"
                                              } catch {}
                                            }
                                            return false
                                          })
                                          .map((m) => ({
                                            url: m.payload?.url || JSON.parse(m.body.slice(7))?.url,
                                            kind: "video" as const,
                                            name: m.payload?.name || JSON.parse(m.body.slice(7))?.name,
                                          })) || []
                                        openMediaLightbox(meta.url, "video", allVideos)
                                      }}
                                    />
                                  )}
                                  {meta.kind === "audio" && (
                                    <div className="space-y-1">
                                      <audio controls className="w-full mb-1">
                                        <source src={meta.url} type={meta.mimeType || "audio/mpeg"} />
                                      </audio>
                                      {/* Fake WhatsApp-like waveform */}
                                      <div className="flex items-end gap-0.5 h-5">
                                        {Array.from({ length: 16 }).map((_, idx) => (
                                          <div
                                            key={idx}
                                            className="w-[2px] rounded-full bg-emerald-300/80 animate-pulse"
                                            style={{
                                              height: `${6 + ((idx * 13) % 14)}px`,
                                              animationDelay: `${(idx % 4) * 80}ms`,
                                            }}
                                          />
                                        ))}
                                        <span className="ml-2 text-[11px] text-[#d1d7db]">
                                          Voice message
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {meta.kind === "file" && (
                                    <div className="flex items-center gap-2 text-[13px]">
                                      <Paperclip className="h-4 w-4" />
                                      <span className="truncate">{meta.name}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between gap-2 mt-1">
                                    <span className="text-[11px] text-[#d1d7db] truncate">{meta.name}</span>
                                    <a
                                      href={meta.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] underline text-[#53bdeb]"
                                    >
                                      Download
                                    </a>
                                  </div>
                                </div>
                              ) : contentType === "voice" && meta ? (
                                <VoiceMessageCard
                                  url={meta.url}
                                  mimeType={meta.mimeType}
                                  isMine={isMine}
                                />
                              ) : contentType === "location" && meta ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-[13px] font-semibold">
                                    <MapPin className="h-4 w-4 text-[#53bdeb]" />
                                    <span>Location shared</span>
                                  </div>
                                  {meta.address && (
                                    <p className="text-[11px] text-[#d1d7db]">{meta.address}</p>
                                  )}
                                  {meta.lat && meta.lng && (
                                    <div className="rounded-md overflow-hidden mb-2">
                                      <a
                                        href={`https://www.google.com/maps?q=${meta.lat},${meta.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                      >
                                        <img
                                          src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+00a884(${meta.lng},${meta.lat})/${meta.lng},${meta.lat},15,0/300x200@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`}
                                          alt="Location map"
                                          className="w-full h-32 object-cover rounded-md hover:opacity-90 transition-opacity"
                                          onError={(e) => {
                                            // Fallback if mapbox fails
                                            (e.target as HTMLImageElement).src = `https://maps.googleapis.com/maps/api/staticmap?center=${meta.lat},${meta.lng}&zoom=15&size=300x200&markers=color:0x00a884|${meta.lat},${meta.lng}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6d_s6L4cO7pXgEI`
                                          }}
                                        />
                                      </a>
                                    </div>
                                  )}
                                  <a
                                    href={meta.url || `https://www.google.com/maps?q=${meta.lat},${meta.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center mt-1 text-[11px] text-[#53bdeb] underline px-2 py-1 rounded-full bg-white/5 hover:bg-white/10"
                                  >
                                    <MapPin className="h-3 w-3 mr-1" />
                                    Open in Maps
                                  </a>
                                </div>
                              ) : contentType === "todo" && meta ? (
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <button
                                      onClick={() => handleToggleTODO(msg.id, meta.status || "pending")}
                                      className="mt-0.5 flex-shrink-0"
                                    >
                                      {meta.status === "completed" ? (
                                        <CheckCircle2 className="h-4 w-4 text-[#00a884]" />
                                      ) : (
                                        <div className="h-4 w-4 rounded-full border-2 border-[#8696a0]" />
                                      )}
                                    </button>
                                    <div className="flex-1">
                                      <p className={`text-[13px] ${meta.status === "completed" ? "line-through text-[#8696a0]" : ""}`}>
                                        {meta.title}
                                      </p>
                                      {meta.description && (
                                        <p className={`text-[11px] text-[#d1d7db] mt-1 ${meta.status === "completed" ? "line-through" : ""}`}>
                                          {meta.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : contentType === "offer" && meta ? (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="border-amber-400/70 text-[10px] uppercase tracking-wide bg-amber-500/10 text-amber-200"
                                      >
                                        Offer
                                      </Badge>
                                      <span className="text-[13px] font-semibold">
                                        {meta.title || "Custom Offer"}
                                      </span>
                                    </div>
                                    <span className="text-[14px] font-bold text-emerald-200">
                                      ₹{meta.amount}
                                    </span>
                                  </div>
                                  {meta.description && (
                                    <p className="text-[11px] text-[#d1d7db] whitespace-pre-wrap">
                                      {meta.description}
                                    </p>
                                  )}
                                  <div className="flex justify-end gap-2 pt-1">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="h-6 px-2 text-[11px] border-white/10 bg-white/5 hover:bg-white/10"
                                        >
                                          View details
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="bg-[#111b21] text-white border-[#2a3942] max-w-md">
                                        <DialogHeader>
                                          <DialogTitle className="text-sm flex items-center gap-2">
                                            <Badge
                                              variant="outline"
                                              className="border-amber-400/70 text-[10px] uppercase tracking-wide bg-amber-500/10 text-amber-200"
                                            >
                                              Offer
                                            </Badge>
                                            {meta.title || "Custom Offer"}
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-2 text-xs">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[#8696a0]">Amount</span>
                                            <span className="font-semibold text-emerald-300">
                                              ₹{meta.amount}
                                            </span>
                                          </div>
                                          {meta.duration && (
                                            <div className="flex items-center justify-between">
                                              <span className="text-[#8696a0]">Duration</span>
                                              <span>{meta.duration}</span>
                                            </div>
                                          )}
                                          {meta.location && (
                                            <div className="flex items-center justify-between">
                                              <span className="text-[#8696a0]">Location</span>
                                              <span>{meta.location}</span>
                                            </div>
                                          )}
                                          {meta.description && (
                                            <div className="pt-2">
                                              <p className="text-[#d1d7db] whitespace-pre-wrap">
                                                {meta.description}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        <DialogFooter>
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="border-white/20 text-xs"
                                          >
                                            Close
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                    {!isMine && (
                                      <Button
                                        type="button"
                                        size="sm"
                                        className="h-6 px-2 text-[11px] bg-[#00a884] hover:bg-[#00a884]/90 text-white"
                                        onClick={() => handleAcceptOffer(msg, meta)}
                                      >
                                        Accept Offer
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ) : contentType === "offerResponse" && meta ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-300">
                                    <Check className="h-3 w-3" />
                                    <span>Offer accepted</span>
                                  </div>
                                  {meta.title && meta.amount !== undefined ? (
                                    <p className="text-[11px] text-[#d1d7db] break-words">
                                      {meta.title} for ₹{meta.amount}
                                    </p>
                                  ) : meta.action === "ACCEPTED" ? (
                                    <p className="text-[11px] text-[#d1d7db]">
                                      Offer has been accepted
                                    </p>
                                  ) : (
                                    <p className="text-[11px] text-[#d1d7db]">
                                      Offer response received
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-[13px] leading-[18px] whitespace-pre-wrap break-words overflow-wrap-anywhere word-break-break-word">
                                  {msg.body?.startsWith("{") || msg.body?.startsWith("[") || msg.body?.includes("OFFER_RESPONSE::") || msg.body?.includes("::") ? (
                                    // Don't show raw JSON or parsed strings, show clean message
                                    <span className="text-muted-foreground italic">Message sent</span>
                                  ) : msg.body ? (
                                    msg.body
                                  ) : (
                                    <span className="text-muted-foreground italic">Empty message</span>
                                  )}
                                </p>
                              )}
                              <div className={`flex items-center justify-end gap-1 mt-0.5 text-[#8696a0]`}>
                    <span className="text-[10px]">
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {isMine && (
                                  <>
                                    {msg.status === "sending" && (
                                      <Check className="h-3 w-3 text-[#8696a0]" />
                                    )}
                                    {msg.status === "sent" && (
                                      <Check className="h-3 w-3 text-[#8696a0]" />
                                    )}
                                    {msg.status === "delivered" && (
                                      <CheckCheck className="h-3 w-3 text-[#8696a0]" />
                                    )}
                                    {msg.status === "seen" && (
                                      <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    
                    {(!messagesData?.messages || messagesData.messages.length === 0) && !messagesLoading && (
                      <div className="flex justify-center my-4">
                        <div className="bg-[#182229] text-[#8696a0] text-sm px-4 py-2 rounded-lg">
                          Chat started! Say hello 👋
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input - Compact */}
              <div className="px-2 sm:px-3 py-2 bg-[#202c33] border-t border-[#222d34] w-full overflow-x-hidden">
                {selectedThread.status === "ACCEPTED" ? (
                  <div className="space-y-1.5">
                    {!subData?.subscription || (subData.subscription.status !== "ACTIVE") ? (
                      <div className="flex flex-col items-center gap-2 py-3 px-4 bg-[#111b21] rounded-lg border border-amber-500/20 shadow-inner">
                        <div className="flex items-center gap-2 text-amber-200">
                          <Shield className="h-4 w-4" />
                          <p className="text-xs font-medium">
                            Active subscription required to send messages.
                          </p>
                        </div>
                        <Link href={isEscort ? "/escort/subscription" : "/settings"}>
                          <Button size="sm" className="h-8 bg-[#00a884] hover:bg-[#00a884]/90 text-white text-[11px] font-bold rounded-full px-6 transition-all shadow-lg">
                            Upgrade Plan
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-end gap-2">
                        <EmojiPickerWrapper onEmojiClick={addEmoji} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#8696a0] hover:bg-[#2a3942] rounded-full mb-0.5"
                          onClick={handleAttachClick}
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="hidden sm:inline-flex h-8 w-8 text-[#8696a0] hover:bg-[#2a3942] rounded-full mb-0.5"
                          onClick={handleLocationClick}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                        <VoiceRecorder onSend={handleVoiceSend} disabled={!selectedThread} />
                        <div className="flex-1 bg-[#2a3942] rounded-lg overflow-hidden">
                          <Input
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => handleMessageChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage()
                              }
                            }}
                            className="bg-transparent border-0 text-white placeholder:text-[#8696a0] focus-visible:ring-0 py-2 px-3 text-sm"
                          />
                        </div>
                        <Button
                          size="icon"
                          className="bg-[#00a884] hover:bg-[#00a884]/90 text-white rounded-full h-9 w-9 shadow-lg hover:shadow-xl transition-all mb-0.5"
                          onClick={sendMessage}
                          disabled={isPending || !message.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Dialog open={todoOpen} onOpenChange={setTodoOpen}>
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="hidden md:inline-flex h-9 rounded-full border-[#2a3942] text-xs text-[#d1d7db] bg-[#111b21]"
                            >
                              <CheckSquare className="h-3 w-3 mr-1" />
                              Task
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#111b21] text-white border-[#2a3942] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-base">Create Task</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3 py-2">
                              <div className="space-y-1.5">
                                <label className="text-xs text-[#8696a0]">Task Title</label>
                                <Input
                                  value={todoTitle}
                                  onChange={(e) => setTodoTitle(e.target.value)}
                                  placeholder="e.g., Confirm booking time"
                                  className="bg-[#202c33] border-0 text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault()
                                      handleSendTODO()
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setTodoOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                className="bg-[#00a884] hover:bg-[#00a884]/90"
                                onClick={handleSendTODO}
                                disabled={!todoTitle.trim()}
                              >
                                Create Task
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="hidden md:inline-flex h-9 rounded-full border-[#2a3942] text-xs text-[#d1d7db] bg-[#111b21]"
                            >
                              Create Offer
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#111b21] text-white border-[#2a3942] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-base">Create Custom Offer</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3 py-2">
                              <div className="space-y-1.5">
                                <label className="text-xs text-[#8696a0]">Title</label>
                                <Input
                                  value={offerTitle}
                                  onChange={(e) => setOfferTitle(e.target.value)}
                                  placeholder="Dinner date, 2 hours"
                                  className="bg-[#202c33] border-0 text-sm"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs text-[#8696a0]">Amount (₹)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={offerAmount}
                                  onChange={(e) => setOfferAmount(e.target.value)}
                                  placeholder="5000"
                                  className="bg-[#202c33] border-0 text-sm"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs text-[#8696a0]">Details</label>
                                <textarea
                                  value={offerDescription}
                                  onChange={(e) => setOfferDescription(e.target.value)}
                                  rows={3}
                                  className="w-full rounded-md bg-[#202c33] border-0 text-sm text-white p-2 resize-none"
                                  placeholder="Timing, place, included services..."
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setOfferOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                className="bg-[#00a884] hover:bg-[#00a884]/90"
                                onClick={handleSendOffer}
                                disabled={!offerAmount.trim()}
                              >
                                Send Offer
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                    {isTyping && (
                      <div className="pl-10 text-[10px] text-[#8696a0]">
                        Typing...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-2 text-[#8696a0]">
                    {selectedThread.status === "PENDING" 
                      ? "Messaging available once request is accepted"
                      : "This chat has been closed"}
                  </div>
                )}
              </div>
              {/* Hidden file input for attachments */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {/* Media Lightbox */}
              <MediaLightbox
                open={lightboxOpen}
                onOpenChange={setLightboxOpen}
                media={lightboxMedia}
                initialIndex={lightboxIndex}
              />
            </>
          ) : (
            /* No chat selected */
            <div className="flex-1 flex flex-col items-center justify-center bg-[#222e35] text-[#8696a0] relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
              <div className="text-center max-w-md px-8 relative z-10">
                <div className="h-48 w-48 mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00a884]/20 to-[#008f6f]/20 rounded-full blur-2xl"></div>
                  <svg viewBox="0 0 303 172" fill="none" className="w-full h-full relative">
                    <path fillRule="evenodd" clipRule="evenodd" d="M229.565 160.229C262.212 149.245 286.931 118.241 267.016 73.3379C247.101 28.4348 205.021 29.9878 173.263 43.9379C141.506 57.888 126.016 34.6896 99.1997 20.6677C72.3834 6.64576 38.6546 1.00001 23.6816 1H23.6715C13.9122 1.00001 10.1665 13.1812 18.449 18.5765C24.2739 22.3846 29.2039 26.7488 33.0234 31.2595C40.3057 39.8639 40.3057 55.5714 38.5862 72.5646C35.4083 103.256 47.2456 117.59 68.7636 125.473C98.7992 136.498 70.8661 137.926 86.7653 155.396C94.1687 163.551 142.047 165.016 181.697 163.373C198.204 162.664 219.028 163.73 229.565 160.229Z" fill="#364147"/>
                    <path d="M201.809 59.9219C201.443 59.7969 200.57 59.5469 199.945 59.4219C196.568 58.6719 192.692 58.4219 188.692 58.9219C183.567 59.5469 179.317 61.0469 175.067 63.4219C172.567 64.7969 170.317 66.4219 168.317 68.1719C167.817 68.5469 167.317 68.9219 166.817 69.2969C161.068 74.0469 156.693 80.2969 154.193 87.2969C150.193 98.2969 151.068 110.047 156.568 120.422C162.068 130.797 171.568 138.047 182.568 140.547C184.818 141.047 187.068 141.297 189.318 141.297C198.068 141.297 206.443 137.672 212.818 131.297C220.318 123.797 224.068 113.797 223.443 103.172C223.068 96.5469 220.818 90.2969 217.068 84.9219C217.068 84.9219 217.068 84.9219 217.068 84.7969C213.318 79.5469 208.068 75.5469 201.809 73.1719" fill="#00a884"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-light text-[#d1d7db] mb-3">Elite Companions Chat</h2>
                <p className="text-sm leading-relaxed text-[#8696a0]">
                  Send and receive messages securely. Your conversations are private and encrypted.
                </p>
                <div className="mt-8 flex items-center justify-center gap-8 text-xs text-[#8696a0]">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#00a884]" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#00a884]" />
                    <span>Private</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[#00a884]" />
                    <span>Real-time</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
