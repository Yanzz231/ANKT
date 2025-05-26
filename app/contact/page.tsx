"use client";

import type React from "react";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/navbar";
import MobileTabBar from "@/components/mobile-tab-bar";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: "info@ankt.co.id",
    description: "Kirim email untuk pertanyaan umum",
  },
  {
    icon: Phone,
    title: "WhatsApp",
    details: "+62 812-3456-7890",
    description: "Chat langsung untuk respon cepat",
  },
  {
    icon: MapPin,
    title: "Alamat",
    details: "Jl. Sudirman No. 123, Jakarta Selatan",
    description: "Kantor pusat ANKT",
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    details: "Senin - Jumat: 09:00 - 18:00 WIB",
    description: "Sabtu: 09:00 - 15:00 WIB",
  },
];

const faqItems = [
  {
    question: "Bagaimana cara memastikan kualitas produk?",
    answer:
      "Setiap produk melalui inspeksi ketat oleh tim quality control kami. Kami memeriksa fungsi, kebersihan, dan keamanan setiap item sebelum dijual.",
  },
  {
    question: "Apakah ada garansi untuk produk bekas?",
    answer:
      "Ya, kami memberikan garansi 7 hari untuk semua produk. Jika ada masalah dengan produk, Anda dapat mengembalikannya dalam kondisi yang sama.",
  },
  {
    question: "Bagaimana cara menjual barang di ANKT?",
    answer:
      "Anda dapat menghubungi tim kami melalui WhatsApp atau email. Tim kami akan membantu proses evaluasi dan penjualan barang Anda.",
  },
  {
    question: "Apakah pengiriman tersedia ke seluruh Indonesia?",
    answer:
      "Ya, kami melayani pengiriman ke seluruh Indonesia melalui berbagai ekspedisi terpercaya dengan packaging yang aman.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Pesan Anda telah terkirim! Tim kami akan segera menghubungi Anda.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 lg:pb-8">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-stone-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-stone-800 mb-6">
            Hubungi Kami
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Punya pertanyaan atau butuh bantuan? Tim customer service kami siap
            membantu Anda 24/7
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-6">
                Informasi Kontak
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-emerald-100 p-3 rounded-lg">
                          <info.icon className="h-6 w-6 text-emerald-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-800 mb-1">
                            {info.title}
                          </h3>
                          <p className="text-stone-700 font-medium">
                            {info.details}
                          </p>
                          <p className="text-stone-600 text-sm">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kontak Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href="mailto:info@ankt.co.id">
                    <Mail className="h-4 w-4 mr-2" />
                    Kirim Email
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Kirim Pesan</CardTitle>
                <p className="text-stone-600">
                  Isi form di bawah ini dan kami akan segera menghubungi Anda
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        placeholder="Masukkan nama lengkap"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        placeholder="08123456789"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subjek *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          handleInputChange("subject", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih subjek" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            Pertanyaan Umum
                          </SelectItem>
                          <SelectItem value="order">Bantuan Pesanan</SelectItem>
                          <SelectItem value="sell">Jual Barang</SelectItem>
                          <SelectItem value="complaint">Keluhan</SelectItem>
                          <SelectItem value="partnership">Kerjasama</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan Anda di sini..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-stone-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Lokasi Kantor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-stone-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.666666666667!2d106.8277778!3d-6.1611111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0a7c1a8!2sJl.%20Mangga%20Dua%20Raya%20No.1%2C%20Mangga%20Dua%20Sel.%2C%20Kecamatan%20Sawah%20Besar%2C%20Kota%20Jakarta%20Pusat%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2010730!5e0!3m2!1sen!2sid!4v1635123456789!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ANKT Headquarters Location"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-stone-700 font-medium">
                  ANKT Headquarters Manga Dua
                </p>
                <p className="text-stone-600">
                  Jl. Mangga Dua Raya No.1, Mangga Dua Sel., Kecamatan Sawah
                  Besar, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10730
                </p>
              </div>
            </CardContent>
          </Card>
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
                    className="hover:text-white transition-colors"
                  >
                    Stroller & Kereta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=car-seat"
                    className="hover:text-white transition-colors"
                  >
                    Car Seat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=feeding"
                    className="hover:text-white transition-colors"
                  >
                    Feeding
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=toys"
                    className="hover:text-white transition-colors"
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
                  <Link href="#" className="hover:text-white transition-colors">
                    Pengiriman
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Garansi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
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
