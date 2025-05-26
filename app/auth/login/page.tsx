"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/lib/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        router.push("/")
      } else {
        setError("Email atau password salah")
      }
    } catch (error) {
      setError("Terjadi kesalahan, silakan coba lagi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-stone-100">
      {/* Header with Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button asChild variant="ghost" className="text-stone-700 hover:text-emerald-700">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <Image src="/logo.png" alt="ANKT Logo" width={80} height={80} className="rounded-lg" />
              </div>
              <CardTitle className="text-2xl font-bold text-stone-800">Masuk ke ANKT</CardTitle>
              <p className="text-stone-600">Selamat datang kembali!</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-stone-400 hover:text-stone-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Masuk"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-stone-600 text-sm">
                  Belum punya akun?{" "}
                  <Link href="/auth/register" className="text-emerald-700 hover:text-emerald-800 font-medium">
                    Daftar sekarang
                  </Link>
                </p>
              </div>

              {/* Demo Account Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm font-medium mb-2">Demo Account:</p>
                <p className="text-blue-700 text-xs">Email: demo@ankt.co.id</p>
                <p className="text-blue-700 text-xs">Password: password</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
