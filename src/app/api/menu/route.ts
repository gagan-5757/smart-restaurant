import { NextResponse } from "next/server";
import { getMenuItems, toggleMenuAvailability } from "@/lib/restaurant-data";

export async function GET() {
  return NextResponse.json({ items: getMenuItems() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, available } = body as { id?: string; available?: boolean };

  if (!id || typeof available !== "boolean") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  return NextResponse.json({ items: toggleMenuAvailability(id, available) });
}
