"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Get initials from name or email
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }
  return "U"
}

// Get display name
function getDisplayName(name?: string | null, email?: string | null): string {
  if (name) return name
  if (email) return email.split("@")[0]
  return "User"
}

export function Header() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isLoggedIn = status === "authenticated" && !!session?.user
  const userRole = (session?.user as any)?.role
  const userName = session?.user?.name
  const userEmail = session?.user?.email
  const userImage = session?.user?.image

  const getDashboardLink = () => {
    if (userRole === "ESCORT") return "/escort/dashboard"
    if (userRole === "ADMIN") return "/admin"
    return "/dashboard"
  }

  const initials = getInitials(userName, userEmail)
  const displayName = getDisplayName(userName, userEmail)

  const navLinks = [
    { href: "/listings", icon: "fa-solid fa-fire", label: "Browse", badge: "Hot" },
    { href: "/cities", icon: "fa-solid fa-location-dot", label: "Cities" },
  ]

  const userLinks = [
    { href: getDashboardLink(), icon: "fa-solid fa-gauge-high", label: "Dashboard" },
    { href: "/saved", icon: "fa-solid fa-heart", label: "Saved" },
    { href: "/chats", icon: "fa-solid fa-comments", label: "Messages" },
    { href: "/settings", icon: "fa-solid fa-gear", label: "Settings" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-pink-500 shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <i className="fa-solid fa-heart text-lg text-white"></i>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Elite<span className="text-primary">Companions</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground rounded-xl hover:text-foreground hover:bg-muted/50 transition-all group"
              >
                <i className={`${link.icon} text-base group-hover:text-primary transition-colors`}></i>
                <span>{link.label}</span>
                {link.badge && (
                  <Badge className="ml-1 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-[10px] px-1.5 py-0">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
            
            {!isLoggedIn && (
              <Link
                href="/signup?role=escort"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground rounded-xl hover:text-foreground hover:bg-muted/50 transition-all group"
              >
                <i className="fa-solid fa-crown text-base group-hover:text-amber-500 transition-colors"></i>
                <span>Become Escort</span>
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <>
                {/* Saved - Desktop only */}
                <Link
                  href="/saved"
                  className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all relative"
                >
                  <i className="fa-solid fa-heart text-lg"></i>
                </Link>

                {/* Messages */}
                <Link
                  href="/chats"
                  className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all relative"
                >
                  <i className="fa-solid fa-comments text-lg"></i>
                  {/* Notification dot */}
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background"></span>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-10 w-10 rounded-xl p-0 hover:bg-muted/50 ring-2 ring-transparent hover:ring-primary/20 transition-all"
                    >
                      <Avatar className="h-10 w-10 rounded-xl">
                        <AvatarImage src={userImage || undefined} alt={displayName} className="object-cover" />
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary to-pink-500 text-white font-bold text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end" sideOffset={8}>
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-2">
                      <Avatar className="h-12 w-12 rounded-xl ring-2 ring-primary/20">
                        <AvatarImage src={userImage || undefined} alt={displayName} className="object-cover" />
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary to-pink-500 text-white font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                        <Badge className="mt-1 text-[10px] bg-primary/10 text-primary border-0">
                          {userRole || "CLIENT"}
                        </Badge>
                      </div>
                    </div>
                    
                    <DropdownMenuSeparator className="my-2" />
                    
                    {userLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <i className={`${link.icon} text-sm text-muted-foreground`}></i>
                          </div>
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    
                    <DropdownMenuSeparator className="my-2" />
                    
                    <DropdownMenuItem 
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950/30">
                        <i className="fa-solid fa-right-from-bracket text-sm text-red-600"></i>
                      </div>
                      <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Login - Desktop */}
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span>Login</span>
                </Link>
                
                {/* Sign Up Button */}
                <Button 
                  className="rounded-xl bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all text-sm px-4 sm:px-6" 
                  asChild
                >
                  <Link href="/signup">
                    <i className="fa-solid fa-sparkles mr-2"></i>
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden">Join</span>
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 rounded-xl hover:bg-muted/50">
                  <i className="fa-solid fa-bars text-lg"></i>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="p-6 pb-4 border-b">
                  <SheetTitle className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-pink-500">
                      <i className="fa-solid fa-heart text-lg text-white"></i>
                    </div>
                    <span className="font-bold">EliteCompanions</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col h-[calc(100vh-80px)]">
                  {/* User Info (if logged in) */}
                  {isLoggedIn && (
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                        <Avatar className="h-14 w-14 rounded-xl ring-2 ring-primary/20">
                          <AvatarImage src={userImage || undefined} alt={displayName} className="object-cover" />
                          <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary to-pink-500 text-white font-bold text-lg">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{displayName}</p>
                          <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                          <Badge className="mt-1 text-[10px] bg-primary/10 text-primary border-0">
                            {userRole || "CLIENT"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                      <i className="fa-solid fa-compass mr-2"></i>
                      Navigation
                    </p>
                    
                    {navLinks.map((link) => (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                            <i className={`${link.icon} text-base text-muted-foreground`}></i>
                          </div>
                          <span className="font-medium">{link.label}</span>
                          {link.badge && (
                            <Badge className="ml-auto bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-[10px]">
                              {link.badge}
                            </Badge>
                          )}
                        </Link>
                      </SheetClose>
                    ))}
                    
                    {!isLoggedIn && (
                      <SheetClose asChild>
                        <Link
                          href="/signup?role=escort"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/30">
                            <i className="fa-solid fa-crown text-base text-amber-600"></i>
                          </div>
                          <span className="font-medium">Become Escort</span>
                          <Badge className="ml-auto bg-amber-100 dark:bg-amber-950/30 text-amber-600 border-0 text-[10px]">
                            Earn
                          </Badge>
                        </Link>
                      </SheetClose>
                    )}

                    {isLoggedIn && (
                      <>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 mt-6">
                          <i className="fa-solid fa-user mr-2"></i>
                          Account
                        </p>
                        
                        {userLinks.map((link) => (
                          <SheetClose key={link.href} asChild>
                            <Link
                              href={link.href}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                <i className={`${link.icon} text-base text-muted-foreground`}></i>
                              </div>
                              <span className="font-medium">{link.label}</span>
                            </Link>
                          </SheetClose>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="p-4 border-t mt-auto">
                    {isLoggedIn ? (
                      <Button 
                        variant="outline" 
                        className="w-full rounded-xl h-12 border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          signOut({ callbackUrl: "/" })
                        }}
                      >
                        <i className="fa-solid fa-right-from-bracket mr-2"></i>
                        Sign Out
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <SheetClose asChild>
                          <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-primary to-pink-500" asChild>
                            <Link href="/signup">
                              <i className="fa-solid fa-sparkles mr-2"></i>
                              Create Account
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button variant="outline" className="w-full rounded-xl h-12" asChild>
                            <Link href="/login">
                              <i className="fa-solid fa-right-to-bracket mr-2"></i>
                              Login
                            </Link>
                          </Button>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
