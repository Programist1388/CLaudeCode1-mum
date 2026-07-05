import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartPageClient } from "@/components/cart/CartPageClient";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function CartPage() {
  const { t, locale } = await getDictionary();

  return (
    <>
      <Header />
      <CartPageClient t={t} locale={locale} />
      <Footer />
    </>
  );
}
