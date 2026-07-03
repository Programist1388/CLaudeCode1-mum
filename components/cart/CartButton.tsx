"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";

export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="Корзина"
      className="relative flex items-center text-text-dim transition-colors hover:text-gold-soft"
    >
      <span aria-hidden className="text-lg">
        ✦
      </span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold px-1 text-[10.5px] font-bold text-bg">
          {count}
        </span>
      )}
    </Link>
  );
}
