"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getDashboardData, getInventory, getOrders, getReservations, getStaff, updateInventoryStock } from "@/lib/restaurant-data";

const intelligenceModes = {
  "Peak Rush": {
    title: "🔥 Peak Rush Pulse (7 PM – 10 PM)",
    description: "AI monitors live ticket pacing and social media viral spikes, routing kitchen prep batches 15 minutes before surge arrival.",
    actions: ["Fast-track 24K Gold Pasta prep station", "Surge price Smoky Tandoori Burger by +₹20 in POS", "Route Runner Miko S. to VIP Terrace arrivals"],
    uplift: "+24% projected revenue lift",
  },
  "Weekend Brunch": {
    title: "🥂 Weekend Brunch Flow",
    description: "Gentle table pacing and automated beverage pairing prompts create a relaxed, high-margin dining experience.",
    actions: ["Suggest Nimbu Mint Sparkling Cooler pairings", "Optimize 2-top table turns for bottomless brunch", "Highlight secret matcha drops"],
    uplift: "+16% projected average check",
  },
  "VIP Night": {
    title: "✨ VIP Night Concierge",
    description: "Personalized tableside cues keep high-touch guests delighted with zero wait times and bespoke dessert presentations.",
    actions: ["Trigger tableside Dragon Smoke Nitro Churro show", "Assign dedicated runner for party of 6", "Adjust acoustic acoustic scene in Booth 1"],
    uplift: "+28% projected tip & retention",
  },
} as const;

const glassCard = "rounded-[32px] border border-white/10 bg-[#111827]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.45)]";

