import type { Product } from "@/lib/types";
import { Wrap } from "@/components/layout/Wrap";
import { ProductCard } from "@/components/catalog/ProductCard";

export function CatalogGrid({ products }: { products: Product[] }) {
  return (
    <section id="catalog" className="py-24">
      <Wrap>
        <div className="mx-auto mb-13 max-w-[620px] text-center">
          <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
            Каталог
          </div>
          <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-semibold text-text">
            Каждый принт — в одном экземпляре
          </h2>
          <p className="mt-3.5 text-[15.5px] text-text-dim">
            Фото сделаны нами при сборке заказов — это реальные изделия, а не
            рендеры. Размер, цвет ткани и вариант страз уточняются при
            оформлении заказа. Можем повторить свой сюжет — пришлите
            референс.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Wrap>
    </section>
  );
}
