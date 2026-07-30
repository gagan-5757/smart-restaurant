import { NextResponse } from "next/server";

const DEMO_OTP = "123456";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP required." }, { status: 400 });
    }
    // Demo verification — accepts 123456 for any phone
    if (otp !== DEMO_OTP) {
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 401 });
    }
    // Generate a simple session token (in production: use Supabase session)
    const user = {
      id: `user_${phone.replace(/\D/g, "")}`,
      phone,
      name: "Foodie Guest",
      role: "customer",
      loggedInAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
