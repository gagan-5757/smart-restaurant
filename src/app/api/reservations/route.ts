import { NextResponse } from "next/server";
import { createReservation, getReservations } from "@/lib/restaurant-data";

export async function GET() {
  return NextResponse.json({ reservations: getReservations() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { customerName, partySize, timeSlot, table } = body as {
    customerName?: string;
    partySize?: number;
    timeSlot?: string;
    table?: string;
  };

  if (!customerName || !partySize || !timeSlot || !table) {
    return NextResponse.json({ error: "Missing reservation fields." }, { status: 400 });
  }

  return NextResponse.json({ reservation: createReservation({ customerName, partySize, timeSlot, table }) });
}
