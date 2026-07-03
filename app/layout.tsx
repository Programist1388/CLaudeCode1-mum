import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { CartProvider } from "@/lib/cart/cart-context";
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

export const metadata: Metadata = {
  title: "СИЯНИЕ — одежда и текстиль со стразами ручной работы",
  description:
    "Худи, футболки и текстиль для дома с авторскими принтами из страз, выложенных вручную кристалл за кристаллом. Свой дизайн, персонаж или логотип — под ваш запрос.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="bg-bg font-sans text-text antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
