import { NextResponse } from "next/server";
import { getInventory } from "@/lib/restaurant-data";

export async function GET() {
  return NextResponse.json({ inventory: getInventory() });
}
