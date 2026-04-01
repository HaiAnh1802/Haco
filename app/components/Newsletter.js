"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <section className="newsletter" id="futures">
      <div className="newsletter__inner">
        <h2 className="newsletter__title">
          Cùng chúng tôi trên hành trình tỏa sáng rạng rỡ.
        </h2>
        <p className="newsletter__desc">
          Nhận ngay mẹo, bí quyết & nội dung độc quyền từ Hailey vào hộp thư của bạn.
        </p>

        <form className="newsletter__form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="newsletter__input"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="newsletter__submit">
            {submitted ? "Cảm ơn bạn ✓" : "Đăng ký"}
          </button>
        </form>

        <p className="newsletter__privacy">
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <a href="#">Chính sách bảo mật</a> của chúng tôi.
        </p>
      </div>
    </section>
  );
}
