"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ChatMessage {
  id: string
  message: string
  sender: "user" | "admin"
  timestamp: Date
  productId?: number
  productName?: string
}

export interface ChatSession {
  id: string
  productId?: number
  productName?: string
  messages: ChatMessage[]
  lastMessage?: ChatMessage
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface ChatStore {
  sessions: ChatSession[]
  currentSessionId: string | null
  isOpen: boolean
  createSession: (productId?: number, productName?: string) => string
  addMessage: (sessionId: string, message: string, sender: "user" | "admin") => void
  setCurrentSession: (sessionId: string) => void
  closeChat: () => void
  openChat: (sessionId?: string) => void
  getCurrentSession: () => ChatSession | null
  getSessionsByProduct: (productId: number) => ChatSession[]
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isOpen: false,

      createSession: (productId?: number, productName?: string) => {
        const sessionId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newSession: ChatSession = {
          id: sessionId,
          productId,
          productName,
          messages: [
            {
              id: `msg-${Date.now()}`,
              message: `Halo! Selamat datang di ANKT. ${productName ? `Saya lihat Anda tertarik dengan ${productName}.` : ""} Ada yang bisa kami bantu?`,
              sender: "admin",
              timestamp: new Date(),
              productId,
              productName,
            },
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: sessionId,
        }))

        return sessionId
      },

      addMessage: (sessionId: string, message: string, sender: "user" | "admin") => {
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newMessage: ChatMessage = {
          id: messageId,
          message,
          sender,
          timestamp: new Date(),
        }

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, newMessage],
                  lastMessage: newMessage,
                  updatedAt: new Date(),
                }
              : session,
          ),
        }))

        // Simulate admin response for user messages
        if (sender === "user") {
          setTimeout(
            () => {
              const responses = [
                "Terima kasih atas pertanyaannya! Tim kami akan segera membantu Anda.",
                "Saya akan cek informasi tersebut untuk Anda. Mohon tunggu sebentar.",
                "Apakah ada hal lain yang ingin Anda tanyakan tentang produk kami?",
                "Tim customer service kami akan segera merespons pertanyaan Anda.",
                "Terima kasih telah menghubungi ANKT. Kami akan membantu Anda dengan senang hati.",
              ]
              const randomResponse = responses[Math.floor(Math.random() * responses.length)]

              get().addMessage(sessionId, randomResponse, "admin")
            },
            1000 + Math.random() * 2000,
          )
        }
      },

      setCurrentSession: (sessionId: string) => {
        set({ currentSessionId: sessionId })
      },

      closeChat: () => {
        set({ isOpen: false })
      },

      openChat: (sessionId?: string) => {
        set({
          isOpen: true,
          currentSessionId: sessionId || get().currentSessionId,
        })
      },

      getCurrentSession: () => {
        const state = get()
        return state.sessions.find((session) => session.id === state.currentSessionId) || null
      },

      getSessionsByProduct: (productId: number) => {
        return get().sessions.filter((session) => session.productId === productId)
      },
    }),
    {
      name: "ankt-chat-storage",
    },
  ),
)
