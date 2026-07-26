import { supabase } from "./supabase";

export type Role = "customer" | "manager";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  description: string;
  tag?: string;
  viralScore?: number;
  socialProof?: string;
  portionsLeft?: number;
  prepTime?: string;
  image?: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  partySize: number;
  timeSlot: string;
  table: string;
  status: "Confirmed" | "Pending";
}

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface RestaurantOrder {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: "Preparing" | "Ready" | "Delivered";
  eta: string;
  channel: "Dine-in" | "Takeaway" | "Online";
}

export interface InventoryItem {
  name: string;
  stock: number;
  target: number;
}

export interface StaffShift {
  name: string;
  role: string;
  shift: string;
}

const initialMenu: MenuItem[] = [
  {
    id: "smoke-burger",
    name: "Smoky Tandoori Truffle Burger",
    category: "Viral Hits",
    price: 199,
    available: true,
    description: "Charred artisan patty, smoked tandoori glaze, truffle garlic aioli, crispy onion crunch on brioche bun.",
    tag: "🔥 #1 TikTok Viral in NYC",
    viralScore: 99,
    socialProof: "18.4K TikTok mentions this week • 4.9★",
    portionsLeft: 6,
    prepTime: "10 mins",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "harvest-pasta",
    name: "24K Gold Butter Paneer Rigatoni",
    category: "Insta Favorites",
    price: 249,
    available: true,
    description: "Silky tomato-makhani cream reduction, artisan rigatoni, charred paneer cubes, topped with edible 24k gold flakes.",
    tag: "📸 Most Instagrammed",
    viralScore: 97,
    socialProof: "Featured on FoodieVibe & NYC Dining",
    portionsLeft: 4,
    prepTime: "12 mins",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281298?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "spice-taco",
    name: "Sizzle Bomb Volcano Kebab Wrap",
    category: "Quick Bite",
    price: 169,
    available: true,
    description: "Crispy spiced seekh kebabs, fiery ghost pepper sizzle drizzle, cooling mint curd dip, wrapped in roomali roti.",
    tag: "🌶️ Challenge Favorite",
    viralScore: 94,
    socialProof: "Over 5,000 spice challenge reels created",
    portionsLeft: 9,
    prepTime: "8 mins",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "matcha-cloud",
    name: "The Secret Midnight Matcha Cloud",
    category: "Secret Drops",
    price: 189,
    available: true,
    description: "Whispered about on social media—ceremonial Uji matcha cold foam over iced spiced chai espresso with cinnamon dusting.",
    tag: "🤫 Secret Chef Drop",
    viralScore: 98,
    socialProof: "Secret menu item • Limit 2 per order",
    portionsLeft: 3,
    prepTime: "5 mins",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "nitro-churros",
    name: "Dragon Smoke Nitro Churros",
    category: "Viral Hits",
    price: 179,
    available: true,
    description: "Crispy Spanish churros infused with cardamom sugar, dipped in liquid nitrogen dark chocolate ganache for tableside smoke.",
    tag: "✨ Viral Dessert",
    viralScore: 96,
    socialProof: "The ultimate table-side showstopper",
    portionsLeft: 7,
    prepTime: "7 mins",
    image: "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mint-cooler",
    name: "Nimbu Mint Sparkling Cooler",
    category: "Drinks",
    price: 129,
    available: true,
    description: "Hand-muddled fresh mint, organic lime juice, rock salt, and effervescent sparkling water with a charred lemon wheel.",
    tag: "🍸 Refreshing Hit",
    viralScore: 92,
    socialProof: "Perfect palate cleanser pairing",
    portionsLeft: 15,
    prepTime: "3 mins",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
  },
];

