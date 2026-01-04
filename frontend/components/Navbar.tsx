"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
import { NotificationCenter } from "@/components/NotificationCenter"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Check if user is logged in by checking for token in localStorage
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("access_token")
        console.log("Token check:", { hasToken: !!token, tokenValue: token ? "exists" : "none" })
        setIsLoggedIn(!!token)
      } catch (error) {
        console.error("Error checking auth:", error)
        setIsLoggedIn(false)
      }
    }
    
    checkAuth()
    // Also check on storage changes (e.g., when user logs in/out in another tab)
    window.addEventListener("storage", checkAuth)
    
    // Listen for custom auth events from login/logout
    window.addEventListener("authStateChanged", checkAuth)
    
    return () => {
      window.removeEventListener("storage", checkAuth)
      window.removeEventListener("authStateChanged", checkAuth)
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      setIsLoggedIn(false)
      // Dispatch custom event so navbar updates immediately
      window.dispatchEvent(new Event("authStateChanged"))
      router.push("/login")
    }
  }

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register")
  const isHomePage = pathname === "/"
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/(dashboard)")

  // Only render on client after mount
  if (!isMounted) {
    return (
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">CircleEd</span>
          </Link>
          <div className="flex items-center gap-4" />
        </div>
      </nav>
    )
  }

  if (isAuthPage) {
    return (
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">CircleEd</span>
          </Link>
        </div>
      </nav>
    )
  }

  // For dashboard pages (authenticated users)
  if (isDashboard) {
    return (
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">CircleEd</span>
          </Link>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <Button variant="ghost" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  // For home page and other pages - show login/signup or profile/logout based on auth state
  if (isLoggedIn === null) {
    // Still loading auth state - don't show anything yet
    return (
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">CircleEd</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Placeholder while checking auth */}
          </div>
        </div>
      </nav>
    )
  }

  // For home page and other pages - show login/signup or profile/logout based on auth state
  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-gray-900">CircleEd</span>
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button variant="primary" onClick={() => router.push("/register")}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

