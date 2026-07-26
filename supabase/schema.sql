-- VibeServe Viral Restaurant & Dining OS - Supabase Backend Schema
-- Create tables for live restaurant operations, AI demand forecasting, and viral scarcity engine

-- 1. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  available BOOLEAN DEFAULT true,
  description TEXT,
  tag TEXT,
  viral_score INTEGER DEFAULT 90,
  social_proof TEXT,
  portions_left INTEGER DEFAULT 10,
  prep_time TEXT DEFAULT '10m',
  ingredients JSONB,
  making_of TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  party_size INTEGER NOT NULL,
  time_slot TEXT NOT NULL,
  table_name TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'Preparing',
  eta TEXT DEFAULT '8 min',
  channel TEXT DEFAULT 'Dine-in',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  stock INTEGER NOT NULL,
  target INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Staff Shifts Table
CREATE TABLE IF NOT EXISTS staff_shifts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  shift TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Seed Data for VibeServe Hackathon Demo
INSERT INTO menu_items (id, name, category, price, available, description, tag, viral_score, social_proof, portions_left, prep_time)
VALUES
  ('smoke-burger', 'Smoky Tandoori Truffle Burger', 'Viral Hits', 249, true, 'Charred brioche, tandoori paneer patty, truffle cheese drip, and crispy curry leaf shards.', '🔥 #1 TikTok Viral in NYC', 99, '2.4M Reels Views • "+340% demand spike tonight"', 4, '12m'),
  ('harvest-pasta', '24K Gold Butter Paneer Rigatoni', 'Viral Hits', 349, true, 'Rigatoni tossed in silky tomato-makhani cream, topped with edible 24K gold flakes and burrata.', '✨ Edible 24K Gold Flakes', 96, 'Featured in Top 10 Romantic Dinner Spots', 7, '15m'),
  ('spice-taco', 'Ghost Pepper Sizzle Taco', 'Viral Hits', 199, true, 'Charred corn tortilla, spicy jackfruit carnitas, ghost pepper sizzle sauce, and cooling mint curd.', '🌶️ Spicy Food Challenge', 94, 'Trending on Foodie Challenges #SpicyVibe', 3, '8m'),
  ('secret-matcha', 'Ceremonial Uji Matcha Cloud', 'Secret Drops', 229, true, 'Whisked organic Kyoto matcha poured over coconut cloud cream and toasted sesame brittle.', '🤫 Secret Menu Drop', 98, 'VIP Member Exclusive Drop • 400+ Wishlisted', 5, '5m'),
  ('nitro-churros', 'Dragon Smoke Nitro Churros', 'Secret Drops', 279, true, 'Warm cinnamon churros served with liquid nitrogen chocolate pot for dramatic table smoke.', '💨 Liquid Nitrogen Table Show', 97, 'Most Instagrammed Dessert of 2026', 6, '10m'),
  ('mint-cooler', 'Nimbu Mint Sparkling Cooler', 'Drinks', 129, true, 'Fresh lime, crushed mint, roasted cumin, and sparkling Himalayan mineral water.', '🍹 Summer Refresher', 90, 'Pairing Favorite for Tandoori Items', 12, '3m'),
  ('rose-mocktail', 'Smoked Rose & Cardamom Fizz', 'Drinks', 159, true, 'Rose water, crushed cardamom, pomegranate reduction, and applewood smoke bubble.', '🫧 Smoked Bubble Glass', 93, 'Viral Bubble Pop Reel Favorite', 8, '5m')
ON CONFLICT (id) DO NOTHING;

INSERT INTO inventory (name, stock, target)
VALUES
  ('Brioche Buns & Paneer Patties', 6, 20),
  ('Truffle Cheese & Makhani Cream', 8, 15),
  ('24K Edible Gold Flakes', 5, 15),
  ('Ceremonial Uji Matcha', 12, 25),
  ('Fresh Mint & Coriander', 18, 25),
  ('Liquid Nitrogen Canisters', 6, 10)
ON CONFLICT (name) DO NOTHING;

INSERT INTO staff_shifts (name, role, shift)
VALUES
  ('Sara Khan', 'VIP Host & Vibe Sommelier', 'Dinner Rush'),
  ('Chef Vikram', 'Executive Action Chef', 'Dinner Rush'),
  ('Jules D.', 'Kitchen Orchestrator', 'Dinner Rush'),
  ('Miko S.', 'Floor Runner (Terrace Section)', 'Dinner Rush'),
  ('Aryan R.', 'Bar & Mixology Specialist', 'Late Night');
