import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Wrap } from "@/components/layout/Wrap";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { PriceTag } from "@/components/catalog/PriceTag";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getProductBySlug } from "@/lib/supabase/queries";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="py-16">
        <Wrap className="grid gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[8px] border border-line">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.title}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <ImagePlaceholder className="aspect-square w-full" />
            )}
          </div>

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
              />
              <AddToCartButton product={product} className="mt-6" />
            </div>
          </div>
        </Wrap>
      </main>
      <Footer />
    </>
  );
}
