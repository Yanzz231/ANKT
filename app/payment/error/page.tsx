import Image from "next/image"
import Link from "next/link"
import { XCircle, RefreshCw, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Image src="/logo.png" alt="ANKT Logo" width={60} height={60} className="rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-emerald-800">ANKT</h1>
              <p className="text-sm text-stone-600">Pembayaran Gagal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <XCircle className="h-24 w-24 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-stone-800 mb-2">Pembayaran Gagal</h2>
            <p className="text-stone-600 text-lg">Maaf, terjadi kesalahan saat memproses pembayaran Anda.</p>
          </div>

          {/* Error Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-left text-red-600">Kemungkinan Penyebab</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <ul className="space-y-2 text-stone-600">
                <li>• Saldo atau limit kartu kredit tidak mencukupi</li>
                <li>• Koneksi internet terputus saat transaksi</li>
                <li>• Informasi kartu yang dimasukkan tidak valid</li>
                <li>• Transaksi ditolak oleh bank penerbit</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
              <Link href="/checkout">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Kembali Belanja</Link>
            </Button>
          </div>

          {/* Help Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Butuh Bantuan?</h3>
              </div>
              <p className="text-blue-700 mb-4">
                Tim customer service kami siap membantu menyelesaikan masalah pembayaran Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-blue-600">
                <span>📧 support@ankt.co.id</span>
                <span>📱 +62 812-3456-7890</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
