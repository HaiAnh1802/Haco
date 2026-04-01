"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const CartContext = createContext();

// Load cart from localStorage
function loadCart() {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("rhode-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setItems(loadCart());
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("rhode-cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((product, shade = null, { silent = false } = {}) => {
    setItems((prev) => {
      const key = product.slug + (shade ? `-${shade.name}` : "");
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          key,
          slug: product.slug,
          name: product.name,
          shade: shade?.name || null,
          shadeColor: shade?.color || null,
          price: product.price,
          priceNum: parseInt(product.price.replace(/[^\d]/g, ""), 10) || 0,
          image: product.card_image || product.images?.[0] || "/images/lip-tint.png",
          qty: 1,
        },
      ];
    });
    if (!silent) setIsOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, qty } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items
    .reduce((sum, item) => sum + item.priceNum * item.qty, 0);
  const totalPriceDisplay = totalPrice.toLocaleString("vi-VN") + "đ";

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPriceDisplay,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
