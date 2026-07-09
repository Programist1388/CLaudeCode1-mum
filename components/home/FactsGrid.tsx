import Link from "next/link";
import type { Product } from "@/lib/types";
import { Wrap } from "@/components/layout/Wrap";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { formatPriceRub } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n/dictionary";

// A sharp-edged, full-bleed-photo grid that alternates big stat numbers
// with product photos (label + price overlaid bottom-left) — the same
// "editorial facts grid" pattern as a movie/brand facts page, built from
// real shop stats and real catalog products rather than filler content.
// Explicit right/bottom borders (rather than Tailwind's divide-* utilities,
// which key off DOM order and don't map cleanly onto a 2D CSS grid) plus a
// matching left/top border on the grid container gives every cell exactly
// one border line regardless of how many columns wrap at each breakpoint.
const CELL_BORDER = "border-r border-b border-line/60";

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className={`flex aspect-[4/3] flex-col justify-between p-6 sm:p-8 ${CELL_BORDER}`}>
      <span className="font-sans text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight text-text">
        {value}
      </span>
      <span className="text-[12.5px] font-semibold tracking-[0.05em] text-text-dim uppercase">
        {label}
      </span>
    </div>
  );
}

function ProductCell({
  product,
  t,
}: {
  product: Product;
  t: Dictionary;
}) {
  return (
    <Link
      href={`/catalog/${product.slug}`}
      className={`group relative flex aspect-[4/3] flex-col justify-end overflow-hidden p-6 sm:p-8 ${CELL_BORDER}`}
    >
      {product.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.images[0]}
          alt={product.title}
          className="absolute inset-0 h-full w-full object-cover opacity-75 transition-[opacity,transform] duration-500 group-hover:scale-105 group-hover:opacity-95"
        />
      ) : (
        <ImagePlaceholder
          className="absolute inset-0 h-full w-full"
          label={t.imagePlaceholder.text}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/15 to-transparent" />
      <div className="relative">
        <div className="text-[14.5px] font-semibold text-text">
          {product.title}
        </div>
        <div className="mt-0.5 text-[13px] text-gold-soft">
          {formatPriceRub(product.priceValue, product.priceIsFrom, t.product.priceFrom)}
        </div>
      </div>
    </Link>
  );
}

export function FactsGrid({
  products,
  t,
}: {
  products: Product[];
  t: Dictionary;
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-24">
      <Wrap>
        <div className="mx-auto mb-13 max-w-[620px] text-center">
          <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
            {t.factsGrid.kicker}
          </div>
          <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-semibold text-text">
            {t.factsGrid.title}
          </h2>
          <p className="mt-3.5 text-[15.5px] text-text-dim">
            {t.factsGrid.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 border-t border-l border-line/60 bg-bg sm:grid-cols-2 lg:grid-cols-4">
          <StatCell value={t.stats.handmadeValue} label={t.stats.handmadeLabel} />
          {products.slice(0, 3).map((p) => (
            <ProductCell key={p.slug} product={p} t={t} />
          ))}
          {products.length > 3 && (
            <StatCell value={t.stats.designsValue} label={t.stats.designsLabel} />
          )}
          {products.slice(3, 6).map((p) => (
            <ProductCell key={p.slug} product={p} t={t} />
          ))}
        </div>
      </Wrap>
    </section>
  );
}
