"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    snap: any
  }
}

interface MidtransIntegrationProps {
  snapToken: string
  onSuccess?: (result: any) => void
  onPending?: (result: any) => void
  onError?: (result: any) => void
  onClose?: () => void
}

export default function MidtransIntegration({
  snapToken,
  onSuccess,
  onPending,
  onError,
  onClose,
}: MidtransIntegrationProps) {
  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement("script")
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js"
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "")
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = () => {
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: (result: any) => {
          console.log("Payment success:", result)
          onSuccess?.(result)
        },
        onPending: (result: any) => {
          console.log("Payment pending:", result)
          onPending?.(result)
        },
        onError: (result: any) => {
          console.log("Payment error:", result)
          onError?.(result)
        },
        onClose: () => {
          console.log("Payment popup closed")
          onClose?.()
        },
      })
    }
  }

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-4 rounded-lg font-medium transition-colors"
    >
      Bayar Sekarang
    </button>
  )
}
