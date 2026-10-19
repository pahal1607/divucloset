"use client";

import { useEffect, useState } from "react";

const CART_KEY = "divucloset-cart";

/** Live number of items in the cart (kept in localStorage by cartUtils). */
export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      try {
        const raw = localStorage.getItem(CART_KEY);
        const cart: { quantity?: number }[] = raw ? JSON.parse(raw) : [];
        setCount(cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0));
      } catch {
        setCount(0);
      }
    };

    update();
    window.addEventListener("cartUpdated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return count;
}
