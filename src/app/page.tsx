"use client";

import { useEffect, useMemo, useState } from "react";
import type { InventoryItem, MenuItem, Reservation, RestaurantOrder, Role, StaffShift } from "@/lib/restaurant-data";

const glassCard = "rounded-[28px] border border-slate-200/70 bg-slate-900/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(2,6,23,0.25)]";

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

  useEffect(() => {
    async function loadData() {
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
    <main className="min-h-screen text-slate-100">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className={`${glassCard} overflow-hidden p-6 lg:p-8`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-200">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                SmartServe OS
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                The future-facing command center for restaurants that move at light speed.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-300">
                SmartServe turns waiting rooms, kitchens, and management into one synchronized operating system with predictive insight, live availability, and zero-friction service at scale.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm text-slate-200">
              <p className="font-medium text-cyan-200">Live neural status</p>
              <p className="mt-1 text-slate-300">{availableCount} dishes live • {reservations.length} active reservations</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className={`${glassCard} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Guest experience</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Live menu intelligence</h2>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-200">Realtime</span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
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
                    <button
                      className="rounded-full border border-slate-600/70 px-3 py-1 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
                      onClick={() => addOrderItem(item)}
                    >
                      Add to order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${glassCard} p-6`}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Secure access</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Auth-ready command portal</h2>
              <form className="mt-4 space-y-3" onSubmit={handleLogin}>
                <input className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-white outline-none" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
                <input className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-white outline-none" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
                <button className="w-full rounded-2xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Sign in</button>
              </form>
              <p className="mt-3 text-sm text-slate-400">{message}</p>
            </div>

            <div className={`${glassCard} p-6`}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Operations view</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{role === "manager" ? "Manager console" : "Guest flow"}</h2>
              <p className="mt-3 text-sm text-slate-300">One synchronized surface keeps dine-in, takeout, and operations linked through live data and instant alerts.</p>
            </div>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className={`${glassCard} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Reservations</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Adaptive reservation flow</h2>
              </div>
            </div>
            <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleReservationSubmit}>
              <input className="rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-white outline-none" placeholder="Customer name" value={reservationForm.customerName} onChange={(event) => setReservationForm({ ...reservationForm, customerName: event.target.value })} />
              <input className="rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-white outline-none" type="number" min="1" value={reservationForm.partySize} onChange={(event) => setReservationForm({ ...reservationForm, partySize: Number(event.target.value) })} />
              <input className="rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-white outline-none" placeholder="Time slot" value={reservationForm.timeSlot} onChange={(event) => setReservationForm({ ...reservationForm, timeSlot: event.target.value })} />
              <input className="rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-white outline-none" placeholder="Table" value={reservationForm.table} onChange={(event) => setReservationForm({ ...reservationForm, table: event.target.value })} />
              <button className="md:col-span-2 rounded-2xl bg-orange-500 px-4 py-2 font-semibold text-white">Create reservation</button>
            </form>
            <div className="mt-6 space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">{reservation.customerName}</p>
                    <p className="text-sm text-slate-400">Party {reservation.partySize} • {reservation.timeSlot} • {reservation.table}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-slate-200">{reservation.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glassCard} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Order queue</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Kitchen coordination engine</h2>
              </div>
            </div>
            <form className="mt-4 space-y-3" onSubmit={handleOrderSubmit}>
              <input className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-white outline-none" placeholder="Customer name" value={orderForm.customer} onChange={(event) => setOrderForm({ ...orderForm, customer: event.target.value })} />
              <select className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-white outline-none" value={orderForm.channel} onChange={(event) => setOrderForm({ ...orderForm, channel: event.target.value as RestaurantOrder["channel"] })}>
                <option value="Dine-in">Dine-in</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Online">Online</option>
              </select>
              <div className="rounded-2xl border border-dashed border-cyan-400/20 bg-slate-950/50 p-3 text-sm text-slate-400">
                {orderItems.length > 0 ? orderItems.map((entry) => <p key={entry.id}>{entry.qty} × {entry.name}</p>) : <p>No items added yet.</p>}
              </div>
              <button className="w-full rounded-2xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Place order</button>
            </form>
            <div className="mt-6 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{order.customer}</p>
                    <span className="rounded-full bg-orange-500/20 px-2.5 py-1 text-xs font-semibold text-orange-200">{order.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{order.channel} • ETA {order.eta}</p>
                  <p className="mt-2 text-lg font-semibold text-white">₹{order.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className={`${glassCard} p-6`}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Management dashboard</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Predictive operations overview</h2>
            {dashboard ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Revenue</p>
                  <p className="mt-2 text-3xl font-semibold text-white">₹{dashboard.revenue.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Occupancy</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{dashboard.occupancy}%</p>
                </div>
                <div className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Pending orders</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{dashboard.pendingOrders}</p>
                </div>
                <div className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Low stock</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{dashboard.lowStock}</p>
                </div>
              </div>
            ) : null}
            <div className="mt-6 space-y-3">
              {dashboard?.insights.map((insight) => (
                <div key={insight.title} className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4">
                  <p className="font-semibold text-white">{insight.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{insight.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{insight.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glassCard} p-6`}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Team coordination</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Staff and inventory pulse</h2>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Inventory</h3>
                <div className="mt-3 space-y-2">
                  {inventory.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2">
                      <span className="text-sm font-medium text-slate-200">{item.name}</span>
                      <span className="text-sm text-slate-400">{item.stock} / {item.target}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Staff</h3>
                <div className="mt-3 space-y-2">
                  {staff.map((member) => (
                    <div key={member.name} className="flex items-center justify-between rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2">
                      <span className="text-sm font-medium text-slate-200">{member.name}</span>
                      <span className="text-sm text-slate-400">{member.role} • {member.shift}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
