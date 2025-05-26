"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import Swal from "sweetalert2" 
import { useAuthStore } from "@/lib/auth-store"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  message?: string
}

export default function AuthGuard({
  children,
  redirectTo = "/auth/login",
  message,
}: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    if (!isAuthenticated) {
      if (message) {
        Swal.fire({
          title: "Login Diperlukan",
          text: message,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#047857",
          cancelButtonColor: "#6b7280",
          confirmButtonText: "Login Sekarang",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(redirectTo)
          } else {
            router.push("/")
          }
        })
      } else {
        router.push(redirectTo)
      }
    }
  }, [hasMounted, isAuthenticated, router, redirectTo, message])

  if (!hasMounted) return null

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            Memerlukan Login
          </h2>
          <p className="text-stone-600">
            Anda perlu login untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
