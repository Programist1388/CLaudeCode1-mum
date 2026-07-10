import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { getAllProducts, getAllCategories } from "@/lib/supabase/queries";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary();
  return { title: t.metadata.catalogTitle };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, locale] = await Promise.all([searchParams, getLocale()]);
  const [products, categories] = await Promise.all([
    getAllProducts(locale),
    getAllCategories(),
  ]);

  const filtered = category
    ? products.filter((p) => p.categorySlug === category)
    : products;

  return (
    <>
      <Header />
      <main>
        <CatalogGrid
          products={filtered}
          categories={categories}
          activeCategory={category}
        />
      </main>
      <Footer />
    </>
  );
}
