import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/restaurant-data";

export async function GET() {
  return NextResponse.json({ dashboard: getDashboardData() });
}
