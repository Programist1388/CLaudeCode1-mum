import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CareSection } from "@/components/home/CareSection";
import { OrderSection } from "@/components/home/OrderSection";
import { getAllProducts } from "@/lib/supabase/queries";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function Home() {
  const [products, { t }] = await Promise.all([
    getAllProducts(),
    getDictionary(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="h-px bg-gradient-to-r from-transparent via-line to-transparent" />
        <ProductSpotlight products={products.slice(0, 8)} t={t} />
        <ProcessSection />
        <CareSection />
        <OrderSection />
      </main>
      <Footer />
    </>
  );
}
