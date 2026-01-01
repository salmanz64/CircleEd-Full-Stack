"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, X, CheckCircle, AlertCircle, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Notification {
  id: string
  type: "session_accepted" | "session_completed" | "tokens_earned" | "session_rejected"
  title: string
  message: string
  timestamp: Date
  read: boolean
  data?: {
    sessionId?: number
    tokens?: number
    skillName?: string
    teacherName?: string
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter(n => !n.read).length

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("notifications")
    if (saved) {
      setNotifications(JSON.parse(saved).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      })))
    }
  }, [])

  // Listen for notification events
  useEffect(() => {
    const handleNotification = (event: CustomEvent<Notification>) => {
      const notification = {
        ...event.detail,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false
      }
      setNotifications(prev => {
        const updated = [notification, ...prev].slice(0, 50) // Keep last 50
        localStorage.setItem("notifications", JSON.stringify(updated))
        return updated
      })
    }

    window.addEventListener("notification" as any, handleNotification)
    return () => window.removeEventListener("notification" as any, handleNotification)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n)
      localStorage.setItem("notifications", JSON.stringify(updated))
      return updated
    })
  }

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      localStorage.setItem("notifications", JSON.stringify(updated))
      return updated
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id)
      localStorage.setItem("notifications", JSON.stringify(updated))
      return updated
    })
  }

  const clearAll = () => {
    setNotifications([])
    localStorage.removeItem("notifications")
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "session_accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "session_completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "tokens_earned":
        return <Gift className="h-5 w-5 text-yellow-500" />
      case "session_rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "session_accepted":
        return "bg-green-50 border-green-200"
      case "session_completed":
        return "bg-blue-50 border-blue-200"
      case "tokens_earned":
        return "bg-yellow-50 border-yellow-200"
      case "session_rejected":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 border-l-4 border-transparent ${getNotificationColor(notification.type)} ${
                    !notification.read ? "border-l-indigo-600 bg-indigo-50/50" : ""
                  } cursor-pointer hover:bg-opacity-80 transition-colors`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.data?.tokens && (
                        <div className="mt-2 inline-block bg-yellow-100 px-2 py-1 rounded text-xs font-bold text-yellow-800">
                          +{notification.data.tokens} tokens
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-2">
              <button
                onClick={clearAll}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
