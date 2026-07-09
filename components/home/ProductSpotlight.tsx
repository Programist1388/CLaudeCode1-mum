"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Wrap } from "@/components/layout/Wrap";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { PriceTag } from "@/components/catalog/PriceTag";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { Dictionary } from "@/lib/i18n/dictionary";

// Apple's AirPods Max page swaps the hero photo when you tap a color
// swatch; here the swatches are products instead of colors, but the
// interaction is the same — tap one, the big photo/title/price crossfade
// to it (see .spotlight-fade in globals.css).
export function ProductSpotlight({
  products,
  t,
}: {
  products: Product[];
  t: Dictionary;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (products.length === 0) return null;

  const active = products[activeIndex];

  return (
    <section className="py-24">
      <Wrap>
        <div className="mx-auto mb-13 max-w-[620px] text-center">
          <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
            {t.spotlight.kicker}
          </div>
          <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-semibold text-text">
            {t.spotlight.title}
          </h2>
          <p className="mt-3.5 text-[15.5px] text-text-dim">
            {t.spotlight.subtitle}
          </p>
        </div>

        <div className="mx-auto max-w-[560px]">
          <Link
            key={active.slug}
            href={`/catalog/${active.slug}`}
            className="spotlight-fade block aspect-square overflow-hidden rounded-[8px] border border-line"
          >
            {active.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.images[0]}
                alt={active.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlaceholder
                className="h-full w-full"
                label={t.imagePlaceholder.text}
              />
            )}
          </Link>

          <div key={`${active.slug}-info`} className="spotlight-fade mt-8 text-center">
            {active.badge && (
              <span className="mb-3 inline-block rounded-full border border-gold/35 bg-card px-3 py-1.5 text-[11.5px] tracking-[0.06em] text-gold-soft uppercase">
                {active.badge}
              </span>
            )}
            <h3 className="font-serif text-3xl font-semibold text-text">
              {active.title}
            </h3>
            <div className="mt-3 flex justify-center">
              <PriceTag
                value={active.priceValue}
                isFrom={active.priceIsFrom}
                fromLabel={t.product.priceFrom}
                unitLabel={t.product.priceUnit}
              />
            </div>
            <div className="mt-6 flex justify-center">
              <AddToCartButton
                product={active}
                addLabel={t.product.addToCart}
                addedLabel={t.product.added}
                orderLabel={t.product.order}
              />
            </div>
          </div>

          {products.length > 1 && (
            <div className="mt-10 flex flex-wrap justify-center gap-3.5">
              {products.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={p.title}
                  aria-pressed={i === activeIndex}
                  className={`h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 transition-all duration-300 ${
                    i === activeIndex
                      ? "border-gold shadow-gold scale-110"
                      : "border-line opacity-55 hover:opacity-100 hover:border-gold-soft"
                  }`}
                >
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-card to-bg-soft font-serif text-gold-soft/60">
                      ✦
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </Wrap>
    </section>
  );
}
