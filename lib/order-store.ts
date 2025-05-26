"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  orderId: string
  userId: string
  items: OrderItem[]
  customerData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  subtotal: number
  shippingCost: number
  total: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "expired"
  snapToken?: string
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  paymentUrl?: string
}

interface OrderStore {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => string
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  updateOrderStatusByOrderId: (orderId: string, status: Order["status"]) => void
  updateOrderSnapToken: (orderId: string, snapToken: string, paymentUrl?: string) => void
  getUserOrders: (userId: string) => Order[]
  getOrderById: (orderId: string) => Order | null
  getOrderByOrderId: (orderId: string) => Order | null
  getPendingOrders: (userId: string) => Order[]
  getExpiredOrders: (userId: string) => Order[]
  markExpiredOrders: () => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData) => {
        const internalId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const now = new Date()
        const expiresAt = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now

        const newOrder: Order = {
          ...orderData,
          id: internalId,
          createdAt: now,
          updatedAt: now,
          expiresAt,
        }

        set((state) => {
          const newState = {
            orders: [newOrder, ...state.orders],
          }
          console.log('Adding order:', newOrder)
          console.log('New orders state:', newState.orders)
          return newState
        })

        return internalId
      },

      updateOrderStatus: (internalId, status) => {
        console.log('Updating order status by internal ID:', internalId, 'to:', status)
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === internalId
              ? {
                  ...order,
                  status,
                  updatedAt: new Date(),
                }
              : order,
          )
          
          console.log('Orders before update:', state.orders)
          console.log('Orders after update:', updatedOrders)
          
          return { orders: updatedOrders }
        })
      },

      updateOrderStatusByOrderId: (orderId, status) => {
        console.log('Updating order status by orderId:', orderId, 'to:', status)
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.orderId === orderId
              ? {
                  ...order,
                  status,
                  updatedAt: new Date(),
                }
              : order,
          )
          
          console.log('Orders before update:', state.orders)
          console.log('Orders after update:', updatedOrders)
          
          return { orders: updatedOrders }
        })
      },

      updateOrderSnapToken: (internalId, snapToken, paymentUrl) => {
        console.log('Updating snap token for order:', internalId)
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === internalId
              ? {
                  ...order,
                  snapToken,
                  paymentUrl,
                  updatedAt: new Date(),
                }
              : order,
          ),
        }))
      },

      getUserOrders: (userId) => {
        return get()
          .orders.filter((order) => order.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      getOrderById: (internalId) => {
        return get().orders.find((order) => order.id === internalId) || null
      },

      getOrderByOrderId: (orderId) => {
        return get().orders.find((order) => order.orderId === orderId) || null
      },

      getPendingOrders: (userId) => {
        const now = new Date()
        return get()
          .orders.filter(
            (order) => order.userId === userId && order.status === "pending" && new Date(order.expiresAt) > now,
          )
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      getExpiredOrders: (userId) => {
        const now = new Date()
        return get().orders.filter(
          (order) => order.userId === userId && order.status === "pending" && new Date(order.expiresAt) <= now,
        )
      },

      markExpiredOrders: () => {
        const now = new Date()
        set((state) => ({
          orders: state.orders.map((order) =>
            order.status === "pending" && new Date(order.expiresAt) <= now
              ? {
                  ...order,
                  status: "expired" as const,
                  updatedAt: now,
                }
              : order,
          ),
        }))
      },
    }),
    {
      name: "ankt-order-storage",
    },
  ),
)