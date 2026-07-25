"use client";

import Link from "next/link";
import { useState } from "react";
import { createOrder, getMenuItems, getOrders } from "@/lib/restaurant-data";

const glassCard = "rounded-[32px] border border-white/10 bg-[#111827]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.45)]";

export default function OrdersPage() {
  const [menu] = useState(getMenuItems());
  const [orders, setOrders] = useState(getOrders());
  const [customer, setCustomer] = useState("Aarav");
  const [channel, setChannel] = useState<"Dine-in" | "Takeaway" | "Online">("Dine-in");
  const [selectedItems, setSelectedItems] = useState<Array<{ id: string; name: string; qty: number; price: number }>>([]);
  const [message, setMessage] = useState("Build an order from the menu below.");

  function addItem(item: { id: string; name: string; price: number }) {
    setSelectedItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) => (entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry));
      }
      return [...current, { id: item.id, name: item.name, qty: 1, price: item.price }];
    });
  }

  function submitOrder(event: React.FormEvent) {
    event.preventDefault();
    if (selectedItems.length === 0) {
      setMessage("Add at least one item before placing the order.");
      return;
    }
    const order = createOrder({ customer, items: selectedItems, channel });
    setOrders((current) => [order, ...current]);
    setSelectedItems([]);
    setMessage(`Order placed for ${order.customer}.`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.10),_transparent_24%),linear-gradient(120deg,_#020617,_#111827_40%,_#0f172a)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className={`${glassCard} p-6`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Order studio</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Create a new order</h1>
              <p className="mt-3 text-sm text-slate-300">This page offers a dedicated ordering experience with its own form and queue.</p>
            </div>
            <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200">
              Back to home
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className={`${glassCard} p-6`}>
            <h2 className="text-xl font-semibold text-white">Pick dishes</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {menu.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-slate-400">{item.category}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.available ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"}`}>
                      {item.available ? "Live" : "Sold out"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">₹{item.price.toFixed(2)}</p>
                    <button onClick={() => addItem(item)} className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 transition-all duration-200 hover:bg-emerald-500/30 hover:border-emerald-400">
                      Add to order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${glassCard} p-6`}>
              <h2 className="text-xl font-semibold text-white">Order details</h2>
              <form className="mt-4 space-y-3" onSubmit={submitOrder}>
                <input className="w-full rounded-2xl border border-slate-600/70 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-400 transition-all duration-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30" value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Customer name" required />
                <select className="w-full rounded-2xl border border-slate-600/70 bg-slate-900/50 px-4 py-3 text-white transition-all duration-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30" value={channel} onChange={(event) => setChannel(event.target.value as "Dine-in" | "Takeaway" | "Online") }>
                  <option value="Dine-in">Dine-in</option>
                  <option value="Takeaway">Takeaway</option>
                  <option value="Online">Online</option>
                </select>
                <button className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition-all duration-200 hover:bg-cyan-400 active:scale-95">Place order</button>
              </form>
              <p className="mt-3 text-sm text-slate-400">{message}</p>
            </div>

            <div className={`${glassCard} p-6`}>
              <h2 className="text-xl font-semibold text-white">Current basket</h2>
              <div className="mt-4 space-y-3">
                {selectedItems.length === 0 ? (
                  <p className="text-sm text-slate-400">No items selected yet.</p>
                ) : (
                  selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                      <span className="text-slate-300">{item.name} × {item.qty}</span>
                      <span className="text-sm text-slate-400">₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={`${glassCard} p-6`}>
          <h2 className="text-xl font-semibold text-white">Recent orders</h2>
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">{order.customer}</p>
                  <p className="text-sm text-slate-400">{order.channel} • {order.items.map((item) => item.name).join(", ")}</p>
                </div>
                <span className="text-sm text-slate-400">₹{order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
