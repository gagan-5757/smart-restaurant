"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCount, setResendCount] = useState(30);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("vibeserve_phone");
    if (!stored) router.push("/auth/login");
    else setPhone(stored);
    inputRefs.current[0]?.focus();
  }, [router]);

  useEffect(() => {
    if (resendCount <= 0) return;
    const t = setTimeout(() => setResendCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCount]);

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 6) {
      verifyOTP(newOtp.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      verifyOTP(pasted);
    }
  }

  async function verifyOTP(code: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: code }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("vibeserve_user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    setResendCount(30);
    setResending(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0B2416 0%, #050E0A 50%, #0B1F2E 100%)" }}
    >
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
        </div>

        <div
          className="rounded-3xl border border-white/15 p-8"
          style={{ background: "rgba(11,36,22,0.85)", backdropFilter: "blur(24px)" }}
        >
          <button
            onClick={() => router.push("/auth/login")}
            className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-extrabold text-white mb-1">Check your phone 📲</h2>
          <p className="text-slate-400 text-sm mb-2">
            We sent a 6-digit OTP to
          </p>
          <p className="text-emerald-400 font-bold text-base mb-8">{phone}</p>

          {/* OTP Boxes */}
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                maxLength={1}
                className={`w-12 h-14 text-center text-2xl font-black rounded-2xl border transition outline-none
                  ${digit ? "border-emerald-400 bg-emerald-500/15 text-white shadow-lg shadow-emerald-500/20" : "border-white/20 text-white"}
                  focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
                `}
                style={{ background: digit ? undefined : "rgba(255,255,255,0.06)" }}
                disabled={loading}
              />
            ))}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center justify-center gap-2 mb-4 text-emerald-400 text-sm font-bold">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying OTP...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3 text-red-300 text-sm font-medium mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Resend */}
          <div className="text-center">
            {resendCount > 0 ? (
              <p className="text-slate-400 text-sm">
                Resend OTP in{" "}
                <span className="text-amber-400 font-bold">{resendCount}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-emerald-400 font-bold text-sm hover:text-emerald-300 transition disabled:opacity-50"
              >
                {resending ? "Resending..." : "🔄 Resend OTP"}
              </button>
            )}
          </div>

          {/* Demo hint */}
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-4">
            <p className="text-xs text-emerald-300 font-bold mb-1">🚀 Demo Mode</p>
            <p className="text-xs text-slate-400">
              Use OTP <strong className="text-white text-base">123456</strong> to log in instantly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
