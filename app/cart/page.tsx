"use client"
import Image from "next/image"
import Link from "next/link"
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/cart-store"
import Navbar from "@/components/navbar"
import MobileTabBar from "@/components/mobile-tab-bar"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, clearCart } = useCartStore()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const shippingCost = 25000
  const finalTotal = totalPrice + shippingCost

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        {/* Header */}
        <Navbar />

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-stone-300 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-stone-800 mb-3 sm:mb-4">Keranjang Kosong</h2>
              <p className="text-sm sm:text-base text-stone-600 mb-6 sm:mb-8">
                Belum ada produk di keranjang Anda. Yuk mulai belanja!
              </p>
              <Button asChild className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Mulai Belanja
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <MobileTabBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <Navbar />

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg sm:text-xl">
                    Keranjang Belanja ({totalItems} item)
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCart} 
                    className="text-red-600 hover:text-red-700 self-start sm:self-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Kosongkan Keranjang</span>
                    <span className="sm:hidden">Kosongkan</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 sm:p-4">
                      {/* Mobile Layout */}
                      <div className="block sm:hidden">
                        <div className="flex gap-3 mb-3">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-stone-800 mb-1 line-clamp-2">{item.name}</h3>
                            <p className="text-xs text-stone-600">Kondisi: {item.condition}</p>
                            <p className="text-xs text-stone-500 mb-2">Kategori: {item.category}</p>
                            <div className="flex flex-col gap-1">
                              <span className="text-base font-bold text-emerald-700">
                                Rp {item.price.toLocaleString("id-ID")}
                              </span>
                              <span className="text-xs text-stone-500 line-through">
                                Rp {item.originalPrice.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 p-1"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop/Tablet Layout */}
                      <div className="hidden sm:flex items-center space-x-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-stone-800 mb-1">{item.name}</h3>
                          <p className="text-sm text-stone-600 mb-1">Kondisi: {item.condition}</p>
                          <p className="text-sm text-stone-500 mb-2">Kategori: {item.category}</p>

                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-emerald-700">
                              Rp {item.price.toLocaleString("id-ID")}
                            </span>
                            <span className="text-sm text-stone-500 line-through">
                              Rp {item.originalPrice.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Subtotal */}
                          <p className="font-semibold">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>

                          {/* Remove Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {/* Mobile Sticky Bottom Summary */}
            <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t shadow-lg z-10 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-stone-600">Total ({totalItems} item)</p>
                  <p className="text-lg font-bold text-emerald-700">
                    Rp {finalTotal.toLocaleString("id-ID")}
                  </p>
                </div>
                <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-white px-6">
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>

            {/* Desktop/Tablet Summary Card */}
            <Card className="hidden lg:block shadow-sm lg:sticky lg:top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} item)</span>
                    <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ongkos Kirim</span>
                    <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-emerald-700">Rp {finalTotal.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3">
                    <Link href="/checkout">Lanjut ke Checkout</Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/products">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Lanjut Belanja
                    </Link>
                  </Button>
                </div>

                {/* Savings Info */}
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2 text-sm">💰 Penghematan Anda</h4>
                  <p className="text-xs text-emerald-700">
                    Anda menghemat{" "}
                    <span className="font-semibold">
                      Rp{" "}
                      {items
                        .reduce((total, item) => total + (item.originalPrice - item.price) * item.quantity, 0)
                        .toLocaleString("id-ID")}
                    </span>{" "}
                    dengan berbelanja produk bekas berkualitas!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tablet Summary Card */}
            <Card className="block lg:hidden shadow-sm mb-20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} item)</span>
                    <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ongkos Kirim</span>
                    <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-emerald-700">Rp {finalTotal.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Lanjut Belanja
                  </Link>
                </Button>

                {/* Savings Info */}
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2 text-sm">💰 Penghematan Anda</h4>
                  <p className="text-xs text-emerald-700">
                    Anda menghemat{" "}
                    <span className="font-semibold">
                      Rp{" "}
                      {items
                        .reduce((total, item) => total + (item.originalPrice - item.price) * item.quantity, 0)
                        .toLocaleString("id-ID")}
                    </span>{" "}
                    dengan berbelanja produk bekas berkualitas!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <MobileTabBar />
    </div>
  )
}