"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { RevealOnScroll } from "@/components/layout/RevealOnScroll";
import { Wrap } from "@/components/layout/Wrap";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { PriceTag } from "@/components/catalog/PriceTag";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatPriceRub } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n/dictionary";

// A big product photo on one side, price/actions and a switchable model
// list on the other — same split as a furniture-site product spotlight,
// with the model list standing in for a color/variant picker: tap a row,
// the photo/title/price on the left crossfade to it (.spotlight-fade in
// globals.css, keyed by slug so React remounts and replays the animation).
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
        <RevealOnScroll className="mx-auto mb-13 max-w-[620px] text-center">
          <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
            {t.spotlight.kicker}
          </div>
          <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-semibold text-text">
            {t.spotlight.title}
          </h2>
          <p className="mt-3.5 text-[15.5px] text-text-dim">
            {t.spotlight.subtitle}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delayMs={150} className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative">
            <div className="absolute inset-6 -z-10 rounded-full bg-gold/12 blur-3xl" />
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
          </div>

          <div>
            <div key={`${active.slug}-info`} className="spotlight-fade">
              {active.badge && (
                <span className="mb-3 inline-block rounded-full border border-gold/35 bg-card px-3 py-1.5 text-[11.5px] tracking-[0.06em] text-gold-soft uppercase">
                  {active.badge}
                </span>
              )}
              <h3 className="font-serif text-3xl font-semibold text-text sm:text-4xl">
                {active.title}
              </h3>
              <div className="mt-3">
                <PriceTag
                  value={active.priceValue}
                  isFrom={active.priceIsFrom}
                  fromLabel={t.product.priceFrom}
                  unitLabel={t.product.priceUnit}
                />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <AddToCartButton
                  product={active}
                  addLabel={t.product.addToCart}
                  addedLabel={t.product.added}
                  orderLabel={t.product.order}
                />
                <Link
                  href={`/catalog/${active.slug}`}
                  className="text-sm tracking-[0.03em] text-text-dim underline decoration-dotted transition-colors hover:text-gold-soft"
                >
                  {t.spotlight.viewDetails} →
                </Link>
              </div>
            </div>

            {products.length > 1 && (
              <div className="mt-10 border-t border-line pt-6">
                <span className="text-[12px] tracking-[0.14em] text-text-dim uppercase">
                  {t.spotlight.otherModels}
                </span>
                <div className="mt-4 flex flex-col gap-1">
                  {products.map((p, i) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-pressed={i === activeIndex}
                      className={`flex items-center gap-3.5 rounded-[8px] border p-2.5 text-left transition-colors ${
                        i === activeIndex
                          ? "border-gold bg-card"
                          : "border-transparent hover:bg-card/60"
                      }`}
                    >
                      <span className="h-12 w-12 shrink-0 overflow-hidden rounded-[6px] border border-line">
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
                      </span>
                      <span className="flex-1 truncate text-[14.5px] text-text">
                        {p.title}
                      </span>
                      <span className="shrink-0 text-[13.5px] text-gold-soft">
                        {formatPriceRub(p.priceValue, p.priceIsFrom, t.product.priceFrom)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>
      </Wrap>
    </section>
  );
}
