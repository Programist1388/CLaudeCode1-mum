import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CareSection } from "@/components/home/CareSection";
import { OrderSection } from "@/components/home/OrderSection";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { getAllProducts } from "@/lib/supabase/queries";

export default async function Home() {
  const products = await getAllProducts();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="h-px bg-gradient-to-r from-transparent via-line to-transparent" />
        <CatalogGrid products={products} />
        <ProcessSection />
        <CareSection />
        <OrderSection />
      </main>
      <Footer />
    </>
  );
}
