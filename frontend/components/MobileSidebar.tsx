"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { X, Menu } from "lucide-react"
import {
  LayoutDashboard,
  Store,
  MessageSquare,
  Wallet,
  User,
  Settings,
  BookOpen,
  Calendar,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/teach", label: "My Skills", icon: BookOpen },
  { href: "/bookings", label: "My Bookings", icon: Calendar },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/wallet", label: "My Tokens", icon: Wallet },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-white rounded-full shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 md:hidden shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">Menu</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>
        </>
      )}
    </>
  )
}

