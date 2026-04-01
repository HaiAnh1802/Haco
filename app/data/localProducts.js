import productsData from "../../public/products.json";

/**
 * Convert product folder name to URL-safe slug
 * e.g. "Nước Tẩy Trang Bí Đao Cocoon 500ml" → "nuoc-tay-trang-bi-dao-cocoon-500ml"
 */
export function toSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // replace đ → d
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Build a public-accessible image URL for a product image file
 * e.g. folder = "ẢNH SẢN PHẨM/Selsun..." → "/products/Selsun.../s1.png"
 */
export function getImageUrl(product, filename) {
  const folderName = product.folder.replace(/^ẢNH SẢN PHẨM\//, "");
  return `/products/${folderName}/${filename}`;
}

/**
 * Enrich a raw product with slug and resolved image URLs
 */
function enrichProduct(p) {
  const slug = toSlug(p.name);
  const folderName = p.folder.replace(/^ẢNH SẢN PHẨM\//, "");
  const base = `/products/${encodeURIComponent(folderName)}`;

  // First variant's first image as card image
  const firstVariantImg =
    p.variants?.[0]?.images?.[0] ||
    p.all_images?.[0] ||
    null;

  // Build variants with full image URLs
  const variants = (p.variants || []).map((v) => ({
    ...v,
    images: (v.images || []).map((img) => `${base}/${img}`),
  }));

  // Gallery images
  const gallery_images = (p.gallery_images || []).map(
    (img) => `${base}/${img}`
  );

  // All images with full URLs
  const all_images = (p.all_images || []).map((img) => `${base}/${img}`);

  // Price display from first variant
  const firstVariant = p.variants?.[0];
  const priceDisplay = firstVariant
    ? firstVariant.sale_price
      ? `${Number(firstVariant.sale_price).toLocaleString("vi-VN")}đ`
      : `${Number(firstVariant.original_price).toLocaleString("vi-VN")}đ`
    : "";

  return {
    ...p,
    slug,
    card_image: firstVariantImg ? `${base}/${firstVariantImg}` : null,
    price: priceDisplay,
    variants,
    gallery_images,
    all_images,
    // For the accordion sections
    description_text: (p.description || []).join("\n"),
    ingredients_text: (p.ingredients || []).join("\n"),
    usage_text: (p.usage || []).join("\n"),
  };
}

// All products enriched
const ALL_PRODUCTS = productsData.map(enrichProduct);

export function getAllLocalProducts() {
  return ALL_PRODUCTS;
}

export function getLocalProductBySlug(slug) {
  return ALL_PRODUCTS.find((p) => p.slug === slug) || null;
}

export function getAllLocalSlugs() {
  return ALL_PRODUCTS.map((p) => p.slug);
}
