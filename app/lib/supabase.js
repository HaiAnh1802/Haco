import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BUCKET = "product-images";

/**
 * Upload an image file to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Subfolder path (e.g. product slug)
 * @returns {Promise<string|null>} Public URL of the uploaded image, or null on error
 */
export async function uploadProductImage(file, folder = "") {
  // Generate unique filename
  const ext = file.name.split(".").pop();
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 30);
  const filePath = folder
    ? `${folder}/${safeName}_${timestamp}.${ext}`
    : `${safeName}_${timestamp}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage by its public URL
 * @param {string} publicUrl - The full public URL
 */
export async function deleteProductImage(publicUrl) {
  if (!publicUrl || !publicUrl.includes(BUCKET)) return;
  // Extract path from public URL
  const parts = publicUrl.split(`/storage/v1/object/public/${BUCKET}/`);
  if (parts.length < 2) return;
  const filePath = decodeURIComponent(parts[1]);
  await supabase.storage.from(BUCKET).remove([filePath]);
}
