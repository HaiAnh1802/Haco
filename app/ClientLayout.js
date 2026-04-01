"use client";

import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";

export default function ClientLayout({ children }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
