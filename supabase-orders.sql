-- =============================================
-- Supabase SQL: Create orders table
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_note TEXT,
  payment_method TEXT DEFAULT 'cod',
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable select for all users"
  ON orders FOR SELECT
  USING (true);
