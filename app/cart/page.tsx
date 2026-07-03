"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Wrap } from "@/components/layout/Wrap";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { buildOrderSummary } from "@/components/cart/OrderSummaryBuilder";
import { useCart } from "@/lib/cart/cart-context";
import { buildWhatsAppLink, buildTelegramLink } from "@/lib/order-links";
import { formatPriceRub } from "@/lib/format";

export default function CartPage() {
  const { items, clear } = useCart();
  const [note, setNote] = useState("");
  const [orderRequested, setOrderRequested] = useState(false);
  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => buildOrderSummary(items, note), [items, note]);
  const hasEstimate = items.some((item) => item.priceIsFrom);
  const total = items.reduce((sum, item) => sum + item.priceValue * item.qty, 0);

  async function handleCopyAndOpenTelegram() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      // Clipboard API may be unavailable; the summary is still visible below to copy by hand.
    }
    setOrderRequested(true);
    window.open(buildTelegramLink(), "_blank", "noopener");
  }

  if (items.length === 0 && !orderRequested) {
    return (
      <>
        <Header />
        <main className="py-24">
          <Wrap className="text-center">
            <h1 className="font-serif text-3xl font-semibold text-text">
              Корзина пуста
            </h1>
            <p className="mt-3 text-text-dim">
              Загляните в каталог, чтобы выбрать принт.
            </p>
            <Link
              href="/#catalog"
              className="mt-8 inline-block rounded-full bg-gold px-7.5 py-3.5 text-sm font-semibold tracking-[0.03em] text-bg uppercase transition-transform hover:-translate-y-0.5"
            >
              Смотреть каталог
            </Link>
          </Wrap>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="py-16">
        <Wrap className="max-w-[760px]">
          <h1 className="mb-8 font-serif text-3xl font-semibold text-text">
            Корзина
          </h1>

          {items.length > 0 && (
            <>
              <div className="rounded-[8px] border border-line bg-card px-6">
                {items.map((item) => (
                  <CartLineItem key={item.slug} item={item} />
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
                <span className="text-text-dim">
                  {hasEstimate ? "Ориентировочно" : "Итого"}
                </span>
                <span className="font-serif text-2xl font-semibold text-gold-soft">
                  {formatPriceRub(total)}
                </span>
              </div>

              <label className="mt-6 block text-sm text-text-dim">
                Размер, цвет, пожелания
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Например: размер L, хочу без надписи снизу"
                  className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text placeholder:text-text-dim/60 focus:border-gold focus:outline-none"
                />
              </label>

              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href={buildWhatsAppLink(summary)}
                  target="_blank"
                  rel="noopener"
                  onClick={() => setOrderRequested(true)}
                  className="rounded-full bg-gold px-7.5 py-3.5 text-sm font-semibold tracking-[0.03em] text-bg uppercase transition-transform hover:-translate-y-0.5"
                >
                  Оформить в WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleCopyAndOpenTelegram}
                  className="rounded-full border border-line px-7 py-3.5 text-sm tracking-[0.03em] text-text uppercase transition-colors hover:border-gold hover:text-gold-soft"
                >
                  {copied
                    ? "Скопировано — открыть Telegram"
                    : "Скопировать и открыть Telegram"}
                </button>
              </div>
            </>
          )}

          {orderRequested && (
            <div className="mt-8 rounded-[8px] border border-gold/35 bg-card p-5 text-[14.5px] text-text-dim">
              Заказ сформирован, при необходимости корзину можно очистить.{" "}
              <button
                type="button"
                onClick={() => {
                  clear();
                  setOrderRequested(false);
                }}
                className="text-gold-soft underline decoration-dotted"
              >
                Очистить корзину
              </button>
            </div>
          )}
        </Wrap>
      </main>
      <Footer />
    </>
  );
}
