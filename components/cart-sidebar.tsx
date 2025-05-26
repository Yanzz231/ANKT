"use client"

import { useEffect, useState } from "react"
import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCartStore } from "@/lib/cart-store"
import { Separator } from "@/components/ui/separator"

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCartStore()

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const totalItems = isMounted ? getTotalItems() : 0
  const totalPrice = isMounted ? getTotalPrice() : 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-stone-700 hover:text-emerald-700">
          <ShoppingBag className="h-5 w-5" />
          {isMounted && totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Keranjang Belanja ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="h-16 w-16 text-stone-300 mb-4" />
              <h3 className="text-lg font-medium text-stone-800 mb-2">Keranjang Kosong</h3>
              <p className="text-stone-600 mb-6">Belum ada produk di keranjang Anda</p>
              <Button asChild className="bg-emerald-700 hover:bg-emerald-800" onClick={() => setIsOpen(false)}>
                <Link href="/products">Mulai Belanja</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-4">
                  {items.map((item) => (
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
                        <p className="font-semibold text-emerald-700">Rp {item.price.toLocaleString("id-ID")}</p>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} item)</span>
                    <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ongkos Kirim</span>
                    <span>Rp 25.000</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-emerald-700">
                      Rp {(totalPrice + 25000).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full bg-emerald-700 hover:bg-emerald-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    <Link href="/cart">Lihat Keranjang</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
