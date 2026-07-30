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
  ingredients?: string[];
  makingOf?: string;
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

export const initialMenuData: MenuItem[] = [
  // 1. BURGERS & FRIES
  {
    id: "smoke-burger",
    name: "Smoky Tandoori Truffle Burger",
    category: "Burgers & Fries",
    price: 249,
    available: true,
    description: "Charred artisan patty, smoked tandoori glaze, truffle garlic aioli, crispy onion crunch on brioche bun.",
    tag: "🔥 #1 TikTok Viral",
    viralScore: 99,
    socialProof: "18.4K TikTok mentions this week • 4.9★",
    portionsLeft: 6,
    prepTime: "10 mins",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Artisan Brioche Bun", "Tandoori Charred Patty", "Black Truffle Aioli", "Crispy Onion Strings", "Smoked Gouda Cheese"],
    makingOf: "Step 1: Artisan brioche buns are toasted with garlic-thyme butter. Step 2: Patty is seared over open white-oak flame and glazed with 24-hr fermented tandoori spices. Step 3: Drizzled with Italian black truffle aioli and crowned with crispy fried onion shards.",
  },
  {
    id: "gold-loaded-fries",
    name: "24K Gold Makhani Loaded Fries",
    category: "Burgers & Fries",
    price: 199,
    available: true,
    description: "Crispy double-fried Belgian frites smothered in velvety butter makhani gravy, melted bocconcini, and edible gold dust.",
    tag: "🍟 Crowd Favorite",
    viralScore: 95,
    socialProof: "Voted Best Loaded Fries 2026 • 4.8★",
    portionsLeft: 12,
    prepTime: "8 mins",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Belgian Russet Potatoes", "Velvety Makhani Gravy", "Melted Bocconcini", "Edible 24K Gold Flakes", "Charred Cilantro"],
    makingOf: "Step 1: Russet potatoes are double-fried at precisely 180°C for maximum golden crunch. Step 2: Smothered in our slow-simmered tomato butter makhani reduction. Step 3: Finished with blowtorch-melted bocconcini and a dusting of genuine 24K gold flakes.",
  },
  {
    id: "paneer-smash",
    name: "Crisp Paneer Smash Burger",
    category: "Burgers & Fries",
    price: 219,
    available: true,
    description: "Smashed spiced paneer patty with crispy edges, spicy chipotle mayo, jalapeño relish, and melted cheddar on toasted potato bun.",
    tag: "🍔 Crispy Sensation",
    viralScore: 93,
    socialProof: "Over 3,000 smash videos on reels",
    portionsLeft: 8,
    prepTime: "9 mins",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Potato Bun", "Spiced Smashed Paneer", "Chipotle Mayo", "Pickled Jalapeño Relish", "Aged Cheddar"],
    makingOf: "Step 1: Spiced paneer slab is pressed ultra-thin onto a 400°F cast-iron griddle until edges caramelize into a lacy crunch. Step 2: Slathered with smoky chipotle mayo and topped with zesty jalapeño relish for a fiery kick.",
  },

  // 2. PIZZA PARADISE & PASTAS
  {
    id: "harvest-pasta",
    name: "24K Gold Butter Paneer Rigatoni",
    category: "Pizza Paradise",
    price: 289,
    available: true,
    description: "Silky tomato-makhani cream reduction, artisan rigatoni, charred paneer cubes, topped with edible 24k gold flakes.",
    tag: "📸 Most Instagrammed",
    viralScore: 97,
    socialProof: "Featured on FoodieVibe & NYC Dining",
    portionsLeft: 4,
    prepTime: "12 mins",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Bronze-Die Rigatoni", "San Marzano Makhani Cream", "Charred Paneer Cubes", "24K Gold Leaf", "Fresh Basil"],
    makingOf: "Step 1: Bronze-die artisan rigatoni boiled al dente. Step 2: Tossed in a wok with San Marzano tomatoes, cashew cream, and fenugreek. Step 3: Crowned with wood-fired paneer cubes and garnished with shimmering gold leaf.",
  },
  {
    id: "burrata-truffle-pizza",
    name: "Truffle Burrata & Wild Mushroom Pizza",
    category: "Pizza Paradise",
    price: 349,
    available: true,
    description: "72-hour cold-fermented Neapolitan dough, roasted porcini & shiitake mushrooms, creamy center burrata, and white truffle oil.",
    tag: "🍕 Neapolitan Masterpiece",
    viralScore: 96,
    socialProof: "99.8% Perfect Crust Rating by Food Critics",
    portionsLeft: 5,
    prepTime: "14 mins",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    ingredients: ["72h Sourdough Crust", "Fresh Burrata Ball", "Roasted Porcini Mushrooms", "White Truffle Oil", "Thyme & Garlic Cream"],
    makingOf: "Step 1: Our 72-hour cold-fermented dough is hand-stretched to form a puffy leopard-spotted cornicione. Step 2: Baked at 450°C in our wood-fired oven for just 90 seconds with roasted mushrooms. Step 3: Topped fresh out of the oven with a cool, creamy burrata ball and aromatic white truffle oil.",
  },
  {
    id: "volcano-pepperoni-pizza",
    name: "Fiery Tandoori Pepperoni Volcano Pizza",
    category: "Pizza Paradise",
    price: 329,
    available: true,
    description: "Spicy tandoori spiced pepperoni cups that pool with hot honey drizzle, mozzarella, and calabrian chili crunch.",
    tag: "🔥 Spicy Honey Splash",
    viralScore: 94,
    socialProof: "Trending #HotHoneyPizza challenge",
    portionsLeft: 7,
    prepTime: "13 mins",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Artisan Pizza Crust", "Crispy Pepperoni Cups", "Spicy Hot Honey Drizzle", "Calabrian Chili Crunch", "Smoked Mozzarella"],
    makingOf: "Step 1: Layered with smoked mozzarella and thick-cut pepperoni that curls into crispy cups when baked. Step 2: Drizzled generously with chili-infused hot honey straight from the oven for the ultimate sweet-savory volcano sensation.",
  },

  // 3. SANDWICHES & WRAPS
  {
    id: "spice-taco",
    name: "Sizzle Bomb Volcano Kebab Wrap",
    category: "Sandwiches & Wraps",
    price: 189,
    available: true,
    description: "Crispy spiced seekh kebabs, fiery ghost pepper sizzle drizzle, cooling mint curd dip, wrapped in roomali roti.",
    tag: "🌶️ Challenge Favorite",
    viralScore: 94,
    socialProof: "Over 5,000 spice challenge reels created",
    portionsLeft: 9,
    prepTime: "8 mins",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Roomali Roti Wrap", "Charred Seekh Kebab", "Ghost Pepper Sizzle Sauce", "Cooling Mint Curd", "Pickled Red Onions"],
    makingOf: "Step 1: Ultra-thin roomali roti warmed on an inverted iron griddle. Step 2: Stuffed with juicy charcoal-grilled seekh kebabs and pickled onions. Step 3: Doused in our infamous ghost pepper sizzle sauce and balanced with cooling mint yogurt.",
  },
  {
    id: "bombay-crunch-sandwich",
    name: "Bombay Grilled Cheese Crunch Sandwich",
    category: "Sandwiches & Wraps",
    price: 169,
    available: true,
    description: "Triple-decker sourdough sourdough toast with spicy potato masala, mint chutney, beetroot carpaccio, and melted amul cheese.",
    tag: "🥪 Street Style Classic",
    viralScore: 91,
    socialProof: "Nostalgic street food upgraded • 4.9★",
    portionsLeft: 11,
    prepTime: "7 mins",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Artisan Sourdough", "Spiced Potato Masala", "Green Mint Chutney", "Beetroot & Cucumber", "Amul Melted Cheese"],
    makingOf: "Step 1: Thick-cut sourdough bread slathered with fiery green mint chutney and garlic butter. Step 2: Layered with spiced potato masala, crisp veggies, and a mountain of cheese. Step 3: Grilled in a heavy cast-iron sandwich press until golden brown and dripping.",
  },
  {
    id: "crispy-falafel-wrap",
    name: "Crispy Falafel & Tahini Lava Wrap",
    category: "Sandwiches & Wraps",
    price: 179,
    available: true,
    description: "Herb-crusted green falafel balls, velvety garlic tahini lava drip, pink pickled turnips, and crunchy romaine in toasted pita.",
    tag: "🌱 100% Plant-Based Hit",
    viralScore: 90,
    socialProof: "Voted #1 Vegan Wrap in Town",
    portionsLeft: 10,
    prepTime: "8 mins",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Toasted Lebanese Pita", "Herb Green Falafel", "Garlic Tahini Lava Sauce", "Pink Pickled Turnips", "Fresh Sumac Parsley"],
    makingOf: "Step 1: Chickpea and broad bean falafels fried fresh to order with a vibrant green parsley-coriander interior. Step 2: Wrapped in warm Lebanese pita with tangy pickled turnips. Step 3: Flooded with our rich, creamy garlic-lemon tahini lava drip.",
  },

  // 4. FRIED & CRISPY
  {
    id: "korean-gochujang-wings",
    name: "Korean Honey-Gochujang Glazed Wings",
    category: "Fried & Crispy",
    price: 239,
    available: true,
    description: "Double-crunch chicken wings coated in sweet & spicy gochujang garlic glaze, toasted sesame seeds, and crushed peanuts.",
    tag: "🍗 ASMR Crunch",
    viralScore: 98,
    socialProof: "12M views on ASMR wing crunch TikToks",
    portionsLeft: 8,
    prepTime: "11 mins",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Jumbo Chicken Wings", "Gochujang Chili Glaze", "Wild Flower Honey", "Toasted Sesame Seeds", "Crushed Roasted Peanuts"],
    makingOf: "Step 1: Wings coated in potato starch and double-fried for an glass-like shatter crunch that stays crispy for hours. Step 2: Wok-tossed in simmering honey-gochujang garlic sauce until every crevice is glazed. Step 3: Showered with toasted sesame seeds and crushed peanuts.",
  },
  {
    id: "tempura-prawns",
    name: "Golden Tempura Prawns with Wasabi Drip",
    category: "Fried & Crispy",
    price: 299,
    available: true,
    description: "Feather-light crispy battered tiger prawns served with matcha salt and a zesty avocado-wasabi dipping emulsion.",
    tag: "🍤 Golden Shatter",
    viralScore: 94,
    socialProof: "Chef's special seafood sensation",
    portionsLeft: 6,
    prepTime: "9 mins",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Tiger Prawns", "Ice-Cold Tempura Batter", "Matcha Sea Salt", "Avocado Wasabi Emulsion", "Daikon Radish Shavings"],
    makingOf: "Step 1: Tiger prawns dipped in ice-cold sparkling water tempura batter. Step 2: Flash-fried in pure sesame oil for exactly 90 seconds for airy perfection. Step 3: Dusted with ceremonial matcha sea salt and paired with creamy avocado-wasabi dip.",
  },
  {
    id: "sizzling-paneer-tikka",
    name: "Table-side Sizzling Paneer Tikka Platter",
    category: "Fried & Crispy",
    price: 259,
    available: true,
    description: "Marinated cottage cheese steaks seared over charcoal, served on a smoking iron skillet with peppers and mint chutney.",
    tag: "🔥 Table-Side Smoke",
    viralScore: 95,
    socialProof: "The aromatics turn every head in the room",
    portionsLeft: 7,
    prepTime: "12 mins",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Charcoal Grilled Paneer", "Bell Peppers & Red Onions", "Kasuri Methi Butter", "Charcoal Smoke", "Spicy Mint Chutney"],
    makingOf: "Step 1: Paneer cubes marinated in hung curd, mustard oil, and Kashmiri chili for 12 hours. Step 2: Skewered and roasted in a traditional 500°C clay tandoor. Step 3: Served on a screaming hot iron sizzler platter deglazed with herb butter for table-side drama.",
  },

  // 5. SECRET DROPS & DRINKS
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
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Ceremonial Uji Matcha", "Vanilla Sweet Cream Foam", "Spiced Chai Espresso", "Oat Milk", "Cinnamon Dusting"],
    makingOf: "Step 1: Spiced chai espresso brewed over craft ice spheres. Step 2: Ceremonial grade Uji matcha whisked with bamboo chasen into velvety sweet cream foam. Step 3: Layered gently to create a mesmerizing green-and-amber cascading cloud.",
  },
  {
    id: "nitro-churros",
    name: "Dragon Smoke Nitro Churros",
    category: "Secret Drops",
    price: 199,
    available: true,
    description: "Crispy Spanish churros infused with cardamom sugar, dipped in liquid nitrogen dark chocolate ganache for tableside smoke.",
    tag: "✨ Viral Dessert",
    viralScore: 96,
    socialProof: "The ultimate table-side showstopper",
    portionsLeft: 7,
    prepTime: "7 mins",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Spanish Churro Loop", "Cardamom Cinnamon Sugar", "Valrhona Dark Chocolate", "Liquid Nitrogen Bath", "Chili Chocolate Shavings"],
    makingOf: "Step 1: Freshly piped churro loops fried until golden and tossed in cardamom-cinnamon sugar. Step 2: Dipped tableside into Valrhona dark chocolate ganache chilled with liquid nitrogen, making you breathe dragon smoke with every bite!",
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
    ingredients: ["Fresh Spearmint Leaves", "Organic Lime Juice", "Himalayan Black Rock Salt", "Sparkling Soda Water", "Charred Lemon Wheel"],
    makingOf: "Step 1: Fresh spearmint and rock salt gently muddled to release essential oils without bitterness. Step 2: Mixed with organic squeezed lime juice and charged with high-fizz sparkling water. Step 3: Garnished with a blowtorched caramelized lemon wheel.",
  },
];

let menuState = initialMenuData.map((item) => ({ ...item }));
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
