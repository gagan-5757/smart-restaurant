"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { InventoryItem, MenuItem, Reservation, RestaurantOrder, Role, StaffShift } from "@/lib/restaurant-data";

const glassCard = "rounded-[32px] border border-white/10 bg-[#111827]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.45)]";

interface DashboardData {
  revenue: number;
  occupancy: number;
  pendingOrders: number;
  lowStock: number;
  insights: Array<{ title: string; value: string; detail: string }>;
}

const initialCustomerForm = {
  customerName: "",
  partySize: 2,
  timeSlot: "19:00",
  table: "Terrace 2",
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
  const [message, setMessage] = useState("Welcome to SmartServe — visibility, speed, and service in one flow.");
  const [isLoading, setIsLoading] = useState(true);

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
        setMessage("The live data service is temporarily unavailable. Demo content is still available.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const availableCount = useMemo(() => menu.filter((item) => item.available).length, [menu]);

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
      setMessage(data.message);
    } else {
      setMessage(data.error || "Authentication failed.");
    }
  }

  async function handleReservationSubmit(event: React.FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationForm),
    });
    const data = await res.json();
    if (res.ok) {
      setReservations((current) => [data.reservation, ...current]);
      setMessage(`Reservation confirmed for ${data.reservation.customerName}.`);
      setReservationForm(initialCustomerForm);
    } else {
      setMessage(data.error || "Reservation failed.");
    }
  }

  async function handleOrderSubmit(event: React.FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer: orderForm.customer, items: orderItems, channel: orderForm.channel }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrders((current) => [data.order, ...current]);
      setMessage(`Order placed for ${data.order.customer}.`);
      setOrderForm(initialOrderForm);
      setOrderItems([]);
    } else {
      setMessage(data.error || "Order failed.");
    }
  }

  function addOrderItem(item: MenuItem) {
    setOrderItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) => (entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry));
      }
      return [...current, { id: item.id, name: item.name, qty: 1, price: item.price }];
    });
  }

  async function toggleAvailability(itemId: string, available: boolean) {
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: itemId, available }),
    });
    const data = await res.json();
    if (res.ok) {
      setMenu(data.items || []);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.10),_transparent_24%),linear-gradient(120deg,_#020617,_#111827_40%,_#0f172a)] text-slate-100">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className={`${glassCard} overflow-hidden p-6 lg:p-8`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Restaurant Operations Simplified
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-300">
                Manage your menu, reservations, orders, and operations from one intelligent dashboard. Built for Indian restaurants.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/80 px-5 py-4 text-sm text-slate-200">
              <p className="font-medium text-amber-300">Tonight’s rhythm</p>
              <p className="mt-1 text-slate-300">{availableCount} dishes ready • {reservations.length} active reservations</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/menu" className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-200 transition duration-200 hover:-translate-y-0.5 hover:bg-amber-500/20">Menu</Link>
                <Link href="/reservations" className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-200 transition duration-200 hover:-translate-y-0.5 hover:bg-amber-500/20">Reservations</Link>
                <Link href="/orders" className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-200 transition duration-200 hover:-translate-y-0.5 hover:bg-amber-500/20">Orders</Link>
                <Link href="/dashboard" className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-200 transition duration-200 hover:-translate-y-0.5 hover:bg-amber-500/20">Dashboard</Link>
              </div>
            </div>
          </div>
        </header>

        {isLoading && (
          <div className={`${glassCard} p-4 text-sm text-slate-300`}>
            Loading live restaurant data…
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className={`${glassCard} p-6`}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Experience overview</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Navigate the full restaurant operating suite</h2>
            <p className="mt-3 text-sm text-slate-300">Use the dedicated pages below to manage menus, reservations, orders, and the live dashboard from separate interactive screens.</p>
            <div className="mt-6 grid gap-3">
              <Link href="/menu" className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-slate-900">
                <p className="font-semibold text-white">Menu control</p>
                <p className="mt-1 text-sm text-slate-400">Change dish availability and keep the kitchen synced.</p>
              </Link>
              <Link href="/reservations" className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-slate-900">
                <p className="font-semibold text-white">Reservation flow</p>
                <p className="mt-1 text-sm text-slate-400">Create guest bookings and review upcoming tables.</p>
              </Link>
              <Link href="/orders" className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-slate-900">
                <p className="font-semibold text-white">Order studio</p>
                <p className="mt-1 text-sm text-slate-400">Place new orders and track the current order queue.</p>
              </Link>
              <Link href="/dashboard" className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-slate-900">
                <p className="font-semibold text-white">Operations dashboard</p>
                <p className="mt-1 text-sm text-slate-400">See revenue, occupancy, staff, and inventory in one place.</p>
              </Link>
            </div>
          </div>

          <div className={`${glassCard} p-6`}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Signature experience</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Thoughtful tools that support real hospitality</h2>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p>Service cues shift smoothly as the restaurant moves from brunch to dinner rush.</p>
              <p>Helpful prompts guide staff toward better pacing, better guest care, and better add-on suggestions.</p>
              <p>The experience feels practical, warm, and grounded in real restaurant rhythm.</p>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-[20px] border border-amber-400/20 bg-amber-500/10 p-4">
                <p className="text-sm font-semibold text-amber-200">Service flow</p>
                <p className="mt-2 text-sm text-slate-300">Gentle prompts help the team stay calm and coordinated during busy moments.</p>
              </div>
              <div className="rounded-[20px] border border-orange-400/20 bg-orange-500/10 p-4">
                <p className="text-sm font-semibold text-orange-200">Guest care</p>
                <p className="mt-2 text-sm text-slate-300">Thoughtful suggestions help raise spend while keeping the experience personal.</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
