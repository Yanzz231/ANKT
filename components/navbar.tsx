"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuthStore } from "@/lib/auth-store"
import { useWishlistStore } from "@/lib/wishlist-store"
import CartSidebar from "@/components/cart-sidebar"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Produk" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Kontak" },
]

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { getTotalItems } = useWishlistStore()
  const wishlistCount = getTotalItems()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  if (!hasMounted) return null

  return (
    <header className="bg-white shadow-sm border-b border-stone-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="ANKT Logo" width={50} height={50} className="rounded-lg" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-emerald-800">ANKT</h1>
              <p className="text-xs text-stone-600">Perlengkapan Bayi Berkualitas</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-medium transition-colors hover:text-emerald-700",
                  pathname === item.href ? "text-emerald-700" : "text-stone-700"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon" className="relative text-stone-700 hover:text-emerald-700">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
            <CartSidebar />

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm" className="text-stone-700 hover:text-emerald-700">
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-stone-700 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-white">
                <Link href="/auth/login">Masuk</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button asChild variant="ghost" size="icon" className="relative text-stone-700">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
            <CartSidebar />

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-stone-700">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold text-stone-800">Menu</h2>
                  </div>

                  <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 rounded-lg transition-colors",
                          pathname === item.href
                            ? "bg-emerald-50 text-emerald-700 font-medium"
                            : "hover:bg-stone-100 text-stone-700"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Auth Section */}
                  <div className="border-t pt-4 space-y-2">
                    {isAuthenticated ? (
                      <>
                        <Button asChild variant="ghost" className="w-full justify-start text-stone-700">
                          <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                            <User className="h-4 w-4 mr-3" />
                            {user?.name}
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-red-700 border-red-200 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Keluar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                          <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                            Masuk
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                        >
                          <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                            Daftar
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
