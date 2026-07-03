"use client";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { PriceTag } from "@/components/catalog/PriceTag";
import { useCart, type CartItem } from "@/lib/cart/cart-context";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-line py-5 last:border-b-0">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[6px] border border-line">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
      </div>

      <div className="min-w-[160px] flex-1">
        <h3 className="font-serif text-lg font-semibold text-text">
          {item.title}
        </h3>
        <PriceTag value={item.priceValue} isFrom={item.priceIsFrom} />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateQty(item.slug, item.qty - 1)}
          aria-label="Уменьшить количество"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-text transition-colors hover:border-gold hover:text-gold-soft"
        >
          −
        </button>
        <span className="w-6 text-center text-text">{item.qty}</span>
        <button
          type="button"
          onClick={() => updateQty(item.slug, item.qty + 1)}
          aria-label="Увеличить количество"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-text transition-colors hover:border-gold hover:text-gold-soft"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => removeItem(item.slug)}
        className="text-sm text-text-dim underline decoration-dotted transition-colors hover:text-rose"
      >
        Удалить
      </button>
    </div>
  );
}
