"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart/cart-context";

export function AddToCartButton({
  product,
  size,
  onMissingSize,
  className = "",
  variant = "primary",
  addLabel = "В корзину",
  addedLabel = "Добавлено ✓",
  orderLabel = "Заказать",
}: {
  product: Product;
  /** Chosen size, if the product needs one — see product.sizeType. */
  size?: string;
  /** Called instead of adding when a size is required but wasn't chosen. */
  onMissingSize?: () => void;
  className?: string;
  variant?: "primary" | "outline";
  addLabel?: string;
  addedLabel?: string;
  orderLabel?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    if (product.sizeType !== "none" && !size) {
      onMissingSize?.();
      return;
    }
    addItem(product, 1, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  const base = "rounded-full tracking-[0.03em] uppercase transition-all";
  const styles =
    variant === "primary"
      ? "bg-gold px-7.5 py-3.5 text-sm font-semibold text-bg hover:-translate-y-0.5"
      : "border border-line px-4.5 py-2.5 text-[13px] text-text hover:border-gold hover:bg-gold hover:text-bg";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${base} ${styles} ${className}`}
    >
      {added ? addedLabel : variant === "primary" ? addLabel : orderLabel}
    </button>
  );
}
