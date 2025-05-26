"use client"

import { useState } from "react"
import { MessageCircle, Send, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatModalProps {
  sellerName: string
  sellerAvatar?: string
  productName: string
}

const mockMessages = [
  {
    id: 1,
    sender: "seller",
    message: "Halo! Ada yang bisa saya bantu mengenai produk ini?",
    time: "10:30",
  },
  {
    id: 2,
    sender: "buyer",
    message: "Halo, saya tertarik dengan stroller ini. Apakah masih tersedia?",
    time: "10:32",
  },
  {
    id: 3,
    sender: "seller",
    message: "Ya masih tersedia. Kondisinya sangat baik, semua fungsi normal.",
    time: "10:33",
  },
]

export default function ChatModal({ sellerName, sellerAvatar, productName }: ChatModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "buyer" as const,
        message: newMessage,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, message])
      setNewMessage("")

      // Simulate seller response
      setTimeout(() => {
        const sellerResponse = {
          id: messages.length + 2,
          sender: "seller" as const,
          message: "Terima kasih atas pertanyaannya! Saya akan segera merespons.",
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, sellerResponse])
      }, 1000)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat Penjual
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={sellerAvatar || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg">{sellerName}</DialogTitle>
                <p className="text-sm text-stone-600">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Product Info */}
        <div className="bg-stone-50 p-3 rounded-lg">
          <p className="text-sm text-stone-600">Mengenai produk:</p>
          <p className="font-medium text-stone-800 truncate">{productName}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 max-h-80 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "buyer" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === "buyer" ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-800"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${message.sender === "buyer" ? "text-emerald-100" : "text-stone-500"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex space-x-2 border-t pt-4">
          <Input
            placeholder="Ketik pesan..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} size="icon" className="bg-emerald-700 hover:bg-emerald-800">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
