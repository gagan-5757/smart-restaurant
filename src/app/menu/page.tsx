"use client";

import Link from "next/link";
import { useState } from "react";
import { getMenuItems, toggleMenuAvailability } from "@/lib/restaurant-data";

const glassCard = "rounded-[32px] border border-white/10 bg-[#111827]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.45)]";

export default function MenuPage() {
  const [menu, setMenu] = useState(getMenuItems());
  const [message, setMessage] = useState("Toggle dish availability from this dedicated menu page.");

  function changeAvailability(id: string, available: boolean) {
    setMenu(toggleMenuAvailability(id, available));
    setMessage(available ? "Dish marked available." : "Dish marked unavailable.");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.10),_transparent_24%),linear-gradient(120deg,_#020617,_#111827_40%,_#0f172a)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className={`${glassCard} p-6`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Menu control</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Manage live dishes</h1>
              <p className="mt-3 text-sm text-slate-300">This separate page lets you update availability without touching the home screen.</p>
            </div>
            <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200">
              Back to home
            </Link>
          </div>
        </header>

        <section className={`${glassCard} p-6`}>
          <p className="text-sm text-slate-400">{message}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {menu.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-slate-400">{item.category}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.available ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"}`}>
                    {item.available ? "Available" : "Sold out"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-400">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-semibold text-white">₹{item.price.toFixed(2)}</p>
                  <button onClick={() => changeAvailability(item.id, !item.available)} className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    item.available
                      ? "border border-rose-400/50 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 hover:border-rose-400"
                      : "border border-emerald-400/50 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 hover:border-emerald-400"
                  }`}>
                    {item.available ? "Mark unavailable" : "Mark available"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
