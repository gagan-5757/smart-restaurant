import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (email === "manager@restaurant.com" && password === "manager123") {
    return NextResponse.json({ role: "manager", message: "Manager access granted." });
  }

  if (email && password) {
    return NextResponse.json({ role: "customer", message: "Customer access granted." });
  }

  return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
}
