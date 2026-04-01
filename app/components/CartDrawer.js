"use client";

import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, totalItems, totalPriceDisplay } = useCart();

  const handleCheckout = () => {
    setIsOpen(false);
    window.location.href = "/checkout";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? "active" : ""}`}>
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Giỏ Hàng
            <span className="cart-drawer__count">({totalItems})</span>
          </h2>
          <button
            className="cart-drawer__close"
            onClick={() => setIsOpen(false)}
            aria-label="Đóng giỏ hàng"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <span className="cart-drawer__empty-icon">🛍️</span>
            <p>Giỏ hàng của bạn đang trống</p>
            <button
              className="cart-drawer__shop-btn"
              onClick={() => setIsOpen(false)}
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div key={item.key} className="cart-item">
                  <div className="cart-item__image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item__info">
                    <h3 className="cart-item__name">{item.name}</h3>
                    {item.shade && (
                      <p className="cart-item__shade">
                        <span
                          className="cart-item__shade-dot"
                          style={{ backgroundColor: item.shadeColor }}
                        />
                        {item.shade}
                      </p>
                    )}
                    <p className="cart-item__price">{item.price}</p>
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        aria-label="Giảm số lượng"
                      >
                        −
                      </button>
                      <span className="cart-item__qty-num">{item.qty}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeItem(item.key)}
                    aria-label="Xóa sản phẩm"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Tạm tính</span>
                <span className="cart-drawer__total-price">{totalPriceDisplay}</span>
              </div>
              <p className="cart-drawer__shipping">Phí vận chuyển tính khi thanh toán</p>
              <button className="cart-drawer__checkout-btn" onClick={handleCheckout}>
                Thanh Toán — {totalPriceDisplay}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
