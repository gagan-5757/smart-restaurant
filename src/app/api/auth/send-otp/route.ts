import { NextResponse } from "next/server";

// In a real app this would integrate with Supabase Phone Auth / Twilio
// For demo: any phone gets OTP "123456"

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || !phone.startsWith("+91")) {
      return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
    }
    // In production: await supabase.auth.signInWithOtp({ phone })
    console.log(`[VibeServe Auth] OTP sent to ${phone} → Demo OTP: 123456`);
    return NextResponse.json({ success: true, message: "OTP sent successfully." });
  } catch {
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
