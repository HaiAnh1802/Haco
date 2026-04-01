"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalPriceDisplay, totalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    note: "",
    payment: "cod",
  });

  const shippingFee = totalPrice >= 500000 ? 0 : 30000;
  const orderTotal = totalPrice + shippingFee;
  const fmtVND = (n) => Number(n).toLocaleString("vi-VN") + "đ";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_note: form.note,
        payment_method: form.payment,
        items: items.map((item) => ({
          name: item.name,
          shade: item.shade,
          price: item.priceNum,
          qty: item.qty,
          image: item.image,
        })),
        subtotal: totalPrice,
        shipping_fee: shippingFee,
        total: orderTotal,
      };

      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      setOrderSuccess(data);
      clearCart();
    } catch (err) {
      alert("Đặt hàng thất bại: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Màn hình thành công
  if (orderSuccess) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="checkout-success">
          <div className="checkout-success__inner">
            <span className="checkout-success__icon">✓</span>
            <h1>Đặt Hàng Thành Công!</h1>
            <p className="checkout-success__id">
              Mã đơn hàng #{orderSuccess.id.slice(0, 8).toUpperCase()}
            </p>
            <p>Cảm ơn bạn đã mua hàng, {orderSuccess.customer_name}!</p>
            <p className="checkout-success__email">
              Xác nhận đơn hàng sẽ được gửi đến <strong>{orderSuccess.customer_email}</strong>
            </p>

            <div className="checkout-success__summary">
              <div className="checkout-success__row">
                <span>Tạm tính</span>
                <span>{fmtVND(orderSuccess.subtotal)}</span>
              </div>
              <div className="checkout-success__row">
                <span>Vận chuyển</span>
                <span>{orderSuccess.shipping_fee > 0 ? fmtVND(orderSuccess.shipping_fee) : "Miễn phí"}</span>
              </div>
              <div className="checkout-success__row checkout-success__total">
                <span>Tổng cộng</span>
                <span>{fmtVND(orderSuccess.total)}</span>
              </div>
            </div>

            <button className="checkout-success__btn" onClick={() => router.push("/")}>
              Tiếp Tục Mua Sắm
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="checkout">
        <div className="checkout__inner">
          <h1 className="checkout__title">Thanh Toán</h1>

          {items.length === 0 ? (
            <div className="checkout__empty">
              <p>Giỏ hàng của bạn đang trống</p>
              <a href="/" className="checkout__back-btn">← Quay lại Cửa Hàng</a>
            </div>
          ) : (
            <div className="checkout__grid">
              {/* LEFT: Form */}
              <form className="checkout__form" onSubmit={handleSubmit}>
                <div className="checkout__section">
                  <h2 className="checkout__section-title">Thông Tin Liên Hệ</h2>
                  <div className="checkout__field">
                    <label htmlFor="name">Họ và Tên *</label>
                    <input
                      id="name" name="name" type="text" required
                      value={form.name} onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="checkout__row-fields">
                    <div className="checkout__field">
                      <label htmlFor="email">Email *</label>
                      <input
                        id="email" name="email" type="email" required
                        value={form.email} onChange={handleChange}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="checkout__field">
                      <label htmlFor="phone">Số Điện Thoại</label>
                      <input
                        id="phone" name="phone" type="tel"
                        value={form.phone} onChange={handleChange}
                        placeholder="+84 xxx xxx xxx"
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout__section">
                  <h2 className="checkout__section-title">Địa Chỉ Giao Hàng</h2>
                  <div className="checkout__field">
                    <label htmlFor="address">Địa Chỉ *</label>
                    <input
                      id="address" name="address" type="text" required
                      value={form.address} onChange={handleChange}
                      placeholder="123 Đường ABC, Phường XYZ"
                    />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="city">Thành Phố *</label>
                    <input
                      id="city" name="city" type="text" required
                      value={form.city} onChange={handleChange}
                      placeholder="TP. Hồ Chí Minh"
                    />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="note">Ghi Chú Đơn Hàng</label>
                    <textarea
                      id="note" name="note" rows="3"
                      value={form.note} onChange={handleChange}
                      placeholder="Hướng dẫn giao hàng đặc biệt..."
                    />
                  </div>
                </div>

                <div className="checkout__section">
                  <h2 className="checkout__section-title">Phương Thức Thanh Toán</h2>
                  <div className="checkout__payment-options">
                    <label className={`checkout__payment-option ${form.payment === "cod" ? "active" : ""}`}>
                      <input
                        type="radio" name="payment" value="cod"
                        checked={form.payment === "cod"} onChange={handleChange}
                      />
                      <span className="checkout__payment-radio" />
                      <div>
                        <strong>Thanh Toán Khi Nhận Hàng</strong>
                        <p>Thanh toán khi bạn nhận được đơn hàng</p>
                      </div>
                    </label>
                    <label className={`checkout__payment-option ${form.payment === "bank" ? "active" : ""}`}>
                      <input
                        type="radio" name="payment" value="bank"
                        checked={form.payment === "bank"} onChange={handleChange}
                      />
                      <span className="checkout__payment-radio" />
                      <div>
                        <strong>Chuyển Khoản Ngân Hàng</strong>
                        <p>Chuyển khoản vào tài khoản ngân hàng của chúng tôi</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="checkout__submit-btn"
                  disabled={loading}
                >
                  {loading ? "Đang đặt hàng..." : `Đặt Hàng — ${fmtVND(orderTotal)}`}
                </button>
              </form>

              {/* RIGHT: Order Summary */}
              <div className="checkout__summary">
                <h2 className="checkout__section-title">Tóm Tắt Đơn Hàng</h2>
                <div className="checkout__items">
                  {items.map((item) => (
                    <div key={item.key} className="checkout__item">
                      <div className="checkout__item-img">
                        <img src={item.image} alt={item.name} />
                        <span className="checkout__item-qty-badge">{item.qty}</span>
                      </div>
                      <div className="checkout__item-info">
                        <h3>{item.name}</h3>
                        {item.shade && (
                          <p className="checkout__item-shade">
                            <span style={{ backgroundColor: item.shadeColor, width: 10, height: 10, borderRadius: "50%", display: "inline-block", border: "1px solid #ddd" }} />
                            {item.shade}
                          </p>
                        )}
                      </div>
                      <p className="checkout__item-price">
                        {fmtVND(item.priceNum * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="checkout__totals">
                  <div className="checkout__totals-row">
                    <span>Tạm tính ({totalItems} sản phẩm)</span>
                    <span>{totalPriceDisplay}</span>
                  </div>
                  <div className="checkout__totals-row">
                    <span>Vận chuyển</span>
                    <span>{shippingFee === 0 ? <em className="checkout__free-ship">Miễn phí</em> : fmtVND(shippingFee)}</span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="checkout__ship-note">
                      Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                    </p>
                  )}
                  <div className="checkout__totals-row checkout__totals-total">
                    <span>Tổng cộng</span>
                    <span>{fmtVND(orderTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
