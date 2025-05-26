"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, Edit, Package, Heart, Settings, Trash2, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/auth-store"
import { useWishlistStore } from "@/lib/wishlist-store"
import { useOrderStore } from "@/lib/order-store"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import MobileTabBar from "@/components/mobile-tab-bar"
import ChatWidget from "@/components/chat-widget"

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items: wishlistItems, removeItem, getTotalItems } = useWishlistStore()
  const { getUserOrders, getPendingOrders, markExpiredOrders } = useOrderStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      setTimeout(() => {
        setIsLoading(false)
      }, 100)
    }

    initAuth()
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated && markExpiredOrders) {
      markExpiredOrders()
    }
  }, [isAuthenticated, markExpiredOrders])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto mb-4"></div>
          <p className="text-stone-600">Memuat...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated (this should rarely show due to useEffect redirect)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const wishlistCount = getTotalItems()
  const userOrders = getUserOrders(user.id)
  const pendingOrders = getPendingOrders(user.id)
  const completedOrders = userOrders.filter((order) => order.status === "paid" || order.status === "delivered")

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-8">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-xl font-bold text-stone-800 mb-2">{user.name}</h2>
                <p className="text-stone-600 mb-4">{user.email}</p>

                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-stone-500" />
                    <span className="text-sm text-stone-700">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-stone-500" />
                      <span className="text-sm text-stone-700">{user.phone}</span>
                    </div>
                  )}
                </div>

                <Button className="w-full mt-6 bg-emerald-700 hover:bg-emerald-800">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profil
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Menu Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/orders">
                    <Package className="h-4 w-4 mr-3" />
                    Pesanan Saya ({userOrders.length})
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/wishlist">
                    <Heart className="h-4 w-4 mr-3" />
                    Wishlist ({wishlistCount})
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-3" />
                    Pengaturan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Orders Alert */}
            {pendingOrders.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-800">
                    <Clock className="h-5 w-5 mr-2" />
                    Pesanan Menunggu Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 mb-4">
                    Anda memiliki {pendingOrders.length} pesanan yang menunggu pembayaran. Selesaikan sebelum waktu
                    habis.
                  </p>
                  <Button asChild className="bg-yellow-600 hover:bg-yellow-700">
                    <Link href="/orders">Lihat Pesanan Pending</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Pesanan Terbaru</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/orders">Lihat Semua ({userOrders.length})</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-600">Belum ada pesanan</p>
                    <Button asChild className="mt-4 bg-emerald-700 hover:bg-emerald-800">
                      <Link href="/products">Mulai Belanja</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {order.status === "pending" ? (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          <div>
                            <p className="font-medium text-stone-800">#{order.orderId}</p>
                            <p className="text-sm text-stone-600">{formatDate(order.createdAt)}</p>
                            <p className="text-sm text-stone-600">{order.items.length} item</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              order.status === "paid" || order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {order.status === "pending"
                              ? "Pending"
                              : order.status === "paid"
                                ? "Dibayar"
                                : order.status === "delivered"
                                  ? "Selesai"
                                  : order.status}
                          </Badge>
                          <p className="font-semibold text-emerald-700 mt-1">
                            Rp {order.total.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Wishlist Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Wishlist Terbaru</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/wishlist">Lihat Semua ({wishlistCount})</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-600">Belum ada produk di wishlist</p>
                    <Button asChild className="mt-4 bg-emerald-700 hover:bg-emerald-800">
                      <Link href="/products">Mulai Belanja</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistItems.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-stone-800 line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-stone-500">{item.condition}</p>
                          <p className="font-semibold text-emerald-700 text-sm">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 h-8 w-8"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-stone-800">{userOrders.length}</p>
                  <p className="text-sm text-stone-600">Total Pesanan</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-stone-800">{completedOrders.length}</p>
                  <p className="text-sm text-stone-600">Pesanan Selesai</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-stone-800">{wishlistCount}</p>
                  <p className="text-sm text-stone-600">Wishlist</p>
                </CardContent>
              </Card>
            </div>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Akun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-stone-800">Notifikasi Email</p>
                    <p className="text-sm text-stone-600">Terima update pesanan via email</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Aktif
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-stone-800">Notifikasi Push</p>
                    <p className="text-sm text-stone-600">Terima notifikasi di browser</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Nonaktif
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-stone-800">Newsletter</p>
                    <p className="text-sm text-stone-600">Terima info produk terbaru</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Aktif
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ChatWidget />
      <MobileTabBar />
    </div>
  )
}