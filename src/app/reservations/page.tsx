"use client";

import Link from "next/link";
import { useState } from "react";
import { createReservation, getReservations } from "@/lib/restaurant-data";

const glassCard = "rounded-[32px] border border-white/10 bg-[#111827]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.45)]";

const tableVibes = [
  { name: "Terrace 2 (Best Lighting 📸)", desc: "Golden hour natural lighting, perfect for Instagram photos & Reels.", capacity: "2-4 guests", turnover: "45 mins" },
  { name: "Chef's Counter (Action View 👨‍🍳)", desc: "Front-row seats to the live kitchen sizzling, plating, and liquid nitrogen smoke.", capacity: "1-3 guests", turnover: "40 mins" },
  { name: "Velvet Booth 1 (Intimate ✨)", desc: "Plush velvet seating with acoustic dampening for romantic VIP dates.", capacity: "2 guests", turnover: "60 mins" },
  { name: "Garden Pergola (Group Fiesta 🎉)", desc: "Spacious outdoor table surrounded by ambient string lights and greenery.", capacity: "6-12 guests", turnover: "75 mins" },
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState(getReservations());
  const [form, setForm] = useState({
    customerName: "",
    partySize: 2,
    timeSlot: "19:30",
    table: "Terrace 2 (Best Lighting 📸)",
  });
  const [message, setMessage] = useState("🎟️ Select your preferred dining atmosphere and lock in an instant VIP reservation.");
  const [selectedVibe, setSelectedVibe] = useState(tableVibes[0]);

  function submitReservation(event: React.FormEvent) {
    event.preventDefault();
    if (!form.customerName) {
      setMessage("⚠️ Please enter a guest name for the booking.");
      return;
    }
    const reservation = createReservation(form);
    setReservations((current) => [reservation, ...current]);
    setForm({ customerName: "", partySize: 2, timeSlot: "19:30", table: tableVibes[0].name });
    setMessage(`🎉 VIP Table confirmed for ${reservation.customerName} at ${reservation.table}! AI turnover synced.`);
  }

  function handleTableSelect(vibe: typeof tableVibes[0]) {
    setSelectedVibe(vibe);
    setForm({ ...form, table: vibe.name });
    setMessage(`✨ Selected '${vibe.name}'. AI Note: Average turnover is ~${vibe.turnover}.`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.15),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.12),_transparent_24%),linear-gradient(120deg,_#020617,_#111827_40%,_#0f172a)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
        <header className={`${glassCard} p-6 lg:p-8`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-300 border border-orange-400/30">
                  Silver Level Workflow
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300 border border-emerald-400/30">
                  AI Smart Seating
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">VIP Table & Vibe Reservation</h1>
              <p className="mt-2 text-sm text-slate-300">
                Forget generic tables. Choose your atmosphere, lighting, and action view with AI-powered turnover prediction.
              </p>
            </div>
            <Link href="/" className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 transition">
              ⬅ Back to Home OS
            </Link>
          </div>
        </header>

        {/* AI Turnover Predictor Banner */}
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-950/80 via-slate-950 to-amber-950/80 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
              🤖 AI SMART SEATING PREDICTOR
            </span>
            <p className="mt-2 text-sm text-slate-200">
              Selected Vibe: <strong className="text-white">{selectedVibe.name}</strong> • Optimal Turnover: <strong className="text-amber-400">{selectedVibe.turnover}</strong>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              AI algorithm matches party size ({form.partySize}) with live table turnover velocity to guarantee 0-minute lobby wait time.
            </p>
          </div>
          <span className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 whitespace-nowrap">
            ⚡ Zero Wait Guarantee
          </span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Reservation Form & Atmosphere Picker */}
          <div className={`${glassCard} p-6 lg:p-8`}>
            <h2 className="text-xl font-bold text-white">1. Choose Your Table Atmosphere</h2>
            
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {tableVibes.map((vibe) => (
                <div
                  key={vibe.name}
                  onClick={() => handleTableSelect(vibe)}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${form.table === vibe.name ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10" : "border-slate-800 bg-slate-950/60 hover:border-slate-700"}`}
                >
                  <p className="font-bold text-white text-sm">{vibe.name}</p>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">{vibe.desc}</p>
                  <div className="mt-3 flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 border-t border-white/5 pt-2">
                    <span>👥 {vibe.capacity}</span>
                    <span className="text-amber-400/90">⏱️ {vibe.turnover}</span>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-8 text-xl font-bold text-white">2. Confirm Booking Details</h2>
            <form className="mt-4 space-y-3" onSubmit={submitReservation}>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
                placeholder="Guest / VIP Name"
                value={form.customerName}
                onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Party Size</label>
                  <input
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                    type="number"
                    min="1"
                    max="20"
                    value={form.partySize}
                    onChange={(event) => setForm({ ...form, partySize: Number(event.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Arrival Time</label>
                  <input
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                    placeholder="HH:MM (e.g. 20:00)"
                    value={form.timeSlot}
                    onChange={(event) => setForm({ ...form, timeSlot: event.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 font-bold text-slate-950 transition hover:from-orange-400 hover:to-amber-400 shadow-xl shadow-orange-500/20"
              >
                🎟️ Confirm & Send Instant SMS Confirmation
              </button>
            </form>
            <p className="mt-4 text-xs font-medium text-amber-300">💬 {message}</p>
          </div>

          {/* Live Floor Status & Upcoming VIP Tables */}
          <div className={`${glassCard} p-6 lg:p-8 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">Floor Orchestration</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Live Dining Floor</h2>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  {reservations.length} Active VIP Bookings
                </span>
              </div>

              <div className="mt-6 space-y-3.5">
                {reservations.map((res, idx) => {
                  const isConfirmed = res.status === "Confirmed";
                  return (
                    <div key={res.id || idx} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-slate-700">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white text-base">{res.customerName}</p>
                            <span className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${isConfirmed ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                              {res.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs font-medium text-amber-300/90">{res.table}</p>
                          <p className="mt-1 text-[11px] text-slate-400">Party of {res.partySize} guests • Time: {res.timeSlot}</p>
                        </div>

                        <div className="text-right">
                          <span className="inline-block rounded-xl bg-slate-900 px-3 py-1 text-xs font-bold text-cyan-300 border border-slate-800">
                            ⏱️ AI Pacing: On Schedule
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-400">
              <p className="font-bold text-slate-200">🛡️ Manager Floor Note:</p>
              <p className="mt-1">
                When an arrival time slot is reached, our POS triggers tableside lighting presets and sends an automated alert to the assigned Floor Runner.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
