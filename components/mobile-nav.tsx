"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCartStore } from "@/lib/cart-store"
import { useAuthStore } from "@/lib/auth-store"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/products", label: "Produk", icon: Search },
  { href: "/cart", label: "Keranjang", icon: ShoppingBag },
  { href: "/profile", label: "Profil", icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { getTotalItems } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const totalItems = getTotalItems()

  return (
    <>
      {/* Mobile Tab Bar - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 md:hidden z-50">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const isCart = item.href === "/cart"
            const isProfile = item.href === "/profile"

            return (
              <Link
                key={item.href}
                href={isProfile && !isAuthenticated ? "/auth/login" : item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-colors",
                  isActive ? "text-emerald-700 bg-emerald-50" : "text-stone-600",
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {isCart && totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Mobile Menu Button - Top */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 space-y-2">
                <Link
                  href="/"
                  className="block px-4 py-3 rounded-lg hover:bg-stone-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Beranda
                </Link>
                <Link
                  href="/products"
                  className="block px-4 py-3 rounded-lg hover:bg-stone-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Semua Produk
                </Link>
                <Link
                  href="/categories"
                  className="block px-4 py-3 rounded-lg hover:bg-stone-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Kategori
                </Link>
                <Link
                  href="/sell"
                  className="block px-4 py-3 rounded-lg hover:bg-stone-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Jual Barang
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-3 rounded-lg hover:bg-stone-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Tentang Kami
                </Link>
                <Link
                  href="/contact"
                  className="block px-4 py-3 rounded-lg hover:bg-stone-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Kontak
                </Link>
              </nav>

              {!isAuthenticated && (
                <div className="border-t pt-4 space-y-2">
                  <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-800">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      Masuk
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                      Daftar
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
