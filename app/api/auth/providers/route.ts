import { NextResponse } from "next/server"

export async function GET() {
  // Return credentials provider info
  return NextResponse.json({
    credentials: {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      signinUrl: "/api/auth/signin/credentials",
      callbackUrl: "/api/auth/callback/credentials",
    },
  })
}
