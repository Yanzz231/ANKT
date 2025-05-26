"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, Star, Truck, Shield, Recycle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"
import Navbar from "@/components/navbar"
import MobileTabBar from "@/components/mobile-tab-bar"
import { cn } from "@/lib/utils"
import Swal from "sweetalert2"

const featuredProducts = [
  {
    id: 1,
    name: "Stroller Bayi Premium",
    price: 850000,
    originalPrice: 1500000,
    image: "/item/stollerbaby.jpg",
    condition: "Sangat Baik",
    rating: 4.8,
    reviews: 24,
    category: "Stroller",
  },
  {
    id: 2,
    name: "Car Seat Safety First",
    price: 650000,
    originalPrice: 1200000,
    image: "/item/CarSeatSafetyFirst.jfif",
    condition: "Baik",
    rating: 4.6,
    reviews: 18,
    category: "Car Seat",
  },
  {
    id: 3,
    name: "High Chair Makan Bayi",
    price: 450000,
    originalPrice: 800000,
    image: "/item/HighChairMakanBayi.jfif",
    condition: "Sangat Baik",
    rating: 4.9,
    reviews: 32,
    category: "Feeding",
  },
  {
    id: 4,
    name: "Baby Bouncer",
    price: 350000,
    originalPrice: 600000,
    image: "/item/BabyBouncer.jfif",
    condition: "Baik",
    rating: 4.7,
    reviews: 15,
    category: "Mainan",
  },
]

const categories = [
  {
    name: "Stroller & Kereta Bayi",
    image: "/item/stollerbaby.jpg",
    count: 45,
    href: "/products?category=stroller",
  },
  {
    name: "Car Seat & Safety",
    image: "/item/CarSeatSafetyFirst.jfif",
    count: 32,
    href: "/products?category=car-seat",
  },
  {
    name: "Feeding & Makan",
    image: "/item/food.jpg",
    count: 28,
    href: "/products?category=feeding",
  },
  {
    name: "Mainan & Edukasi",
    image: "/item/mainan.jpg",
    count: 67,
    href: "/products?category=toys",
  },
  {
    name: "Pakaian Bayi",
    image: "/item/pakaian.jfif",
    count: 89,
    href: "/products?category=clothes",
  },
  {
    name: "Perlengkapan Tidur",
    image: "/item/perlengkapan.jpg",
    count: 23,
    href: "/products?category=sleep",
  },
]

