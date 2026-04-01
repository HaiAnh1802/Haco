"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProductBySlug, getAllProducts } from "../../data/products";

import { useCart } from "../../context/CartContext";
import AnnouncementBar from "../../components/AnnouncementBar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ScrollAnimations from "../../components/ScrollAnimations";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeImage, setActiveImage] = useState(null);
  const [openAccordion, setOpenAccordion] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [otherProducts, setOtherProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const p = await getProductBySlug(params.slug);
      setProduct(p);
      setLoading(false);
      setSelectedVariantIdx(0);
      setActiveImage(null);

      // Also load related products
      const all = await getAllProducts();
      setOtherProducts(
        all.filter((item) => item.slug !== params.slug).slice(0, 4)
      );
    }
    load();
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="pdp-loading">
          <div className="pdp-loading__spinner" />
          <p>Đang tải sản phẩm...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="pdp-not-found">
          <h1>Không tìm thấy sản phẩm</h1>
          <p>Xin lỗi, chúng tôi không tìm thấy sản phẩm bạn đang tìm kiếm.</p>
          <a href="/#shop" className="pdp-back-link">← Quay lại cửa hàng</a>
        </main>
        <Footer />
      </>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const selectedVariant = hasVariants ? product.variants[selectedVariantIdx] : null;

  // ALL images always shown in thumbnails
  const allImages = product.all_images || [];

  // Main image = activeImage if user clicked a thumb, else first image of selected variant (or first overall)
  const variantFirstImage =
    selectedVariant?.images?.[0] ?? allImages[0] ?? null;
  const currentImage = activeImage ?? variantFirstImage;

  const handleVariantSelect = (idx) => {
    setSelectedVariantIdx(idx);
    // Jump to that variant's first image
    const v = product.variants[idx];
    setActiveImage(v?.images?.[0] ?? allImages[0] ?? null);
  };


  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const salePrice = selectedVariant?.sale_price || null;
  const originalPrice = selectedVariant?.original_price || 0;

  const priceDisplay = salePrice
    ? `${Number(salePrice).toLocaleString("vi-VN")} VND`
    : `${Number(originalPrice).toLocaleString("vi-VN")} VND`;

  const originalPriceDisplay = salePrice
    ? `${Number(originalPrice).toLocaleString("vi-VN")} VND`
    : null;

  const discountPercent = salePrice && originalPrice
    ? Math.round((1 - salePrice / originalPrice) * 100)
    : 0;

  return (
    <>
      <ScrollAnimations />
      <AnnouncementBar />
      <Header />

      <main className="pdp">
        {/* ===== BREADCRUMB ===== */}
        <div className="pdp-breadcrumb">
          <a href="/">Trang Chủ</a> /{" "}
          <a href="/#shop">Cửa Hàng</a> /{" "}
          <span>{product.name}</span>
        </div>

        {/* ===== HERO SECTION ===== */}
        <section className="pdp-hero">
          {/* Gallery */}
          <div className="pdp-hero__gallery">
            <div className="pdp-hero__thumbs">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`pdp-hero__thumb ${
                    currentImage === img ? "active" : ""
                  }`}
                  onClick={() => setActiveImage(img)}
                  title={`Ảnh ${idx + 1}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </button>
              ))}
            </div>
            <div className="pdp-hero__main-image">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="pdp-hero__img"
                  key={currentImage}
                />
              ) : (
                <div className="pdp-hero__img-placeholder">
                  <span>Không có ảnh</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="pdp-hero__info">
            <h1 className="pdp-hero__name">{product.name}</h1>

            {/* Price */}
            <div className="pdp-hero__price-row">
              <span className="pdp-hero__price">{priceDisplay}</span>
              {originalPriceDisplay && (
                <span className="pdp-hero__price-original">
                  {originalPriceDisplay}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="pdp-hero__discount-badge">
                  Giảm {discountPercent}%
                </span>
              )}
            </div>

            {/* Variant Selector */}
            {hasVariants && (
              <div className="pdp-variants">
                <p className="pdp-variants__label">Phân loại</p>
                <div className="pdp-variants__list">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      className={`pdp-variants__item ${selectedVariantIdx === idx ? "active" : ""}`}
                      onClick={() => handleVariantSelect(idx)}
                    >
                      {v.images?.[0] && (
                        <img
                          src={v.images[0]}
                          alt={v.name}
                          className="pdp-variants__item-img"
                        />
                      )}
                      <span className="pdp-variants__item-name">{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pdp-quantity">
              <button
                className="pdp-quantity__btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span className="pdp-quantity__val">{quantity}</span>
              <button
                className="pdp-quantity__btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pdp-actions">
              <button
                className="pdp-actions__cart"
                id="add-to-bag-btn"
                onClick={() =>
                  addItem(
                    {
                      ...product,
                      price: priceDisplay,
                      card_image: allImages[0],
                    },
                    selectedVariant
                      ? { name: selectedVariant.name, color: null }
                      : null
                  )
                }
              >
                🛒 THÊM VÀO GIỎ HÀNG
              </button>
              <button
                className="pdp-actions__buy"
                onClick={() =>
                  addItem(
                    {
                      ...product,
                      price: priceDisplay,
                      card_image: allImages[0],
                    },
                    selectedVariant
                      ? { name: selectedVariant.name, color: null }
                      : null
                  )
                }
              >
                MUA NGAY
              </button>
            </div>

            {/* Accordion */}
            <div className="pdp-accordion">
              {/* Description */}
              {product.description_text && (
                <div
                  className={`pdp-accordion__item ${openAccordion === "description" ? "open" : ""}`}
                >
                  <button
                    className="pdp-accordion__header"
                    onClick={() => toggleAccordion("description")}
                  >
                    <span>Mô Tả Sản Phẩm</span>
                    <span className="pdp-accordion__icon">
                      {openAccordion === "description" ? "−" : "+"}
                    </span>
                  </button>
                  <div className="pdp-accordion__body">
                    <p className="pdp-accordion__text">
                      {product.description_text}
                    </p>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients_text && (
                <div
                  className={`pdp-accordion__item ${openAccordion === "ingredients" ? "open" : ""}`}
                >
                  <button
                    className="pdp-accordion__header"
                    onClick={() => toggleAccordion("ingredients")}
                  >
                    <span>Thành Phần</span>
                    <span className="pdp-accordion__icon">
                      {openAccordion === "ingredients" ? "−" : "+"}
                    </span>
                  </button>
                  <div className="pdp-accordion__body">
                    <p className="pdp-accordion__text">
                      {product.ingredients_text}
                    </p>
                  </div>
                </div>
              )}

              {/* Usage */}
              {product.usage_text && (
                <div
                  className={`pdp-accordion__item ${openAccordion === "usage" ? "open" : ""}`}
                >
                  <button
                    className="pdp-accordion__header"
                    onClick={() => toggleAccordion("usage")}
                  >
                    <span>Hướng Dẫn Sử Dụng</span>
                    <span className="pdp-accordion__icon">
                      {openAccordion === "usage" ? "−" : "+"}
                    </span>
                  </button>
                  <div className="pdp-accordion__body">
                    <p className="pdp-accordion__text">
                      {product.usage_text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===== SẢN PHẨM KHÁC ===== */}
        {otherProducts.length > 0 && (
          <section className="pdp-related fade-in">
            <div className="section-header">
              <p className="section-header__label">Có thể bạn thích</p>
              <h2 className="section-header__title">Sản phẩm khác</h2>
            </div>
            <div className="product-grid">
              {otherProducts.map((p) => {
                const v = p.variants?.[0];
                return (
                  <a
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="product-grid-card"
                  >
                    <div className="product-grid-card__img-wrap">
                      {p.card_image ? (
                        <img
                          src={p.card_image}
                          alt={p.name}
                          className="product-grid-card__img primary"
                        />
                      ) : (
                        <div className="product-grid-card__placeholder">📦</div>
                      )}
                      <div className="product-grid-card__overlay">
                        <span>Xem Sản Phẩm</span>
                      </div>
                    </div>
                    <div className="product-grid-card__info">
                      <h3 className="product-grid-card__name">{p.name}</h3>
                      <div className="product-grid-card__pricing">
                        {v?.sale_price ? (
                          <>
                            <span className="product-grid-card__price sale">
                              {Number(v.sale_price).toLocaleString("vi-VN")}đ
                            </span>
                            <span className="product-grid-card__price original">
                              {Number(v.original_price).toLocaleString("vi-VN")}đ
                            </span>
                          </>
                        ) : v ? (
                          <span className="product-grid-card__price">
                            {Number(v.original_price).toLocaleString("vi-VN")}đ
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
