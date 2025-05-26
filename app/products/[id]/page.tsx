"use client";

import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useOrderStore } from "@/lib/order-store";
import CompanyChatModal from "@/components/company-chat-modal";
import { useWishlistStore } from "@/lib/wishlist-store";
import Navbar from "@/components/navbar";
import MobileTabBar from "@/components/mobile-tab-bar";
import ChatWidget from "@/components/chat-widget";
import Swal from "sweetalert2";

// All products data
const allProducts = [
  {
    id: 1,
    name: "Stroller Bayi Premium Joie Versatrax",
    price: 850000,
    originalPrice: 1500000,
    images: [
      "/item/stollerbaby.jpg",
      "/item/stollerbaby.jpg",
      "/item/stollerbaby.jpg",
      "/item/stollerbaby.jpg",
    ],
    condition: "Sangat Baik",
    rating: 4.8,
    reviews: 24,
    category: "Stroller",
    brand: "Joie",
    description: `Stroller premium dengan fitur lengkap untuk kenyamanan si kecil. Dilengkapi dengan sistem suspensi yang halus, 
    kanopi yang dapat disesuaikan, dan storage basket yang luas. Kondisi sangat baik dengan semua fungsi bekerja dengan sempurna.`,
    features: [
      "Sistem suspensi 4 roda untuk perjalanan yang halus",
      "Kanopi UPF 50+ untuk perlindungan dari sinar UV",
      "5-point safety harness dengan padding empuk",
      "Storage basket dengan kapasitas besar",
      "Dapat dilipat dengan mudah untuk penyimpanan",
      "Roda depan dapat dikunci/berputar 360°",
    ],
    specifications: {
      "Berat Maksimal": "22 kg",
      "Berat Stroller": "8.5 kg",
      "Dimensi Terbuka": "85 x 60 x 105 cm",
      "Dimensi Terlipat": "85 x 60 x 35 cm",
      Usia: "0-4 tahun",
      Warna: "Navy Blue",
    },
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Car Seat Safety First",
    price: 650000,
    originalPrice: 1200000,
    images: [
      "/item/CarSeatSafetyFirst.jfif",
      "/item/CarSeatSafetyFirst.jfif",
      "/item/CarSeatSafetyFirst.jfif",
      "/item/CarSeatSafetyFirst.jfif",
    ],
    condition: "Baik",
    rating: 4.6,
    reviews: 18,
    category: "Car Seat",
    brand: "Safety First",
    description: `Car seat berkualitas tinggi yang memberikan perlindungan maksimal untuk si kecil saat berkendara. 
    Dilengkapi dengan sistem keamanan berlapis dan bahan yang nyaman untuk perjalanan jarak jauh.`,
    features: [
      "5-point safety harness system",
      "Side impact protection yang kuat",
      "Adjustable headrest dan harness",
      "Cup holder dan storage compartment",
      "Easy installation dengan LATCH system",
      "Washable fabric covers",
    ],
    specifications: {
      "Berat Maksimal": "18 kg",
      "Berat Car Seat": "5.2 kg",
      Installation: "LATCH & Seat Belt",
      Usia: "0-4 tahun",
      "Safety Rating": "5 Star",
      Warna: "Black/Grey",
    },
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "High Chair Makan Bayi Chicco",
    price: 450000,
    originalPrice: 800000,
    images: [
      "/item/HighChairMakanBayi.jfif",
      "/item/HighChairMakanBayi.jfif",
      "/item/HighChairMakanBayi.jfif",
      "/item/HighChairMakanBayi.jfif",
    ],
    condition: "Sangat Baik",
    rating: 4.9,
    reviews: 32,
    category: "Feeding",
    brand: "Chicco",
    description: `High chair yang ergonomis dan aman untuk waktu makan si kecil. Dilengkapi dengan tray yang mudah dibersihkan 
    dan sistem keamanan yang reliable. Dapat disesuaikan tingginya sesuai kebutuhan.`,
    features: [
      "7 level height adjustment",
      "Removable dan dishwasher-safe tray",
      "5-point safety harness",
      "Compact folding untuk storage",
      "Non-slip feet untuk stabilitas",
      "Comfortable padded seat",
    ],
    specifications: {
      "Berat Maksimal": "15 kg",
      "Berat Chair": "7.8 kg",
      "Height Range": "75-105 cm",
      Tray: "Dishwasher Safe",
      Usia: "6 bulan - 3 tahun",
      Warna: "White/Blue",
    },
    createdAt: "2024-01-20",
  },
  {
    id: 4,
    name: "Baby Bouncer Fisher Price",
    price: 350000,
    originalPrice: 600000,
    images: [
      "/item/BabyBouncer.jfif",
      "/item/BabyBouncer.jfif",
      "/item/BabyBouncer.jfif",
      "/item/BabyBouncer.jfif",
    ],
    condition: "Baik",
    rating: 4.7,
    reviews: 15,
    category: "Mainan",
    brand: "Fisher Price",
    description: `Baby bouncer yang menyenangkan dengan berbagai mainan interaktif. Membantu mengembangkan motorik bayi 
    sambil memberikan hiburan yang edukatif. Getaran lembut membantu menenangkan bayi.`,
    features: [
      "Soothing vibrations dengan 2 speed",
      "Musical toys dengan suara menarik",
      "Adjustable 3-position recline",
      "Machine washable seat pad",
      "Non-skid feet untuk keamanan",
      "Removable toy bar",
    ],
    specifications: {
      "Berat Maksimal": "11 kg",
      "Berat Bouncer": "3.2 kg",
      Power: "1 D Battery",
      Music: "8 melodies",
      Usia: "0-6 bulan",
      Warna: "Multicolor",
    },
    createdAt: "2024-01-05",
  },
  {
    id: 5,
    name: "Baby Carrier Ergobaby",
    price: 750000,
    originalPrice: 1300000,
    images: [
      "/item/BabyCarrierErgobaby.jpg",
      "/item/BabyCarrierErgobaby.jpg",
      "/item/BabyCarrierErgobaby.jpg",
      "/item/BabyCarrierErgobaby.jpg",
    ],
    condition: "Sangat Baik",
    rating: 4.9,
    reviews: 28,
    category: "Carrier",
    brand: "Ergobaby",
    description: `Baby carrier ergonomis yang memberikan kenyamanan maksimal untuk bayi dan orang tua. Distribusi berat yang merata 
    mencegah sakit punggung dan memberikan dukungan optimal untuk pertumbuhan bayi.`,
    features: [
      "4 carrying positions (front-inward, front-outward, hip, back)",
      "Lumbar support untuk orang tua",
      "Padded shoulder straps dan waist belt",
      "Natural M-position untuk pinggul bayi",
      "UPF 50+ detachable hood",
      "Storage pocket",
    ],
    specifications: {
      "Berat Maksimal": "20 kg",
      "Berat Carrier": "680 g",
      "Waist Size": "66-140 cm",
      Material: "100% Cotton",
      Usia: "0-4 tahun",
      Warna: "Grey",
    },
    createdAt: "2024-01-18",
  },
  {
    id: 6,
    name: "Playmat Bayi Skip Hop",
    price: 280000,
    originalPrice: 500000,
    images: [
      "/item/BabyCarrierErgobaby.jpg",
      "/item/BabyCarrierErgobaby.jpg",
      "/item/BabyCarrierErgobaby.jpg",
      "/item/BabyCarrierErgobaby.jpg",
    ],
    condition: "Baik",
    rating: 4.5,
    reviews: 12,
    category: "Mainan",
    brand: "Skip Hop",
    description: `Playmat interaktif yang membantu perkembangan sensorik dan motorik bayi. Dengan berbagai tekstur, warna, 
    dan mainan gantung yang menarik perhatian bayi untuk bereksplorasi.`,
    features: [
      "Large padded mat dengan soft fabric",
      "5 removable hanging toys",
      "Tummy time pillow included",
      "Multiple textures untuk sensory play",
      "Easy to clean surface",
      "Foldable untuk easy storage",
    ],
    specifications: {
      "Ukuran Mat": "85 x 85 cm",
      Berat: "1.2 kg",
      Material: "Polyester + Cotton",
      Care: "Machine Washable",
      Usia: "0-12 bulan",
      Warna: "Multicolor Animals",
    },
    createdAt: "2024-01-12",
  },
  {
    id: 7,
    name: "Baby Monitor Motorola",
    price: 400000,
    originalPrice: 700000,
    images: [
      "/item/BabyMonitorMotorola.jpg",
      "/item/BabyMonitorMotorola.jpg",
      "/item/BabyMonitorMotorola.jpg",
      "/item/BabyMonitorMotorola.jpg",
    ],
    condition: "Sangat Baik",
    rating: 4.6,
    reviews: 20,
    category: "Electronics",
    brand: "Motorola",
    description: `Baby monitor dengan teknologi digital yang memberikan monitoring audio-visual berkualitas tinggi. 
    Fitur night vision dan two-way communication memudahkan orang tua mengawasi bayi dari jarak jauh.`,
    features: [
      "2.4 inch color LCD screen",
      "Digital zoom dan pan/tilt control",
      "Infrared night vision",
      "Two-way communication",
      "Temperature monitoring",
      "Long range up to 300m",
    ],
    specifications: {
      "Screen Size": "2.4 inch",
      Range: "Up to 300m",
      "Battery Life": "10 hours",
      Resolution: "320x240",
      Power: "Rechargeable battery + AC adapter",
      Warna: "White",
    },
    createdAt: "2024-01-22",
  },
  {
    id: 8,
    name: "Breast Pump Medela",
    price: 1200000,
    originalPrice: 2000000,
    images: [
      "/item/BreastPumpMedela.jfif",
      "/item/BreastPumpMedela.jfif",
      "/item/BreastPumpMedela.jfif",
      "/item/BreastPumpMedela.jfif",
    ],
    condition: "Baik",
    rating: 4.8,
    reviews: 35,
    category: "Feeding",
    brand: "Medela",
    description: `Breast pump elektrik dengan teknologi 2-Phase Expression yang meniru pola isapan bayi natural. 
    Efisien dan nyaman digunakan untuk ibu yang aktif bekerja atau bepergian.`,
    features: [
      "2-Phase Expression technology",
      "Hospital-grade motor",
      "Digital display dengan memory function",
      "Rechargeable battery",
      "BPA-free bottles dan parts",
      "Quiet operation",
    ],
    specifications: {
      Type: "Electric Double",
      Power: "Rechargeable Li-ion",
      Display: "LED Digital",
      Bottles: "2x 150ml BPA-free",
      "Suction Levels": "9 vacuum levels",
      Warna: "White/Yellow",
    },
    createdAt: "2024-01-08",
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const { addItem } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addOrder, updateOrderSnapToken, updateOrderStatus } = useOrderStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  // Load product data based on ID
  useEffect(() => {
    const foundProduct = allProducts.find((p) => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);

      // Get related products (same category, excluding current product)
      const related = allProducts
        .filter(
          (p) => p.id !== productId && p.category === foundProduct.category
        )
        .slice(0, 4);

      // If not enough related products from same category, add from other categories
      if (related.length < 4) {
        const additional = allProducts
          .filter(
            (p) => p.id !== productId && !related.some((r) => r.id === p.id)
          )
          .slice(0, 4 - related.length);
        related.push(...additional);
      }

      setRelatedProducts(related);
    }
  }, [productId]);

  // Show loading or not found if product doesn't exist
  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">
            Produk Tidak Ditemukan
          </h1>
          <p className="text-stone-600 mb-6">
            Produk yang Anda cari tidak tersedia.
          </p>
          <Link href="/products">
            <Button className="bg-emerald-700 hover:bg-emerald-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Produk
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        condition: product.condition,
        category: product.category,
      });
    }

    // Success message with SweetAlert
    Swal.fire({
      title: "Berhasil!",
      text: `${product.name} (${quantity}x) telah ditambahkan ke keranjang`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
      background: "#f0fdf4",
      color: "#166534",
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);

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
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        condition: product.condition,
        category: product.category,
        rating: product.rating,
      });

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
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBuyNowClick = () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Login Diperlukan",
        text: "Anda harus login terlebih dahulu untuk melakukan pembelian",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#047857",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Login Sekarang",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/auth/login";
        }
      });
      return;
    }

    // Pre-fill customer data if user is logged in
    if (user) {
      setCustomerData({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        address: "",
        city: "",
        postalCode: "",
      });
    }

    setIsBuyNowOpen(true);
  };

  const handleBuyNow = async () => {
    if (!user) {
      Swal.fire({
        title: "Error!",
        text: "Anda harus login terlebih dahulu",
        icon: "error",
      });
      return;
    }

    // Validate form
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "postalCode",
    ];
    const missingFields = requiredFields.filter(
      (field) => !customerData[field as keyof typeof customerData]
    );

    if (missingFields.length > 0) {
      Swal.fire({
        title: "Data Tidak Lengkap!",
        text: `Mohon lengkapi data: ${missingFields.join(", ")}`,
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        background: "#fef2f2",
        color: "#dc2626",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const shippingCost = 25000;
      const totalAmount = product.price * quantity + shippingCost;

      // Create order in our store first
      const orderItems = [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images[0],
        },
      ];

      const idpay = `ANKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const orderId = addOrder({
        orderId: idpay,
        userId: user.id,
        items: orderItems,
        customerData,
        subtotal: product.price * quantity,
        shippingCost: shippingCost,
        total: totalAmount,
        status: "pending",
        paymentMethod: "midtrans",
      });

      // Prepare payment data
      const paymentData = {
        idpay: idpay,
        amount: totalAmount,
        shippingCost: shippingCost,
        customer: customerData,
        items: [
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
          },
        ],
      };

      // Call our API to create Midtrans transaction
      const response = await fetch("/api/midtrans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success && result.snapToken) {
        // Update order with snap token
        updateOrderSnapToken(orderId, result.snapToken, result.redirectUrl);

        // Load Midtrans Snap if not already loaded
        if (!window.snap) {
          const script = document.createElement("script");
          script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
          script.setAttribute(
            "data-client-key",
            process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
          );
          document.head.appendChild(script);

          script.onload = () => {
            window.snap.pay(result.snapToken, {
              onSuccess: (result: any) => {
                console.log("Payment success:", result);
                updateOrderStatus(orderId, "paid");
                window.location.href = "/payment/success";
              },
              onPending: (result: any) => {
                console.log("Payment pending:", result);
                window.location.href = `/payment/pending?order_id=${result.order_id}&status_code=200&transaction_status=pending`;
              },
              onError: (result: any) => {
                console.log("Payment error:", result);
                window.location.href = "/payment/error";
              },
              onClose: () => {
                console.log("Payment popup closed");
                setIsProcessing(false);
              },
            });
          };
        } else {
          // Snap already loaded
          window.snap.pay(result.snapToken, {
            onSuccess: (result: any) => {
              console.log("Payment success:", result);
              updateOrderStatus(orderId, "paid");
              window.location.href = "/payment/success";
            },
            onPending: (result: any) => {
              console.log("Payment pending:", result);
              window.location.href = `/payment/pending?order_id=${result.order_id}&status_code=200&transaction_status=pending`;
            },
            onError: (result: any) => {
              console.log("Payment error:", result);
              window.location.href = "/payment/error";
            },
            onClose: () => {
              console.log("Payment popup closed");
              setIsProcessing(false);
            },
          });
        }
        setIsBuyNowOpen(false);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Gagal membuat transaksi: " + (result.error || "Unknown error"),
          icon: "error",
        });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat memproses pembayaran",
        icon: "error",
      });
      setIsProcessing(false);
    }
  };

  const savings = product.originalPrice - product.price;
  const savingsPercentage = Math.round((savings / product.originalPrice) * 100);
  const shippingCost = 25000;
  const totalPrice = product.price * quantity + shippingCost;

  return (
    <div className="min-h-screen bg-stone-50 pb-20 lg:pb-8">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-sm text-stone-600">
          <Link
            href="/products"
            className="hover:text-emerald-700 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke Produk
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <Badge className="absolute top-4 left-4 bg-emerald-700 text-white">
                {product.condition}
              </Badge>
              <Badge className="absolute top-4 right-16 bg-red-500 text-white">
                -{savingsPercentage}%
              </Badge>
              <Button
                size="icon"
                variant="ghost"
                className={`absolute top-4 right-4 bg-white/80 hover:bg-white h-10 w-10 ${
                  isInWishlist(product.id) ? "text-red-500" : "text-stone-600"
                }`}
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist(product.id) ? "fill-current" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-stone-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline">{product.brand}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{product.rating}</span>
                </div>
                <span className="text-stone-500">
                  ({product.reviews} ulasan)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2 mb-6">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-emerald-700">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-lg text-stone-500 line-through">
                    Rp {product.originalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-emerald-600 font-medium">
                  Hemat Rp {savings.toLocaleString("id-ID")} (
                  {savingsPercentage}%)
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-stone-700 mb-2 block">
                  Jumlah
                </Label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Tambah ke Keranjang
                </Button>

                {/* Buy Now Dialog */}
                <Dialog open={isBuyNowOpen} onOpenChange={setIsBuyNowOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full py-3 border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                      onClick={handleBuyNowClick}
                    >
                      Beli Sekarang
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Beli Sekarang</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Order Summary */}
                      <div className="bg-stone-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">
                          Ringkasan Pesanan
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>
                              {product.name} x{quantity}
                            </span>
                            <span>
                              Rp{" "}
                              {(product.price * quantity).toLocaleString(
                                "id-ID"
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ongkos Kirim</span>
                            <span>
                              Rp {shippingCost.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="text-emerald-700">
                              Rp {totalPrice.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Information Form */}
                      <div className="space-y-3">
                        <h3 className="font-semibold">Informasi Pengiriman</h3>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="firstName" className="text-sm">
                              Nama Depan *
                            </Label>
                            <Input
                              id="firstName"
                              placeholder="Nama depan"
                              value={customerData.firstName}
                              onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-sm">
                              Nama Belakang *
                            </Label>
                            <Input
                              id="lastName"
                              placeholder="Nama belakang"
                              value={customerData.lastName}
                              onChange={(e) =>
                                handleInputChange("lastName", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-sm">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={customerData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-sm">
                            Nomor Telepon *
                          </Label>
                          <Input
                            id="phone"
                            placeholder="08123456789"
                            value={customerData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="address" className="text-sm">
                            Alamat Lengkap *
                          </Label>
                          <Textarea
                            id="address"
                            placeholder="Alamat lengkap"
                            value={customerData.address}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="city" className="text-sm">
                              Kota *
                            </Label>
                            <Input
                              id="city"
                              placeholder="Jakarta"
                              value={customerData.city}
                              onChange={(e) =>
                                handleInputChange("city", e.target.value)
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="postalCode" className="text-sm">
                              Kode Pos *
                            </Label>
                            <Input
                              id="postalCode"
                              placeholder="12345"
                              value={customerData.postalCode}
                              onChange={(e) =>
                                handleInputChange("postalCode", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={handleBuyNow}
                          className="flex-1 bg-emerald-700 hover:bg-emerald-800"
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Memproses..." : "Bayar Sekarang"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsBuyNowOpen(false)}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Login Notice for Non-authenticated Users - Only for Buy Now */}
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Info Login</h3>
                <p className="text-blue-700 text-sm mb-3">
                  Anda dapat menambahkan produk ke keranjang dan wishlist tanpa
                  login. Namun untuk melakukan pembelian, Anda perlu login
                  terlebih dahulu.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/auth/login">Login Sekarang</Link>
                </Button>
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-stone-200">
              <div className="text-center">
                <Shield className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-stone-600">Kualitas Terjamin</p>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-stone-600">Pengiriman Cepat</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-stone-600">Garansi 7 Hari</p>
              </div>
            </div>

            {/* Company Chat */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-stone-800 mb-3">
                  Butuh Bantuan?
                </h3>
                <p className="text-sm text-stone-600 mb-3">
                  Tim customer service ANKT siap membantu Anda dengan pertanyaan
                  tentang produk ini.
                </p>
                <CompanyChatModal
                  productName={product.name}
                  productId={product.id}
                  triggerText="Chat Customer Service"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 space-y-8">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-stone-800 mb-4">
                Deskripsi Produk
              </h2>
              <p className="text-stone-700 leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-stone-800 mb-4">
                Fitur Unggulan
              </h2>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span className="text-stone-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-stone-800 mb-4">
                Spesifikasi
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-stone-100"
                  >
                    <span className="text-stone-600">{key}</span>
                    <span className="font-medium text-stone-800">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            Produk Serupa
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-square">
                  <Image
                    src={relatedProduct.images[0] || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 left-2 bg-emerald-700 text-white text-xs">
                    {relatedProduct.condition}
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm text-stone-800 mb-2 line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-stone-600 ml-1">
                      {relatedProduct.rating}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-emerald-700 text-sm">
                      Rp {relatedProduct.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-stone-500 line-through">
                      Rp {relatedProduct.originalPrice.toLocaleString("id-ID")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ChatWidget />
      <MobileTabBar />
    </div>
  );
}
