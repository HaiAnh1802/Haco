import { supabase } from "../lib/supabase";

// Fetch all products with first variant (for grid/listing)
export async function getAllProducts() {
  const { data, error } = await supabase
    .from("haco_products")
    .select(`
      id, slug, name, category, card_image, images,
      haco_variants (name, original_price, sale_price, images, sort_order)
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data.map((p) => ({
    ...p,
    variants: (p.haco_variants || []).sort((a, b) => a.sort_order - b.sort_order),
    haco_variants: undefined,
  }));
}

// Fetch single product by slug with all variants (for detail page)
export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("haco_products")
    .select(`
      *,
      haco_variants (id, name, original_price, sale_price, images, sort_order)
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return {
    ...data,
    all_images: data.images || [],
    description_text: data.description || "",
    ingredients_text: data.ingredients || "",
    usage_text: data.usage_info || "",
    variants: (data.haco_variants || []).sort((a, b) => a.sort_order - b.sort_order),
    haco_variants: undefined,
  };
}

// Get all slugs
export async function getAllSlugs() {
  const { data, error } = await supabase
    .from("haco_products")
    .select("slug");

  if (error) return [];
  return data.map((p) => p.slug);
}
