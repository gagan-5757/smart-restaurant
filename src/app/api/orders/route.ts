import { NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/restaurant-data";

export async function GET() {
  return NextResponse.json({ orders: getOrders() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { customer, items, channel } = body as {
    customer?: string;
    items?: Array<{ id: string; name: string; qty: number; price: number }>;
    channel?: "Dine-in" | "Takeaway" | "Online";
  };

  if (!customer || !items || !channel) {
    return NextResponse.json({ error: "Missing order details." }, { status: 400 });
  }

  return NextResponse.json({ order: createOrder({ customer, items, channel }) });
}
