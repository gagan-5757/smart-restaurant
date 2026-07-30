"use client";

import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (method: string) => void;
  orderTotal: number;
}

const PAYMENT_METHODS = [
  {
    id: "gpay",
    name: "Google Pay",
    icon: "💳",
    emoji: "G",
    gradient: "from-blue-500 to-cyan-500",
    badge: "Instant",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    icon: "📱",
    emoji: "P",
    gradient: "from-purple-500 to-violet-600",
    badge: "Popular",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
  },
  {
    id: "paytm",
    name: "Paytm",
    icon: "💰",
    emoji: "₹",
    gradient: "from-sky-500 to-blue-600",
    badge: "",
    badgeColor: "",
  },
  {
    id: "upi",
    name: "UPI / BHIM",
    icon: "🏦",
    emoji: "UPI",
    gradient: "from-orange-500 to-amber-500",
    badge: "",
    badgeColor: "",
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    icon: "💳",
    emoji: "CARD",
    gradient: "from-slate-500 to-slate-600",
    badge: "",
    badgeColor: "",
  },
  {
    id: "cash",
    name: "Cash at Counter",
    icon: "🪙",
    emoji: "₹₹",
    gradient: "from-emerald-500 to-green-600",
    badge: "No fee",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  },
];

export default function PaymentModal({ isOpen, onClose, onConfirm, orderTotal }: PaymentModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [upiId, setUpiId] = useState("");
  const [confirming, setConfirming] = useState(false);

  if (!isOpen) return null;

  async function handleConfirm() {
    if (!selected) return;
    if (selected === "upi" && !upiId.includes("@")) return;
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1500)); // Simulate payment processing
    setConfirming(false);
    onConfirm(selected);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-0"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: "rgba(7,22,14,0.98)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white">Choose Payment 💳</h3>
              <p className="text-slate-400 text-sm mt-0.5">Select how you'd like to pay</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center text-lg transition">
              ✕
            </button>
          </div>

          {/* Order Amount */}
          <div
            className="mt-4 rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <span className="text-slate-300 text-sm font-medium">Order Total</span>
            <span className="text-2xl font-black text-emerald-400">₹{orderTotal}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="px-6 py-4 space-y-3 max-h-[360px] overflow-y-auto">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.id}>
              <button
                onClick={() => setSelected(method.id)}
                className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 border transition-all ${
                  selected === method.id
                    ? "border-emerald-400/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : "border-white/10 hover:border-white/25"
                }`}
                style={selected !== method.id ? { background: "rgba(255,255,255,0.05)" } : {}}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center font-black text-white text-xs shrink-0 shadow-lg`}
                >
                  {method.emoji.length <= 2 ? method.emoji : (
                    <span style={{ fontSize: "10px" }}>{method.emoji}</span>
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 text-left">
                  <p className="text-white font-bold text-sm">{method.name}</p>
                  {method.badge && (
                    <span className={`text-[10px] font-extrabold uppercase border rounded-full px-2 py-0.5 ${method.badgeColor}`}>
                      {method.badge}
                    </span>
                  )}
                </div>

                {/* Radio */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected === method.id
                      ? "border-emerald-400 bg-emerald-400"
                      : "border-slate-600"
                  }`}
                >
                  {selected === method.id && (
                    <div className="w-2 h-2 rounded-full bg-slate-950" />
                  )}
                </div>
              </button>

              {/* UPI ID input */}
              {selected === "upi" && method.id === "upi" && (
                <div className="mt-2 px-1">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full rounded-2xl border border-white/15 px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-amber-400/60 transition"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    autoFocus
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10" style={{ background: "rgba(0,0,0,0.2)" }}>
          <button
            onClick={handleConfirm}
            disabled={!selected || confirming || (selected === "upi" && !upiId.includes("@"))}
            className="w-full rounded-2xl py-4 font-black text-base transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: selected
                ? "linear-gradient(135deg, #F59E0B, #EF4444)"
                : "rgba(255,255,255,0.1)",
              color: selected ? "#0a0a0a" : "#64748b",
            }}
          >
            {confirming ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : (
              <>✅ Pay ₹{orderTotal} Now</>
            )}
          </button>
          <p className="text-center text-xs text-slate-500 mt-3">
            🔒 Secured by 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
