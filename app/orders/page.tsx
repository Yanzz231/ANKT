"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/auth-store";
import { useOrderStore, type Order } from "@/lib/order-store";
import AuthGuard from "@/components/auth-guard";
import Navbar from "@/components/navbar";
import MobileTabBar from "@/components/mobile-tab-bar";
import ChatWidget from "@/components/chat-widget";

// Declare global window.snap for TypeScript
declare global {
  interface Window {
    snap: any;
  }
}

function OrdersContent() {
  const { user } = useAuthStore();
  const {
    getUserOrders,
    getPendingOrders,
    updateOrderStatus,
    markExpiredOrders,
  } = useOrderStore();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const userOrders = user ? getUserOrders(user.id) : [];
  const pendingOrders = user ? getPendingOrders(user.id) : [];

  // Mark expired orders on component mount
  useEffect(() => {
    markExpiredOrders();
  }, [markExpiredOrders]);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "cancelled":
      case "expired":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-stone-500" />;
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Menunggu Pembayaran";
      case "paid":
        return "Dibayar";
      case "shipped":
        return "Dikirim";
      case "delivered":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      case "expired":
        return "Kedaluwarsa";
      default:
        return status;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Kedaluwarsa";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours} jam ${minutes} menit lagi`;
    }
    return `${minutes} menit lagi`;
  };

  const handleRetryPayment = async (order: Order) => {
    if (!order.snapToken) {
      alert("Token pembayaran tidak tersedia");
      return;
    }

    setIsProcessing(order.id);

    try {
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
          window.snap.pay(order.snapToken, {
            onSuccess: (result: any) => {
              console.log("Payment success:", result);
              updateOrderStatus(order.id, "paid");
              window.location.href = `/payment/success?order_id=${result.order_id}&status_code=200&transaction_status=settlement`;
            },
            onPending: (result: any) => {
              console.log("Payment pending:", result);
              window.location.href = `/payment/pending?order_id=${result.order_id}&status_code=200&transaction_status=pending`;
            },
            onClose: () => {
              console.log("Payment popup closed");
              setIsProcessing(null);
            },
          });
        };
      } else {
        // Snap already loaded
        window.snap.pay(order.snapToken, {
          onSuccess: (result: any) => {
            console.log("Payment success:", result);
            updateOrderStatus(order.id, "paid");
            window.location.href = `/payment/success?order_id=${result.order_id}&status_code=200&transaction_status=settlement`;
          },
          onPending: (result: any) => {
            console.log("Payment pending:", result); 
            window.location.href = `/payment/pending?order_id=${result.order_id}&status_code=200&transaction_status=pending`;
          },
          onClose: () => {
            console.log("Payment popup closed");
            setIsProcessing(null);
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Terjadi kesalahan saat memproses pembayaran");
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 lg:pb-8">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/profile" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Profile
            </Link>
          </Button>
        </div>

        <div className="flex items-center space-x-3 mb-8">
          <Package className="h-8 w-8 text-emerald-700" />
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Pesanan Saya</h1>
            <p className="text-stone-600">
              Kelola dan lacak semua pesanan Anda
            </p>
          </div>
        </div>

        {/* Pending Orders Alert */}
        {pendingOrders.length > 0 && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <Clock className="h-5 w-5 mr-2" />
                Pesanan Menunggu Pembayaran ({pendingOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                Anda memiliki pesanan yang menunggu pembayaran. Selesaikan
                pembayaran sebelum waktu habis.
              </p>
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-stone-800">
                        #{order.orderId}
                      </p>
                      <p className="text-sm text-stone-600">
                        Total: Rp {order.total.toLocaleString("id-ID")} •{" "}
                        {getTimeRemaining(order.expiresAt)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => handleRetryPayment(order)}
                      disabled={isProcessing === order.id}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {isProcessing === order.id
                        ? "Memproses..."
                        : "Bayar Sekarang"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        {userOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-800 mb-2">
                Belum Ada Pesanan
              </h3>
              <p className="text-stone-600 mb-6">
                Anda belum memiliki pesanan. Mulai berbelanja sekarang!
              </p>
              <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                <Link href="/products">Mulai Belanja</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-stone-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold text-stone-800">
                          #{order.orderId}
                        </h3>
                        <p className="text-sm text-stone-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      {order.status === "pending" &&
                        new Date(order.expiresAt) > new Date() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetryPayment(order)}
                            disabled={isProcessing === order.id}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            {isProcessing === order.id
                              ? "Memproses..."
                              : "Bayar"}
                          </Button>
                        )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-stone-800">
                            {item.name}
                          </h4>
                          <p className="text-sm text-stone-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-emerald-700">
                          Rp{" "}
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Summary */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-stone-800 mb-3">
                        Informasi Pengiriman
                      </h4>
                      <div className="text-sm text-stone-600 space-y-1">
                        <p>
                          {order.customerData.firstName}{" "}
                          {order.customerData.lastName}
                        </p>
                        <p>{order.customerData.email}</p>
                        <p>{order.customerData.phone}</p>
                        <p>{order.customerData.address}</p>
                        <p>
                          {order.customerData.city},{" "}
                          {order.customerData.postalCode}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-stone-800 mb-3">
                        Ringkasan Pembayaran
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>
                            Rp {order.subtotal.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ongkos Kirim</span>
                          <span>
                            Rp {order.shippingCost.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span className="text-emerald-700">
                            Rp {order.total.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      {/* Payment Status Info */}
                      {order.status === "pending" && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800 font-medium">
                            ⏰ Batas Waktu Pembayaran
                          </p>
                          <p className="text-sm text-yellow-700">
                            {getTimeRemaining(order.expiresAt)}
                          </p>
                        </div>
                      )}

                      {order.status === "expired" && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800 font-medium">
                            ❌ Pesanan Kedaluwarsa
                          </p>
                          <p className="text-sm text-red-700">
                            Waktu pembayaran telah habis
                          </p>
                        </div>
                      )}

                      {order.status === "paid" && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">
                            ✅ Pembayaran Berhasil
                          </p>
                          <p className="text-sm text-green-700">
                            Pesanan sedang diproses
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    {order.status === "pending" &&
                      new Date(order.expiresAt) > new Date() && (
                        <Button
                          className="bg-emerald-700 hover:bg-emerald-800"
                          onClick={() => handleRetryPayment(order)}
                          disabled={isProcessing === order.id}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          {isProcessing === order.id
                            ? "Memproses..."
                            : "Selesaikan Pembayaran"}
                        </Button>
                      )}

                    {order.status === "paid" && (
                      <Button variant="outline">
                        <Truck className="h-4 w-4 mr-2" />
                        Lacak Pengiriman
                      </Button>
                    )}

                    <Button variant="outline" asChild>
                      <Link href="/contact">Hubungi Customer Service</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ChatWidget />
      <MobileTabBar />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard message="Anda harus login terlebih dahulu untuk melihat pesanan">
      <OrdersContent />
    </AuthGuard>
  );
}
