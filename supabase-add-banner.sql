-- =============================================
-- Add banner columns to featured_sections table
-- Run this ONLY if you already created the table before
-- =============================================

ALTER TABLE featured_sections ADD COLUMN IF NOT EXISTS banner_image TEXT DEFAULT '';
ALTER TABLE featured_sections ADD COLUMN IF NOT EXISTS banner_title TEXT DEFAULT '';
ALTER TABLE featured_sections ADD COLUMN IF NOT EXISTS banner_subtitle TEXT DEFAULT '';
ALTER TABLE featured_sections ADD COLUMN IF NOT EXISTS banner_cta TEXT DEFAULT '';

-- Update existing row with default banner values
UPDATE featured_sections
SET
  banner_image = '/images/hero.png',
  banner_title = 'Khám phá bộ sưu tập mùa xuân.',
  banner_subtitle = 'Xuân 2026',
  banner_cta = 'Sắc màu mới đã có mặt'
WHERE section_key = 'editorial'
  AND (banner_image IS NULL OR banner_image = '');
