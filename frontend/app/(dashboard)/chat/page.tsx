"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { chatsAPI, Chat } from "@/lib/api"
import { Search, Send, User, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/Toast"
import Image from "next/image"

type ChatView = {
  id: number | string
  participantName: string
  participantAvatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  participantId?: number
  participantIsActive?: boolean
}

export default function ChatPage() {
  const [chats, setChats] = useState<ChatView[]>([])
  const [selectedChat, setSelectedChat] = useState<number | string | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const u = await response.json()
          setCurrentUserId(u.id)
        }
      } catch (err) {
        console.error('Failed to load user:', err)
        setCurrentUserId(null)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true)
        const data = await chatsAPI.getAll?.() || []
        // Map API shape to UI shape (handle different property namings)
        const uiChats: ChatView[] = data.map((c: any) => ({
          id: c.id,
          participantName: c.participant_name || c.participantName || c.participant_name || `Chat #${c.id}`,
          participantAvatar: c.participant_avatar || c.participantAvatar,
          participantId: c.participant_id || c.participantId,
          participantIsActive: c.participant_is_active !== undefined ? c.participant_is_active : false,
          lastMessage: c.last_message || c.lastMessage || "",
          lastMessageTime: c.last_message_time || c.lastMessageTime || "",
          unreadCount: c.unread_count || c.unreadCount || 0,
        }))
        setChats(uiChats)
        // If there's a chat query param, open that chat
        const requested = searchParams?.get('chat')
        if (requested) {
          setSelectedChat(requested)
        } else if (uiChats.length > 0) {
          setSelectedChat(uiChats[0].id)
        }
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chats")
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [])

  const currentChat = chats.find((c) => c.id === selectedChat)
  const [messages, setMessages] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return
      try {
        const msgs = await chatsAPI.getMessages(Number(selectedChat))
        console.log('fetched messages for chat', selectedChat, msgs)
        setMessages(Array.isArray(msgs) ? msgs : [])
      } catch (err) {
        console.error('Error loading messages', err)
      }
    }
    fetchMessages()
  }, [selectedChat])

  const { showToast } = useToast()
  const [sendingMessage, setSendingMessage] = useState(false)

  const sendMessage = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault()
    if (!selectedChat || !message.trim() || sendingMessage) return
    
    const messageContent = message.trim()
    try {
      setSendingMessage(true)
      // Optimistically add the message
      const optimisticMessage = {
        id: Date.now(),
        chat_id: selectedChat,
        sender_id: currentUserId,
        content: messageContent,
        created_at: new Date().toISOString(),
        is_read: false,
      }
      setMessages([...messages, optimisticMessage])
      setMessage("")

      await chatsAPI.sendMessage(Number(selectedChat), messageContent)
      
      // Refresh messages to get the actual saved message
      const msgs = await chatsAPI.getMessages(Number(selectedChat))
      setMessages(msgs || [])
      showToast({ title: 'Message sent', type: 'success' })
    } catch (err) {
      console.error('Send error:', err)
      showToast({ 
        title: 'Send failed', 
        message: err instanceof Error ? err.message : 'Failed to send message', 
        type: 'error' 
      })
      // Remove optimistic message on error
      setMessages(messages)
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] border rounded-lg bg-white overflow-hidden">
      {/* Sidebar */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r flex-col`}>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chats..."
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                  selectedChat === chat.id ? "bg-indigo-50 border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                    {chat.id.toString().charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{chat.participantName}</p>
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage || "No messages"}</p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No chats yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              {currentChat.participantAvatar ? (
                <Image
                  src={currentChat.participantAvatar}
                  alt={currentChat.participantName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                  {currentChat.participantName.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold">{currentChat.participantName}</p>
                <p className={`text-xs flex items-center gap-1 ${currentChat.participantIsActive ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className={`inline-block w-2 h-2 rounded-full ${currentChat.participantIsActive ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                  {currentChat.participantIsActive ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length > 0 ? (
                <>
                  {messages.map((m: any) => {
                    const isSent = m.sender_id === currentUserId
                    let timestamp = ''
                    if (m.created_at) {
                      // Parse the UTC time and convert to IST (UTC+5:30)
                      const date = new Date(m.created_at)
                      // Create IST timezone formatter
                      const istTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000))
                      timestamp = istTime.toLocaleString('en-IN', { 
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit',
                        timeZone: 'Asia/Kolkata'
                      })
                    }
                    return (
                      <div key={m.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'} items-end gap-2 px-2`}>
                        {!isSent && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {currentChat?.participantName.charAt(0) || 'U'}
                          </div>
                        )}
                        <div className={`rounded-xl px-4 py-2 max-w-sm lg:max-w-md break-words shadow-sm ${
                          isSent 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white text-gray-900 rounded-bl-none border border-gray-100'
                        }`}>
                          <p className="text-sm leading-relaxed">{m.content}</p>
                          <p className={`text-xs mt-2 ${isSent ? 'text-indigo-100' : 'text-gray-500'}`}>
                            {timestamp}
                          </p>
                        </div>
                        {isSent && (
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            You
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">No messages yet</div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage(e)
                    }
                  }}
                  disabled={sendingMessage}
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    sendMessage(e)
                  }}
                  disabled={sendingMessage || !message.trim()}
                  className="px-6"
                  type="button"
                >
                  {sendingMessage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

