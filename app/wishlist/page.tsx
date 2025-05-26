"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWishlistStore } from "@/lib/wishlist-store"
import { useCartStore } from "@/lib/cart-store"
import Navbar from "@/components/navbar"
import MobileTabBar from "@/components/mobile-tab-bar"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const { addItem } = useCartStore()

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      condition: item.condition,
      category: item.category,
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 pb-20 lg:pb-8">
        <Navbar />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Heart className="h-24 w-24 text-stone-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Wishlist Kosong</h2>
            <p className="text-stone-600 mb-8">
              Belum ada produk di wishlist Anda. Yuk mulai tambahkan produk favorit!
            </p>
            <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
              <Link href="/products">Mulai Belanja</Link>
            </Button>
          </div>
        </div>

        <MobileTabBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20 lg:pb-8">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Wishlist Saya</h1>
            <p className="text-stone-600">{items.length} produk favorit</p>
          </div>
          <Button variant="outline" onClick={clearWishlist} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus Semua
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative aspect-square">
                <Link href={`/products/${item.id}`}>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Badge className="absolute top-3 left-3 bg-emerald-700 text-white">{item.condition}</Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500"
                  onClick={() => removeItem(item.id)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>

              <CardContent className="p-4">
                <Badge variant="secondary" className="text-xs mb-2">
                  {item.category}
                </Badge>
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-semibold text-stone-800 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold text-emerald-700">Rp {item.price.toLocaleString("id-ID")}</p>
                    <p className="text-sm text-stone-500 line-through">
                      Rp {item.originalPrice.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Hemat {Math.round((1 - item.price / item.originalPrice) * 100)}%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Tambah ke Keranjang
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus dari Wishlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <MobileTabBar />
    </div>
  )
}
