"use client";

import Link from "next/link";
import { useState } from "react";
import { adjustPortionsLeft, getMenuItems, toggleMenuAvailability } from "@/lib/restaurant-data";

const glassCard = "rounded-[32px] border border-white/10 bg-[#111827]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.45)]";

export default function MenuPage() {
  const [menu, setMenu] = useState(getMenuItems());
  const [message, setMessage] = useState("🔥 Live Kitchen & Menu Orchestration: manage item availability and real-time portion scarcity.");
  const [aiPricingActive, setAiPricingActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  function changeAvailability(id: string, available: boolean) {
    setMenu(toggleMenuAvailability(id, available));
    setMessage(available ? "✓ Dish marked live and available to guests." : "⚠️ Dish marked sold out.");
  }

  function handlePortionChange(id: string, delta: number) {
    setMenu(adjustPortionsLeft(id, delta));
    setMessage(`🔄 Stock updated (+${delta} portions). Live inventory scarcity synced.`);
  }

  function triggerAiPriceOptimizer() {
    setAiPricingActive(!aiPricingActive);
    if (!aiPricingActive) {
      setMessage("🤖 AI Dynamic Pricing Active: Analyzed social media velocity. Recommended +₹20 surge on Smoky Tandoori Truffle Burger during 7-9 PM peak window.");
    } else {
      setMessage("🤖 AI Dynamic Pricing disabled. Standard base pricing restored.");
    }
  }

  const categories = ["All", "Viral Hits", "Secret Drops", "Insta Favorites", "Quick Bite", "Drinks"];
  const filteredMenu = selectedCategory === "All" ? menu : menu.filter((item) => item.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.12),_transparent_24%),linear-gradient(120deg,_#020617,_#111827_40%,_#0f172a)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className={`${glassCard} p-6 lg:p-8`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-300 border border-amber-400/30">
                  Silver & Gold Workflow
                </span>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300 border border-cyan-400/30">
                  Live Scarcity Engine
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Viral Menu Control Room</h1>
              <p className="mt-2 text-sm text-slate-300">
                Manage live dish status, adjust real-time remaining portion counts, and trigger AI dynamic pricing based on social hype velocity.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={triggerAiPriceOptimizer}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-lg ${aiPricingActive ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-emerald-500/30" : "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20"}`}
              >
                🤖 {aiPricingActive ? "AI Margin Optimizer: ON ✓" : "Activate AI Price Optimizer"}
              </button>
              <Link href="/" className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 transition">
                ⬅ Back to Home OS
              </Link>
            </div>
          </div>
        </header>

        {/* AI Dynamic Pricing Alert Banner */}
        {aiPricingActive && (
          <div className="rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-emerald-950/80 via-slate-950 to-emerald-950/80 p-5 shadow-xl animate-fadeIn flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                🤖 AI MARGIN RECOMMENDATION ACTIVE
              </span>
              <h3 className="mt-2 text-base font-bold text-white">Surge Pricing Forecasted for TikTok Viral Hits</h3>
              <p className="mt-1 text-xs text-slate-300">
                Smoky Tandoori Truffle Burger mentions increased by +340%. Recommending automatic +12% margin lift during 19:00–21:30 dinner rush. Predicted revenue lift: +₹4,800 tonight.
              </p>
            </div>
            <span className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 whitespace-nowrap">
              ✓ Automated in POS
            </span>
          </div>
        )}

        {/* Status Message & Filters */}
        <section className={`${glassCard} p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
            <p className="text-xs font-medium text-amber-300 flex items-center gap-1.5">
              <span>💬</span> {message}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${selectedCategory === cat ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMenu.map((item) => {
              const isSoldOut = !item.available || (item.portionsLeft !== undefined && item.portionsLeft <= 0);
              const dynamicPrice = aiPricingActive && item.viralScore && item.viralScore > 95 ? item.price + 20 : item.price;
              return (
                <div key={item.id} className={`flex flex-col justify-between rounded-3xl border p-5 transition ${isSoldOut ? "border-rose-500/30 bg-slate-950/40 opacity-75" : "border-slate-800 bg-slate-950/80 hover:border-slate-700 shadow-xl"}`}>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold text-amber-300 border border-white/10">
                        {item.tag || item.category}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isSoldOut ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"}`}>
                        {isSoldOut ? "Sold out" : "Live in POS"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white">{item.name}</h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.description}</p>
                    
                    {item.socialProof && (
                      <p className="mt-3 text-[11px] font-medium text-cyan-300">✨ {item.socialProof}</p>
                    )}
                  </div>

                  <div className="mt-5 space-y-4 border-t border-white/10 pt-4">
                    {/* Price & Scarcity Tracker */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl font-extrabold text-white">₹{dynamicPrice}</span>
                          {aiPricingActive && dynamicPrice !== item.price && (
                            <span className="text-[10px] line-through text-slate-500">₹{item.price}</span>
                          )}
                        </div>
                        <span className="text-[10px] uppercase text-slate-500">Prep: {item.prepTime || "10 mins"}</span>
                      </div>

                      {/* Stock Adjuster */}
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
                        <button
                          onClick={() => handlePortionChange(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-500/30 text-white font-bold flex items-center justify-center text-xs transition"
                          title="Decrease portions"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-amber-300 min-w-[32px] text-center">
                          {item.portionsLeft ?? 10}
                        </span>
                        <button
                          onClick={() => handlePortionChange(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-emerald-500/30 text-white font-bold flex items-center justify-center text-xs transition"
                          title="Add stock batch"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => changeAvailability(item.id, !item.available)}
                      className={`w-full rounded-xl py-2.5 text-xs font-bold transition ${
                        item.available
                          ? "border border-rose-500/50 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                          : "border border-emerald-500/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                      }`}
                    >
                      {item.available ? "🛑 Mark Item Sold Out" : "✓ Restore Dish to Menu"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
