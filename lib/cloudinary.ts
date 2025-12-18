// Cloudinary is only used on the server (API routes)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require("cloudinary").v2

// Configure Cloudinary from environment variables
// Cloudinary SDK automatically reads CLOUDINARY_URL from process.env
// Format: cloudinary://api_key:api_secret@cloud_name
// Or set individual: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
if (!process.env.CLOUDINARY_URL && (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)) {
  console.warn(
    "⚠️  Cloudinary not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET in .env"
  )
}
// Cloudinary SDK auto-configures from CLOUDINARY_URL or individual env vars
cloudinary.config({
  secure: true,
})

export async function uploadImageToCloudinary(file: File, folder = "escort-photos") {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise<{
    url: string
    public_id: string
    width: number
    height: number
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error: any, result: any) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"))
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width || 0,
          height: result.height || 0,
        })
      }
    )

    stream.end(buffer)
  })
}

// Generic uploader for any media type (image, video, audio, raw files)
export async function uploadAnyToCloudinary(
  file: File,
  folder = "chat-media"
) {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise<{
    url: string
    public_id: string
    resource_type: string
    format?: string
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error: any, result: any) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"))
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format,
        })
      }
    )

    stream.end(buffer)
  })
}

