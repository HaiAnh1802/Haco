-- =============================================
-- Supabase Storage: Create product-images bucket
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access (anyone can view images)
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 3. Allow authenticated/anon users to upload (for admin panel)
CREATE POLICY "Allow upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- 4. Allow update
CREATE POLICY "Allow update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- 5. Allow delete
CREATE POLICY "Allow delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');
