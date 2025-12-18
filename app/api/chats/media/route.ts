import { NextResponse } from "next/server"
import { resolveUser } from "@/lib/user-resolver"
import { uploadAnyToCloudinary } from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    const mimeType = (file.type as string) || "application/octet-stream"
    const originalName = (file.name as string) || "file"

    // Use Cloudinary "auto" resource type so images, videos, audio, docs all work
    const result = await uploadAnyToCloudinary(file, "chat-media")

    let kind: "image" | "video" | "audio" | "file" = "file"
    if (mimeType.startsWith("image/") || result.resource_type === "image") kind = "image"
    else if (mimeType.startsWith("video/") || result.resource_type === "video") kind = "video"
    else if (mimeType.startsWith("audio/") || result.resource_type === "audio") kind = "audio"

    return NextResponse.json({
      url: result.url,
      kind,
      mimeType,
      name: originalName,
    })
  } catch (error: any) {
    console.error("POST /api/chats/media error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}


