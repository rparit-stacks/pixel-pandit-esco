import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./db"
import * as bcrypt from "bcryptjs"
import { Role, UserStatus } from "@prisma/client"
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Master OTP for development/testing (works always)
        const MASTER_OTP = "981016"
        const isMasterOtp = password === MASTER_OTP

        // Attempt OTP-first flow: treat password as OTP code or master OTP
        const otpToken = await prisma.otpToken.findUnique({ where: { email } })
        const now = new Date()
        const isValidOtp = otpToken && !otpToken.consumed && otpToken.code === password && otpToken.expiresAt > now
        
        if (isMasterOtp || isValidOtp) {
          // Upsert user as CLIENT
          const randomPassword = isMasterOtp ? MASTER_OTP + email : (otpToken?.code || password) + email
          const otpUser = await prisma.user.upsert({
            where: { email },
            create: {
              email,
              password: await bcrypt.hash(randomPassword, 10),
              role: Role.CLIENT,
              status: UserStatus.ACTIVE,
            },
            update: {},
            include: { profile: true },
          })

          // Only consume OTP if it was a real one (not master)
          if (isValidOtp && otpToken) {
            await prisma.otpToken.update({
              where: { email },
              data: { consumed: true },
            })
          }

          return {
            id: otpUser.id,
            email: otpUser.email,
            role: otpUser.role,
            name: otpUser.profile?.displayName || otpUser.email,
            image: otpUser.profile?.mainPhotoUrl || null,
          }
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            profile: true,
          },
        })

        if (!user) {
          return null
        }

        // Check if user is active
        if (user.status !== UserStatus.ACTIVE) {
          throw new Error("Account is suspended or pending verification")
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.profile?.displayName || user.email,
          image: user.profile?.mainPhotoUrl || null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
}
