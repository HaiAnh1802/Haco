-- =============================================
-- Add category column to haco_products
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

ALTER TABLE haco_products 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Khác';

-- Auto-fill existing products based on name (one-time migration)
UPDATE haco_products SET category = 'Nước tẩy trang' WHERE LOWER(name) LIKE '%nước tẩy trang%' OR LOWER(name) LIKE '%micellar%' OR LOWER(name) LIKE '%cleansing water%';
UPDATE haco_products SET category = 'Sữa rửa mặt' WHERE LOWER(name) LIKE '%sữa rửa mặt%' OR LOWER(name) LIKE '%gel rửa mặt%';
UPDATE haco_products SET category = 'Trị mụn' WHERE LOWER(name) LIKE '%gel ngừa mụn%' OR LOWER(name) LIKE '%acnes%';
UPDATE haco_products SET category = 'Dầu gội' WHERE LOWER(name) LIKE '%dầu gội%' OR LOWER(name) LIKE '%shampoo%';
UPDATE haco_products SET category = 'Dầu xả / Dưỡng tóc' WHERE LOWER(name) LIKE '%dầu dưỡng tóc%' OR LOWER(name) LIKE '%hair oil%' OR LOWER(name) LIKE '%elseve%';
