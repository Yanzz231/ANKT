"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Send, X, Clock, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useChatStore } from "@/lib/chat-store"
import { cn } from "@/lib/utils"

export default function ChatWidget() {
  const {
    sessions,
    currentSessionId,
    isOpen,
    createSession,
    addMessage,
    setCurrentSession,
    closeChat,
    openChat,
    getCurrentSession,
  } = useChatStore()

  const [newMessage, setNewMessage] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentSession = getCurrentSession()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = createSession()
    }

    addMessage(sessionId, newMessage, "user")
    setNewMessage("")
  }

  const handleStartNewChat = () => {
    const sessionId = createSession()
    setShowHistory(false)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <Button
          onClick={() => openChat()}
          className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full h-12 w-12 md:h-14 md:w-14 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm md:w-80 lg:w-96">
      <Card className={cn("shadow-2xl border-0 transition-all duration-300", isMinimized ? "h-14" : "h-80 md:h-96")}>
        <CardHeader className="bg-emerald-700 text-white rounded-t-lg p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <div className="min-w-0">
                <CardTitle className="text-sm md:text-base truncate">ANKT Customer Service</CardTitle>
                {!isMinimized && <p className="text-xs text-emerald-100 truncate">Online - Siap membantu Anda</p>}
              </div>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              {!isMinimized && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 md:h-8 md:w-8 text-white hover:bg-emerald-600"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <Clock className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8 md:w-8 text-white hover:bg-emerald-600"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3 md:h-4 md:w-4" />
                ) : (
                  <Minimize2 className="h-3 w-3 md:h-4 md:w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8 md:w-8 text-white hover:bg-emerald-600"
                onClick={closeChat}
              >
                <X className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex-1 flex flex-col p-0 h-64 md:h-80">
            {showHistory ? (
              // Chat History View
              <div className="flex-1 p-3 md:p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-stone-800 text-sm md:text-base">Riwayat Chat</h3>
                  <Button
                    size="sm"
                    onClick={handleStartNewChat}
                    className="bg-emerald-700 hover:bg-emerald-800 text-xs md:text-sm px-2 md:px-3 py-1"
                  >
                    Chat Baru
                  </Button>
                </div>

                <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto">
                  {sessions.length === 0 ? (
                    <p className="text-stone-500 text-sm text-center py-8">Belum ada riwayat chat</p>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className={cn(
                          "p-2 md:p-3 border rounded-lg cursor-pointer hover:bg-stone-50 transition-colors",
                          currentSessionId === session.id ? "border-emerald-500 bg-emerald-50" : "border-stone-200",
                        )}
                        onClick={() => {
                          setCurrentSession(session.id)
                          setShowHistory(false)
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs md:text-sm font-medium text-stone-800 truncate">
                            {session.productName || "Chat Umum"}
                          </span>
                          <span className="text-xs text-stone-500 flex-shrink-0 ml-2">
                            {formatDate(session.updatedAt)}
                          </span>
                        </div>
                        {session.lastMessage && (
                          <p className="text-xs text-stone-600 line-clamp-2">{session.lastMessage.message}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              // Chat Messages View
              <>
                <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
                  {currentSession?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] md:max-w-xs px-3 py-2 rounded-lg text-xs md:text-sm",
                          message.sender === "user"
                            ? "bg-emerald-700 text-white rounded-br-sm"
                            : "bg-stone-100 text-stone-800 rounded-bl-sm",
                        )}
                      >
                        <p className="break-words">{message.message}</p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            message.sender === "user" ? "text-emerald-100" : "text-stone-500",
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-3 md:p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ketik pesan..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 text-sm"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="bg-emerald-700 hover:bg-emerald-800 h-9 w-9 md:h-10 md:w-10"
                    >
                      <Send className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
