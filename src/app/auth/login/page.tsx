"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${cleaned}` }),
      });
      const data = await res.json();
      if (res.ok) {
        // Store phone in sessionStorage to use on verify page
        sessionStorage.setItem("vibeserve_phone", `+91${cleaned}`);
        router.push("/auth/verify");
      } else {
        setError(data.error || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0B2416 0%, #050E0A 50%, #0B1F2E 100%)",
      }}
    >
      {/* Ambient orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl mb-4 shadow-2xl shadow-amber-500/30">
            🍃
          </div>
          <h1 className="text-4xl font-black text-white">
            Vibe<span className="text-amber-400">Serve</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">The Viral Dining OS</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border border-white/15 p-8"
          style={{ background: "rgba(11,36,22,0.85)", backdropFilter: "blur(24px)" }}
        >
          <h2 className="text-2xl font-extrabold text-white mb-1">Welcome back 👋</h2>
          <p className="text-slate-400 text-sm mb-8">
            Enter your phone number to receive a one-time password.
          </p>

          <form onSubmit={handleSendOTP} className="space-y-5">
            {/* Phone Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest">
                Mobile Number
              </label>
              <div className="flex gap-2">
                {/* Country Code Badge */}
                <div
                  className="flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-white font-bold text-sm shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  🇮🇳 +91
                </div>
                {/* Phone Number Field */}
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98765 43210"
                  className="flex-1 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-white text-lg font-bold placeholder-slate-500 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20 transition"
                  style={{ background: "rgba(255,255,255,0.06)", letterSpacing: "0.1em" }}
                  maxLength={10}
                  inputMode="numeric"
                  autoFocus
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3 text-red-300 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black py-4 text-base shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending OTP...
                </>
              ) : (
                <>📲 Send OTP</>
              )}
            </button>
          </form>

          {/* Quick demo login info */}
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-4">
            <p className="text-xs text-emerald-300 font-bold mb-1">🚀 Demo Mode</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              For demo purposes, enter any 10-digit number. OTP <strong className="text-white">123456</strong> will always work.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          By continuing, you agree to VibeServe's{" "}
          <span className="text-slate-300 underline cursor-pointer">Terms of Service</span>
        </p>
      </div>
    </main>
  );
}
