-- =============================================
-- Supabase SQL: Create haco_products + haco_variants tables
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- Drop old tables if they exist (optional, remove if you want to keep old data)
-- DROP TABLE IF EXISTS haco_variants CASCADE;
-- DROP TABLE IF EXISTS haco_products CASCADE;

-- Products table
CREATE TABLE IF NOT EXISTS haco_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  usage_info TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  card_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Variants table
CREATE TABLE IF NOT EXISTS haco_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES haco_products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  original_price INTEGER NOT NULL,
  sale_price INTEGER,
  images JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE haco_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE haco_variants ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "haco_products_select" ON haco_products FOR SELECT USING (true);
CREATE POLICY "haco_variants_select" ON haco_variants FOR SELECT USING (true);

-- Write access (for seeding / admin)
CREATE POLICY "haco_products_insert" ON haco_products FOR INSERT WITH CHECK (true);
CREATE POLICY "haco_products_update" ON haco_products FOR UPDATE USING (true);
CREATE POLICY "haco_products_delete" ON haco_products FOR DELETE USING (true);

CREATE POLICY "haco_variants_insert" ON haco_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "haco_variants_update" ON haco_variants FOR UPDATE USING (true);
CREATE POLICY "haco_variants_delete" ON haco_variants FOR DELETE USING (true);

-- Index for fast slug lookup
CREATE INDEX IF NOT EXISTS idx_haco_products_slug ON haco_products(slug);
CREATE INDEX IF NOT EXISTS idx_haco_variants_product_id ON haco_variants(product_id);