export default function DashboardPage() {
  const [dashboard] = useState(getDashboardData());
  const [reservations] = useState(getReservations());
  const [orders] = useState(getOrders());
  const [inventory, setInventory] = useState(getInventory());
  const [staff] = useState(getStaff());
  const [activeMode, setActiveMode] = useState<keyof typeof intelligenceModes>("Peak Rush");
  const [message, setMessage] = useState("🛡️ Live Control Room: Real-time inventory forecasting, staff shifts, and AI demand analytics.");

  const occupancyLabel = useMemo(() => `${dashboard.occupancy}% full`, [dashboard.occupancy]);
  const activeIntelligence = intelligenceModes[activeMode];

  function handleRestock(itemName: string, currentStock: number, target: number) {
    const nextStock = Math.max(target, currentStock + 10);
    setInventory(updateInventoryStock(itemName, nextStock));
    setMessage(`📦 AI Restock Sync: Automated supplier order sent for '${itemName}'. Stock restored to ${nextStock} units.`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.15),_transparent_24%),linear-gradient(120deg,_#020617,_#111827_40%,_#0f172a)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
        <header className={`${glassCard} p-6 lg:p-8`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-300 border border-orange-400/30">
                  Gold Level Dashboard
                </span>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300 border border-cyan-400/30">
                  Platinum AI Operations
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Manager Control Room & AI Analytics</h1>
              <p className="mt-2 text-sm text-slate-300 max-w-3xl">
                Comprehensive operational oversight across 7 core modules: Orders, Tables, Inventory, Staff, Customers, Sales, and Predictive AI Forecasting.
              </p>
            </div>
            <Link href="/" className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 transition">
              ⬅ Back to Home OS
            </Link>
          </div>
        </header>

        {/* Status bar */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-3 text-xs sm:text-sm text-slate-200 backdrop-blur-md flex items-center justify-between">
          <span>💬 {message}</span>
          <span className="text-xs font-bold text-emerald-400">⚡ LIVE SYNC ACTIVE</span>
        </div>

        {/* AI Operational Intelligence & Demand Forecasting (Platinum Level) */}
        <section className={`${glassCard} p-6 lg:p-8 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-[#0a192f]/90 to-slate-900/90`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-5">
            <div>
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
                🤖 PLATINUM AI PREDICTION ENGINE
              </span>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">Adaptive Service Moods & Trend Forecasting</h2>
              <p className="mt-1 text-xs text-slate-300">
                Our AI analyzes social hype velocity (TikTok/Reels) to predict weekend ingredient surges and automatically adjust kitchen prep.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(intelligenceModes) as Array<keyof typeof intelligenceModes>).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    activeMode === mode
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                      : "border border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{activeIntelligence.title}</p>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  AI STRATEGY ACTIVE
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">{activeIntelligence.description}</p>
              
              <div className="mt-4 space-y-2">
                {activeIntelligence.actions.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900/60 px-3.5 py-2 text-xs text-slate-200">
                    <span className="text-amber-400 font-bold">✓</span> {action}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-950/40 to-slate-950 p-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Predicted Financial Uplift</p>
                <p className="mt-2 text-4xl font-extrabold text-white">{activeIntelligence.uplift}</p>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  By syncing front-of-house table pacing with viral social media demand, VibeServe eliminates kitchen bottlenecks and maximizes high-margin add-ons.
                </p>
              </div>

              <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Social Velocity: <strong className="text-white">28.4K mentions</strong></span>
                <span>AI Confidence: <strong className="text-emerald-400">99.2%</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Management Gauges (Orders, Tables, Inventory, Staff, Sales, Analytics) */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "💰 Live Revenue", value: `₹${dashboard.revenue.toLocaleString()}`, sub: "Up +34% vs last week" },
            { label: "🎟️ Table Occupancy", value: occupancyLabel, sub: `${reservations.length} active VIP parties` },
            { label: "🔥 Kitchen Queue", value: `${dashboard.pendingOrders} orders`, sub: "Average ETA: 8 mins" },
            { label: "📦 AI Stock Alerts", value: `${dashboard.lowStock} items low`, sub: "Auto-restock draft ready" },
          ].map((item, idx) => (
            <div key={idx} className={`${glassCard} p-5 transition hover:border-slate-700`}>
              <p className="text-xs font-bold uppercase text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{item.value}</p>
              <p className="mt-1 text-[11px] font-medium text-cyan-300">{item.sub}</p>
            </div>
          ))}
        </section>

        {/* Live Active Reservations & Order Queue */}
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`${glassCard} p-6 lg:p-8`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Active Floor Bookings</h2>
                <p className="text-xs text-slate-400">Live table assignments and guest arrival windows</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                {reservations.length} Live Parties
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-base">{reservation.customerName}</p>
                      <p className="text-xs font-medium text-amber-300">{reservation.table} • Time: {reservation.timeSlot}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Party size: {reservation.partySize} guests</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-200 border border-slate-700">
                      {reservation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glassCard} p-6 lg:p-8`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Kitchen Order Queue</h2>
                <p className="text-xs text-slate-400">Live ticket pacing and channel breakdown</p>
              </div>
              <Link href="/orders" className="text-xs font-bold text-cyan-400 hover:underline">
                Manage in Studio ➔
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white">#{order.id}</span>
                        <span className="text-xs font-bold text-slate-300">• {order.customer}</span>
                        <span className="rounded-full bg-slate-800 px-2 py-0.2 text-[10px] text-slate-400">{order.channel}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-1">{order.items.map((i) => `${i.name} (${i.qty})`).join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                        {order.status}
                      </span>
                      <p className="mt-1 text-[11px] font-bold text-amber-400">₹{order.total} • {order.eta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Inventory Health & Staff Scheduling Optimization */}
        <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className={`${glassCard} p-6 lg:p-8`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Inventory Health & AI Restock</h2>
                <p className="text-xs text-slate-400">Real-time stock vs target thresholds</p>
              </div>
              <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-bold text-orange-300">
                {inventory.filter((i) => i.stock < i.target).length} Action Required
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {inventory.map((item) => {
                const isLow = item.stock < item.target;
                return (
                  <div key={item.name} className={`flex items-center justify-between rounded-2xl border p-4 transition ${isLow ? "border-orange-500/40 bg-orange-950/20" : "border-white/10 bg-slate-950/60"}`}>
                    <div>
                      <span className="font-bold text-white text-sm">{item.name}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className={isLow ? "text-orange-400 font-bold" : "text-emerald-400 font-bold"}>{item.stock}</strong> / Target: {item.target} units
                      </p>
                    </div>

                    {isLow ? (
                      <button
                        onClick={() => handleRestock(item.name, item.stock, item.target)}
                        className="rounded-xl bg-orange-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-orange-400 transition shadow-lg shadow-orange-500/20"
                      >
                        📦 AI Restock (+10)
                      </button>
                    ) : (
                      <span className="rounded-xl bg-slate-900 px-3 py-1 text-xs font-bold text-emerald-400 border border-slate-800">
                        ✓ Optimal Stock
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${glassCard} p-6 lg:p-8`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Staff Shift & Service Routing</h2>
                <p className="text-xs text-slate-400">Assigned roles and peak hour coverage</p>
              </div>
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
                {staff.length} Active Staff
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {staff.map((member) => (
                <div key={member.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-slate-700">
                  <div>
                    <p className="font-bold text-white text-sm">{member.name}</p>
                    <p className="text-xs text-cyan-300 font-medium">{member.role}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-200 border border-slate-700">
                    {member.shift}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
