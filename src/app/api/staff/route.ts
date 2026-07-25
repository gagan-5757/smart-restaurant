import { NextResponse } from "next/server";
import { getStaff } from "@/lib/restaurant-data";

export async function GET() {
  return NextResponse.json({ staff: getStaff() });
}
