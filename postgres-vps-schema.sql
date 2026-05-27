-- =============================================
-- HACO DATABASE - VPS PostgreSQL Schema
-- Chạy file này trong pgAdmin > Query Tool
-- Đã xóa toàn bộ RLS và Policy của Supabase
-- =============================================

-- Extension cần thiết cho gen_random_uuid() trên PostgreSQL 10
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. BẢNG PRODUCTS (sản phẩm gốc)
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  price TEXT NOT NULL,
  size TEXT,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  shades JSONB DEFAULT '[]'::jsonb,
  shade_groups JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  application TEXT,
  key_ingredients JSONB DEFAULT '[]'::jsonb,
  ingredient_spotlight JSONB DEFAULT '{}'::jsonb,
  sensory JSONB DEFAULT '{}'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  sustainability JSONB DEFAULT '{}'::jsonb,
  category TEXT,
  card_image TEXT,
  card_badge TEXT,
  card_desc TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2. BẢNG HACO_PRODUCTS + HACO_VARIANTS (sản phẩm Haco)
-- =============================================
CREATE TABLE IF NOT EXISTS haco_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  usage_info TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  card_image TEXT,
  category TEXT DEFAULT 'Khác',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS haco_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES haco_products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  original_price INTEGER NOT NULL,
  sale_price INTEGER,
  images JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0
);

-- Index để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_haco_products_slug ON haco_products(slug);
CREATE INDEX IF NOT EXISTS idx_haco_variants_product_id ON haco_variants(product_id);

-- =============================================
-- 3. BẢNG FEATURED_SECTIONS (banner, editorial...)
-- =============================================
CREATE TABLE IF NOT EXISTS featured_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  product_ids JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  banner_image TEXT DEFAULT '',
  banner_title TEXT DEFAULT '',
  banner_subtitle TEXT DEFAULT '',
  banner_cta TEXT DEFAULT '',
  banner_slides JSONB DEFAULT '[]'::jsonb,
  announcement_text TEXT,
  announcement_bg TEXT,
  announcement_text_color TEXT,
  banner_cta_align TEXT DEFAULT 'bottom-center',
  card_style_data JSONB,
  brand_values_data JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed dữ liệu mặc định cho featured_sections
INSERT INTO featured_sections (section_key, title, description, product_ids, is_active, banner_image, banner_title, banner_subtitle, banner_cta)
VALUES (
  'editorial',
  'Sắc màu mùa xuân.',
  'Khám phá bộ sưu tập Pocket Blush và Peptide Lip Tint phiên bản giới hạn vừa kịp cho mùa xuân.',
  '[]'::jsonb,
  true,
  '/images/hero.png',
  'Khám phá bộ sưu tập mùa xuân.',
  'Xuân 2026',
  'Sắc màu mới đã có mặt'
)
ON CONFLICT (section_key) DO NOTHING;

-- Seed Feature section
INSERT INTO featured_sections (section_key, title, description, is_active, banner_image, banner_title, banner_subtitle, banner_cta, product_ids)
VALUES (
  'feature',
  'Kết nối tức thì.',
  'Chúng tôi cũng đã tạo ra những chiếc Lip Case mới để phối hợp.',
  true,
  '/images/lip-case.png',
  'Phiên Bản Giới Hạn',
  '',
  'Mua ngay',
  '[]'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;

-- Seed BrandValues section
INSERT INTO featured_sections (section_key, title, description, is_active, brand_values_data, product_ids)
VALUES (
  'brand_values',
  'rhode + bạn',
  '',
  true,
  '[
    {"icon": "✦", "title": "Giá Trị Của Chúng Tôi", "desc": "PHỤC HỒI, BẢO VỆ và NUÔI DƯỠNG làn da hiện tại của bạn để có kết quả lâu dài theo thời gian.", "link": "Giá Trị"},
    {"icon": "♡", "title": "Rhode Futures", "desc": "QUỸ RHODE FUTURES hỗ trợ các tổ chức hoạt động nhằm xóa bỏ rào cản kìm hãm phụ nữ.", "link": "Tác Động"},
    {"icon": "◎", "title": "Bền Vững", "desc": "Từ nguyên liệu có nguồn gốc có ý thức đến bao bì làm từ vật liệu tái chế.", "link": "Dấu Chân Xanh"}
  ]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;

-- Seed Announcement bar
INSERT INTO featured_sections (section_key, announcement_text, announcement_bg, announcement_text_color, product_ids)
VALUES (
  'announcement',
  'MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TỪ 1.000.000₫',
  '#000000',
  '#ffffff',
  '{}'
)
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. BẢNG ORDERS (đơn hàng)
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

-- =============================================
-- HOÀN THÀNH! Tất cả bảng đã được tạo.
-- =============================================
