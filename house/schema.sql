-- =========================================================
-- RAVIKUMAR HOUSE MATERIALS — Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com)
-- =========================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  stock INT DEFAULT 0,
  available BOOLEAN DEFAULT true,
  image TEXT,
  popular BOOLEAN DEFAULT false,
  delivery TEXT,
  min_qty INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial products
INSERT INTO public.products (id, name, name_en, category, price, unit, stock, available, image, popular, delivery, min_qty)
VALUES 
  ('sand', 'Sand (ఇసుక)', 'Sand', 'sand', 2500, 'Load', 50, true, 'sand.jpg', true, '🚛 Same-day / Next-day delivery', 1),
  ('dust', 'Dust', 'Dust', 'sand', 1800, 'Load', 30, true, 'dust.jpg', false, '🚛 Same-day delivery available', 1),
  ('20mm-kankara', '20 MM Kankara', '20MM Kankara', 'aggregate', 3000, 'Load', 35, true, '20mm-kankara.jpg', true, '🚛 Next-day delivery', 1),
  ('40mm-kankara', '40 MM Kankara', '40MM Kankara', 'aggregate', 3200, 'Load', 40, true, '40mm-kankara.jpg', true, '🚛 Delivered to your site', 1),
  ('water-tanker', 'Water Tanker Service', 'Water Tanker', 'service', 1200, 'Trip', 20, true, 'water-tanker.jpg', true, '🚰 Delivered directly to site', 1),
  ('red-bricks', 'Red Bricks', 'Red Bricks', 'brick', 8, 'Piece', 5000, true, 'red-bricks.jpg', true, '🚛 Bulk delivery available', 100),
  ('cement-bricks', 'Cement Bricks', 'Cement Bricks', 'brick', 35, 'Piece', 2000, true, 'cement-bricks.jpg', false, '🚛 Bulk orders delivered', 50)
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  available = EXCLUDED.available,
  image = EXCLUDED.image;

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  landmark TEXT,
  city TEXT,
  pincode TEXT,
  delivery_date DATE NOT NULL,
  delivery_time TEXT,
  notes TEXT,
  products JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_charge NUMERIC DEFAULT 200,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'Pending',
  order_status TEXT DEFAULT 'Order Placed',
  status_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICE BOOKINGS TABLE (Tractor & Water Tanker)
CREATE TABLE IF NOT EXISTS public.service_bookings (
  id TEXT PRIMARY KEY,
  service_type TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  location TEXT,
  service_date DATE NOT NULL,
  service_time TEXT NOT NULL,
  duration TEXT,
  requirements TEXT,
  tanker_type TEXT,
  quantity INT DEFAULT 1,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist before recreating to prevent duplicate policy errors
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read access to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert to service_bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Allow public read access to service_bookings" ON public.service_bookings;

-- Create policies safely
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert to service_bookings" ON public.service_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to service_bookings" ON public.service_bookings FOR SELECT USING (true);
