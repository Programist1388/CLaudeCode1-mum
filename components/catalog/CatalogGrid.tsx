import Link from "next/link";
import type { Product } from "@/lib/types";
import type { CategoryRow } from "@/lib/supabase/types";
import { Wrap } from "@/components/layout/Wrap";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function CatalogGrid({
  products,
  categories,
  activeCategory,
}: {
  products: Product[];
  categories?: CategoryRow[];
  activeCategory?: string;
}) {
  const { t } = await getDictionary();

  return (
    <section id="catalog" className="py-24">
      <Wrap>
        <div className="mx-auto mb-13 max-w-[620px] text-center">
          <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
            {t.catalog.kicker}
          </div>
          <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-semibold text-text">
            {t.catalog.title}
          </h2>
          <p className="mt-3.5 text-[15.5px] text-text-dim">
            {t.catalog.subtitle}
          </p>
        </div>

        {categories && categories.length > 0 && (
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/catalog"
              className={`rounded-full border px-5 py-2 text-sm tracking-[0.03em] transition-colors ${
                !activeCategory
                  ? "border-gold bg-gold text-bg"
                  : "border-line text-text-dim hover:border-gold hover:text-gold-soft"
              }`}
            >
              {t.catalog.allTab}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className={`rounded-full border px-5 py-2 text-sm tracking-[0.03em] transition-colors ${
                  activeCategory === cat.slug
                    ? "border-gold bg-gold text-bg"
                    : "border-line text-text-dim hover:border-gold hover:text-gold-soft"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <p className="text-center text-text-dim">
            {activeCategory ? t.catalog.emptyCategory : t.catalog.emptyGeneral}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </Wrap>
    </section>
  );
}
