import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Supabase credentials are not configured yet." }, { status: 500 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message || "Authentication failed." }, { status: 401 });
  }

  return NextResponse.json({ user: data.user, session: data.session });
}
