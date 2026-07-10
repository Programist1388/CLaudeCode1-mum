import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Wrap } from "@/components/layout/Wrap";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { PriceTag } from "@/components/catalog/PriceTag";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getProductBySlug } from "@/lib/supabase/queries";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const [product, { t }] = await Promise.all([
    getProductBySlug(decodeURIComponent(slug), locale),
    getDictionary(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="py-16">
        <Wrap className="grid gap-12 lg:grid-cols-2">
          <ProductGallery
            images={product.images}
            alt={product.title}
            placeholderLabel={t.imagePlaceholder.text}
          />

          <div>
            {product.badge && (
              <span className="mb-3 inline-block rounded-full border border-gold/35 bg-card px-3 py-1.5 text-[11.5px] tracking-[0.06em] text-gold-soft uppercase">
                {product.badge}
              </span>
            )}
            <h1 className="font-serif text-4xl font-semibold text-text">
              {product.title}
            </h1>
            <p className="mt-4 text-[15.5px] text-text-dim">
              {product.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line px-2.5 py-1.5 text-[11.5px] tracking-[0.03em] text-text-dim"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <PriceTag
                value={product.priceValue}
                isFrom={product.priceIsFrom}
                fromLabel={t.product.priceFrom}
                unitLabel={t.product.priceUnit}
              />
              <AddToCartButton
                product={product}
                className="mt-6"
                addLabel={t.product.addToCart}
                addedLabel={t.product.added}
                orderLabel={t.product.order}
              />
            </div>
          </div>
        </Wrap>
      </main>
      <Footer />
    </>
  );
}