let menuState = initialMenu.map((item) => ({ ...item }));
let reservationState: Reservation[] = [
  {
    id: "res-001",
    customerName: "Aarav Mehta",
    partySize: 4,
    timeSlot: "19:00",
    table: "Terrace 2 (Best Lighting 📸)",
    status: "Confirmed",
  },
  {
    id: "res-002",
    customerName: "Nisha Kapoor",
    partySize: 2,
    timeSlot: "20:30",
    table: "Chef's Counter (Action View 👨‍🍳)",
    status: "Confirmed",
  },
  {
    id: "res-003",
    customerName: "Kabir Singh",
    partySize: 6,
    timeSlot: "21:00",
    table: "Garden Pergola (Group Fiesta 🎉)",
    status: "Pending",
  },
];

let orderState: RestaurantOrder[] = [
  {
    id: "ord-104",
    customer: "Mina Sharma",
    items: [
      { id: "smoke-burger", name: "Smoky Tandoori Truffle Burger", qty: 2, price: 199 },
      { id: "mint-cooler", name: "Nimbu Mint Sparkling Cooler", qty: 2, price: 129 },
    ],
    total: 656,
    status: "Preparing",
    eta: "10 min",
    channel: "Dine-in",
  },
  {
    id: "ord-105",
    customer: "Rohan Verma",
    items: [{ id: "harvest-pasta", name: "24K Gold Butter Paneer Rigatoni", qty: 1, price: 249 }],
    total: 249,
    status: "Ready",
    eta: "2 min",
    channel: "Takeaway",
  },
  {
    id: "ord-106",
    customer: "Sanya Malhotra",
    items: [
      { id: "matcha-cloud", name: "The Secret Midnight Matcha Cloud", qty: 2, price: 189 },
      { id: "nitro-churros", name: "Dragon Smoke Nitro Churros", qty: 1, price: 179 },
    ],
    total: 557,
    status: "Preparing",
    eta: "5 min",
    channel: "Online",
  },
];

let inventoryState: InventoryItem[] = [
  { name: "Brioche buns (Artisan)", stock: 14, target: 30 },
  { name: "Truffle Garlic Aioli", stock: 8, target: 20 },
  { name: "24K Edible Gold Flakes", stock: 5, target: 15 },
  { name: "Ceremonial Uji Matcha", stock: 12, target: 25 },
  { name: "Fresh Mint & Coriander", stock: 18, target: 25 },
  { name: "Liquid Nitrogen Canisters", stock: 6, target: 10 },
];

let staffState: StaffShift[] = [
  { name: "Sara Khan", role: "VIP Host & Vibe Sommelier", shift: "Dinner Rush" },
  { name: "Chef Vikram", role: "Executive Action Chef", shift: "Dinner Rush" },
  { name: "Jules D.", role: "Kitchen Orchestrator", shift: "Dinner Rush" },
  { name: "Miko S.", role: "Floor Runner (Terrace Section)", shift: "Dinner Rush" },
  { name: "Aryan R.", role: "Bar & Mixology Specialist", shift: "Late Night" },
];

export function getMenuItems(): MenuItem[] {
  return menuState.map((item) => ({ ...item }));
}

export function toggleMenuAvailability(id: string, available: boolean): MenuItem[] {
  menuState = menuState.map((item) => (item.id === id ? { ...item, available } : item));
  if (supabase) {
    supabase.from("menu_items").update({ available }).eq("id", id).then(() => {});
  }
  return getMenuItems();
}

export function adjustPortionsLeft(id: string, delta: number): MenuItem[] {
  menuState = menuState.map((item) => {
    if (item.id === id) {
      const current = item.portionsLeft ?? 10;
      const next = Math.max(0, current + delta);
      return { ...item, portionsLeft: next, available: next > 0 };
    }
    return item;
  });
  if (supabase) {
    const updated = menuState.find((item) => item.id === id);
    if (updated) {
      supabase.from("menu_items").update({ portions_left: updated.portionsLeft, available: updated.available }).eq("id", id).then(() => {});
    }
  }
  return getMenuItems();
}

export function getReservations(): Reservation[] {
  return reservationState.map((reservation) => ({ ...reservation }));
}

