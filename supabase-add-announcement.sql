-- Thêm các cột mới cho Announcement Bar vào bảng featured_sections
-- Chạy lệnh này trong Supabase SQL Editor

ALTER TABLE featured_sections
  ADD COLUMN IF NOT EXISTS announcement_text TEXT,
  ADD COLUMN IF NOT EXISTS announcement_bg TEXT,
  ADD COLUMN IF NOT EXISTS announcement_text_color TEXT,
  ADD COLUMN IF NOT EXISTS banner_cta_align TEXT DEFAULT 'bottom-center',
  ADD COLUMN IF NOT EXISTS card_style_data JSONB;

-- Tạo row mặc định cho announcement bar (nếu chưa có)
INSERT INTO featured_sections (section_key, announcement_text, announcement_bg, announcement_text_color, product_ids)
VALUES (
  'announcement',
  'MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TỪ 1.000.000₫',
  '#000000',
  '#ffffff',
  '{}'
)
ON CONFLICT DO NOTHING;
