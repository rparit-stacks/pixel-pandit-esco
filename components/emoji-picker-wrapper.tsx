"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dynamically import emoji picker to avoid SSR issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false })

interface EmojiPickerWrapperProps {
  onEmojiClick: (emoji: string) => void
}

export function EmojiPickerWrapper({ onEmojiClick }: EmojiPickerWrapperProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#8696a0] hover:bg-[#2a3942] rounded-full"
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 border-[#2a3942] bg-[#202c33]"
        align="start"
        side="top"
      >
        <EmojiPicker
          onEmojiClick={(emojiData) => {
            onEmojiClick(emojiData.emoji)
            setOpen(false)
          }}
          theme="dark"
          previewConfig={{ showPreview: false }}
          searchPlaceHolder="Search emojis..."
        />
      </PopoverContent>
    </Popover>
  )
}

