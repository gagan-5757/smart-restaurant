"use client";

import Link from "next/link";
import { useState } from "react";
import { createOrder, getMenuItems, getOrders, updateOrderStage } from "@/lib/restaurant-data";
import type { RestaurantOrder } from "@/lib/restaurant-data";

const glassCard = "rounded-[32px] border border-white/10 bg-[#111827]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.45)]";

export default function OrdersPage() {
  const [menu, setMenu] = useState(getMenuItems());
  const [orders, setOrders] = useState(getOrders());
  const [customer, setCustomer] = useState("VIP Guest");
  const [channel, setChannel] = useState<"Dine-in" | "Takeaway" | "Online">("Dine-in");
  const [selectedItems, setSelectedItems] = useState<Array<{ id: string; name: string; qty: number; price: number }>>([]);
  const [message, setMessage] = useState("🔥 Fire orders directly to our live kitchen queue with real-time ETA pacing.");

  function addItem(item: { id: string; name: string; price: number; available: boolean; portionsLeft?: number }) {
    if (!item.available || (item.portionsLeft !== undefined && item.portionsLeft <= 0)) {
      setMessage(`⚠️ Sorry! '${item.name}' is currently sold out!`);
      return;
    }
    setSelectedItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) => (entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry));
      }
      return [...current, { id: item.id, name: item.name, qty: 1, price: item.price }];
    });
    setMessage(`🛒 Added '${item.name}' to your order tray.`);
  }

  function submitOrder(event: React.FormEvent) {
    event.preventDefault();
    if (selectedItems.length === 0) {
      setMessage("⚠️ Please select at least one viral dish before placing an order.");
      return;
    }
    const order = createOrder({ customer, items: selectedItems, channel });
    setOrders((current) => [order, ...current]);
    setMenu(getMenuItems()); // refresh portions left
    setSelectedItems([]);
    setMessage(`🚀 Order fired for ${order.customer}! Estimated kitchen ETA: ${order.eta}.`);
  }

  function advanceOrderStage(id: string, currentStatus: RestaurantOrder["status"]) {
    let nextStatus: RestaurantOrder["status"] = "Ready";
    if (currentStatus === "Preparing") nextStatus = "Ready";
    else if (currentStatus === "Ready") nextStatus = "Delivered";
    else return;

    setOrders(updateOrderStage(id, nextStatus));
    setMessage(`⚡ Kitchen Status Updated: Order #${id} advanced to '${nextStatus}'!`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_24%),linear-gradient(120deg,_#020617,_#111827_40%,_#0f172a)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
        <header className={`${glassCard} p-6 lg:p-8`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300 border border-cyan-400/30">
                  Order Orchestration
                </span>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-300 border border-amber-400/30">
                  Live Kitchen ETA
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Viral Order Studio & Queue</h1>
              <p className="mt-2 text-sm text-slate-300">
                Place multi-channel orders (Dine-in, Takeaway, Online) and track live kitchen stage progression in real time.
              </p>
            </div>
            <Link href="/" className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 transition">
              ⬅ Back to Home OS
            </Link>
          </div>
        </header>

        {/* Gamified Upsell Banner */}
        <div className="rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950/80 via-slate-950 to-cyan-950/80 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
              ⚡ GAMIFIED KITCHEN PRIORITY
            </span>
            <p className="mt-2 text-sm font-bold text-white">
              Add any <span className="text-amber-400">Viral Dessert (Nitro Churros)</span> to unlock Priority VIP Kitchen Prep!
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Priority routing cuts estimated tableside wait time by up to 50% during peak service hours.
            </p>
          </div>
          <span className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 whitespace-nowrap">
            🚀 Fast-Track Active
          </span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Menu Selection */}
          <div className={`${glassCard} p-6 lg:p-8`}>
            <h2 className="text-xl font-bold text-white">1. Select Dishes to Fire</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {menu.map((item) => {
                const isSoldOut = !item.available || (item.portionsLeft !== undefined && item.portionsLeft <= 0);
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col justify-between rounded-2xl border p-4 transition ${isSoldOut ? "border-rose-500/30 bg-slate-950/40 opacity-75" : "border-slate-800 bg-slate-950/70 hover:border-cyan-400/50"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-white/10">
                          {item.tag || item.category}
                        </span>
                        <span className={`text-[10px] font-bold ${isSoldOut ? "text-rose-400" : "text-emerald-400"}`}>
                          {isSoldOut ? "SOLD OUT" : `${item.portionsLeft ?? 10} portions left`}
                        </span>
                      </div>
                      <h3 className="mt-2 font-bold text-white text-base">{item.name}</h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-lg font-extrabold text-white">₹{item.price}</span>
                      <button
                        onClick={() => addItem(item)}
                        disabled={isSoldOut}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${isSoldOut ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20"}`}
                      >
                        {isSoldOut ? "Sold Out" : "➕ Add to Tray"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Form & Basket */}
          <div className="space-y-8">
            <div className={`${glassCard} p-6 lg:p-8`}>
              <h2 className="text-xl font-bold text-white">2. Guest Details & Channel</h2>
              <form className="mt-4 space-y-3" onSubmit={submitOrder}>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  placeholder="Guest Name or Table #"
                  required
                />
                <select
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  value={channel}
                  onChange={(event) => setChannel(event.target.value as any)}
                >
                  <option value="Dine-in">🍽️ Dine-in VIP</option>
                  <option value="Takeaway">🛍️ Express Takeaway</option>
                  <option value="Online">⚡ Online Delivery</option>
                </select>
                <button
                  type="submit"
                  disabled={selectedItems.length === 0}
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-slate-950 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 shadow-xl shadow-cyan-500/20"
                >
                  🚀 Fire Order to Kitchen (₹{selectedItems.reduce((acc, i) => acc + i.price * i.qty, 0)})
                </button>
              </form>
              <p className="mt-3 text-xs font-medium text-cyan-300">💬 {message}</p>
            </div>

            <div className={`${glassCard} p-6 lg:p-8`}>
              <h2 className="text-xl font-bold text-white">Current Tray Basket</h2>
              <div className="mt-4 space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                {selectedItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No items selected yet. Click any dish on the left to begin.</p>
                ) : (
                  selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5">
                      <span className="text-slate-200 text-sm font-medium">{item.name} × {item.qty}</span>
                      <span className="text-sm font-bold text-amber-400">₹{item.price * item.qty}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Live Kitchen Order Queue with Visual Stage Progression (Silver & Gold Level) */}
        <section className={`${glassCard} p-6 lg:p-8`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Real-Time Kitchen Orchestration</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Live Order Progression Queue</h2>
            </div>
            <span className="rounded-full bg-orange-500/20 px-3.5 py-1 text-xs font-bold text-orange-300 border border-orange-500/30">
              {orders.filter((o) => o.status !== "Delivered").length} Active Kitchen Orders
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {orders.map((order) => {
              const isPrep = order.status === "Preparing";
              const isReady = order.status === "Ready";
              const isDelivered = order.status === "Delivered";

              return (
                <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-slate-700">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-lg">#{order.id}</span>
                        <span className="font-bold text-slate-200 text-base">• {order.customer}</span>
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">{order.channel}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        Dishes: <strong className="text-slate-200">{order.items.map((i) => `${i.name} (${i.qty})`).join(", ")}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-white">₹{order.total}</p>
                        <p className="text-xs text-cyan-300 font-medium">ETA: {order.eta}</p>
                      </div>

                      {/* Interactive Stage Button for Kitchen Managers */}
                      <button
                        onClick={() => advanceOrderStage(order.id, order.status)}
                        disabled={isDelivered}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-md ${
                          isPrep
                            ? "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20"
                            : isReady
                            ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                        title="Click to advance order stage in POS"
                      >
                        {isPrep ? "⚡ Sizzling ➔ Mark Ready" : isReady ? "🍽️ Ready ➔ Mark Delivered" : "✓ Delivered"}
                      </button>
                    </div>
                  </div>

                  {/* Visual Stage Progression Bar */}
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-center text-[11px] font-bold">
                    <div className={`rounded-lg py-1 transition ${isPrep || isReady || isDelivered ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-900 text-slate-600"}`}>
                      1. Kitchen Fired ✓
                    </div>
                    <div className={`rounded-lg py-1 transition ${isReady || isDelivered ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-slate-900 text-slate-600"}`}>
                      2. Plated & Ready {isReady || isDelivered ? "✓" : "⏳"}
                    </div>
                    <div className={`rounded-lg py-1 transition ${isDelivered ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-900 text-slate-600"}`}>
                      3. Table Served {isDelivered ? "✓" : "⏳"}
                    </div>
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
