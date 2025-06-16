"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Star,
  Filter,
  Search,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import Navbar from "@/components/navbar";
import MobileTabBar from "@/components/mobile-tab-bar";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

const allProducts = [
  {
    id: 1,
    name: "Stroller Bayi Premium Joie",
    price: 850000,
    originalPrice: 1500000,
    image: "/item/stollerbaby.jpg",
    condition: "Sangat Baik",
    rating: 4.8,
    reviews: 24,
    category: "Stroller",
    brand: "Joie",
    createdAt: "2024-01-15",
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
    brand: "Safety First",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "High Chair Makan Bayi Chicco",
    price: 450000,
    originalPrice: 800000,
    image: "/item/HighChairMakanBayi.jfif",
    condition: "Sangat Baik",
    rating: 4.9,
    reviews: 32,
    category: "Feeding",
    brand: "Chicco",
    createdAt: "2024-01-20",
  },
  {
    id: 4,
    name: "Baby Bouncer Fisher Price",
    price: 350000,
    originalPrice: 600000,
    image: "/item/BabyBouncer.jfif",
    condition: "Baik",
    rating: 4.7,
    reviews: 15,
    category: "Mainan",
    brand: "Fisher Price",
    createdAt: "2024-01-05",
  },
  {
    id: 5,
    name: "Baby Carrier Ergobaby",
    price: 750000,
    originalPrice: 1300000,
    image: "/item/BabyCarrierErgobaby.jpg",
    condition: "Sangat Baik",
    rating: 4.9,
    reviews: 28,
    category: "Carrier",
    brand: "Ergobaby",
    createdAt: "2024-01-18",
  },
  {
    id: 6,
    name: "Playmat Bayi Skip Hop",
    price: 280000,
    originalPrice: 500000,
    image: "/item/BabyCarrierErgobaby.jpg",
    condition: "Baik",
    rating: 4.5,
    reviews: 12,
    category: "Mainan",
    brand: "Skip Hop",
    createdAt: "2024-01-12",
  },
  {
    id: 7,
    name: "Baby Monitor Motorola",
    price: 400000,
    originalPrice: 700000,
    image: "/item/BabyMonitorMotorola.jpg",
    condition: "Sangat Baik",
    rating: 4.6,
    reviews: 20,
    category: "Electronics",
    brand: "Motorola",
    createdAt: "2024-01-22",
  },
  {
    id: 8,
    name: "Breast Pump Medela",
    price: 1200000,
    originalPrice: 2000000,
    image: "/item/BreastPumpMedela.jfif",
    condition: "Baik",
    rating: 4.8,
    reviews: 35,
    category: "Feeding",
    brand: "Medela",
    createdAt: "2024-01-08",
  },
];

