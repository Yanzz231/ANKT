"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useChatStore } from "@/lib/chat-store"

interface CompanyChatModalProps {
  productName?: string
  productId?: number
  triggerText?: string
}

export default function CompanyChatModal({
  productName,
  productId,
  triggerText = "Chat Customer Service",
}: CompanyChatModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { createSession, openChat } = useChatStore()

  const handleStartChat = () => {
    const sessionId = createSession(productId, productName)
    setIsOpen(false)
    openChat(sessionId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <MessageCircle className="h-4 w-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-emerald-700" />
            Chat dengan ANKT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h3 className="font-semibold text-emerald-800 mb-2">Customer Service ANKT</h3>
            <p className="text-emerald-700 text-sm">
              Tim customer service kami siap membantu Anda 24/7.
              {productName && ` Kami akan membantu Anda dengan pertanyaan tentang ${productName}.`}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-stone-600 text-sm">Kami dapat membantu Anda dengan:</p>
            <ul className="text-stone-600 text-sm space-y-1">
              <li>• Informasi produk dan spesifikasi</li>
              <li>• Status pesanan dan pengiriman</li>
              <li>• Kebijakan return dan garansi</li>
              <li>• Pertanyaan umum lainnya</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleStartChat} className="flex-1 bg-emerald-700 hover:bg-emerald-800">
              <MessageCircle className="h-4 w-4 mr-2" />
              Mulai Chat
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
