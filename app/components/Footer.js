"use client";

import Link from "next/link";
import { SUPPORT_LINKS, POLICY_LINKS } from "../data/footerPages";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          {/* Col 1: Logo + brand info */}
          <div className="site-footer__col site-footer__col--brand">
            <div className="site-footer__logo">
              <img src="/images/avatar.png" alt="Haco" className="site-footer__logo-img" />
              <div>
                <div className="site-footer__logo-name">HACO</div>
                <div className="site-footer__logo-sub">COSMETICS</div>
              </div>
            </div>
            <ul className="site-footer__contact">
              <li>
                <span className="site-footer__ico">🏢</span>
                <span>CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ QUỐC TẾ HACO</span>
              </li>
              <li>
                <span className="site-footer__ico">🏠</span>
                <span>B-TT4-4 Him Lam Vạn Phúc, Hà Đông, Hà Nội</span>
              </li>
              <li>
                <span className="site-footer__ico">📞</span>
                <span>0979 928 612</span>
              </li>
              <li>
                <span className="site-footer__ico">✉️</span>
                <span>haco.tmdv@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Col 2: Hỗ trợ khách hàng */}
          <div className="site-footer__col">
            <h4 className="site-footer__title">Hỗ trợ khách hàng</h4>
            <ul className="site-footer__links">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.slug}>
                  <Link href={`/page/${item.slug}`}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Chính sách */}
          <div className="site-footer__col">
            <h4 className="site-footer__title">Chính sách</h4>
            <ul className="site-footer__links">
              {POLICY_LINKS.map((item) => (
                <li key={item.slug}>
                  <Link href={`/page/${item.slug}`}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM: social + fanpage */}
        <div className="site-footer__bottom-grid">
          <div>
            <h4 className="site-footer__title">Mạng xã hội</h4>
            <div className="site-footer__social">
              <a
                href="https://www.facebook.com/share/1DGWHoaGRm/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="site-footer__social-icon site-footer__social-icon--fb"
              >f</a>
              <a
                href="https://tiktok.com/@hacocosmetics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="site-footer__social-icon site-footer__social-icon--tt"
              >♪</a>
              <a
                href="https://www.instagram.com/haco.cosmetics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="site-footer__social-icon site-footer__social-icon--ig"
              >Ig</a>
            </div>
          </div>

          <div>
            <h4 className="site-footer__title">Fanpage</h4>
            <div className="site-footer__fanpage">
              <div className="site-footer__fanpage-head">
                <img src="/images/avatar.png" alt="Haco" className="site-footer__fanpage-avatar-img" />
                <div>
                  <div className="site-footer__fanpage-name">Haco Cosmetics</div>
                  <div className="site-footer__fanpage-followers">Theo dõi để nhận ưu đãi mới nhất</div>
                </div>
              </div>
              <div className="site-footer__fanpage-actions">
                <a
                  href="https://www.facebook.com/share/1DGWHoaGRm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__fanpage-follow"
                >👍 Theo dõi Trang</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer__copyright">
        Copyright © 2025 Haco Cosmetics
      </div>
    </footer>
  );
}
