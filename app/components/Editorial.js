"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

// Fallback content khi DB chưa có dữ liệu hoặc lỗi fetch
const FALLBACK = {
  title: "Sắc màu mùa xuân.",
  description:
    "Khám phá bộ sưu tập Pocket Blush và Peptide Lip Tint phiên bản giới hạn vừa kịp cho mùa xuân. Được thiết kế để phối hợp cùng nhau, với các tông hồng và đỏ rực rỡ cùng lớp tint lấp lánh được bạn lựa chọn.",
};

export default function Editorial() {
  const [section, setSection] = useState(FALLBACK);
  const [products, setProducts] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        // Fetch the editorial section config
        const { data: sectionData, error: sectionError } = await supabase
          .from("featured_sections")
          .select("*")
          .eq("section_key", "editorial")
          .maybeSingle();

        if (sectionData) {
          // If is_active is false, hide the section
          if (sectionData.is_active === false) {
            setSection(null);
            setReady(true);
            return;
          }

          setSection({
            title: sectionData.title || FALLBACK.title,
            description: sectionData.description || FALLBACK.description,
          });

          // Fetch selected products
          const productIds = sectionData.product_ids || [];
          if (productIds.length > 0) {
            const { data: productsData } = await supabase
              .from("haco_products")
              .select(`
                id, slug, name, card_image, images,
                haco_variants (name, original_price, sale_price, images, sort_order)
              `)
              .in("id", productIds);

            if (productsData) {
              // Maintain the order from product_ids
              const ordered = productIds
                .map(id => productsData.find(p => p.id === id))
                .filter(Boolean)
                .map(p => ({
                  ...p,
                  variants: (p.haco_variants || []).sort((a, b) => a.sort_order - b.sort_order),
                  haco_variants: undefined,
                }));
              setProducts(ordered);
            }
          }
        }
        // If sectionError or no data, keep the fallback
      } catch (err) {
        console.error("Error fetching featured section:", err);
        // Keep fallback on error
      }
      setReady(true);
    }

    fetchFeatured();
  }, []);

  // Don't render if explicitly deactivated
  if (ready && !section) return null;

  return (
    <section className="editorial">
      <div className="editorial__inner">
        <div className="editorial__header">
          <h2 className="editorial__title">{section.title}</h2>
          <p className="editorial__description">{section.description}</p>
        </div>

        {products.length > 0 && (
          <div className="editorial__grid">
            {products.map((product) => {
              const firstVariant = product.variants?.[0];
              const cardImage = product.card_image || product.images?.[0];

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="editorial__product"
                >
                  {cardImage ? (
                    <img
                      src={cardImage}
                      alt={product.name}
                      className="editorial__product-img"
                    />
                  ) : (
                    <div className="editorial__product-placeholder">📦</div>
                  )}
                  <h3 className="editorial__product-name">{product.name}</h3>
                  {firstVariant && (
                    <>
                      <p className="editorial__product-shade">
                        {firstVariant.name}
                      </p>
                      <span className="editorial__product-buy">
                        MUA —{" "}
                        {firstVariant.sale_price
                          ? Number(firstVariant.sale_price).toLocaleString("vi-VN") + "đ"
                          : Number(firstVariant.original_price).toLocaleString("vi-VN") + "đ"}
                      </span>
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        <div className="editorial__cta">
          <a href="#shop" className="editorial__cta-link">
            Mua sắm ngay
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
