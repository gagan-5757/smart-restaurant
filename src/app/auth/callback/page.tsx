"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function finishAuth() {
      if (!supabase) {
        router.replace("/");
        return;
      }
      const { error } = await supabase.auth.getSession();
      if (!error) {
        router.replace("/");
      }
    }
    finishAuth();
  }, [router]);

  return <div className="flex min-h-screen items-center justify-center text-slate-200">Finalizing sign-in…</div>;
}
