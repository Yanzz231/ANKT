"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, XCircle, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderStore, type Order } from "@/lib/order-store";
import { useCartStore } from "@/lib/cart-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { updateOrderStatusByOrderId, updateOrderStatus, getOrderByOrderId } =
    useOrderStore();
  const { clearCart } = useCartStore();

  const orderId = searchParams.get("order_id");
  const statusCode = searchParams.get("status_code");
  const transactionStatus = searchParams.get("transaction_status");
  const type = searchParams.get("type");

  const [isPaid, setIsPaid] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const order = getOrderByOrderId(orderId);
    if (order) {
      setOrderData(order);
    }

    const isSuccess =
      (transactionStatus === "settlement" || transactionStatus === "capture") &&
      statusCode === "200";

    if (isSuccess) {
      if(type) clearCart();
      updateOrderStatusByOrderId(orderId, "paid");
      updateOrderStatus(orderId, "paid");
      setIsPaid(true);
    }
  }, [
    orderId,
    statusCode,
    transactionStatus,
    updateOrderStatusByOrderId,
    updateOrderStatus,
    getOrderByOrderId,
    clearCart,
  ]);

  const isSuccess = isPaid;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-4">
            <Image
              src="/logo.png"
              alt="ANKT Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-emerald-800">ANKT</h1>
              <p className="text-sm text-stone-600">Pembayaran Berhasil</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Status Icon & Message */}
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-emerald-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-stone-800 mb-2">
              Pembayaran Berhasil!
            </h2>
            <p className="text-stone-600 text-lg">
              Terima kasih atas pembelian Anda. Pesanan sedang kami proses.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-left">Detail Transaksi</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-stone-600">Order ID:</span>
                <span className="font-mono">{orderId || "Tidak tersedia"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Status Midtrans:</span>
                <span
                  className={cn("capitalize text-emerald-700 font-semibold")}
                >
                  {transactionStatus || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Kode Status:</span>
                <span className="font-semibold">{statusCode || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Status Order:</span>
                <span className="font-semibold capitalize">
                  Paid
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Pembayaran via:</span>
                <span>Midtrans Gateway</span>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-left">Langkah Selanjutnya</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-emerald-600 mt-1" />
                <div>
                  <p className="font-medium">Pesanan Diproses</p>
                  <p className="text-sm text-stone-600">
                    Tim kami akan memproses pesanan Anda dalam 1–2 hari kerja.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-emerald-600 mt-1" />
                <div>
                  <p className="font-medium">Pengiriman</p>
                  <p className="text-sm text-stone-600">
                    Barang akan dikirim dalam 2–3 hari kerja setelah proses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
              <Link href="/orders">Lihat Pesanan Saya</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Lanjut Belanja</Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 p-6 bg-emerald-50 rounded-lg">
            <h3 className="font-semibold text-stone-800 mb-2">
              Butuh Bantuan?
            </h3>
            <p className="text-stone-600 mb-4">
              Tim customer service kami siap membantu Anda 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span>📧 support@ankt.co.id</span>
              <span>📱 +62 812-3456-7890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
