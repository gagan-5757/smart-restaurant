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
    name: "Smoky Tandoori Burger",
    category: "Bestseller",
    price: 149,
    available: true,
    description: "Spiced patty, mint chutney, onion relish, and toasted bun.",
  },
  {
    id: "harvest-pasta",
    name: "Butter Paneer Pasta",
    category: "Chef Special",
    price: 189,
    available: true,
    description: "Creamy paneer, roasted peppers, and a touch of masala spice.",
  },
  {
    id: "spice-taco",
    name: "Chili Kebab Wrap",
    category: "Quick Bite",
    price: 129,
    available: false,
    description: "Crispy kebab filling with tangy chutney and fresh herbs.",
  },
  {
    id: "mint-cooler",
    name: "Nimbu Mint Cooler",
    category: "Drinks",
    price: 119,
    available: true,
    description: "Fresh lime, mint, and a sparkling citrus finish.",
  },
];

let menuState = initialMenu.map((item) => ({ ...item }));
let reservationState: Reservation[] = [
  {
    id: "res-001",
    customerName: "Aarav Mehta",
    partySize: 4,
    timeSlot: "19:00",
    table: "Terrace 2",
    status: "Confirmed",
  },
  {
    id: "res-002",
    customerName: "Nisha Kapoor",
    partySize: 2,
    timeSlot: "20:30",
    table: "Window 1",
    status: "Pending",
  },
];

let orderState: RestaurantOrder[] = [
  {
    id: "ord-104",
    customer: "Mina Sharma",
    items: [
      { id: "smoke-burger", name: "Smoky Tandoori Burger", qty: 2, price: 149 },
      { id: "mint-cooler", name: "Nimbu Mint Cooler", qty: 2, price: 119 },
    ],
    total: 536,
    status: "Preparing",
    eta: "12 min",
    channel: "Dine-in",
  },
  {
    id: "ord-105",
    customer: "Rohan Verma",
    items: [{ id: "harvest-pasta", name: "Butter Paneer Pasta", qty: 1, price: 189 }],
    total: 189,
    status: "Ready",
    eta: "3 min",
    channel: "Takeaway",
  },
];

let inventoryState: InventoryItem[] = [
  { name: "Brioche buns", stock: 18, target: 24 },
  { name: "Fresh coriander", stock: 11, target: 18 },
  { name: "Paneer cubes", stock: 7, target: 12 },
  { name: "Lime garnish", stock: 16, target: 20 },
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
