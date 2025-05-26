"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CreditCard, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useOrderStore } from "@/lib/order-store";
import AuthGuard from "@/components/auth-guard";
import Navbar from "@/components/navbar";
import MobileTabBar from "@/components/mobile-tab-bar";
import ChatWidget from "@/components/chat-widget";
import Swal from "sweetalert2";

// Declare global window.snap for TypeScript
declare global {
  interface Window {
    snap: any;
  }
}

function CheckoutContent() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const {
    addOrder,
    updateOrderSnapToken,
    updateOrderStatus,
    updateOrderStatusByOrderId,
  } = useOrderStore();
  const [paymentMethod, setPaymentMethod] = useState("midtrans");
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerData, setCustomerData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const subtotal = getTotalPrice();
  const shipping = 25000;
  const total = subtotal + shipping;

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      window.location.href = "/cart";
    }
  }, [items]);

  // Update customer data when user changes
  useEffect(() => {
    if (user) {
      setCustomerData((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMidtransPayment = async () => {
    if (!user) {
      Swal.fire({
        title: "Error!",
        text: "Anda harus login terlebih dahulu",
        icon: "error",
      });
      return;
    }

    // Validate form
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "postalCode",
    ];
    const missingFields = requiredFields.filter(
      (field) => !customerData[field as keyof typeof customerData]
    );

    if (missingFields.length > 0) {
      Swal.fire({
        title: "Data Tidak Lengkap!",
        text: `Mohon lengkapi data: ${missingFields.join(", ")}`,
        icon: "warning",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in our store first
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const idpay = `ANKT-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const orderId = addOrder({
        orderId: idpay,
        userId: user.id,
        items: orderItems,
        customerData,
        subtotal,
        shippingCost: shipping,
        total,
        status: "pending",
        paymentMethod: "midtrans",
      });

      // Prepare payment data
      const paymentData = {
        idpay: idpay,
        amount: total,
        shippingCost: shipping,
        customer: customerData,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      // Call our API to create Midtrans transaction
      const response = await fetch("/api/midtrans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success && result.snapToken) {
        // Update order with snap token
        updateOrderSnapToken(orderId, result.snapToken, result.redirectUrl);

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
            window.snap.pay(result.snapToken, {
              onSuccess: (result: any) => {
                console.log("Payment success:", result);
                updateOrderStatus(orderId, "paid");
                updateOrderStatusByOrderId(orderId, "paid");
                clearCart();
                window.location.href = "/payment/success";
              },
              onPending: (result: any) => {
                console.log("Payment pending:", result);
                window.location.href = `/payment/pending?order_id=${result.order_id}&status_code=200&transaction_status=pending&type=checkout`;
              },
              onClose: () => {
                window.location.href = `/payment/pending?order_id=${result.order_id}&status_code=200&transaction_status=pending`;
                console.log("Payment popup closed");
                setIsProcessing(false);
              },
            });
          };
        } else {
          // Snap already loaded
          window.snap.pay(result.snapToken, {
            onSuccess: (result: any) => {
              console.log("Payment success:", result);
              updateOrderStatus(orderId, "paid");
              updateOrderStatusByOrderId(orderId, "paid");
              clearCart();
              window.location.href = "/payment/success";
            },
            onPending: (result: any) => {
              console.log("Payment pending:", result);
              window.location.href = `/payment/pending?order_id=${result.order_id}&status_code=200&transaction_status=pending`;
            },
            onClose: () => {
              window.location.href = `/payment/pending?order_id=${result.order_id}&status_code=200&transaction_status=pending`;
              console.log("Payment popup closed");
              setIsProcessing(false);
            },
          });
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: "Gagal membuat transaksi: " + (result.error || "Unknown error"),
          icon: "error",
        });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat memproses pembayaran",
        icon: "error",
      });
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-emerald-700" />
                  Informasi Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nama Depan *</Label>
                    <Input
                      id="firstName"
                      placeholder="Masukkan nama depan"
                      value={customerData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nama Belakang *</Label>
                    <Input
                      id="lastName"
                      placeholder="Masukkan nama belakang"
                      value={customerData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={customerData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input
                    id="phone"
                    placeholder="08123456789"
                    value={customerData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat lengkap"
                    value={customerData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Kota *</Label>
                    <Input
                      id="city"
                      placeholder="Jakarta"
                      value={customerData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">Provinsi</Label>
                    <Input
                      id="province"
                      placeholder="DKI Jakarta"
                      value={customerData.province}
                      onChange={(e) =>
                        handleInputChange("province", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Kode Pos *</Label>
                    <Input
                      id="postalCode"
                      placeholder="12345"
                      value={customerData.postalCode}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-emerald-700" />
                  Metode Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="midtrans" id="midtrans" />
                    <Label htmlFor="midtrans" className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            Midtrans Payment Gateway
                          </p>
                          <p className="text-sm text-stone-600">
                            Credit Card, Bank Transfer, E-Wallet, dll
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Image
                            src="/placeholder.svg?height=24&width=40"
                            alt="Visa"
                            width={40}
                            height={24}
                          />
                          <Image
                            src="/placeholder.svg?height=24&width=40"
                            alt="Mastercard"
                            width={40}
                            height={24}
                          />
                          <Image
                            src="/placeholder.svg?height=24&width=40"
                            alt="GoPay"
                            width={40}
                            height={24}
                          />
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-stone-600 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>Rp {shipping.toLocaleString("id-ID")}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-emerald-700">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3"
                  onClick={handleMidtransPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Memproses..." : "Bayar Sekarang"}
                </Button>

                {/* Security Notice */}
                <div className="text-center text-xs text-stone-600 mt-4">
                  <p>🔒 Pembayaran aman dan terlindungi</p>
                  <p>Data Anda dienkripsi dengan SSL</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ChatWidget />
      <MobileTabBar />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard message="Anda harus login terlebih dahulu untuk melakukan checkout">
      <CheckoutContent />
    </AuthGuard>
  );
}
