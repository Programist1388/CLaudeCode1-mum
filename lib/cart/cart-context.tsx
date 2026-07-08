"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";
import { loadCart, saveCart } from "@/lib/cart/cart-storage";

export interface CartItem {
  slug: string;
  title: string;
  priceValue: number;
  priceIsFrom: boolean;
  image?: string;
  qty: number;
  /** Chosen clothing/shoe size, if the product has one (see lib/sizes.ts). */
  size?: string;
}

/** Same slug with different sizes are separate cart lines. */
export function cartLineKey(slug: string, size?: string): string {
  return size ? `${slug}::${size}` : slug;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (product: Product, qty?: number, size?: string) => void;
  removeItem: (slug: string, size?: string) => void;
  updateQty: (slug: string, qty: number, size?: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Cart starts empty on both server and first client render (avoids a
  // hydration mismatch), then hydrates from localStorage right after mount.
  // This one-time read of an external store is exactly what an effect is
  // for; a lazy useState initializer would read localStorage during the
  // client's hydration render and mismatch the server-rendered empty cart.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, qty = 1, size?: string) => {
    setItems((prev) => {
      const key = cartLineKey(product.slug, size);
      const existing = prev.find((i) => cartLineKey(i.slug, i.size) === key);
      if (existing) {
        return prev.map((i) =>
          cartLineKey(i.slug, i.size) === key ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          title: product.title,
          priceValue: product.priceValue,
          priceIsFrom: product.priceIsFrom,
          image: product.images[0],
          qty,
          size,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((slug: string, size?: string) => {
    const key = cartLineKey(slug, size);
    setItems((prev) => prev.filter((i) => cartLineKey(i.slug, i.size) !== key));
  }, []);

  const updateQty = useCallback((slug: string, qty: number, size?: string) => {
    const key = cartLineKey(slug, size);
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => cartLineKey(i.slug, i.size) !== key)
        : prev.map((i) => (cartLineKey(i.slug, i.size) === key ? { ...i, qty } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, count, addItem, removeItem, updateQty, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
