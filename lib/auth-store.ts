"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock authentication - in real app, call your API
        if (email === "demo@ankt.co.id" && password === "password") {
          const user = {
            id: "1",
            name: "Demo User",
            email: "demo@ankt.co.id",
            phone: "08123456789",
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      register: async (name: string, email: string, password: string, phone?: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock registration - in real app, call your API
        const user = {
          id: Date.now().toString(),
          name,
          email,
          phone,
        }
        set({ user, isAuthenticated: true })
        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: (data: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...data } })
        }
      },
    }),
    {
      name: "ankt-auth-storage",
    },
  ),
)
