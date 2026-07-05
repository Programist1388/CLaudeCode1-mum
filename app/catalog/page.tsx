import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { getAllProducts, getAllCategories } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Каталог — СИЯНИЕ",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getAllProducts(),
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