export default function HomePage() {
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  const handleAddToCart = (product: (typeof featuredProducts)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      condition: product.condition,
      category: product.category,
    })

    // Success message with SweetAlert
    Swal.fire({
      title: "Berhasil!",
      text: `${product.name} telah ditambahkan ke keranjang`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
      background: "#f0fdf4",
      color: "#166534",
    })
  }

  const handleWishlistToggle = (product: (typeof featuredProducts)[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)

      // Success message for removal
      Swal.fire({
        title: "Dihapus!",
        text: `${product.name} telah dihapus dari wishlist`,
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        background: "#fef3c7",
        color: "#92400e",
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        condition: product.condition,
        category: product.category,
        rating: product.rating,
      })

      // Success message for addition
      Swal.fire({
        title: "Ditambahkan!",
        text: `${product.name} telah ditambahkan ke wishlist`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        background: "#fef2f2",
        color: "#dc2626",
      })
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-stone-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6 leading-tight">
                Perlengkapan Bayi <span className="text-emerald-700">Berkualitas</span> dengan Harga Terjangkau
              </h2>
              <p className="text-xl text-stone-600 mb-8 leading-relaxed">
                Temukan perlengkapan bayi bekas berkualitas tinggi dengan harga ekonomis. Mendukung gaya hidup
                berkelanjutan sambil menghemat budget keluarga.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 transform hover:scale-105 transition-all"
                >
                  <Link href="/products">Belanja Sekarang</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 transform hover:scale-105 transition-all"
                >
                  <Link href="/about">Pelajari Lebih Lanjut</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <Image
                src="/baby.jpg"
                alt="Happy family with baby products"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Kualitas Terjamin",
                desc: "Setiap produk telah melalui inspeksi ketat untuk memastikan kualitas dan keamanan",
              },
              {
                icon: Truck,
                title: "Pengiriman Cepat",
                desc: "Pengiriman ke seluruh Indonesia dengan packaging aman dan terpercaya",
              },
              {
                icon: Recycle,
                title: "Ramah Lingkungan",
                desc: "Mendukung ekonomi sirkular dan mengurangi limbah dengan konsep reuse",
              },
              {
                icon: Users,
                title: "Komunitas Terpercaya",
                desc: "Bergabung dengan ribuan ibu yang telah mempercayai ANKT",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{feature.title}</h3>
                <p className="text-stone-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">Kategori Produk</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Temukan berbagai kategori perlengkapan bayi yang Anda butuhkan dengan kualitas terbaik
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={category.href}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:scale-105">
                  <CardContent className="p-4 text-center">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={120}
                      height={120}
                      className="mx-auto mb-3 rounded-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <h3 className="font-medium text-stone-800 mb-1 text-sm">{category.name}</h3>
                    <p className="text-xs text-stone-500">{category.count} produk</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
            >
              <Link href="/products">Lihat Semua Produk</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">Produk Unggulan</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Pilihan terbaik dari koleksi perlengkapan bayi kami dengan kualitas premium
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <Link href={`/products/${product.id}`}>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                  <Badge className="absolute top-3 left-3 bg-emerald-700 text-white">{product.condition}</Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "absolute top-3 right-3 bg-white/80 hover:bg-white h-10 w-10",
                      isInWishlist(product.id) ? "text-red-500" : "text-stone-600",
                    )}
                    onClick={() => handleWishlistToggle(product)}
                  >
                    <Heart className={cn("h-5 w-5", isInWishlist(product.id) && "fill-current")} />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-stone-800 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-stone-600 ml-1">{product.rating}</span>
                      <span className="text-sm text-stone-500 ml-1">({product.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg font-bold text-emerald-700">Rp {product.price.toLocaleString("id-ID")}</p>
                      <p className="text-sm text-stone-500 line-through">
                        Rp {product.originalPrice.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Hemat {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                  </div>

                  <Button
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white transform hover:scale-105 transition-all"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Tambah ke Keranjang
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
            >
              <Link href="/products">Lihat Semua Produk</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Bergabunglah dengan Komunitas ANKT</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari gerakan berkelanjutan dan dapatkan perlengkapan bayi terbaik untuk si kecil
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-700 hover:bg-stone-100 px-8 py-3 transform hover:scale-105 transition-all"
            >
              <Link href="/products">Mulai Belanja</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white text-emerald-700 hover:bg-stone-100 px-8 py-3 transform hover:scale-105 transition-all"
            >
              <Link href="/about">Pelajari Lebih Lanjut</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/logo.png" alt="ANKT Logo" width={40} height={40} className="rounded" />
                <h3 className="text-xl font-bold">ANKT</h3>
              </div>
              <p className="text-stone-800 mb-4">
                Marketplace terpercaya untuk perlengkapan bayi bekas berkualitas. Mendukung gaya hidup berkelanjutan
                untuk keluarga Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-stone-800">
                <li>
                  <Link href="/products?category=stroller" className="hover:text-white transition-colors">
                    Stroller & Kereta
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=car-seat" className="hover:text-white transition-colors">
                    Car Seat
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=feeding" className="hover:text-white transition-colors">
                    Feeding
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=toys" className="hover:text-white transition-colors">
                    Mainan
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-stone-800">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pengiriman
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Garansi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Customer Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-stone-800">
                <li>Email: info@ankt.co.id</li>
                <li>WhatsApp: +62 812-3456-7890</li>
                <li>Jam Operasional: 09:00 - 18:00 WIB</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-stone-800">
            <p>&copy; 2024 ANKT. Semua hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
      <MobileTabBar />
    </div>
  )
}
