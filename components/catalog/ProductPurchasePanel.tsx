"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { sizeOptionsFor } from "@/lib/sizes";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function ProductPurchasePanel({
  product,
  t,
  className = "",
}: {
  product: Product;
  t: Dictionary;
  className?: string;
}) {
  const [size, setSize] = useState<string | undefined>(undefined);
  const [showSizeError, setShowSizeError] = useState(false);
  const sizeOptions = sizeOptionsFor(product.sizeType);

  return (
    <div className={className}>
      {sizeOptions.length > 0 && (
        <div className="mb-5">
          <span className="mb-2 block text-sm text-text-dim">
            {t.product.sizeLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSize(option);
                  setShowSizeError(false);
                }}
                className={`rounded-full border px-4 py-2 text-sm tracking-[0.03em] transition-colors ${
                  size === option
                    ? "border-gold bg-gold text-bg"
                    : "border-line text-text-dim hover:border-gold hover:text-gold-soft"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {showSizeError && (
            <p className="mt-2 text-[13px] text-rose">
              {t.product.selectSizeError}
            </p>
          )}
        </div>
      )}

      <AddToCartButton
        product={product}
        size={size}
        onMissingSize={() => setShowSizeError(true)}
        addLabel={t.product.addToCart}
        addedLabel={t.product.added}
        orderLabel={t.product.order}
      />
    </div>
  );
}
