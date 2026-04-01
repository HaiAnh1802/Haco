-- =============================================
-- Supabase SQL: Create featured_sections table
-- Run this in Supabase Dashboard > SQL Editor
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
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE featured_sections ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "featured_sections_select" ON featured_sections FOR SELECT USING (true);

-- Write access (for admin)
CREATE POLICY "featured_sections_insert" ON featured_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "featured_sections_update" ON featured_sections FOR UPDATE USING (true);
CREATE POLICY "featured_sections_delete" ON featured_sections FOR DELETE USING (true);

-- Seed default data (current Editorial + Hero content)
INSERT INTO featured_sections (section_key, title, description, product_ids, is_active, banner_image, banner_title, banner_subtitle, banner_cta)
VALUES (
  'editorial',
  'Sắc màu mùa xuân.',
  'Khám phá bộ sưu tập Pocket Blush và Peptide Lip Tint phiên bản giới hạn vừa kịp cho mùa xuân. Được thiết kế để phối hợp cùng nhau, với các tông hồng và đỏ rực rỡ cùng lớp tint lấp lánh được bạn lựa chọn.',
  '[]'::jsonb,
  true,
  '/images/hero.png',
  'Khám phá bộ sưu tập mùa xuân.',
  'Xuân 2026',
  'Sắc màu mới đã có mặt'
)
ON CONFLICT (section_key) DO NOTHING;
