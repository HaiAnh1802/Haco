import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "haco cosmetics - mỹ phẩm chính hãng",
  description:
    "Mỹ phẩm chính hãng - Chăm sóc da, tóc và làm đẹp. Sản phẩm được tuyển chọn kỹ lưỡng, đảm bảo chất lượng.",
  keywords: "haco, mỹ phẩm, chăm sóc da, tẩy trang, dầu gội, serum, chính hãng",
  openGraph: {
    title: "haco cosmetics - mỹ phẩm chính hãng",
    description: "Mỹ phẩm chính hãng - Chăm sóc da, tóc và làm đẹp.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

