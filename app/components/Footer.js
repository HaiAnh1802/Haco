export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Điều hướng */}
          <div>
            <h4 className="footer__col-title">Điều Hướng</h4>
            <div className="footer__col-links">
              <a href="#" className="footer__link">Cửa Hàng</a>
              <a href="#" className="footer__link">Câu Chuyện</a>
              <a href="#" className="footer__link">Rhode Futures</a>
              <a href="#" className="footer__link">Tác Động</a>
              <a href="#" className="footer__link">VLOG</a>
              <a href="#" className="footer__link">Tìm Chúng Tôi</a>
            </div>
          </div>

          {/* Mạng xã hội */}
          <div>
            <h4 className="footer__col-title">Mạng Xã Hội</h4>
            <div className="footer__col-links">
              <a href="https://instagram.com/rhode" className="footer__link" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://youtube.com" className="footer__link" target="_blank" rel="noopener noreferrer">Youtube</a>
              <a href="https://tiktok.com/@rhode" className="footer__link" target="_blank" rel="noopener noreferrer">TikTok</a>
              <a href="https://pinterest.com/rhode" className="footer__link" target="_blank" rel="noopener noreferrer">Pinterest</a>
            </div>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="footer__col-title">Chính Sách</h4>
            <div className="footer__col-links">
              <a href="#" className="footer__link">Quyền Riêng Tư</a>
              <a href="#" className="footer__link">Điều Khoản</a>
              <a href="#" className="footer__link">Tuyên Bố Trợ Năng</a>
              <a href="#" className="footer__link">Câu Hỏi Thường Gặp</a>
              <a href="#" className="footer__link">Liên Hệ</a>
              <a href="#" className="footer__link">Sự Kiện</a>
            </div>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="footer__col-title">Hỗ Trợ</h4>
            <p className="footer__support-time">
              Chúng tôi có mặt T2-T6, 9h - 17h.
            </p>
            <div className="footer__col-links">
              <a href="#" className="footer__link">Gửi tin nhắn cho chúng tôi bất cứ lúc nào.</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">© rhode 2026</p>
          <div className="footer__social">
            <a href="https://instagram.com/rhode" className="footer__social-link" target="_blank" rel="noopener noreferrer">IG</a>
            <a href="https://youtube.com" className="footer__social-link" target="_blank" rel="noopener noreferrer">YT</a>
            <a href="https://tiktok.com/@rhode" className="footer__social-link" target="_blank" rel="noopener noreferrer">TK</a>
            <a href="https://pinterest.com/rhode" className="footer__social-link" target="_blank" rel="noopener noreferrer">PT</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
