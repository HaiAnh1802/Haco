-- =============================================
-- Add banner_slides column to featured_sections table
-- This stores an array of banner slide image URLs
-- Run this in Supabase SQL Editor
-- =============================================

ALTER TABLE featured_sections ADD COLUMN IF NOT EXISTS banner_slides JSONB DEFAULT '[]'::jsonb;

-- Migrate existing banner_image to banner_slides if it exists
UPDATE featured_sections
SET banner_slides = jsonb_build_array(
  jsonb_build_object('url', banner_image, 'id', gen_random_uuid()::text)
)
WHERE section_key = 'editorial'
  AND banner_image IS NOT NULL
  AND banner_image != ''
  AND (banner_slides IS NULL OR banner_slides = '[]'::jsonb);
