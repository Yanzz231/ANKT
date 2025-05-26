import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required environment variables
    if (!process.env.MIDTRANS_SERVER_KEY) {
      throw new Error("MIDTRANS_SERVER_KEY is not configured")
    }

    // Create authorization header
    const auth = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64")

    // Calculate total from items
    const itemsTotal = body.items.reduce((total: number, item: any) => {
      return total + item.price * item.quantity
    }, 0)

    // Add shipping cost if provided
    const shippingCost = body.shippingCost || 25000
    const grossAmount = itemsTotal + shippingCost

    // Prepare item details including shipping
    const itemDetails = [
      ...body.items.map((item: any) => ({
        id: item.id.toString(),
        price: item.price,
        quantity: item.quantity,
        name: item.name,
        category: "baby_equipment",
      })),
      {
        id: "shipping",
        price: shippingCost,
        quantity: 1,
        name: "Ongkos Kirim",
        category: "shipping",
      },
    ]

    // Prepare transaction data for Midtrans
    const transactionData = {
      transaction_details: {
        order_id: body.idpay,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: body.customer.firstName,
        last_name: body.customer.lastName,
        email: body.customer.email,
        phone: body.customer.phone,
        billing_address: {
          first_name: body.customer.firstName,
          last_name: body.customer.lastName,
          address: body.customer.address,
          city: body.customer.city,
          postal_code: body.customer.postalCode,
          country_code: "IDN",
        },
        shipping_address: {
          first_name: body.customer.firstName,
          last_name: body.customer.lastName,
          address: body.customer.address,
          city: body.customer.city,
          postal_code: body.customer.postalCode,
          country_code: "IDN",
        },
      },
      item_details: itemDetails,
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/error`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/pending`,
      },
    }

    console.log("Transaction data:", JSON.stringify(transactionData, null, 2))

    // Call Midtrans Snap API
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/v1/transactions"

    const response = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
      body: JSON.stringify(transactionData),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Midtrans API Error:", errorData)
      throw new Error(`Midtrans API Error: ${response.status} - ${errorData}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      snapToken: result.token,
      redirectUrl: result.redirect_url,
      orderId: transactionData.transaction_details.order_id,
    })
  } catch (error) {
    console.error("Midtrans Integration Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create payment",
      },
      { status: 500 },
    )
  }
}
