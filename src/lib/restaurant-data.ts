export type Role = "customer" | "manager";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  description: string;
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
    name: "Smoky Stack Burger",
    category: "Bestseller",
    price: 14.5,
    available: true,
    description: "Double patty, smoked aioli, pickles, and brioche bun.",
  },
  {
    id: "harvest-pasta",
    name: "Harvest Pasta",
    category: "Chef Special",
    price: 13.0,
    available: true,
    description: "Roasted vegetables with basil cream and parmesan crunch.",
  },
  {
    id: "spice-taco",
    name: "Spice Glow Tacos",
    category: "Quick Bite",
    price: 9.75,
    available: false,
    description: "Crispy cauliflower and chili glaze with herb salsa.",
  },
  {
    id: "mint-cooler",
    name: "Mint Citrus Cooler",
    category: "Drinks",
    price: 5.5,
    available: true,
    description: "Fresh mint, orange, and lime with a sparkling finish.",
  },
];

let menuState = initialMenu.map((item) => ({ ...item }));
let reservationState: Reservation[] = [
  {
    id: "res-001",
    customerName: "Ava Chen",
    partySize: 4,
    timeSlot: "19:00",
    table: "Terrace 2",
    status: "Confirmed",
  },
  {
    id: "res-002",
    customerName: "Noah Patel",
    partySize: 2,
    timeSlot: "20:30",
    table: "Window 1",
    status: "Pending",
  },
];

let orderState: RestaurantOrder[] = [
  {
    id: "ord-104",
    customer: "Mina",
    items: [
      { id: "smoke-burger", name: "Smoky Stack Burger", qty: 2, price: 14.5 },
      { id: "mint-cooler", name: "Mint Citrus Cooler", qty: 2, price: 5.5 },
    ],
    total: 40,
    status: "Preparing",
    eta: "12 min",
    channel: "Dine-in",
  },
  {
    id: "ord-105",
    customer: "Leo",
    items: [{ id: "harvest-pasta", name: "Harvest Pasta", qty: 1, price: 13 }],
    total: 13,
    status: "Ready",
    eta: "3 min",
    channel: "Takeaway",
  },
];

let inventoryState: InventoryItem[] = [
  { name: "Brioche buns", stock: 18, target: 24 },
  { name: "Fresh basil", stock: 11, target: 18 },
  { name: "Cauliflower", stock: 7, target: 12 },
  { name: "Citrus garnish", stock: 16, target: 20 },
];

let staffState: StaffShift[] = [
  { name: "Sara", role: "Host", shift: "Lunch" },
  { name: "Jules", role: "Kitchen Lead", shift: "Dinner" },
  { name: "Miko", role: "Floor Runner", shift: "Dinner" },
];

export function getMenuItems(): MenuItem[] {
  return menuState.map((item) => ({ ...item }));
}

export function toggleMenuAvailability(id: string, available: boolean): MenuItem[] {
  menuState = menuState.map((item) => (item.id === id ? { ...item, available } : item));
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
    id: `res-${reservationState.length + 1}`,
    customerName: input.customerName,
    partySize: input.partySize,
    timeSlot: input.timeSlot,
    table: input.table,
    status: "Pending",
  };
  reservationState = [reservation, ...reservationState];
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
  const order: RestaurantOrder = {
    id: `ord-${100 + orderState.length}`,
    customer: input.customer,
    items: input.items,
    total,
    status: "Preparing",
    eta: "10 min",
    channel: input.channel,
  };
  orderState = [order, ...orderState];
  return order;
}

export function getInventory(): InventoryItem[] {
  return inventoryState.map((item) => ({ ...item }));
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
    { title: "Peak demand", value: "Friday 19:00", detail: "Dinner orders spike 18% before weekend rush." },
    { title: "Inventory forecast", value: `${lowStock} items need restock`, detail: "Basil and tacos are trending above target." },
    { title: "Guest satisfaction", value: "4.8/5", detail: "Wait times are down after smart queue updates." },
  ];
  return {
    revenue,
    occupancy,
    pendingOrders,
    lowStock,
    insights,
  };
}
