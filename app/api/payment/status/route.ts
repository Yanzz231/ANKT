import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order_id")

  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 })
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY!
  const base64 = Buffer.from(`${serverKey}:`).toString("base64")

  const response = await fetch(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
    headers: {
      Authorization: `Basic ${base64}`,
    },
  })

  const data = await response.json()

  return NextResponse.json(data)
}
