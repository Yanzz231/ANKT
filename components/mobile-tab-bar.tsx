"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, Heart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

const tabItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/products", label: "Produk", icon: Search },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/cart", label: "Keranjang", icon: ShoppingBag },
  { href: "/profile", label: "Profil", icon: User },
];

export default function MobileTabBar() {
  const pathname = usePathname()
  const { getTotalItems: getCartItems } = useCartStore()
  const { getTotalItems: getWishlistItems } = useWishlistStore()
  const { isAuthenticated } = useAuthStore()

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  const cartCount = getCartItems()
  const wishlistCount = getWishlistItems()

  if (pathname.startsWith("/auth/")) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 lg:hidden z-50">
      <div className="grid grid-cols-5 h-16">
        {tabItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isCart = item.href === "/cart"
          const isWishlist = item.href === "/wishlist"
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
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
                {isWishlist && wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
