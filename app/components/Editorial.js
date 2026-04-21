"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";
import Link from "next/link";

function QuickAddModal({ product, onClose }) {
  const { addItem } = useCart();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const variants = product.variants || [];

  if (variants.length === 0) return null;

  const handleAdd = () => {
    const v = variants[selectedIdx];
    const price = v.sale_price
      ? `${Number(v.sale_price).toLocaleString("vi-VN")}đ`
      : `${Number(v.original_price).toLocaleString("vi-VN")}đ`;
    addItem(
      { ...product, price, card_image: product.card_image || product.images?.[0] },
      { name: v.name, color: null },
      { silent: true }
    );
    onClose();
  };

  return createPortal(
    <div className="quick-add-overlay" onClick={onClose}>
      <div className="quick-add-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quick-add-modal__close" onClick={onClose}>✕</button>
        <div className="quick-add-modal__header">
          <div className="quick-add-modal__thumb">
            {product.card_image ? <img src={product.card_image} alt={product.name} /> : <span>📦</span>}
          </div>
          <div className="quick-add-modal__info">
            <h3 className="quick-add-modal__name">{product.name}</h3>
            <p className="quick-add-modal__hint">Chọn phân loại</p>
          </div>
        </div>
        <div className="quick-add-modal__variants">
          {variants.map((v, idx) => (
            <button
              key={idx}
              className={`quick-add-modal__variant ${selectedIdx === idx ? "active" : ""}`}
              onClick={() => setSelectedIdx(idx)}
            >
              {v.images?.[0] && <img src={v.images[0]} alt={v.name} className="quick-add-modal__variant-img" />}
              <div className="quick-add-modal__variant-info">
                <span className="quick-add-modal__variant-name">{v.name}</span>
                <span className="quick-add-modal__variant-price">
                  {v.sale_price
                    ? Number(v.sale_price).toLocaleString("vi-VN") + "đ"
                    : Number(v.original_price).toLocaleString("vi-VN") + "đ"}
                </span>
              </div>
              {selectedIdx === idx && <span className="quick-add-modal__check">✓</span>}
            </button>
          ))}
        </div>
        <button className="quick-add-modal__confirm" onClick={handleAdd}>
          🛒 Thêm vào giỏ hàng
        </button>
      </div>
    </div>,
    document.body
  );
}

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
  const [cardStyle, setCardStyle] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [quickAddProduct, setQuickAddProduct] = useState(null);

  useEffect(() => {
    // Fetch card style settings (same as ProductCarousel)
    supabase
      .from("featured_sections")
      .select("card_style_data")
      .eq("section_key", "product_card_style")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.card_style_data) setCardStyle(data.card_style_data);
      });

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
                id, slug, name, card_image, images, category,
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
          <div className="product-grid">
            {products.map((product) => {
              const firstVariant = product.variants?.[0];
              const allImages = product.images || [];
              const cardImage = product.card_image || allImages[0];
              const hoverImg = allImages[1] || cardImage;

              return (
                <div
                  key={product.id}
                  className="product-grid-card"
                  onMouseEnter={() => setHovered(product.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <Link href={`/products/${product.slug}`} className="product-grid-card__link">
                    <div
                      className="product-grid-card__img-wrap"
                      style={cardStyle ? { aspectRatio: cardStyle.imgAspect, borderRadius: cardStyle.imgRadius + "px" } : undefined}
                    >
                      {cardImage ? (
                        <>
                          <img
                            src={cardImage}
                            alt={product.name}
                            className={`product-grid-card__img primary ${hovered === product.id ? "hidden" : ""}`}
                            style={cardStyle ? { objectFit: cardStyle.imgFit } : undefined}
                          />
                          <img
                            src={hoverImg}
                            alt={product.name}
                            className={`product-grid-card__img hover ${hovered === product.id ? "visible" : ""}`}
                            style={cardStyle ? { objectFit: cardStyle.imgFit } : undefined}
                          />
                        </>
                      ) : (
                        <div className="product-grid-card__placeholder"><span>📦</span></div>
                      )}
                    </div>
                    <div className="product-grid-card__info">
                      <span
                        className="product-grid-card__category"
                        style={cardStyle ? { color: cardStyle.categoryColor, fontSize: cardStyle.categorySize + "px" } : undefined}
                      >
                        {product.category}
                      </span>
                      <h3
                        className="product-grid-card__name"
                        style={cardStyle ? { color: cardStyle.nameColor, fontSize: cardStyle.nameSize + "px" } : undefined}
                      >
                        {product.name}
                      </h3>
                      <div className="product-grid-card__pricing">
                        {firstVariant?.sale_price ? (
                          <>
                            <span
                              className="product-grid-card__price sale"
                              style={cardStyle ? { color: cardStyle.salePriceColor, fontSize: cardStyle.priceSize + "px" } : undefined}
                            >
                              {Number(firstVariant.sale_price).toLocaleString("vi-VN")}đ
                            </span>
                            <span
                              className="product-grid-card__price original"
                              style={cardStyle ? { fontSize: (parseInt(cardStyle.priceSize) - 2) + "px" } : undefined}
                            >
                              {Number(firstVariant.original_price).toLocaleString("vi-VN")}đ
                            </span>
                          </>
                        ) : firstVariant ? (
                          <span
                            className="product-grid-card__price"
                            style={cardStyle ? { color: cardStyle.priceColor, fontSize: cardStyle.priceSize + "px" } : undefined}
                          >
                            {Number(firstVariant.original_price).toLocaleString("vi-VN")}đ
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                  {product.variants?.length > 0 && (
                    <button
                      className="product-grid-card__quick-add"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickAddProduct(product); }}
                      title="Thêm vào giỏ hàng"
                      style={cardStyle ? { background: cardStyle.cartIconBg, color: cardStyle.cartIconColor } : undefined}
                    >
                      🛒
                    </button>
                  )}
                </div>
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

      {quickAddProduct && (
        <QuickAddModal product={quickAddProduct} onClose={() => setQuickAddProduct(null)} />
      )}
    </section>
  );
}
