"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function EscortMessagesPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the main chats page which has the proper WhatsApp-style UI
    router.push("/chats")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to messages...</p>
      </div>
    </div>
  )
}
