"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { getAllProducts } from "../data/products";
import ShopFilter from "./ShopFilter";
import Link from "next/link";
import { useCart } from "../context/CartContext";

const ITEMS_PER_PAGE = 12;

// Auto-detect brand from product name
function detectBrand(name) {
  const n = name.toLowerCase();
  if (n.includes("l'oreal") || n.includes("loreal")) return "L'Oreal";
  if (n.includes("garnier")) return "Garnier";
  if (n.includes("maybelline")) return "Maybelline";
  if (n.includes("cocoon")) return "Cocoon";
  if (n.includes("acnes")) return "Acnes";
  if (n.includes("selsun")) return "Selsun";
  if (n.includes("jmsolution")) return "JMSolution";
  if (n.includes("compliment")) return "Compliment";
  if (n.includes("la roche")) return "La Roche-Posay";
  if (n.includes("innisfree")) return "Innisfree";
  if (n.includes("cerave")) return "CeraVe";
  if (n.includes("bioderma")) return "Bioderma";
  if (n.includes("anessa")) return "Anessa";
  if (n.includes("cetaphil")) return "Cetaphil";
  if (n.includes("senka")) return "Senka";
  if (n.includes("pond")) return "Pond's";
  return null;
}

const EMPTY_FILTERS = { categories: [], brands: [], priceRange: null, origins: [] };

// ===== QUICK ADD MODAL =====
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
      {
        ...product,
        price,
        card_image: product.card_image || product.images?.[0],
      },
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
            {product.card_image ? (
              <img src={product.card_image} alt={product.name} />
            ) : (
              <span>📦</span>
            )}
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
              {v.images?.[0] && (
                <img src={v.images[0]} alt={v.name} className="quick-add-modal__variant-img" />
              )}
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

// ===== MAIN COMPONENT =====
export default function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quickAddProduct, setQuickAddProduct] = useState(null);

  const [pendingFilters, setPendingFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    getAllProducts().then((data) => {
      const enriched = data.map((p) => ({
        ...p,
        category: p.category || "Khác",
        brand: detectBrand(p.name),
      }));
      setProducts(enriched);
    });
  }, []);

  const handleSearch = () => {
    setAppliedFilters({ ...pendingFilters });
    setCurrentPage(1);
  };

  const handleClear = () => {
    setPendingFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (appliedFilters.categories.length > 0 && !appliedFilters.categories.includes(p.category)) return false;
      if (appliedFilters.brands.length > 0 && !appliedFilters.brands.includes(p.brand)) return false;
      if (appliedFilters.priceRange) {
        const price = p.variants?.[0]?.sale_price || p.variants?.[0]?.original_price || 0;
        if (price < appliedFilters.priceRange.min || price > appliedFilters.priceRange.max) return false;
      }
      return true;
    });
  }, [products, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const activeFilterCount =
    (appliedFilters.categories?.length || 0) +
    (appliedFilters.brands?.length || 0) +
    (appliedFilters.priceRange ? 1 : 0) +
    (appliedFilters.origins?.length || 0);

  return (
    <section id="shop" className="shop-section">
      <div className="section-header">
        <p className="section-header__label">Mua Sắm</p>
        <h2 className="section-header__title">Bộ sưu tập sản phẩm.</h2>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filter */}
        <div
          className={`shop-layout__sidebar ${mobileFilterOpen ? "open" : ""}`}
          onClick={(e) => { if (e.target === e.currentTarget) setMobileFilterOpen(false); }}
        >
          <ShopFilter
            filters={pendingFilters}
            onFilterChange={setPendingFilters}
            onSearch={handleSearch}
            onClear={handleClear}
            onClose={() => setMobileFilterOpen(false)}
          />
        </div>

        {/* Products */}
        <div className="shop-layout__main">
          <div className="shop-toolbar">
            <button
              className="shop-filter-toggle"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
              </svg>
              Bộ lọc
              {activeFilterCount > 0 && (
                <span className="shop-filter-toggle__count">{activeFilterCount}</span>
              )}
            </button>
            <span className="shop-layout__results">
              Hiển thị <strong>{filtered.length}</strong> sản phẩm
              {totalPages > 1 && ` · Trang ${currentPage}/${totalPages}`}
            </span>
          </div>

          <div className="product-grid">
            {paginated.length === 0 ? (
              <div className="product-grid__empty">
                <span>🔍</span>
                <p>Không tìm thấy sản phẩm phù hợp.</p>
                <button onClick={() => { setPendingFilters(EMPTY_FILTERS); setAppliedFilters(EMPTY_FILTERS); }}>
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              paginated.map((product) => {
                const firstVariant = product.variants?.[0];
                const allImages = product.images || [];
                const cardImage = product.card_image || allImages[0];
                const hoverImg = allImages[1] || cardImage;

                return (
                  <div
                    key={product.slug}
                    className="product-grid-card"
                    onMouseEnter={() => setHovered(product.slug)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <Link href={`/products/${product.slug}`} className="product-grid-card__link">
                      <div className="product-grid-card__img-wrap">
                        {cardImage ? (
                          <>
                            <img
                              src={cardImage}
                              alt={product.name}
                              className={`product-grid-card__img primary ${hovered === product.slug ? "hidden" : ""}`}
                            />
                            <img
                              src={hoverImg}
                              alt={product.name}
                              className={`product-grid-card__img hover ${hovered === product.slug ? "visible" : ""}`}
                            />
                          </>
                        ) : (
                          <div className="product-grid-card__placeholder">
                            <span>📦</span>
                          </div>
                        )}
                      </div>

                      <div className="product-grid-card__info">
                        <span className="product-grid-card__category">{product.category}</span>
                        <h3 className="product-grid-card__name">{product.name}</h3>
                        <div className="product-grid-card__pricing">
                          {firstVariant?.sale_price ? (
                            <>
                              <span className="product-grid-card__price sale">
                                {Number(firstVariant.sale_price).toLocaleString("vi-VN")}đ
                              </span>
                              <span className="product-grid-card__price original">
                                {Number(firstVariant.original_price).toLocaleString("vi-VN")}đ
                              </span>
                            </>
                          ) : firstVariant ? (
                            <span className="product-grid-card__price">
                              {Number(firstVariant.original_price).toLocaleString("vi-VN")}đ
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Link>

                    {/* Quick Add to Cart Button */}
                    {product.variants?.length > 0 && (
                      <button
                        className="product-grid-card__quick-add"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuickAddProduct(product);
                        }}
                        title="Thêm vào giỏ hàng"
                      >
                        🛒
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="shop-pagination">
              <button
                className="shop-pagination__btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`shop-pagination__page ${page === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="shop-pagination__btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      {quickAddProduct && (
        <QuickAddModal
          product={quickAddProduct}
          onClose={() => setQuickAddProduct(null)}
        />
      )}
    </section>
  );
}
