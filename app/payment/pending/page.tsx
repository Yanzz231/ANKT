"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, CreditCard, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const statusCode = searchParams.get("status_code");
  const transactionStatus = searchParams.get("transaction_status");
  const type = searchParams.get("type");

  // Cek status transaksi setiap 5 detik
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!orderId) return;

      try {
        const res = await fetch(`/api/payment/status?order_id=${orderId}`);
        const data = await res.json();

        if (
          data.transaction_status === "settlement" ||
          data.transaction_status === "capture"
        ) {
          if (type) {
            router.replace(
              `/payment/success?order_id=${orderId}&status_code=200&transaction_status=${data.transaction_status}&type=checkout`
            );
          } else {
            router.replace(
              `/payment/success?order_id=${orderId}&status_code=200&transaction_status=${data.transaction_status}`
            );
          }
        }
      } catch (err) {
        console.error("Gagal mengecek status pembayaran", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, router]);

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
              <p className="text-sm text-stone-600">Pembayaran Pending</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Pending Icon */}
          <div className="mb-8">
            <Clock className="h-24 w-24 text-yellow-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-stone-800 mb-2">
              Pembayaran Pending
            </h2>
            <p className="text-stone-600 text-lg">
              Pembayaran Anda sedang diproses. Halaman ini akan memperbarui
              status otomatis.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-left">Detail Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-stone-600">Order ID:</span>
                <span className="font-mono">{orderId || "Tidak tersedia"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Status Midtrans:</span>
                <span className="text-yellow-600 font-semibold capitalize">
                  {transactionStatus || "pending"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Kode Status:</span>
                <span>{statusCode || "-"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-left">Instruksi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Kartu Kredit/Debit</p>
                    <p className="text-sm text-stone-600">
                      Jika menggunakan kartu kredit, pembayaran akan diproses
                      otomatis dalam beberapa menit.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Transfer Bank</p>
                    <p className="text-sm text-stone-600">
                      Silakan lakukan transfer sesuai instruksi yang dikirim ke
                      email Anda.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
              <Link href="/orders">Cek Status Pesanan</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Lanjut Belanja</Link>
            </Button>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Penting!</h3>
            <p className="text-yellow-700 text-sm">
              Pesanan akan otomatis dibatalkan jika pembayaran tidak
              diselesaikan dalam 24 jam. Silakan hubungi customer service jika
              mengalami kesulitan.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center text-sm text-yellow-600">
              <span>📧 support@ankt.co.id</span>
              <span>📱 +62 812-3456-7890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
