"use client";

import Link from "next/link";
import { useState } from "react";
import { createReservation, getReservations } from "@/lib/restaurant-data";

const glassCard = "rounded-[32px] border border-white/10 bg-[#111827]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.45)]";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState(getReservations());
  const [form, setForm] = useState({ customerName: "", partySize: 2, timeSlot: "19:00", table: "Terrace 2" });
  const [message, setMessage] = useState("Create a reservation for the upcoming service window.");

  function submitReservation(event: React.FormEvent) {
    event.preventDefault();
    const reservation = createReservation(form);
    setReservations((current) => [reservation, ...current]);
    setForm({ customerName: "", partySize: 2, timeSlot: "19:00", table: "Terrace 2" });
    setMessage(`Reservation confirmed for ${reservation.customerName}.`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.10),_transparent_24%),linear-gradient(120deg,_#020617,_#111827_40%,_#0f172a)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className={`${glassCard} p-6`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Guest reservations</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Reserve and manage tables</h1>
              <p className="mt-3 text-sm text-slate-300">This dedicated page handles guest reservations end to end.</p>
            </div>
            <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200">
              Back to home
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className={`${glassCard} p-6`}>
            <h2 className="text-xl font-semibold text-white">New reservation</h2>
            <form className="mt-4 grid gap-3" onSubmit={submitReservation}>
              <input className="rounded-2xl border border-slate-600/70 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-400 transition-all duration-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30" placeholder="Customer name" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} required />
              <input className="rounded-2xl border border-slate-600/70 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-400 transition-all duration-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30" type="number" min="1" placeholder="Party size" value={form.partySize} onChange={(event) => setForm({ ...form, partySize: Number(event.target.value) })} />
              <input className="rounded-2xl border border-slate-600/70 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-400 transition-all duration-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30" placeholder="Time slot (HH:MM)" value={form.timeSlot} onChange={(event) => setForm({ ...form, timeSlot: event.target.value })} required />
              <input className="rounded-2xl border border-slate-600/70 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-400 transition-all duration-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30" placeholder="Table" value={form.table} onChange={(event) => setForm({ ...form, table: event.target.value })} required />
              <button className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-orange-400 active:scale-95">Create reservation</button>
            </form>
            <p className="mt-3 text-sm text-slate-400">{message}</p>
          </div>

          <div className={`${glassCard} p-6`}>
            <h2 className="text-xl font-semibold text-white">Upcoming reservations</h2>
            <div className="mt-4 space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">{reservation.customerName}</p>
                    <p className="text-sm text-slate-400">Party {reservation.partySize} • {reservation.timeSlot} • {reservation.table}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">{reservation.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