export function createReservation(input: {
  customerName: string;
  partySize: number;
  timeSlot: string;
  table: string;
}): Reservation {
  const reservation: Reservation = {
    id: `res-00${reservationState.length + 1}`,
    customerName: input.customerName,
    partySize: input.partySize,
    timeSlot: input.timeSlot,
    table: input.table,
    status: "Pending",
  };
  reservationState = [reservation, ...reservationState];
  if (supabase) {
    supabase.from("reservations").insert([{
      id: reservation.id,
      customer_name: reservation.customerName,
      party_size: reservation.partySize,
      time_slot: reservation.timeSlot,
      table_name: reservation.table,
      status: reservation.status,
    }]).then(() => {});
  }
  return reservation;
}

export function getOrders(): RestaurantOrder[] {
  return orderState.map((order) => ({ ...order, items: order.items.map((item) => ({ ...item })) }));
}

export function createOrder(input: {
  customer: string;
  items: OrderItem[];
  channel: RestaurantOrder["channel"];
}): RestaurantOrder {
  const total = input.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  
  // Automatically decrease portions left for ordered items to simulate real-time scarcity
  input.items.forEach((item) => {
    adjustPortionsLeft(item.id, -item.qty);
  });

  const order: RestaurantOrder = {
    id: `ord-${100 + orderState.length + 1}`,
    customer: input.customer,
    items: input.items,
    total,
    status: "Preparing",
    eta: "8 min",
    channel: input.channel,
  };
  orderState = [order, ...orderState];
  if (supabase) {
    supabase.from("orders").insert([{
      id: order.id,
      customer: order.customer,
      items: order.items,
      total: order.total,
      status: order.status,
      eta: order.eta,
      channel: order.channel,
    }]).then(() => {});
  }
  return order;
}

export function updateOrderStage(id: string, status: RestaurantOrder["status"]): RestaurantOrder[] {
  orderState = orderState.map((order) => (order.id === id ? { ...order, status } : order));
  if (supabase) {
    supabase.from("orders").update({ status }).eq("id", id).then(() => {});
  }
  return getOrders();
}

export function getInventory(): InventoryItem[] {
  return inventoryState.map((item) => ({ ...item }));
}

export function updateInventoryStock(name: string, stock: number): InventoryItem[] {
  inventoryState = inventoryState.map((item) => (item.name === name ? { ...item, stock } : item));
  if (supabase) {
    supabase.from("inventory").update({ stock }).eq("name", name).then(() => {});
  }
  return getInventory();
}

export function getStaff(): StaffShift[] {
  return staffState.map((shift) => ({ ...shift }));
}

export function getDashboardData() {
  const revenue = orderState.reduce((sum, order) => sum + order.total, 0);
  const occupancy = Math.round((reservationState.length / 6) * 100);
  const pendingOrders = orderState.filter((order) => order.status === "Preparing").length;
  const lowStock = inventoryState.filter((item) => item.stock < item.target).length;
  const insights = [
    { title: "Peak viral demand", value: "Friday 19:30–21:30", detail: "TikTok viral mentions drove +340% increase in Smoky Tandoori Burger orders." },
    { title: "AI inventory alert", value: `${lowStock} items below target`, detail: "Brioche buns and 24K edible gold flakes require urgent restock before weekend." },
    { title: "Guest vibe rating", value: "4.9/5 ★ (342 reviews)", detail: "Tableside Dragon Smoke Nitro Churros is rated #1 most shared dining experience in town." },
  ];
  return {
    revenue,
    occupancy,
    pendingOrders,
    lowStock,
    insights,
    viralHypeScore: 97,
    socialMentions: "28.4K this week",
    aiAlerts: [
      { id: "alt-1", type: "trend", message: "🔥 TikTok spike for 'Smoky Tandoori Truffle Burger' (+340%). Recommended: increase bun dough batch by +15 portions." },
      { id: "alt-2", type: "pricing", message: "⚡ Peak evening demand forecasted for 24K Gold Pasta. AI dynamic margin optimization active (+₹20 during 7-9 PM)." },
      { id: "alt-3", type: "staff", message: "👥 VIP arriving at 19:00 on Terrace 2. Assigned runner Miko S. for personalized tableside presentation." },
    ],
  };
}
