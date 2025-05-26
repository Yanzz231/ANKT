"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WishlistItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  condition: string
  category: string
  rating: number
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: number) => void
  isInWishlist: (id: number) => boolean
  clearWishlist: () => void
  getTotalItems: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)

        if (!existingItem) {
          set({
            items: [...items, item],
          })
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id)
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.length
      },
    }),
    {
      name: "ankt-wishlist-storage",
    },
  ),
)
