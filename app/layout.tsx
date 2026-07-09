import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { CartProvider } from "@/lib/cart/cart-context";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const OG_LOCALES: Record<string, string> = {
  ru: "ru_RU",
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

const siteUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getDictionary();
  return {
    ...(siteUrl ? { metadataBase: new URL(`https://${siteUrl}`) } : {}),
    title: t.metadata.title,
    description: t.metadata.description,
    openGraph: {
      title: t.metadata.title,
      description: t.metadata.description,
      locale: OG_LOCALES[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.metadata.title,
      description: t.metadata.description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale } = await getDictionary();

  return (
    <html lang={locale} className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="bg-bg font-sans text-text antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
