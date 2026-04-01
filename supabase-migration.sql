-- =============================================
-- Supabase SQL: Create products table + seed data
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- Create products table
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

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view products)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Allow authenticated insert/update/delete (for admin)
CREATE POLICY "Enable insert for all users"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON products FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for all users"
  ON products FOR DELETE
  USING (true);

-- =============================================
-- Seed data: 2 existing products
-- =============================================

INSERT INTO products (slug, name, subtitle, price, size, description, images, shades, shade_groups, benefits, application, key_ingredients, ingredient_spotlight, sensory, certifications, sustainability, category, card_image, card_badge, card_desc)
VALUES
(
  'peptide-lip-tint-pretzel',
  'Peptide Lip Tint',
  'Limited edition shade',
  '$20.00',
  '10ml / .3 fl oz',
  'Meet Peptide Lip Tint in Pretzel, a limited edition shade handpicked by our community. It''s a nourishing formula with a hint of tint and shimmer that hydrates and replenishes lips while leaving a glossy, high-shine finish. Smells like a caramel-glazed pretzel.',
  '["/images/product-hero.png", "/images/product-hero-2.png"]'::jsonb,
  '[
    {"name": "pretzel", "desc": "shimmery warm mauve", "color": "#9E7B7B", "badge": "new", "active": true},
    {"name": "sweet pea", "desc": "pearly warm pink", "color": "#E8B4B8", "badge": "new"},
    {"name": "ribbon", "desc": "sheer pink", "color": "#D4918F"},
    {"name": "toast", "desc": "rose taupe", "color": "#B08B7E"},
    {"name": "raspberry jelly", "desc": "crushed berry", "color": "#8B3A4A"},
    {"name": "espresso", "desc": "rich brown", "color": "#5C3A2E"},
    {"name": "jelly bean", "desc": "shimmery sheer pink", "color": "#E8A0A8"},
    {"name": "salty tan", "desc": "soft mauve", "color": "#C49B9B"},
    {"name": "pbj", "desc": "warm berry brown", "color": "#7A3B3B"}
  ]'::jsonb,
  '[
    {"label": "Limited Edition", "shades": ["pretzel", "sweet pea", "ribbon", "toast", "raspberry jelly", "espresso"]},
    {"label": "Core Shades", "shades": ["jelly bean", "ribbon", "toast", "salty tan", "raspberry jelly", "pbj", "espresso"]}
  ]'::jsonb,
  '["Sheer-but-buildable color melts onto lips", "Helps immediately lock in moisture", "Nourishes, hydrates, and replenishes dry lips", "Leaves lips feeling pillowy-soft", "Smooths fine lines on the lips and visibly plumps lips over time"]'::jsonb,
  'Tint lips day or night. Our buildable formula can be applied in one swipe for sheer color or layered over Pocket Blush and Peptide Lip Shape.',
  '[
    {"name": "Peptide", "desc": "A short chain of amino acids that hydrates, smooths, and plumps lips while reducing the look of fine lines"},
    {"name": "Shea Butter", "desc": "A nourishing emollient that hydrates and moisturizes with 5 essential fatty acids"},
    {"name": "Vitamin E", "desc": "An antioxidant that helps protect against external stressors"}
  ]'::jsonb,
  '{"name": "Palmitoyl Tripeptide-1", "desc": "A short chain of amino acids that hydrates, smooths, and plumps lips while reducing the look of fine lines", "alsoMadeWith": ["Shea Butter", "Babassu", "Cupuaçu"]}'::jsonb,
  '{"feelsLike": "Rich, velvety gloss that melts onto lips", "looksLike": "A glossy wash of warm mauve with multicolor shimmer", "smellsLike": "A caramel-glazed pretzel"}'::jsonb,
  '["Cruelty-Free", "Vegan", "Gluten-Free", "Dermatologist-Tested"]'::jsonb,
  '{
    "tagline": "less harm, more tint.",
    "desc": "Peptide Lip Tint packaging is made with post-consumer recycled (PCR) materials.",
    "materials": [
      {"part": "Unit Carton", "detail": "100% recyclable and made from FSC-certified paper"},
      {"part": "Tube", "detail": "30% PCR HDPE #2 and 70% LDPE #4"},
      {"part": "Cap", "detail": "30% PCR PP #5"}
    ],
    "recycling": {
      "title": "recycling 101",
      "desc": "We''ll recycle your empties for you. Here''s how it works:",
      "steps": [
        "Gather at least 3 empty products you''d like us to recycle.",
        "Contact us with the subject line ''rhode recycling'' for a complimentary shipping label.",
        "Drop off at your closest mailbox or USPS location and you''re all set. ♡"
      ]
    }
  }'::jsonb,
  'tint',
  '/images/lip-tint.png',
  'Limited Edition',
  'Limited edition shade'
),
(
  'pocket-blush',
  'Pocket Blush',
  'The natural flush',
  '$25.00',
  '3g / .1 oz',
  'A creamy, satiny blush that taps onto cheeks for a natural, buildable flush of color.',
  '["/images/blush.png", "/images/blush.png"]'::jsonb,
  '[
    {"name": "sleepy girl", "desc": "soft peach", "color": "#E8B4A0"},
    {"name": "freckle", "desc": "warm nude", "color": "#C4956E"}
  ]'::jsonb,
  '[{"label": "All Shades", "shades": ["sleepy girl", "freckle"]}]'::jsonb,
  '["Satiny, buildable color", "Creamy formula melts into skin"]'::jsonb,
  'Tap onto cheeks and lips for satiny, buildable color.',
  '[{"name": "Peptide", "desc": "Smooths and hydrates skin"}]'::jsonb,
  '{"name": "Peptide Complex", "desc": "Smooths skin and provides lasting hydration", "alsoMadeWith": ["Vitamin E"]}'::jsonb,
  '{"feelsLike": "Silky cream that melts into skin", "looksLike": "A natural, dewy flush", "smellsLike": "Light, clean fragrance"}'::jsonb,
  '["Cruelty-Free", "Vegan", "Gluten-Free"]'::jsonb,
  '{
    "tagline": "less harm, more blush.",
    "desc": "Pocket Blush packaging uses recycled materials.",
    "materials": [{"part": "Compact", "detail": "Recyclable materials"}],
    "recycling": {"title": "recycling 101", "desc": "We''ll recycle your empties for you.", "steps": ["Gather empties", "Contact us", "Ship them back"]}
  }'::jsonb,
  'blush',
  '/images/blush.png',
  'New Shades',
  'The natural flush'
);
