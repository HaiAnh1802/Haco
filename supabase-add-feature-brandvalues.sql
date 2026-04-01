-- =============================================
-- Add Feature + BrandValues sections to featured_sections
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- Seed Feature section data
INSERT INTO featured_sections (section_key, title, description, is_active, banner_image, banner_title, banner_subtitle, banner_cta, product_ids)
VALUES (
  'feature',
  'Kết nối tức thì.',
  'Chúng tôi cũng đã tạo ra những chiếc Lip Case mới để phối hợp. Cả Signature và Snap-On Lip Case đều có các màu phiên bản giới hạn để kết hợp với Peptide Lip Tint màu Sweet Pea và Pretzel.',
  true,
  '/images/lip-case.png',
  'Phiên Bản Giới Hạn',
  '',
  'Mua ngay',
  '[]'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;

-- Add brand_values_data column for BrandValues cards (JSONB array)
ALTER TABLE featured_sections ADD COLUMN IF NOT EXISTS brand_values_data JSONB DEFAULT '[]'::jsonb;

-- Seed BrandValues section data
INSERT INTO featured_sections (section_key, title, description, is_active, brand_values_data, product_ids)
VALUES (
  'brand_values',
  'rhode + bạn',
  '',
  true,
  '[
    {"icon": "✦", "title": "Giá Trị Của Chúng Tôi", "desc": "PHỤC HỒI, BẢO VỆ và NUÔI DƯỠNG làn da hiện tại của bạn để có kết quả lâu dài theo thời gian.", "link": "Giá Trị"},
    {"icon": "♡", "title": "Rhode Futures", "desc": "QUỸ RHODE FUTURES hỗ trợ các tổ chức hoạt động nhằm xóa bỏ rào cản kìm hãm phụ nữ.", "link": "Tác Động"},
    {"icon": "◎", "title": "Bền Vững", "desc": "Từ nguyên liệu có nguồn gốc có ý thức đến bao bì làm từ vật liệu tái chế, chúng tôi cam kết CHĂM SÓC DA CÓ TRÁCH NHIỆM.", "link": "Dấu Chân Xanh"}
  ]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;
