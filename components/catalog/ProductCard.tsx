import Link from "next/link";
import type { Product } from "@/lib/types";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { PriceTag } from "@/components/catalog/PriceTag";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function ProductCard({ product }: { product: Product }) {
  const { t } = await getDictionary();

  return (
    <div className="group flex flex-col overflow-hidden rounded-[8px] border border-line bg-card transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-[#4a4552]">
      <Link
        href={`/catalog/${product.slug}`}
        className="card-shimmer relative block aspect-square overflow-hidden"
      >
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 z-10 rounded-full border border-gold/35 bg-bg/72 px-3 py-1.5 text-[11.5px] tracking-[0.06em] text-gold-soft uppercase backdrop-blur-sm">
            {product.badge}
          </span>
        )}
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <ImagePlaceholder
            className="h-full w-full"
            label={t.imagePlaceholder.text}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <h3 className="font-serif text-[23px] font-semibold text-text">
          {product.title}
        </h3>

        <div className="flex flex-1 flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-2.5 py-1.5 text-[11.5px] tracking-[0.03em] text-text-dim"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-3.5 flex items-center justify-between border-t border-line pt-4">
          <PriceTag
            value={product.priceValue}
            isFrom={product.priceIsFrom}
            fromLabel={t.product.priceFrom}
            unitLabel={t.product.priceUnit}
          />
          <AddToCartButton
            product={product}
            variant="outline"
            addLabel={t.product.addToCart}
            addedLabel={t.product.added}
            orderLabel={t.product.order}
          />
        </div>
      </div>
    </div>
  );
}
