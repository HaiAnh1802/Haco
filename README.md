# HACO Cosmetics

Website thương mại điện tử mỹ phẩm chính hãng, xây dựng bằng **Next.js 13** và **Supabase**.

## Nguồn gốc dự án

Dự án được xây dựng theo phương pháp **Web Cloning tự động**:

1. **Truy cập trang web gốc** — Tự động mở và crawl trang web mục tiêu (rhodeskin.com) bằng trình duyệt headless (Puppeteer/Playwright).
2. **Thu thập giao diện** — Chụp layout, CSS, font, màu sắc, cấu trúc HTML từng section (Hero, Header, Footer, Product Card, ...).
3. **Thu thập hành vi (actions)** — Ghi lại các tương tác: mở giỏ hàng, chọn màu sản phẩm, bộ lọc danh mục, hiệu ứng scroll, animation.
4. **Tái dựng bằng Next.js** — Viết lại từ đầu bằng React/Next.js 13, ánh xạ từng component theo giao diện và hành vi đã thu thập, thay thế dữ liệu bằng hệ thống quản lý riêng qua Supabase.
5. **Việt hoá & tuỳ chỉnh** — Toàn bộ nội dung được chuyển sang tiếng Việt, đổi thương hiệu thành **HACO Cosmetics**, bổ sung tính năng phù hợp thị trường Việt Nam (COD, phí ship, định dạng VNĐ).

> Đây là dự án nghiên cứu và học tập kỹ thuật frontend. Không sao chép tài sản bản quyền (ảnh, logo, nội dung gốc) của trang web nguồn.

---

## Tính năng

- Trang chủ với Hero banner, carousel sản phẩm, editorial, brand values và newsletter
- Danh sách và trang chi tiết sản phẩm theo slug
- Giỏ hàng (Cart Drawer) lưu trữ qua `localStorage`
- Trang thanh toán (Checkout) với thông tin giao hàng, phí ship và lưu đơn hàng lên Supabase
- Bộ lọc sản phẩm theo danh mục (ShopFilter)
- Announcement bar, banner slides, featured section động từ database
- **Admin Panel** (`/admin`) bảo vệ bằng mật khẩu — quản lý sản phẩm, banner, danh mục, đơn hàng và upload ảnh lên Supabase Storage

## Tech Stack

| Thành phần   | Công nghệ                       |
| ------------ | ------------------------------- |
| Framework    | Next.js 13 (App Router)         |
| UI           | React 18, CSS Modules           |
| Backend / DB | Supabase (PostgreSQL + Storage) |
| Ngôn ngữ     | JavaScript                      |

## Cài đặt

### Yêu cầu

- Node.js >= 18
- Tài khoản [Supabase](https://supabase.com)

### Bước 1 — Clone & cài dependencies

```bash
git clone <repo-url>
cd haco
npm install
```

### Bước 2 — Cấu hình biến môi trường

Tạo file `.env.local` ở thư mục gốc:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
ADMIN_PASSWORD=<mật-khẩu-admin-tự-đặt>
```

### Bước 3 — Khởi tạo database

Chạy các file SQL sau theo thứ tự trong **Supabase Dashboard → SQL Editor**:

1. `supabase-migration.sql` — Bảng `products`
2. `supabase-orders.sql` — Bảng `orders`
3. `supabase-add-category.sql` — Bảng `categories`
4. `supabase-add-banner.sql` / `supabase-add-banner-slides.sql` — Banner
5. `supabase-add-announcement.sql` — Announcement bar
6. `supabase-featured-section.sql` — Featured section
7. `supabase-add-feature-brandvalues.sql` — Brand values
8. `supabase-storage.sql` — Bucket `product-images`
9. `supabase-haco-migration.sql` — Migration bổ sung

### Bước 4 — Chạy môi trường phát triển

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run start    # Chạy production server
npm run lint     # Kiểm tra lint
```

## Cấu trúc thư mục

```
app/
├── page.js                  # Trang chủ
├── layout.js                # Root layout + metadata SEO
├── globals.css              # CSS toàn cục
├── admin/page.js            # Admin Panel
├── checkout/page.js         # Trang thanh toán
├── products/[slug]/page.js  # Trang chi tiết sản phẩm
├── api/
│   └── admin-auth/route.js  # API xác thực admin
├── components/              # UI components
├── context/CartContext.js   # Quản lý giỏ hàng (React Context)
└── lib/supabase.js          # Supabase client + helpers upload/delete ảnh
pages/
├── _document.js
└── _error.js
public/
└── images/                  # Ảnh tĩnh
```

## Admin Panel

Truy cập `/admin` và nhập `ADMIN_PASSWORD` đã cấu hình trong `.env.local`.

Từ admin panel có thể:

- Thêm / sửa / xóa sản phẩm và upload ảnh
- Quản lý banner, announcement bar, featured section
- Xem và cập nhật trạng thái đơn hàng

## Deploy

Deploy lên [Vercel](https://vercel.com) (khuyến nghị):

1. Push code lên GitHub
2. Import project trên Vercel
3. Thêm các biến môi trường (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`) trong Settings → Environment Variables
4. Deploy

> Lưu ý: `next.config.js` đã bật `images.unoptimized: true` để tương thích với Supabase Storage URLs.

## License

Private — All rights reserved.
