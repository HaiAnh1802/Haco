"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

const navLinks = [
  { label: "Cửa Hàng", href: "#shop" },
  { label: "Giới Thiệu", href: "#about" },
  { label: "Tương Lai", href: "#futures" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const { totalItems, setIsOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch products for mega menu
  useEffect(() => {
    async function fetchMegaMenu() {
      const { data, error } = await supabase
        .from("haco_products")
        .select(`
          id, slug, name, category, card_image,
          haco_variants (name, original_price, sale_price, sort_order)
        `)
        .order("created_at", { ascending: true });

      if (error || !data) return;

      // Group by category
      const grouped = {};
      for (const p of data) {
        const cat = p.category || "Khác";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({
          ...p,
          variants: (p.haco_variants || []).sort((a, b) => a.sort_order - b.sort_order),
          haco_variants: undefined,
        });
      }

      const catList = Object.keys(grouped);
      setCategories(catList);
      setProductsByCategory(grouped);
      if (catList.length > 0) setActiveCategory(catList[0]);
    }
    fetchMegaMenu();
  }, []);

  const currentProducts = productsByCategory[activeCategory] || [];

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="header__inner">
          {/* Left nav */}
          <nav className="header__nav">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="header__nav-link"
                onMouseEnter={() => {
                  if (link.label === "Cửa Hàng") {
                    setMegaMenuOpen(true);
                  }
                }}
                onMouseLeave={() => { }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Hamburger */}
          <button
            className="header__hamburger"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Mở menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo center */}
          <a href="/" className="header__logo">
            <span className="header__logo-text">haco</span>
          </a>

          {/* Right actions */}
          <div className="header__actions">
            <button className="header__action-btn" aria-label="Giỏ hàng" onClick={() => setIsOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && <span className="header__cart-count">{totalItems}</span>}
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <div
          className={`mega-menu ${megaMenuOpen ? "active" : ""}`}
          onMouseEnter={() => setMegaMenuOpen(true)}
          onMouseLeave={() => setMegaMenuOpen(false)}
        >
          <div className="mega-menu__inner">
            <div className="mega-menu__categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`mega-menu__category ${activeCategory === cat ? "active" : ""}`}
                  onMouseEnter={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="mega-menu__products">
              {currentProducts.slice(0, 4).map((product) => {
                const firstVariant = product.variants?.[0];
                return (
                  <a key={product.id} href={`/products/${product.slug}`} className="mega-menu__product">
                    {product.card_image ? (
                      <img
                        src={product.card_image}
                        alt={product.name}
                        className="mega-menu__product-img"
                      />
                    ) : (
                      <div className="mega-menu__product-img mega-menu__product-placeholder">📦</div>
                    )}
                    <div className="mega-menu__product-name">{product.name}</div>
                    <div className="mega-menu__product-desc">
                      {firstVariant
                        ? (firstVariant.sale_price
                          ? Number(firstVariant.sale_price).toLocaleString("vi-VN") + "đ"
                          : Number(firstVariant.original_price).toLocaleString("vi-VN") + "đ")
                        : ""}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav ${mobileNavOpen ? "active" : ""}`}>
        <button
          className="mobile-nav__close"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Đóng menu"
        >
          ✕
        </button>
        <div className="mobile-nav__links">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-nav__link"
              onClick={() => setMobileNavOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#account" className="mobile-nav__link" onClick={() => setMobileNavOpen(false)}>
            Tài Khoản
          </a>
        </div>
      </div>
    </>
  );
}
