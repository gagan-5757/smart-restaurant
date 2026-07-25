"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getDashboardData, getInventory, getOrders, getReservations, getStaff } from "@/lib/restaurant-data";

const intelligenceModes = {
  "Peak Rush": {
    title: "Peak Rush Pulse",
    description: "Kitchen and floor teams get instant cues to shorten handoffs and push premium add-ons.",
    actions: ["Fast-track the next two table turns", "Highlight chef's special as a high-margin upsell", "Route host to VIP arrivals first"],
    uplift: "+18% projected order uplift",
  },
  "Weekend Brunch": {
    title: "Weekend Brunch Flow",
    description: "Gentle pacing and beverage pairing suggestions create a more relaxed, high-value guest journey.",
    actions: ["Offer mocktail pairings before the main course", "Keep seating pace relaxed for groups", "Highlight festive dessert bundles"],
    uplift: "+12% projected brunch spend",
  },
  "VIP Night": {
    title: "VIP Night Concierge",
    description: "Personalized service prompts keep the experience premium and seamless for high-touch guests.",
    actions: ["Prepare a tasting route for the table", "Assign a dedicated runner for the reservation", "Override the playlist and lighting scene"],
    uplift: "+22% projected premium spend",
  },
} as const;

const glassCard = "rounded-[32px] border border-white/10 bg-[#111827]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.45)]";

export default function DashboardPage() {
  const [dashboard] = useState(getDashboardData());
  const [reservations] = useState(getReservations());
  const [orders] = useState(getOrders());
  const [inventory] = useState(getInventory());
  const [staff] = useState(getStaff());
  const [activeMode, setActiveMode] = useState<keyof typeof intelligenceModes>("Peak Rush");

  const occupancyLabel = useMemo(() => `${dashboard.occupancy}% full`, [dashboard.occupancy]);
  const activeIntelligence = intelligenceModes[activeMode];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.10),_transparent_24%),linear-gradient(120deg,_#020617,_#111827_40%,_#0f172a)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className={`${glassCard} p-6`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Operations center</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Live control room</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">Track reservations, orders, inventory, and staffing from a dedicated dashboard page.</p>
            </div>
            <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200">
              Back to home
            </Link>
          </div>
        </header>

        <section className={`${glassCard} p-6`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Signature intelligence</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Adaptive service moods</h2>
              <p className="mt-2 text-sm text-slate-300">Switch modes to see how the platform tailors service recommendations for different guest moments.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(intelligenceModes) as Array<keyof typeof intelligenceModes>).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    activeMode === mode
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40"
                      : "border border-slate-600/70 bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800/70"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">{activeIntelligence.title}</p>
              <p className="mt-3 text-sm text-slate-300">{activeIntelligence.description}</p>
              <div className="mt-4 space-y-2">
                {activeIntelligence.actions.map((action) => (
                  <div key={action} className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-slate-200">
                    {action}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Projected lift</p>
              <p className="mt-3 text-3xl font-semibold text-white">{activeIntelligence.uplift}</p>
              <p className="mt-3 text-sm text-slate-400">This feature gives the platform a memorable identity: a living service engine that adapts to guest intent.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Revenue", value: `₹${dashboard.revenue.toLocaleString()}` },
            { label: "Occupancy", value: occupancyLabel },
            { label: "Pending orders", value: dashboard.pendingOrders.toString() },
            { label: "Low stock", value: dashboard.lowStock.toString() },
          ].map((item) => (
            <div key={item.label} className={`${glassCard} p-5`}>
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className={`${glassCard} p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Active reservations</h2>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-200">{reservations.length} live</span>
            </div>
            <div className="mt-4 space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{reservation.customerName}</p>
                      <p className="text-sm text-slate-400">{reservation.table} • {reservation.timeSlot}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">{reservation.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glassCard} p-6`}>
            <h2 className="text-xl font-semibold text-white">Order queue</h2>
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{order.customer}</p>
                      <p className="text-sm text-slate-400">{order.channel}</p>
                    </div>
                    <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-sm text-cyan-200">{order.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">ETA {order.eta} • ₹{order.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className={`${glassCard} p-6`}>
            <h2 className="text-xl font-semibold text-white">Inventory health</h2>
            <div className="mt-4 space-y-3">
              {inventory.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-sm text-slate-400">{item.stock} / {item.target}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glassCard} p-6`}>
            <h2 className="text-xl font-semibold text-white">Staff coverage</h2>
            <div className="mt-4 space-y-3">
              {staff.map((member) => (
                <div key={member.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="text-sm text-slate-400">{member.role}</p>
                  </div>
                  <span className="rounded-full bg-orange-500/15 px-3 py-1 text-sm text-orange-200">{member.shift}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
