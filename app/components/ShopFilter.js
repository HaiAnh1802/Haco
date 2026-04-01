"use client";

import { useState } from "react";

// ===== COSMETICS INDUSTRY FILTER DATA =====
const CATEGORIES = [
  "Nước tẩy trang",
  "Sữa rửa mặt",
  "Trị mụn",
  "Toner / Nước hoa hồng",
  "Serum / Tinh chất",
  "Kem dưỡng ẩm",
  "Kem chống nắng",
  "Mặt nạ",
  "Dầu gội",
  "Dầu xả / Dưỡng tóc",
  "Son môi",
  "Phấn nền / Cushion",
  "Mascara / Kẻ mắt",
  "Nước hoa",
];

const BRANDS = [
  "L'Oreal",
  "Garnier",
  "Maybelline",
  "Cocoon",
  "Acnes",
  "Selsun",
  "JMSolution",
  "Compliment",
  "La Roche-Posay",
  "Innisfree",
  "The Ordinary",
  "CeraVe",
  "Bioderma",
  "Anessa",
  "Cetaphil",
  "Senka",
  "Pond's",
  "Vaseline",
];

const PRICE_RANGES = [
  { label: "Dưới 100K", min: 0, max: 100000 },
  { label: "100K - 200K", min: 100000, max: 200000 },
  { label: "200K - 500K", min: 200000, max: 500000 },
  { label: "500K - 1 triệu", min: 500000, max: 1000000 },
  { label: "Trên 1 triệu", min: 1000000, max: Infinity },
];

const ORIGINS = [
  "Việt Nam",
  "Hàn Quốc",
  "Nhật Bản",
  "Pháp",
  "Mỹ",
  "Thái Lan",
];

export default function ShopFilter({ filters, onFilterChange, onClose, onSearch, onClear }) {
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    price: true,
    origin: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (type, value) => {
    const current = filters[type] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [type]: updated });
  };

  const setPriceRange = (range) => {
    const current = filters.priceRange;
    if (current?.label === range.label) {
      onFilterChange({ ...filters, priceRange: null });
    } else {
      onFilterChange({ ...filters, priceRange: range });
    }
  };

  const clearAll = () => {
    onFilterChange({ categories: [], brands: [], priceRange: null, origins: [] });
  };

  const hasActiveFilters =
    (filters.categories?.length > 0) ||
    (filters.brands?.length > 0) ||
    filters.priceRange ||
    (filters.origins?.length > 0);

  return (
    <aside className="shop-filter">
      <div className="shop-filter__header">
        <h3 className="shop-filter__title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
          </svg>
          Bộ lọc
        </h3>
        <div className="shop-filter__header-actions">
          {onClose && (
            <button className="shop-filter__close" onClick={onClose}>✕</button>
          )}
        </div>
      </div>

      <div className="shop-filter__actions">
        <button
          className="shop-filter__search-btn"
          onClick={() => { onSearch && onSearch(); onClose && onClose(); }}
        >
          🔍 Tìm kiếm
        </button>
        {hasActiveFilters && (
          <button className="shop-filter__clear shop-filter__clear--bottom" onClick={() => { onClear && onClear(); onClose && onClose(); }}>
            Xóa lọc
          </button>
        )}
      </div>

      {/* Category */}
      <div className="shop-filter__group">
        <button className="shop-filter__group-header" onClick={() => toggleSection("category")}>
          <span>Loại sản phẩm</span>
          <span className="shop-filter__chevron">{openSections.category ? "−" : "+"}</span>
        </button>
        {openSections.category && (
          <div className="shop-filter__options">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="shop-filter__checkbox">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(cat) || false}
                  onChange={() => toggleFilter("categories", cat)}
                />
                <span className="shop-filter__checkmark" />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="shop-filter__group">
        <button className="shop-filter__group-header" onClick={() => toggleSection("brand")}>
          <span>Thương hiệu</span>
          <span className="shop-filter__chevron">{openSections.brand ? "−" : "+"}</span>
        </button>
        {openSections.brand && (
          <div className="shop-filter__options">
            {BRANDS.map((brand) => (
              <label key={brand} className="shop-filter__checkbox">
                <input
                  type="checkbox"
                  checked={filters.brands?.includes(brand) || false}
                  onChange={() => toggleFilter("brands", brand)}
                />
                <span className="shop-filter__checkmark" />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="shop-filter__group">
        <button className="shop-filter__group-header" onClick={() => toggleSection("price")}>
          <span>Khoảng giá</span>
          <span className="shop-filter__chevron">{openSections.price ? "−" : "+"}</span>
        </button>
        {openSections.price && (
          <div className="shop-filter__options">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.label}
                className={`shop-filter__price-btn ${filters.priceRange?.label === range.label ? "active" : ""}`}
                onClick={() => setPriceRange(range)}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Origin */}
      <div className="shop-filter__group">
        <button className="shop-filter__group-header" onClick={() => toggleSection("origin")}>
          <span>Xuất xứ</span>
          <span className="shop-filter__chevron">{openSections.origin ? "−" : "+"}</span>
        </button>
        {openSections.origin && (
          <div className="shop-filter__options">
            {ORIGINS.map((origin) => (
              <label key={origin} className="shop-filter__checkbox">
                <input
                  type="checkbox"
                  checked={filters.origins?.includes(origin) || false}
                  onChange={() => toggleFilter("origins", origin)}
                />
                <span className="shop-filter__checkmark" />
                <span>{origin}</span>
              </label>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
}