const categories = [
  "Stroller",
  "Car Seat",
  "Feeding",
  "Mainan",
  "Carrier",
  "Electronics",
];
const brands = [
  "Joie",
  "Safety First",
  "Chicco",
  "Fisher Price",
  "Ergobaby",
  "Skip Hop",
  "Motorola",
  "Medela",
];
const conditions = ["Sangat Baik", "Baik", "Cukup Baik"];
const priceRanges = [
  { id: "under-300k", label: "Di bawah Rp 300.000", min: 0, max: 300000 },
  { id: "300k-500k", label: "Rp 300.000 - 500.000", min: 300000, max: 500000 },
  { id: "500k-1m", label: "Rp 500.000 - 1.000.000", min: 500000, max: 1000000 },
  {
    id: "above-1m",
    label: "Di atas Rp 1.000.000",
    min: 1000000,
    max: Number.POSITIVE_INFINITY,
  },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  const { addItem } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  // Set category filter from URL parameter
  useEffect(() => {
    if (categoryParam) {
      const categoryMap: { [key: string]: string } = {
        stroller: "Stroller",
        "car-seat": "Car Seat",
        feeding: "Feeding",
        toys: "Mainan",
        clothes: "Pakaian",
        sleep: "Tidur",
        bath: "Mandi",
        health: "Kesehatan",
      };
      const mappedCategory = categoryMap[categoryParam];
      if (mappedCategory && categories.includes(mappedCategory)) {
        setSelectedCategories([mappedCategory]);
      }
    }
  }, [categoryParam]);

  const handleAddToCart = (product: (typeof allProducts)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      condition: product.condition,
      category: product.category,
    });

    Swal.fire({
      title: "Berhasil!",
      text: `${product.name} (1x) telah ditambahkan ke keranjang`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
      background: "#f0fdf4",
      color: "#166534",
    });
  };

  const handleWishlistToggle = (product: (typeof allProducts)[0]) => {
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
        image: product.image,
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

  const handleFilterChange = (
    type: string,
    value: string,
    checked: boolean
  ) => {
    switch (type) {
      case "category":
        setSelectedCategories((prev) =>
          checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
        break;
      case "brand":
        setSelectedBrands((prev) =>
          checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
        break;
      case "condition":
        setSelectedConditions((prev) =>
          checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
        break;
      case "price":
        setSelectedPriceRanges((prev) =>
          checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
        break;
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      // Brand filter
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      // Condition filter
      const matchesCondition =
        selectedConditions.length === 0 ||
        selectedConditions.includes(product.condition);

      // Price filter
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((rangeId) => {
          const range = priceRanges.find((r) => r.id === rangeId);
          return (
            range && product.price >= range.min && product.price <= range.max
          );
        });

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesCondition &&
        matchesPrice
      );
    });

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return filtered;
  }, [
    searchQuery,
    selectedCategories,
    selectedBrands,
    selectedConditions,
    selectedPriceRanges,
    sortBy,
  ]);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-medium text-stone-700 mb-2 block">
          Cari Produk
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Cari perlengkapan bayi..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <Label className="text-sm font-medium text-stone-700 mb-3 block">
          Kategori
        </Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) =>
                  handleFilterChange("category", category, checked as boolean)
                }
              />
              <Label htmlFor={category} className="text-sm text-stone-600">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <Label className="text-sm font-medium text-stone-700 mb-3 block">
          Brand
        </Label>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) =>
                  handleFilterChange("brand", brand, checked as boolean)
                }
              />
              <Label htmlFor={brand} className="text-sm text-stone-600">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <Label className="text-sm font-medium text-stone-700 mb-3 block">
          Kondisi
        </Label>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={selectedConditions.includes(condition)}
                onCheckedChange={(checked) =>
                  handleFilterChange("condition", condition, checked as boolean)
                }
              />
              <Label htmlFor={condition} className="text-sm text-stone-600">
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium text-stone-700 mb-3 block">
          Rentang Harga
        </Label>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.id} className="flex items-center space-x-2">
              <Checkbox
                id={range.id}
                checked={selectedPriceRanges.includes(range.id)}
                onCheckedChange={(checked) =>
                  handleFilterChange("price", range.id, checked as boolean)
                }
              />
              <Label htmlFor={range.id} className="text-sm text-stone-600">
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories([]);
          setSelectedBrands([]);
          setSelectedConditions([]);
          setSelectedPriceRanges([]);
          setSearchQuery("");
          setCurrentPage(1);
        }}
      >
        Hapus Semua Filter
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20 lg:pb-8">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block w-80">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter Produk
              </h3>
              <FilterContent />
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-stone-800">
                  {categoryParam
                    ? `Kategori ${
                        categoryParam.charAt(0).toUpperCase() +
                        categoryParam.slice(1)
                      }`
                    : "Semua Produk"}
                </h2>
                <p className="text-stone-600">
                  Menampilkan {filteredAndSortedProducts.length} produk
                </p>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden flex-1 sm:flex-none"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filter Produk</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="price-low">Harga Terendah</SelectItem>
                    <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    <SelectItem value="rating">Rating Tertinggi</SelectItem>
                    <SelectItem value="popular">Terpopuler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid/List */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-stone-600 text-lg">
                  Tidak ada produk yang sesuai dengan filter Anda.
                </p>
                <p className="text-stone-500 mt-2">
                  Coba ubah filter atau kata kunci pencarian.
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {currentProducts.map((product) => (
                  <Card
                    key={product.id}
                    className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${
                      viewMode === "list" ? "flex flex-row" : ""
                    }`}
                  >
                    <div
                      className={`relative ${
                        viewMode === "list"
                          ? "w-48 flex-shrink-0"
                          : "aspect-square"
                      }`}
                    >
                      <Link href={`/products/${product.id}`}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <Badge className="absolute top-2 left-2 bg-emerald-700 text-white text-xs px-2 py-1">
                        {product.condition}
                      </Badge>
                      <Badge className="absolute top-2 right-12 bg-red-500 text-white text-xs px-2 py-1">
                        -
                        {Math.round(
                          (1 - product.price / product.originalPrice) * 100
                        )}
                        %
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "absolute top-2 right-2 bg-white/80 hover:bg-white transition-colors h-8 w-8",
                          isInWishlist(product.id)
                            ? "text-red-500"
                            : "text-stone-600"
                        )}
                        onClick={() => handleWishlistToggle(product)}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4",
                            isInWishlist(product.id) && "fill-current"
                          )}
                        />
                      </Button>
                    </div>

                    <CardContent
                      className={`p-4 ${
                        viewMode === "list"
                          ? "flex-1 flex flex-col justify-between"
                          : ""
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {product.brand}
                          </Badge>
                        </div>
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-semibold text-stone-800 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-stone-600 ml-1">
                              {product.rating}
                            </span>
                            <span className="text-sm text-stone-500 ml-1">
                              ({product.reviews})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-lg font-bold text-emerald-700">
                              Rp {product.price.toLocaleString("id-ID")}
                            </p>
                            <p className="text-sm text-stone-500 line-through">
                              Rp {product.originalPrice.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Tambah ke Keranjang
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-12 gap-4">
                <p className="text-stone-600 text-sm">
                  Menampilkan {startIndex + 1}-
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredAndSortedProducts.length
                  )}{" "}
                  dari {filteredAndSortedProducts.length} produk
                </p>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="hidden sm:flex"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className={
                            currentPage === pageNumber
                              ? "bg-emerald-700 text-white"
                              : ""
                          }
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="hidden sm:flex"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/logo.png"
                  alt="ANKT Logo"
                  width={40}
                  height={40}
                  className="rounded"
                />
                <h3 className="text-xl font-bold">ANKT</h3>
              </div>
              <p className="text-stone-800 mb-4">
                Marketplace terpercaya untuk perlengkapan bayi bekas
                berkualitas. Mendukung gaya hidup berkelanjutan untuk keluarga
                Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-stone-800">
                <li>
                  <Link
                    href="/products?category=stroller"
                    
                  >
                    Stroller & Kereta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=car-seat"
                    
                  >
                    Car Seat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=feeding"
                    
                  >
                    Feeding
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=toys"
                    
                  >
                    Mainan
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-stone-800">
                <li>
                  <Link href="#" >
                    Pengiriman
                  </Link>
                </li>
                <li>
                  <Link href="#" >
                    Garansi
                  </Link>
                </li>
                <li>
                  <Link href="#" >
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
  );
}
