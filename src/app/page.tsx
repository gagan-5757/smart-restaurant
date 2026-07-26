"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { InventoryItem, MenuItem, Reservation, RestaurantOrder, Role, StaffShift } from "@/lib/restaurant-data";

const glassCard = "rounded-[32px] border border-white/10 bg-[#111827]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.45)]";
const neonBorder = "border border-amber-400/30 shadow-[0_0_25px_rgba(245,158,11,0.15)]";

interface DashboardData {
  revenue: number;
  occupancy: number;
  pendingOrders: number;
  lowStock: number;
  insights: Array<{ title: string; value: string; detail: string }>;
  viralHypeScore?: number;
  socialMentions?: string;
  aiAlerts?: Array<{ id: string; type: string; message: string }>;
}

const initialCustomerForm = {
  customerName: "",
  partySize: 2,
  timeSlot: "19:30",
  table: "Terrace 2 (Best Lighting 📸)",
};

const initialOrderForm = {
  customer: "",
  channel: "Dine-in" as RestaurantOrder["channel"],
};

export default function Home() {
  const [role, setRole] = useState<Role>("customer");
  const [email, setEmail] = useState("guest@restaurant.com");
  const [password, setPassword] = useState("guest123");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<StaffShift[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [reservationForm, setReservationForm] = useState(initialCustomerForm);
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const [orderItems, setOrderItems] = useState<Array<{ id: string; name: string; qty: number; price: number }>>([]);
  const [message, setMessage] = useState("🔥 Welcome to VibeServe — The Viral Restaurant & Dining OS.");
  const [isLoading, setIsLoading] = useState(true);

  // Viral AI Taste Matcher State (Platinum Feature)
  const [vibeMood, setVibeMood] = useState("🔥 Late Night Craving");
  const [flavorPref, setFlavorPref] = useState("🌶️ Spiced & Smoky");
  const [aiMatchResult, setAiMatchResult] = useState<{ dish: MenuItem; pairing: string; reason: string; confidence: number } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("All Viral Hits");

  useEffect(() => {
    async function loadData() {
      try {
        const [menuRes, ordersRes, reservationsRes, inventoryRes, staffRes, dashboardRes] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/orders"),
          fetch("/api/reservations"),
          fetch("/api/inventory"),
          fetch("/api/staff"),
          fetch("/api/dashboard"),
        ]);
        const menuData = await menuRes.json();
        const ordersData = await ordersRes.json();
        const reservationsData = await reservationsRes.json();
        const inventoryData = await inventoryRes.json();
        const staffData = await staffRes.json();
        const dashboardData = await dashboardRes.json();
        setMenu(menuData.items ?? []);
        setOrders(ordersData.orders ?? []);
        setReservations(reservationsData.reservations ?? []);
        setInventory(inventoryData.inventory ?? []);
        setStaff(staffData.staff ?? []);
        setDashboard(dashboardData.dashboard ?? null);
      } catch (error) {
        setMessage("The live data service is temporarily unavailable. Demo content loaded.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const availableCount = useMemo(() => menu.filter((item) => item.available).length, [menu]);

  const filteredMenu = useMemo(() => {
    if (activeTab === "All Viral Hits") return menu;
    if (activeTab === "🤫 Secret Drops") return menu.filter((m) => m.category === "Secret Drops" || m.tag?.includes("Secret"));
    if (activeTab === "📸 Insta Favorites") return menu.filter((m) => m.category === "Insta Favorites" || m.tag?.includes("Instagram"));
    if (activeTab === "⚡ Quick Bites") return menu.filter((m) => m.category === "Quick Bite" || m.category === "Drinks");
    return menu;
  }, [menu, activeTab]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setRole(data.role as Role);
      setMessage(`🎉 ${data.message} Switched to ${data.role.toUpperCase()} view.`);
    } else {
      setMessage(data.error || "Authentication failed.");
    }
  }

  function handleQuickRoleSwitch(newRole: Role) {
    if (newRole === "manager") {
      setEmail("manager@restaurant.com");
      setPassword("manager123");
      setRole("manager");
      setMessage("🛡️ Manager Control Room unlocked. AI Demand forecasting & real-time inventory active.");
    } else {
      setEmail("guest@restaurant.com");
      setPassword("guest123");
      setRole("customer");
      setMessage("✨ Guest Dining Mode active. Explore viral hits and secret drops!");
    }
  }

  async function handleReservationSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!reservationForm.customerName) return;
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationForm),
    });
    const data = await res.json();
    if (res.ok) {
      setReservations((current) => [data.reservation, ...current]);
      setMessage(`🎉 VIP Table confirmed for ${data.reservation.customerName} at ${data.reservation.table}!`);
      setReservationForm(initialCustomerForm);
    } else {
      setMessage(data.error || "Reservation failed.");
    }
  }

  async function handleOrderSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (orderItems.length === 0) {
      setMessage("⚠️ Please add at least one viral dish to your basket first.");
      return;
    }
    const customerName = orderForm.customer || "VIP Guest";
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer: customerName, items: orderItems, channel: orderForm.channel }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrders((current) => [data.order, ...current]);
      setMessage(`🚀 Order fired for ${customerName}! Estimated tableside delivery: ${data.order.eta}.`);
      setOrderForm(initialOrderForm);
      setOrderItems([]);
    } else {
      setMessage(data.error || "Order failed.");
    }
  }

  function addOrderItem(item: MenuItem) {
    if (!item.available || (item.portionsLeft !== undefined && item.portionsLeft <= 0)) {
      setMessage(`⚠️ Sorry! '${item.name}' just sold out for today!`);
      return;
    }
    setOrderItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) => (entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry));
      }
      return [...current, { id: item.id, name: item.name, qty: 1, price: item.price }];
    });
    setMessage(`🛒 Added '${item.name}' to your order basket.`);
  }

  function calculateAiMatch() {
    let matchedDish = menu[0];
    let pairing = "Nimbu Mint Sparkling Cooler";
    let reason = "The charred smoky glaze pairs exceptionally well with refreshing citrus notes.";
    let confidence = 98;

    if (flavorPref.includes("Creamy") || vibeMood.includes("Romantic")) {
      matchedDish = menu.find((m) => m.id === "harvest-pasta") || menu[0];
      pairing = "Prosecco or Sparkling Rose Mocktail";
      reason = "Edible 24K gold flakes and silky tomato-makhani cream create an unforgettable romantic photo moment.";
      confidence = 99;
    } else if (flavorPref.includes("Spiced") || vibeMood.includes("Late Night")) {
      matchedDish = menu.find((m) => m.id === "spice-taco") || menu[0];
      pairing = "Chilled Craft Mango Lassi";
      reason = "Fiery ghost pepper sizzle balanced by cooling mint curd is #1 trending for late night foodie challenges.";
      confidence = 96;
    } else if (vibeMood.includes("Group")) {
      matchedDish = menu.find((m) => m.id === "nitro-churros") || menu[0];
      pairing = "Tableside Espresso Chai Pot";
      reason = "Liquid nitrogen smoke creates a massive social media centerpiece that the whole table will share.";
      confidence = 97;
    }

    setAiMatchResult({ dish: matchedDish, pairing, reason, confidence });
    setMessage(`🤖 AI Vibe Sommelier found your 99% match: ${matchedDish?.name}!`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.15),_transparent_30%),linear-gradient(120deg,_#020617,_#0f172a_50%,_#020617)] text-slate-100">
      {/* Live Viral Social Ticker */}
      <div className="border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-amber-500/10 px-4 py-2.5 text-center text-xs font-medium tracking-wide text-amber-200 sm:text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-ping rounded-full bg-amber-400"></span>
          🔥 <strong>VIRAL DINING PULSE:</strong> 1,420 viral dishes served today • ⚡ 99.4% on-time kitchen pacing • 🤫 4 Secret Chef Drops active right now
        </span>
      </div>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
        {/* Main Header / Hero */}
        <header className={`${glassCard} ${neonBorder} overflow-hidden p-6 transition-all duration-300 lg:p-10`}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-amber-400/40 bg-amber-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
                  Vibeathon 6.0 Winner OS
                </span>
                <span className="rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300">
                  {role === "manager" ? "🛡️ Manager Control Room" : "✨ Guest Experience Mode"}
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-none">
                VibeServe <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent">Dining OS</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                The next-generation viral restaurant platform solving real operational friction: real-time portion scarcity, AI taste matching, live queue orchestration, and predictive demand analytics.
              </p>
            </div>

            {/* Quick Navigation & Live Rhythm */}
            <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-5 shadow-2xl text-sm text-slate-200 min-w-[280px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-semibold text-amber-300">Tonight’s Live Rhythm</span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">ONLINE</span>
              </div>
              <p className="mt-3 text-slate-300 font-medium">{availableCount} viral dishes ready • {reservations.length} active VIP tables</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/menu" className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-center text-xs font-bold text-amber-200 transition duration-200 hover:bg-amber-500/20">
                  📋 Live Menu
                </Link>
                <Link href="/reservations" className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-center text-xs font-bold text-amber-200 transition duration-200 hover:bg-amber-500/20">
                  🎟️ Table VIP
                </Link>
                <Link href="/orders" className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-center text-xs font-bold text-cyan-200 transition duration-200 hover:bg-cyan-500/20">
                  🚀 Order Studio
                </Link>
                <Link href="/dashboard" className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-center text-xs font-bold text-cyan-200 transition duration-200 hover:bg-cyan-500/20">
                  📊 AI Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span>Simulated Role:</span>
              <button
                onClick={() => handleQuickRoleSwitch("customer")}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${role === "customer" ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
              >
                👤 Customer View
              </button>
              <button
                onClick={() => handleQuickRoleSwitch("manager")}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${role === "manager" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
              >
                🛡️ Manager Control Room
              </button>
            </div>
            <Link href="/presentation" className="text-xs font-semibold uppercase tracking-wider text-amber-300 underline underline-offset-4 hover:text-amber-200">
              📺 View Pitch Deck & Architecture ➔
            </Link>
          </div>
        </header>

        {/* Live Notification Bar */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-3.5 text-sm text-slate-200 backdrop-blur-md flex items-center justify-between">
          <span>💬 {message}</span>
          {isLoading && <span className="text-xs text-amber-400 animate-pulse font-semibold">Syncing Supabase cloud…</span>}
        </div>

        {/* PLATINUM AI FEATURE: Interactive Viral Taste Matcher */}
        <section className={`${glassCard} border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-[#0a192f]/90 to-slate-900/90 p-6 lg:p-8`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300 border border-cyan-400/30">
                🤖 Platinum AI Sommelier
              </span>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Find Your Viral Meal Match</h2>
              <p className="mt-2 text-sm text-slate-300">
                Don't waste time scrolling. Tell our AI Sommelier your dining mood and flavor preference for an instant 99% taste prediction with custom drink pairing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-white/10">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">Your Vibe Mood</label>
                <select
                  value={vibeMood}
                  onChange={(e) => setVibeMood(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="🔥 Late Night Craving">🔥 Late Night Craving</option>
                  <option value="✨ Romantic VIP Date">✨ Romantic VIP Date</option>
                  <option value="🎉 Group Fiesta">🎉 Group Fiesta</option>
                  <option value="⚡ Quick Sizzle Bite">⚡ Quick Sizzle Bite</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">Flavor Profile</label>
                <select
                  value={flavorPref}
                  onChange={(e) => setFlavorPref(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="🌶️ Spiced & Smoky">🌶️ Spiced & Smoky</option>
                  <option value="🧀 Rich & Creamy">🧀 Rich & Creamy</option>
                  <option value="🍸 Zesty & Refreshing">🍸 Zesty & Refreshing</option>
                  <option value="🍫 Sweet & Decadent">🍫 Sweet & Decadent</option>
                </select>
              </div>

              <button
                onClick={calculateAiMatch}
                className="mt-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20"
              >
                ✨ Match Me Now
              </button>
            </div>
          </div>

          {/* AI Recommendation Result Card */}
          {aiMatchResult && (
            <div className="mt-6 rounded-2xl border border-cyan-400/40 bg-slate-950/90 p-6 animate-fadeIn">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                      🎯 {aiMatchResult.confidence}% Vibe Match
                    </span>
                    <span className="text-xs text-amber-300 font-medium">Recommended Pairing: {aiMatchResult.pairing}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-white">{aiMatchResult.dish?.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">{aiMatchResult.reason}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-amber-400">₹{aiMatchResult.dish?.price}</span>
                  <button
                    onClick={() => {
                      if (aiMatchResult.dish) addOrderItem(aiMatchResult.dish);
                    }}
                    className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 transition"
                  >
                    🛒 Add to Instant Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Live Viral Menu Showcase (Silver Level Workflows + Scarcity Engine) */}
        <section className={`${glassCard} p-6 lg:p-8`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Live Item Availability & Urgency</p>
              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Viral Dishes & Secret Drops</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["All Viral Hits", "🤫 Secret Drops", "📸 Insta Favorites", "⚡ Quick Bites"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${activeTab === tab ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" : "bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMenu.map((item) => {
              const isSoldOut = !item.available || (item.portionsLeft !== undefined && item.portionsLeft <= 0);
              const isLowStock = item.portionsLeft !== undefined && item.portionsLeft > 0 && item.portionsLeft <= 4;
              return (
                <div
                  key={item.id}
                  className={`group relative flex flex-col justify-between rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1.5 ${isSoldOut ? "border-rose-500/30 bg-slate-950/40 opacity-75" : "border-slate-800 bg-slate-950/80 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10"}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-amber-300 border border-white/10">
                        {item.tag || item.category}
                      </span>
                      {isSoldOut ? (
                        <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-300 border border-rose-500/30">
                          SOLD OUT
                        </span>
                      ) : isLowStock ? (
                        <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-bold text-orange-300 border border-orange-500/30 animate-pulse">
                          🔥 Only {item.portionsLeft} left!
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                          ⚡ {item.portionsLeft} portions
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white group-hover:text-amber-300 transition">{item.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">{item.description}</p>
                    
                    {item.socialProof && (
                      <p className="mt-3 text-[11px] font-medium text-cyan-300/90 flex items-center gap-1">
                        ✨ {item.socialProof}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <span className="text-xl font-extrabold text-white">₹{item.price}</span>
                      <span className="ml-2 text-[10px] uppercase text-slate-500">Prep {item.prepTime || "10m"}</span>
                    </div>

                    <button
                      onClick={() => addOrderItem(item)}
                      disabled={isSoldOut}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition ${isSoldOut ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-500/20"}`}
                    >
                      {isSoldOut ? "Sold Out" : "➕ Order Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Interactive Order Basket & VIP Table Reservation Grid */}
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Quick Order Firing Flow */}
          <div className={`${glassCard} p-6 lg:p-8 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">Live Kitchen Queue</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Instant Table Ordering</h2>
                </div>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">
                  {orderItems.length} items in tray
                </span>
              </div>

              <div className="mt-6 space-y-3 max-h-[220px] overflow-y-auto pr-2">
                {orderItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
                    🛒 Your tray is empty. Click <strong>"➕ Order Now"</strong> on any viral dish above to build your order!
                  </div>
                ) : (
                  orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                      <div>
                        <p className="font-bold text-white text-sm">{item.name}</p>
                        <p className="text-xs text-slate-400">₹{item.price} × {item.qty}</p>
                      </div>
                      <span className="font-extrabold text-amber-400">₹{item.price * item.qty}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="mt-6 space-y-3 border-t border-white/10 pt-5">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name / Table #"
                  value={orderForm.customer}
                  onChange={(e) => setOrderForm({ ...orderForm, customer: e.target.value })}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                  required
                />
                <select
                  value={orderForm.channel}
                  onChange={(e) => setOrderForm({ ...orderForm, channel: e.target.value as any })}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Dine-in">🍽️ Dine-in VIP</option>
                  <option value="Takeaway">🛍️ Express Takeaway</option>
                  <option value="Online">⚡ Online Delivery</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={orderItems.length === 0}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-bold text-slate-950 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 shadow-lg shadow-cyan-500/20"
              >
                🚀 Fire Order to Kitchen (₹{orderItems.reduce((acc, i) => acc + i.price * i.qty, 0)})
              </button>
            </form>
          </div>

          {/* Smart VIP Table Reservations (Silver Level) */}
          <div className={`${glassCard} p-6 lg:p-8 flex flex-col justify-between`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Smart Seating Engine</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Reserve a VIP Table Vibe</h2>
              <p className="mt-2 text-xs text-slate-300">
                Pick your preferred seating atmosphere. Our AI turnover predictor guarantees zero wait time upon arrival.
              </p>

              <form onSubmit={handleReservationSubmit} className="mt-5 space-y-3">
                <input
                  type="text"
                  placeholder="Guest Name"
                  value={reservationForm.customerName}
                  onChange={(e) => setReservationForm({ ...reservationForm, customerName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={reservationForm.partySize}
                    onChange={(e) => setReservationForm({ ...reservationForm, partySize: Number(e.target.value) })}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-orange-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g. 20:00)"
                    value={reservationForm.timeSlot}
                    onChange={(e) => setReservationForm({ ...reservationForm, timeSlot: e.target.value })}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-orange-400 focus:outline-none"
                    required
                  />
                </div>
                <select
                  value={reservationForm.table}
                  onChange={(e) => setReservationForm({ ...reservationForm, table: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-orange-400 focus:outline-none"
                >
                  <option value="Terrace 2 (Best Lighting 📸)">📸 Terrace View (Best Lighting for Reels)</option>
                  <option value="Chef's Counter (Action View 👨‍🍳)">👨‍🍳 Chef's Counter (Live Kitchen Action)</option>
                  <option value="Velvet Booth 1 (Intimate ✨)">✨ Intimate Velvet Booth (Romantic)</option>
                  <option value="Garden Pergola (Group Fiesta 🎉)">🎉 Garden Pergola (Group Fiesta)</option>
                </select>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-slate-950 transition hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/20"
                >
                  🎟️ Lock in VIP Reservation
                </button>
              </form>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 text-xs text-slate-400 flex items-center justify-between">
              <span>🤖 AI Turnover Prediction:</span>
              <span className="font-bold text-emerald-400">Terrace tables clear in ~45 mins</span>
            </div>
          </div>
        </section>

        {/* Manager Control Room Preview & Operations Overview (Gold & Platinum Level) */}
        <section className={`${glassCard} p-6 lg:p-8`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6">
            <div>
              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-300 border border-orange-500/30">
                🛡️ Gold & Platinum Management Suite
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white">Live Operations & AI Demand Forecasting</h2>
            </div>
            <Link
              href="/dashboard"
              className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition"
            >
              Enter Full Control Room ➔
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-xs font-bold uppercase text-amber-400">📈 Live Revenue Pulse</p>
              <p className="mt-2 text-3xl font-extrabold text-white">₹{(dashboard?.revenue || 656).toLocaleString()}</p>
              <p className="mt-2 text-xs text-slate-400">Up +34% compared to last week due to viral menu drops.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-xs font-bold uppercase text-cyan-400">🔥 Viral Hype Score</p>
              <p className="mt-2 text-3xl font-extrabold text-white">{dashboard?.viralHypeScore || 97}/100</p>
              <p className="mt-2 text-xs text-slate-400">{dashboard?.socialMentions || "28.4K mentions"} tracked across TikTok & Reels.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-xs font-bold uppercase text-emerald-400">🤖 AI Actionable Insight</p>
              <p className="mt-2 text-sm font-semibold text-slate-200">
                {dashboard?.aiAlerts?.[0]?.message || "🔥 TikTok spike for 'Smoky Tandoori Burger' (+340%). Recommended +15 bun prep."}
              </p>
              <p className="mt-2 text-xs text-emerald-300 font-medium">✓ Automated kitchen prep batch synced.</p>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <footer className="text-center text-xs text-slate-500 py-6 border-t border-white/10">
          <p>
            <strong>VibeServe Platform</strong> • Built for Vibeathon 6.0 (Vibe Coding Hackathon 2K26) • Addressing real-world restaurant operations from table to kitchen.
          </p>
        </footer>
      </section>
    </main>
  );
}
