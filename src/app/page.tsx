"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { InventoryItem, MenuItem, Reservation, RestaurantOrder, Role, StaffShift } from "@/lib/restaurant-data";
import PaymentModal from "@/components/PaymentModal";
import ChatWidget from "@/components/ChatWidget";

// Glassmorphism & Aesthetics inspired by DelishDrop Viral Food Design
const glassPanel = "rounded-[32px] border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)]";
const darkGreenBg = "bg-[#0B2416] text-white";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("Burgers & Fries");

  // Glassmorphic Modal State for Full Dish Details & Making-Of Story
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [modalChannel, setModalChannel] = useState<RestaurantOrder["channel"]>("Takeaway");

  // Payment Modal State
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [paymentPendingOrder, setPaymentPendingOrder] = useState<null | (() => void)>(null);

  // Auth state from sessionStorage
  const [authedUser, setAuthedUser] = useState<{ name: string; phone: string } | null>(null);
  useEffect(() => {
    const stored = sessionStorage.getItem("vibeserve_user");
    if (stored) setAuthedUser(JSON.parse(stored));
  }, []);

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
    return menu.filter((m) => m.category === activeTab || m.tag?.toLowerCase().includes(activeTab.toLowerCase()));
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
      setRole(data.user.role);
      setMessage(`Logged in as ${data.user.name} (${data.user.role.toUpperCase()})`);
    } else {
      setMessage(data.error || "Login failed.");
    }
  }

  function handleQuickLogin(targetRole: Role) {
    if (targetRole === "manager") {
      setEmail("manager@restaurant.com");
      setPassword("manager123");
      setRole("manager");
      setMessage("🛡️ Switched to Manager Control Room (AI Surge & Restock Active).");
    } else {
      setEmail("guest@restaurant.com");
      setPassword("guest123");
      setRole("customer");
      setMessage("✨ Switched to Guest Experience Mode.");
    }
  }

  async function handleToggleMenu(id: string, available: boolean) {
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", id, available }),
    });
    const data = await res.json();
    if (res.ok) {
      setMenu(data.items);
      setMessage(`Updated ${id} availability to ${available ? "available" : "sold out"}.`);
    }
  }

  async function handleAdjustPortions(id: string, delta: number) {
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "adjust_portions", id, delta }),
    });
    const data = await res.json();
    if (res.ok) {
      setMenu(data.items);
      setMessage(`Real-time inventory portion count adjusted for item ${id}.`);
    }
  }

  async function handleCreateReservation(event: React.FormEvent) {
    event.preventDefault();
    if (!reservationForm.customerName) return;
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationForm),
    });
    const data = await res.json();
    if (res.ok) {
      setReservations([data.reservation, ...reservations]);
      setReservationForm(initialCustomerForm);
      setMessage(`🎟️ Table booked for ${data.reservation.customerName} on ${data.reservation.table}.`);
    }
  }

  function addToOrder(item: MenuItem, overrideChannel?: RestaurantOrder["channel"]) {
    if (!item.available || (item.portionsLeft !== undefined && item.portionsLeft <= 0)) return;
    if (overrideChannel) {
      setOrderForm((prev) => ({ ...prev, channel: overrideChannel }));
    }
    setOrderItems((current) => {
      const existing = current.find((i) => i.id === item.id);
      if (existing) {
        return current.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...current, { id: item.id, name: item.name, qty: 1, price: item.price }];
    });
    const channelLabel = overrideChannel || orderForm.channel;
    setMessage(`🛒 Added 1x ${item.name} to kitchen cart [${channelLabel} Mode]!`);
    if (selectedDish?.id === item.id) {
      setSelectedDish(null);
    }
  }

  // Actual order submission — called after payment is confirmed
  async function submitOrderToKitchen() {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: orderForm.customer,
        channel: orderForm.channel,
        items: orderItems,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrders([data.order, ...orders]);
      setOrderItems([]);
      setOrderForm(initialOrderForm);
      const menuRes = await fetch("/api/menu");
      const menuData = await menuRes.json();
      setMenu(menuData.items ?? []);
    }
  }

  // Opens payment modal first — order fires only after payment confirmed
  function handleSubmitOrder(event: React.FormEvent) {
    event.preventDefault();
    if (!orderForm.customer || orderItems.length === 0) return;
    const total = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);
    setPaymentTotal(total);
    setPaymentPendingOrder(() => submitOrderToKitchen);
    setPaymentOpen(true);
  }

  async function handleUpdateOrderStage(id: string, status: RestaurantOrder["status"]) {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_stage", id, status }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrders(data.orders);
      setMessage(`Updated kitchen order #${id} stage to ${status}.`);
    }
  }

  async function handleRestockInventory(name: string, target: number) {
    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, stock: target }),
    });
    const data = await res.json();
    if (res.ok) {
      setInventory(data.inventory);
      setMessage(`📦 Auto-supplier order executed: Restocked ${name} to target (${target} units).`);
    }
  }

  function runAiTasteMatcher() {
    if (menu.length === 0) return;
    const availableItems = menu.filter((i) => i.available && (i.portionsLeft ?? 1) > 0);
    const pool = availableItems.length > 0 ? availableItems : menu;
    let chosen = pool[0];

    if (flavorPref.includes("Spiced") || vibeMood.includes("Late Night")) {
      chosen = pool.find((i) => i.name.includes("Burger") || i.name.includes("Taco") || i.name.includes("Wings")) || chosen;
    } else if (flavorPref.includes("Creamy") || vibeMood.includes("Romantic")) {
      chosen = pool.find((i) => i.name.includes("Rigatoni") || i.name.includes("Burrata") || i.name.includes("Truffle")) || chosen;
    } else if (flavorPref.includes("Sweet") || vibeMood.includes("Fiesta")) {
      chosen = pool.find((i) => i.name.includes("Churros") || i.name.includes("Matcha") || i.name.includes("Secret")) || chosen;
    }

    const pairings: Record<string, string> = {
      "Smoky Tandoori Truffle Burger": "🍹 Pair with: Smoked Rose & Cardamom Fizz (Cuts the rich truffle fat)",
      "24K Gold Butter Paneer Rigatoni": "🫧 Pair with: Nimbu Mint Sparkling Cooler (Cleanses the velvety makhani palate)",
      "Sizzle Bomb Volcano Kebab Wrap": "🥛 Pair with: Sweet Saffron Lassi Cloud (Extinguishes the ghost pepper heat)",
      "The Secret Midnight Matcha Cloud": "🍵 Pair with: Toasted Black Sesame Brittle Bites",
      "Dragon Smoke Nitro Churros": "☕ Pair with: Spiced Espresso Martini Mocktail",
    };

    setAiMatchResult({
      dish: chosen,
      pairing: pairings[chosen.name] || "🍹 Pair with: House Smoked Sparkling Cooler",
      reason: `Matches your '${vibeMood}' vibe and desire for '${flavorPref}' notes with a 99.4% taste compatibility score.`,
      confidence: 99.4,
    });
  }

  const currentOrderTotal = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <main className={`min-h-screen ${darkGreenBg} font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden`}>
      {/* Decorative Floating Sparkles / Stars in Background */}
      <div className="absolute top-12 left-10 text-amber-400/30 text-2xl animate-pulse pointer-events-none">✨</div>
      <div className="absolute top-40 right-20 text-emerald-400/20 text-4xl animate-bounce pointer-events-none">⭐</div>
      <div className="absolute bottom-20 left-1/4 text-amber-300/20 text-3xl animate-pulse pointer-events-none">✨</div>

      {/* Top Glass Navigation Bar (DelishDrop Style) */}
      <nav className="mx-auto max-w-7xl px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
            🍃
          </span>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-white">Vibe<span className="text-amber-400">Serve</span> Beta</span>
            <span className="block text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Viral Dining OS</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <Link href="/" className="text-amber-400 transition hover:text-white">Home</Link>
          <a href="#menu-section" className="transition hover:text-white">Menu & Parcel</a>
          <a href="#cuisine-section" className="transition hover:text-white">Cuisines</a>
          <Link href="/reservations" className="transition hover:text-white">VIP Tables</Link>
          <Link href="/orders" className="transition hover:text-white">Kitchen Queue</Link>
          <Link href="/dashboard" className="transition hover:text-white">Control Room</Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Role Switcher Pill */}
          <div className="flex rounded-full bg-black/40 p-1 border border-white/15 text-xs font-bold">
            <button
              onClick={() => handleQuickLogin("customer")}
              className={`rounded-full px-3 py-1.5 transition ${role === "customer" ? "bg-amber-400 text-slate-950 font-black shadow-md" : "text-slate-300 hover:text-white"}`}
            >
              ✨ Diner
            </button>
            <button
              onClick={() => handleQuickLogin("manager")}
              className={`rounded-full px-3 py-1.5 transition ${role === "manager" ? "bg-cyan-400 text-slate-950 font-black shadow-md" : "text-slate-300 hover:text-white"}`}
            >
              🛡️ Manager
            </button>
          </div>

          <a
            href="https://github.com/gagan-5757/smart-restaurant"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition shadow-lg"
          >
            ⭐ Star Repo
          </a>
        </div>
      </nav>

      {/* Top Banner Message */}
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-emerald-500/20 border-b border-white/10 py-2.5 px-4 text-center text-xs font-semibold text-amber-200">
        🔥 <strong>SOMETHING IS COOKING:</strong> #1 Trending on GitHub & TikTok • 🛍️ Express Parcel & Dine-In Active • {availableCount} gourmet dishes ready to serve
      </div>

      {/* =========================================================================
          HERO SECTION & EXPLORE CUISINE (EXACT DELISHDROP LAYOUT)
         ========================================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side (7 Cols): Typography + Floating Gourmet Food Display */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-10">
          
          {/* Headline & CTA */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1.5 text-xs font-extrabold text-amber-300 mb-6 shadow-md animate-pulse">
              <span>🔥 SOMETHING IS COOKING... 👨‍🍳💨</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Delicious food at your <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent">doorstep</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-lg">
              Our mission is to serve delicious, hot food with live kitchen pacing, AI taste matching, and zero-wait VIP tables. Experience dining that trends.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#menu-section"
                className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black px-8 py-4 text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
              >
                Explore Menu & Parcel ➔
              </a>
              <button
                onClick={runAiTasteMatcher}
                className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-4 text-sm backdrop-blur-md transition shadow-lg flex items-center gap-2"
              >
                <span>🤖 AI Sommelier Match</span>
              </button>
            </div>
          </div>

          {/* Promotional Bento Cards (Bottom Left Grid exactly like picture!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            
            {/* Card 1: Cream/Golden Fresh Meals Card */}
            <div className="rounded-[32px] bg-gradient-to-br from-[#FDFBF7] to-[#F5EEDC] text-slate-900 p-6 shadow-2xl relative overflow-hidden border border-amber-200/60 flex flex-col justify-between min-h-[220px] transition hover:-translate-y-1">
              <div className="relative z-20">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-3 py-1 rounded-full">
                  Irresistibly Tasty Meals
                </span>
                <h3 className="mt-3 text-xl font-black leading-tight text-slate-950">
                  MADE FRESH •<br />SERVED HOT
                </h3>
              </div>
              <div className="flex items-end justify-between mt-4 relative z-20">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Up to</span>
                  <span className="text-4xl font-black text-amber-700">40%<span className="text-xl"> OFF</span></span>
                </div>
                <a href="#menu-section" className="rounded-full bg-slate-950 text-white px-4 py-2 text-xs font-bold hover:bg-slate-800 transition shadow-md">
                  Order Now ➔
                </a>
              </div>
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80"
                alt="Fresh Tasty Meals"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"; }}
                className="absolute right-0 bottom-0 w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg pointer-events-none opacity-25 sm:opacity-75 transform translate-x-4 translate-y-4"
              />
            </div>

            {/* Card 2: Fiery Red Loaded Burgers Card */}
            <div className="rounded-[32px] bg-gradient-to-br from-[#E63946] to-[#D62828] text-white p-6 shadow-2xl relative overflow-hidden border border-red-400/30 flex flex-col justify-between min-h-[220px] transition hover:-translate-y-1">
              <div className="relative z-20">
                <span className="text-xs font-bold uppercase tracking-wider text-red-100 bg-black/20 px-3 py-1 rounded-full">
                  🔥 Viral Specialty
                </span>
                <h3 className="mt-3 text-2xl font-black leading-tight text-white tracking-wide">
                  LOADED BEEF<br />BURGERS
                </h3>
              </div>
              <div className="flex items-end justify-between mt-4 relative z-20">
                <div>
                  <span className="text-xs font-semibold text-red-100 block">Up to</span>
                  <span className="text-4xl font-black text-white">30%<span className="text-xl"> OFF</span></span>
                </div>
                <a href="#menu-section" className="rounded-full bg-white text-red-700 px-4 py-2 text-xs font-black hover:bg-red-50 transition shadow-md">
                  Grab Deal ➔
                </a>
              </div>
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
                alt="Loaded Burger"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"; }}
                className="absolute right-0 bottom-0 w-36 h-36 object-cover rounded-full border-4 border-red-300/40 shadow-2xl pointer-events-none opacity-25 sm:opacity-75 transform rotate-12 translate-x-4 translate-y-4"
              />
            </div>

          </div>

        </div>

        {/* Right Side (5 Cols): Interactive Cuisine Category Orbit & Hero Food Glass Display */}
        <div id="cuisine-section" className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Top Right: The Giant Gourmet Burger & Floating Glass Badges */}
          <div className={`${glassPanel} p-6 sm:p-8 relative overflow-hidden flex flex-col items-center justify-between min-h-[380px] gap-5 border border-emerald-400/20`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-amber-500/10 pointer-events-none"></div>

            {/* Top Badge: Review Quote */}
            <div className="w-full flex justify-start z-10">
              <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-xl flex items-center gap-3 max-w-[220px]">
                <span className="text-xl">👩🏽‍🍳</span>
                <div>
                  <p className="text-[11px] font-bold text-white leading-tight">"Best Burger in Ages! Fast Delivery."</p>
                  <p className="text-[10px] text-amber-400 font-black mt-0.5">★★★★★ 4.9</p>
                </div>
              </div>
            </div>

            {/* Center: Gourmet Burger Image */}
            <div className="relative z-10 my-2 transform hover:scale-105 transition duration-500 cursor-pointer" onClick={() => menu[0] && setSelectedDish(menu[0])}>
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
                alt="Delicious Gourmet Burger"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"; }}
                className="w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-full border-8 border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
              />
              <div className="absolute -top-3 -right-3 rounded-full bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 shadow-lg animate-bounce">
                🔥 #1 Viral Hit
              </div>
            </div>

            {/* Bottom Badge: Customer Rating */}
            <div className="w-full flex justify-end z-10">
              <div className="bg-black/75 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Customer" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80"; }} />
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Customer" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80"; }} />
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Customer" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80"; }} />
                </div>
                <div>
                  <p className="text-xs font-black text-white">1,500+ Happy</p>
                  <p className="text-[10px] text-emerald-400 font-bold">★★★★★ 4.8 Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right: Explore Delicious Cuisine by Category (Pastel Sage Green Panel exactly like picture!) */}
          <div className="rounded-[36px] bg-[#E8F0E9] text-slate-900 p-7 shadow-2xl border border-white/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-3 py-1 rounded-full">
                  Cuisine Explorer
                </span>
                <h3 className="mt-2 text-2xl font-black text-slate-950 tracking-tight">
                  Explore Delicious Cuisine by <span className="text-emerald-700">Category</span>
                </h3>
              </div>
              <span className="text-2xl animate-spin" style={{ animationDuration: "15s" }}>🍕</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { name: "Burgers & Fries", icon: "🍔", time: "8 min", count: "3 Items", desc: "Tandoori & makhani drips" },
                { name: "Pizza Paradise", icon: "🍕", time: "14 min", count: "3 Items", desc: "24K gold & truffle burrata" },
                { name: "Sandwiches & Wraps", icon: "🌮", time: "8 min", count: "3 Items", desc: "Ghost pepper & falafel lava" },
                { name: "Fried & Crispy", icon: "🍗", time: "10 min", count: "3 Items", desc: "Korean gochujang & tempura" },
              ].map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setActiveTab(cat.name);
                    setMessage(`✨ Filtered menu by category: ${cat.name}! Tap any dish to see full ingredients & making-of story.`);
                  }}
                  className={`flex items-start gap-3 rounded-2xl p-3.5 text-left transition-all ${
                    activeTab === cat.name
                      ? "bg-emerald-700 text-white shadow-lg scale-[1.02] ring-2 ring-emerald-500"
                      : "bg-white/80 hover:bg-white text-slate-900 shadow-sm hover:shadow-md"
                  }`}
                >
                  <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-black/10">{cat.icon}</span>
                  <div>
                    <p className="font-black text-xs leading-tight">{cat.name}</p>
                    <p className={`text-[10px] font-semibold mt-0.5 ${activeTab === cat.name ? "text-emerald-200" : "text-emerald-700"}`}>
                      ⏱️ {cat.time} • {cat.count}
                    </p>
                    <p className={`text-[9px] mt-1 line-clamp-1 ${activeTab === cat.name ? "text-white/80" : "text-slate-500"}`}>
                      {cat.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          PLATINUM AI SOMMELIER & TASTE MATCHER (VIBEATHON 6.0 SPECIALTY)
         ========================================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className={`${glassPanel} p-6 sm:p-8 border border-cyan-400/30 bg-gradient-to-r from-[#0D2818]/90 via-[#113A24]/90 to-[#0F2E20]/90 relative`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 border border-cyan-400/40 px-3 py-1 text-xs font-bold text-cyan-300 mb-2">
                <span>🤖 PLATINUM FEATURE</span>
              </div>
              <h2 className="text-3xl font-black text-white">AI Sommelier & Taste Matcher</h2>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Tell us your mood and flavor preference. Our neural model predicts your 99% taste match and custom drink pairing!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={vibeMood}
                onChange={(e) => setVibeMood(e.target.value)}
                className="rounded-2xl border border-white/20 bg-black/60 px-4 py-3 text-xs font-bold text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option>🔥 Late Night Craving</option>
                <option>✨ Romantic VIP Date</option>
                <option>🎉 Group Fiesta</option>
                <option>⚡ Quick Energy Boost</option>
              </select>
              <select
                value={flavorPref}
                onChange={(e) => setFlavorPref(e.target.value)}
                className="rounded-2xl border border-white/20 bg-black/60 px-4 py-3 text-xs font-bold text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option>🌶️ Spiced & Smoky</option>
                <option>🧀 Rich & Creamy</option>
                <option>🍯 Sweet & Crispy</option>
                <option>🍃 Fresh & Herbal</option>
              </select>
              <button
                onClick={runAiTasteMatcher}
                className="rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black px-6 py-3 text-xs shadow-lg transition hover:scale-105"
              >
                ✨ Predict Match
              </button>
            </div>
          </div>

          {/* AI Result Card */}
          {aiMatchResult && (
            <div className="mt-6 rounded-2xl bg-black/50 border border-cyan-400/40 p-5 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedDish(aiMatchResult.dish)}>
                <span className="text-4xl">🎯</span>
                <div>
                  <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
                    {aiMatchResult.confidence}% Viral Taste Match • Tap to view ingredients & story!
                  </span>
                  <h4 className="text-xl font-black text-white">{aiMatchResult.dish.name} • ₹{aiMatchResult.dish.price}</h4>
                  <p className="text-xs text-amber-300 font-medium mt-1">{aiMatchResult.pairing}</p>
                  <p className="text-xs text-slate-300 mt-1 italic">"{aiMatchResult.reason}"</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedDish(aiMatchResult.dish)}
                  className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2.5 text-xs"
                >
                  📖 View Craft Story
                </button>
                <button
                  onClick={() => addToOrder(aiMatchResult.dish, "Takeaway")}
                  className="rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 text-xs shadow-md"
                >
                  🛍️ + Parcel Order
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          LIVE VIRAL MENU & SCARCITY ENGINE (WITH PARCEL & DINE-IN PROVISION)
         ========================================================================= */}
      <section id="menu-section" className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <span>🛍️ PARCEL (TAKEAWAY) & 🍽️ DINE-IN PROVISION ACTIVE</span>
            </div>
            <h2 className="text-3xl font-black text-white">Gourmet Viral Menu & Scarcity Engine</h2>
            <p className="text-slate-300 text-sm mt-1">
              Tap any dish to open the Glassmorphic Popup, view full ingredients, and experience the culinary making-of story!
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All Viral Hits", "Burgers & Fries", "Pizza Paradise", "Sandwiches & Wraps", "Fried & Crispy", "Secret Drops", "Drinks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  activeTab === tab ? "bg-amber-400 text-slate-950 font-black shadow-lg" : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => {
            const isSoldOut = !item.available || (item.portionsLeft !== undefined && item.portionsLeft <= 0);
            const isLowStock = !isSoldOut && item.portionsLeft !== undefined && item.portionsLeft <= 5;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedDish(item)}
                className={`${glassPanel} p-6 flex flex-col justify-between transition-all duration-300 hover:border-amber-400/60 hover:-translate-y-1.5 cursor-pointer relative ${
                  isSoldOut ? "opacity-60 grayscale" : ""
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-amber-500/20 border border-amber-400/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                      {item.category}
                    </span>
                    <span className="text-lg font-black text-emerald-400">₹{item.price}</span>
                  </div>

                  {item.image && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-lg h-44 w-full relative group">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
                          <span>📖</span> Tap for Ingredients & Craft Story
                        </span>
                      </div>
                    </div>
                  )}

                  <h3 className="mt-4 text-xl font-bold text-white leading-snug">{item.name}</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-2">{item.description}</p>

                  {item.tag && (
                    <div className="mt-3 inline-block rounded-lg bg-black/40 px-2.5 py-1 text-[11px] font-bold text-amber-300 border border-white/10">
                      {item.tag}
                    </div>
                  )}

                  {item.socialProof && (
                    <p className="mt-2 text-[11px] text-cyan-300 font-semibold flex items-center gap-1">
                      <span>📈</span> {item.socialProof}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col xl:flex-row xl:items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
                  <div>
                    {isSoldOut ? (
                      <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30">
                        🚫 SOLD OUT
                      </span>
                    ) : isLowStock ? (
                      <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-300 border border-orange-500/30 animate-pulse">
                        🔥 Only {item.portionsLeft} left!
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        ✅ {item.portionsLeft ?? 10} ready ({item.prepTime ?? "10m"})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {role === "manager" ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustPortions(item.id, 5)}
                          className="rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 px-2.5 py-1 text-xs font-bold text-cyan-300"
                        >
                          +5 Stock
                        </button>
                        <button
                          onClick={() => handleToggleMenu(item.id, !item.available)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold border ${
                            item.available ? "bg-red-500/20 text-red-300 border-red-400/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                          }`}
                        >
                          {item.available ? "Lock" : "Unlock"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => addToOrder(item, "Takeaway")}
                          disabled={isSoldOut}
                          className={`rounded-full px-3.5 py-1.5 text-[11px] font-black shadow-md transition ${
                            isSoldOut
                              ? "bg-white/10 text-slate-500 cursor-not-allowed"
                              : "bg-amber-400 text-slate-950 hover:bg-amber-300"
                          }`}
                          title="Add as Parcel / Takeaway"
                        >
                          🛍️ Parcel
                        </button>
                        <button
                          onClick={() => addToOrder(item, "Dine-in")}
                          disabled={isSoldOut}
                          className={`rounded-full px-3.5 py-1.5 text-[11px] font-black shadow-md transition ${
                            isSoldOut
                              ? "bg-white/10 text-slate-500 cursor-not-allowed"
                              : "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                          }`}
                          title="Add to Dine-in Table"
                        >
                          🍽️ Dine-in
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          VIP TABLE VIBE RESERVATIONS & KITCHEN QUEUE PROGRESSION
         ========================================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side (6 Cols): VIP Table Vibe Reservations */}
        <div className="lg:col-span-6">
          <div className={`${glassPanel} p-7 border border-white/15`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest">Atmosphere Booking</span>
                <h3 className="text-2xl font-black text-white mt-1">🎟️ VIP Table Vibe Picker</h3>
              </div>
              <span className="text-3xl">✨</span>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Guest Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sara Khan & VIP Guests"
                  value={reservationForm.customerName}
                  onChange={(e) => setReservationForm({ ...reservationForm, customerName: e.target.value })}
                  className="w-full rounded-2xl border border-white/20 bg-black/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Party Size</label>
                  <select
                    value={reservationForm.partySize}
                    onChange={(e) => setReservationForm({ ...reservationForm, partySize: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-white/20 bg-black/50 px-4 py-3 text-sm text-white focus:outline-none"
                  >
                    {[2, 3, 4, 6, 8, 12].map((num) => (
                      <option key={num} value={num}>{num} Guests</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Time Slot</label>
                  <select
                    value={reservationForm.timeSlot}
                    onChange={(e) => setReservationForm({ ...reservationForm, timeSlot: e.target.value })}
                    className="w-full rounded-2xl border border-white/20 bg-black/50 px-4 py-3 text-sm text-white focus:outline-none"
                  >
                    {["18:30", "19:00", "19:30 (Peak Rush)", "20:30", "21:30"].map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select Dining Vibe & Table</label>
                <select
                  value={reservationForm.table}
                  onChange={(e) => setReservationForm({ ...reservationForm, table: e.target.value })}
                  className="w-full rounded-2xl border border-amber-400/40 bg-black/60 px-4 py-3 text-sm text-amber-200 font-bold focus:outline-none"
                >
                  <option>Terrace 2 (Best Lighting for Reels 📸)</option>
                  <option>Chef's Counter 1 (Action View 👨‍🍳🔥)</option>
                  <option>Velvet Booth 4 (Intimate & Smoked Cocktails ✨)</option>
                  <option>Rooftop Lounge 9 (Sunset & DJ Vibe 🌅)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black py-4 text-sm shadow-xl transition hover:scale-[1.02]"
              >
                🎟️ Confirm VIP Table Reservation
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Active VIP Table Turnover AI</h4>
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                {reservations.slice(0, 3).map((res) => (
                  <div key={res.id} className="rounded-xl bg-black/40 border border-white/10 p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{res.customerName}</span>
                      <span className="text-slate-400"> ({res.partySize}p)</span>
                      <p className="text-[10px] text-amber-300 font-semibold mt-0.5">{res.table}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                        {res.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">⏱️ {res.timeSlot}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (6 Cols): Interactive Kitchen Order Queue & Cart */}
        <div className="lg:col-span-6">
          <div className={`${glassPanel} p-7 border border-white/15 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-widest">Order Orchestration</span>
                  <h3 className="text-2xl font-black text-white mt-1">🛒 Live Kitchen Cart & Queue</h3>
                </div>
                <span className="text-3xl">👨‍🍳</span>
              </div>

              {/* Cart Form & Items */}
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Customer / Table Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Table 4 / Aryan"
                      value={orderForm.customer}
                      onChange={(e) => setOrderForm({ ...orderForm, customer: e.target.value })}
                      className="w-full rounded-2xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Dining Channel (Parcel vs Dine-In)</label>
                    <select
                      value={orderForm.channel}
                      onChange={(e) => setOrderForm({ ...orderForm, channel: e.target.value as any })}
                      className="w-full rounded-2xl border border-amber-400/50 bg-black/70 px-4 py-2.5 text-sm text-amber-200 font-bold focus:outline-none"
                    >
                      <option value="Takeaway">🛍️ Parcel (Express Takeaway & Packed Hot)</option>
                      <option value="Dine-in">🍽️ Dine-in (VIP Table Service)</option>
                      <option value="Online">🚀 Online Viral Delivery</option>
                    </select>
                  </div>
                </div>

                {/* Cart Item Display */}
                <div className="rounded-2xl bg-black/40 border border-white/10 p-4 min-h-[110px] max-h-[160px] overflow-y-auto">
                  {orderItems.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-6">
                      Your kitchen cart is empty. Tap any viral dish to view ingredients or order as Parcel / Dine-in! 🛍️🍽️
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs text-white border-b border-white/5 pb-1.5">
                          <span className="font-bold">{item.qty}x {item.name}</span>
                          <span className="text-emerald-400 font-black">₹{item.qty * item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={orderItems.length === 0}
                  className={`w-full rounded-2xl py-4 text-sm font-black transition shadow-xl ${
                    orderItems.length === 0
                      ? "bg-white/10 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 text-slate-950 hover:scale-[1.02]"
                  }`}
                >
                  💳 Pay & Place {orderForm.channel} Order — ₹{currentOrderTotal}
                </button>
              </form>
            </div>

            {/* Active Kitchen Stage Progression */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Kitchen Stage Progression</h4>
              <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="rounded-xl bg-black/50 border border-white/10 p-3.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-white">Order #{ord.id} • {ord.customer} <span className="text-amber-400">[{ord.channel}]</span></span>
                      <span className="font-black text-emerald-400">₹{ord.total}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>{ord.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</span>
                      <span className="text-cyan-300 font-bold">⏱️ {ord.eta}</span>
                    </div>

                    {/* Visual Stage Progression Pill */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                      <span className={`font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        ord.status === "Preparing" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse" :
                        ord.status === "Ready" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                        "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      }`}>
                        🔥 Stage: {ord.status}
                      </span>

                      {role === "manager" && (
                        <div className="flex gap-1">
                          <button onClick={() => handleUpdateOrderStage(ord.id, "Preparing")} className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold">Prep</button>
                          <button onClick={() => handleUpdateOrderStage(ord.id, "Ready")} className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold">Ready</button>
                          <button onClick={() => handleUpdateOrderStage(ord.id, "Delivered")} className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold">Done</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          MANAGER CONTROL ROOM (INTELLIGENT SURGE PRICING & AUTO RESTOCK)
         ========================================================================= */}
      {role === "manager" && dashboard && (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className={`${glassPanel} p-8 border border-cyan-400/40 bg-gradient-to-br from-[#0D2818]/95 via-[#0F3824]/95 to-[#0B2416]/95`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 border border-cyan-400/40 px-3 py-1 text-xs font-bold text-cyan-300 mb-2">
                  <span>🛡️ MANAGER CONTROL ROOM ACTIVE</span>
                </div>
                <h2 className="text-3xl font-black text-white">AI Operations & Dynamic Margin Control</h2>
              </div>
              <span className="text-4xl">⚡</span>
            </div>

            {/* KPI Matrix */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Revenue</span>
                <p className="mt-2 text-3xl font-black text-emerald-400">₹{dashboard.revenue}</p>
                <p className="text-[11px] text-emerald-300 mt-1">📈 +34% vs last Friday</p>
              </div>
              <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">VIP Table Occupancy</span>
                <p className="mt-2 text-3xl font-black text-amber-400">{dashboard.occupancy}%</p>
                <p className="text-[11px] text-amber-300 mt-1">🎟️ 6 of 8 terraces booked</p>
              </div>
              <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Queue</span>
                <p className="mt-2 text-3xl font-black text-cyan-400">{dashboard.pendingOrders} Orders</p>
                <p className="text-[11px] text-cyan-300 mt-1">🔥 99.4% on-time pacing</p>
              </div>
              <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Alerts</span>
                <p className="mt-2 text-3xl font-black text-orange-400">{dashboard.lowStock} Items</p>
                <p className="text-[11px] text-orange-300 mt-1">⚠️ Auto-supplier active</p>
              </div>
            </div>

            {/* AI Alert & Restock Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span>🤖 AI Social Hype & Surge Pricing Recommendations</span>
                </h3>
                <div className="space-y-3">
                  {(dashboard.aiAlerts ?? []).map((alt) => (
                    <div key={alt.id} className="rounded-2xl bg-black/50 border border-cyan-400/30 p-4 flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                          AI {alt.type.toUpperCase()}
                        </span>
                        <p className="mt-2 text-xs text-slate-200 font-medium leading-relaxed">{alt.message}</p>
                      </div>
                      <button
                        onClick={() => setMessage(`⚡ AI Action Executed for alert #${alt.id}: Surge margins applied!`)}
                        className="rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black px-3.5 py-2 text-[11px] shrink-0"
                      >
                        Execute
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span>📦 Automated Ingredient Restock (Supplier Sync)</span>
                </h3>
                <div className="space-y-3">
                  {inventory.map((inv) => {
                    const isLow = inv.stock < inv.target;
                    return (
                      <div key={inv.name} className={`rounded-2xl bg-black/50 border p-4 flex items-center justify-between ${isLow ? "border-orange-500/50 bg-orange-950/10" : "border-white/10"}`}>
                        <div>
                          <p className="font-bold text-xs text-white">{inv.name}</p>
                          <p className={`text-[11px] font-semibold mt-0.5 ${isLow ? "text-orange-300" : "text-slate-400"}`}>
                            Current: {inv.stock} units (Target: {inv.target}) {isLow ? "• ⚠️ LOW STOCK" : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRestockInventory(inv.name, inv.target)}
                          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                            isLow ? "bg-orange-500 text-white hover:bg-orange-400 shadow-md animate-pulse" : "bg-white/10 text-slate-300 hover:bg-white/20"
                          }`}
                        >
                          {isLow ? "🚀 Restock Now" : "Restock"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          GLASSMORPHIC POPUP MODAL (FULL DISH DETAILS & MAKING-OF STORY)
         ========================================================================= */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={() => setSelectedDish(null)}>
          <div
            className="bg-[#0B2416]/95 border-2 border-emerald-400/40 rounded-[36px] max-w-2xl w-full p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] relative overflow-hidden text-white my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-lg font-bold transition z-20"
            >
              ✕
            </button>

            {/* Modal Image Banner */}
            {selectedDish.image && (
              <div className="relative h-56 sm:h-64 w-full rounded-3xl overflow-hidden mb-6 border border-white/15 shadow-2xl">
                <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2416] via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <span className="rounded-full bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 shadow-lg">
                    {selectedDish.tag || "🔥 Gourmet Viral Hit"}
                  </span>
                  <span className="text-2xl font-black text-emerald-300 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/20">
                    ₹{selectedDish.price}
                  </span>
                </div>
              </div>
            )}

            {/* Dish Title & Category */}
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-widest">
              <span>🍃 {selectedDish.category}</span>
              <span>•</span>
              <span>⏱️ Prep: {selectedDish.prepTime || "10 mins"}</span>
              <span>•</span>
              <span className="text-cyan-300">📈 {selectedDish.viralScore ?? 95}% Hype Score</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 leading-tight">{selectedDish.name}</h3>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">{selectedDish.description}</p>

            {selectedDish.socialProof && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 px-3.5 py-2 text-xs font-bold text-cyan-300">
                <span>📱 Social Proof:</span>
                <span>{selectedDish.socialProof}</span>
              </div>
            )}

            {/* INGREDIENTS LIST */}
            {selectedDish.ingredients && (
              <div className="mt-6 pt-5 border-t border-white/10">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-2 mb-3">
                  <span>🥗 Prime Ingredients & Aromatics</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDish.ingredients.map((ing, idx) => (
                    <span key={idx} className="rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 text-xs font-bold text-slate-200 transition">
                      ✨ {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* THE FEEL OF THE MAKING OF FOOD (CULINARY STORY) */}
            {selectedDish.makingOf && (
              <div className="mt-6 rounded-2xl bg-black/60 border border-amber-400/30 p-5 relative">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-widest mb-2">
                  <span>👨‍🍳 The Craft & Culinary Making-Of Story</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium italic">
                  "{selectedDish.makingOf}"
                </p>
              </div>
            )}

            {/* PARCEL VS DINE-IN SELECTOR DIRECTLY IN POPUP */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-3">
                Select Order Channel (How would you like this served?)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setModalChannel("Takeaway")}
                  className={`rounded-2xl p-3 text-center border transition font-bold text-xs ${
                    modalChannel === "Takeaway"
                      ? "bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-[1.02]"
                      : "bg-black/50 text-slate-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg block mb-1">🛍️</span>
                  <span>Parcel (Takeaway)</span>
                  <span className="block text-[9px] font-normal opacity-80">Packed Hot in Thermal Box</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalChannel("Dine-in")}
                  className={`rounded-2xl p-3 text-center border transition font-bold text-xs ${
                    modalChannel === "Dine-in"
                      ? "bg-emerald-400 text-slate-950 border-emerald-300 shadow-lg scale-[1.02]"
                      : "bg-black/50 text-slate-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg block mb-1">🍽️</span>
                  <span>Dine-In VIP</span>
                  <span className="block text-[9px] font-normal opacity-80">Served at Table</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalChannel("Online")}
                  className={`rounded-2xl p-3 text-center border transition font-bold text-xs ${
                    modalChannel === "Online"
                      ? "bg-cyan-400 text-slate-950 border-cyan-300 shadow-lg scale-[1.02]"
                      : "bg-black/50 text-slate-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg block mb-1">🚀</span>
                  <span>Online Delivery</span>
                  <span className="block text-[9px] font-normal opacity-80">Doorstep ETA</span>
                </button>
              </div>
            </div>

            {/* MODAL ACTION BUTTON */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Total Dish Price</span>
                <span className="text-3xl font-black text-amber-400">₹{selectedDish.price}</span>
              </div>
              <button
                onClick={() => addToOrder(selectedDish, modalChannel)}
                disabled={!selectedDish.available || (selectedDish.portionsLeft !== undefined && selectedDish.portionsLeft <= 0)}
                className="rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 hover:scale-105 text-slate-950 font-black px-8 py-4 text-sm shadow-xl transition flex-1 sm:flex-initial text-center"
              >
                🛒 Add to Order [{modalChannel} Mode]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 py-12 border-t border-white/10 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-300">🍃 VibeServe — The Viral Restaurant & Dining OS (Built for Vibeathon 6.0)</p>
        <p className="mt-2">Empowering restaurants with real-time portion scarcity, AI taste matching, and dynamic surge pricing.</p>
        <div className="mt-4 flex justify-center gap-4">
          <a href="https://github.com/gagan-5757/smart-restaurant" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">⭐ Star on GitHub</a>
          <span>•</span>
          <Link href="/presentation" className="text-cyan-400 hover:underline">📺 View Pitch Deck & Architecture</Link>
        </div>
      </footer>

      {/* Toast Notification Bar */}
      {message && (
        <div className="fixed bottom-6 left-6 z-50 rounded-2xl bg-slate-950/95 border border-amber-400/50 p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3 max-w-sm">
          <span className="text-xl">🔥</span>
          <p className="text-xs font-bold text-slate-200 leading-snug">{message}</p>
          <button onClick={() => setMessage("")} className="text-slate-400 hover:text-white font-bold text-sm ml-2">✕</button>
        </div>
      )}

      {/* Phone Auth Banner (if not logged in) */}
      {!authedUser && (
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 border-b border-amber-400/30" style={{ background: "rgba(7,22,14,0.97)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-amber-400">🔐</span>
            <span>Sign in for exclusive offers & order tracking</span>
          </div>
          <Link
            href="/auth/login"
            className="text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full px-4 py-1.5 hover:scale-105 transition"
          >
            📲 Login with OTP
          </Link>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        orderTotal={paymentTotal}
        onConfirm={(method) => {
          setPaymentOpen(false);
          if (paymentPendingOrder) paymentPendingOrder();
          setPaymentPendingOrder(null);
          setMessage(`✅ Payment via ${method.toUpperCase()} confirmed! Your order is being prepared 🔥`);
        }}
      />

      {/* VibeBot RAG Chat Widget */}
      <ChatWidget />
    </main>
  );
}
