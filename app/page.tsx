import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Showroom } from "@/components/home/Showroom";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CareSection } from "@/components/home/CareSection";
import { OrderSection } from "@/components/home/OrderSection";
import { getAllShowroomItems } from "@/lib/supabase/queries";

export default async function Home() {
  const showroomItems = await getAllShowroomItems();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="h-px bg-gradient-to-r from-transparent via-line to-transparent" />
        <Showroom items={showroomItems} />
        <ProcessSection />
        <CareSection />
        <OrderSection />
      </main>
      <Footer />
    </>
  );
}
