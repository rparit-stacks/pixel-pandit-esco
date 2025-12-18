import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    console.error("AUTH_SECRET or NEXTAUTH_SECRET must be set in environment variables")
    return NextResponse.next() // Allow request through if secret is missing (shouldn't happen in production)
  }
  const token = await getToken({ req, secret })

  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/listings",
    "/cities",
    "/contact",
    "/privacy",
    "/terms",
    "/safety",
    "/age-verification",
  ]

  // Allow public routes
  if (publicRoutes.includes(path) || path.startsWith("/profile/")) {
    return NextResponse.next()
  }

  // Require auth for protected client routes
  const protectedClientRoutes = ["/dashboard", "/saved", "/settings", "/chats"]
  if (protectedClientRoutes.some((route) => path.startsWith(route))) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url))
    return NextResponse.next()
  }

  // Admin only
  if (path.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") return NextResponse.redirect(new URL("/login", req.url))
    return NextResponse.next()
  }

  // Escort only
  if (path.startsWith("/escort")) {
    if (!token || token.role !== "ESCORT") return NextResponse.redirect(new URL("/login", req.url))
    return NextResponse.next()
  }

  // Default allow
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/escort/:path*",
    "/dashboard/:path*",
    "/saved/:path*",
    "/settings/:path*",
    "/chats/:path*",
  ],
}

