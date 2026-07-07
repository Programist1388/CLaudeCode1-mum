"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Wrap } from "@/components/layout/Wrap";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderStatusList } from "@/components/cart/OrderStatusList";
import { buildOrderSummary } from "@/components/cart/OrderSummaryBuilder";
import { useCart } from "@/lib/cart/cart-context";
import { addOrderId, newOrderId, orderNumber } from "@/lib/cart/order-storage";
import { buildWhatsAppLink, buildTelegramLink } from "@/lib/order-links";
import { createOrder } from "@/lib/supabase/mutations";
import { formatPriceRub } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

export function CartPageClient({
  t,
  locale,
}: {
  t: Dictionary;
  locale: Locale;
}) {
  const { items, clear } = useCart();
  const [note, setNote] = useState("");
  const [orderRequested, setOrderRequested] = useState(false);
  const [copied, setCopied] = useState(false);
  // The order id is minted in the browser so its number can be quoted in
  // the message right away; a fresh one is minted if the cart changes
  // after an order was already placed (that's a different order then).
  const [draft, setDraft] = useState(() => ({
    id: newOrderId(),
    placed: false,
  }));

  useEffect(() => {
    // A placed draft belongs to the cart contents it was placed with; if
    // the cart changes afterwards, that's a different order.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft((d) => (d.placed ? { id: newOrderId(), placed: false } : d));
  }, [items, note]);

  const summary = useMemo(
    () => buildOrderSummary(items, note, locale, orderNumber(draft.id)),
    [items, note, locale, draft.id]
  );
  const hasEstimate = items.some((item) => item.priceIsFrom);
  const total = items.reduce((sum, item) => sum + item.priceValue * item.qty, 0);

  // Fire-and-forget: the WhatsApp/Telegram window opens immediately, the
  // order row is written in parallel so the customer can track its status.
  function placeOrder(channel: "whatsapp" | "telegram") {
    if (draft.placed || items.length === 0) return;
    setDraft({ ...draft, placed: true });
    void createOrder({
      id: draft.id,
      items: items.map((item) => ({
        slug: item.slug,
        title: item.title,
        qty: item.qty,
        priceValue: item.priceValue,
        priceIsFrom: item.priceIsFrom,
      })),
      total,
      note,
      locale,
      channel,
    }).then((result) => {
      if (!result.error) addOrderId(draft.id);
    });
  }

  async function handleCopyAndOpenTelegram() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      // Clipboard API may be unavailable; the summary is still visible below to copy by hand.
    }
    placeOrder("telegram");
    setOrderRequested(true);
    window.open(buildTelegramLink(), "_blank", "noopener");
  }

  if (items.length === 0 && !orderRequested) {
    return (
      <main className="py-24">
        <Wrap className="text-center">
          <h1 className="font-serif text-3xl font-semibold text-text">
            {t.cart.emptyTitle}
          </h1>
          <p className="mt-3 text-text-dim">{t.cart.emptySubtitle}</p>
          <Link
            href="/catalog"
            className="mt-8 inline-block rounded-full bg-gold px-7.5 py-3.5 text-sm font-semibold tracking-[0.03em] text-bg uppercase transition-transform hover:-translate-y-0.5"
          >
            {t.cart.browseCatalog}
          </Link>
          <OrderStatusList t={t} locale={locale} />
        </Wrap>
      </main>
    );
  }

  return (
    <main className="py-16">
      <Wrap className="max-w-[760px]">
        <h1 className="mb-8 font-serif text-3xl font-semibold text-text">
          {t.cart.title}
        </h1>

        {items.length > 0 && (
          <>
            <div className="rounded-[8px] border border-line bg-card px-6">
              {items.map((item) => (
                <CartLineItem key={item.slug} item={item} t={t} />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
              <span className="text-text-dim">
                {hasEstimate ? t.cart.estimateTotal : t.cart.total}
              </span>
              <span className="font-serif text-2xl font-semibold text-gold-soft">
                {formatPriceRub(total)}
              </span>
            </div>

            <label className="mt-6 block text-sm text-text-dim">
              {t.cart.noteLabel}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder={t.cart.notePlaceholder}
                className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text placeholder:text-text-dim/60 focus:border-gold focus:outline-none"
              />
            </label>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={buildWhatsAppLink(summary)}
                target="_blank"
                rel="noopener"
                onClick={() => {
                  placeOrder("whatsapp");
                  setOrderRequested(true);
                }}
                className="rounded-full bg-gold px-7.5 py-3.5 text-sm font-semibold tracking-[0.03em] text-bg uppercase transition-transform hover:-translate-y-0.5"
              >
                {t.cart.checkoutWhatsapp}
              </a>
              <button
                type="button"
                onClick={handleCopyAndOpenTelegram}
                className="rounded-full border border-line px-7 py-3.5 text-sm tracking-[0.03em] text-text uppercase transition-colors hover:border-gold hover:text-gold-soft"
              >
                {copied
                  ? t.cart.checkoutTelegramCopied
                  : t.cart.checkoutTelegram}
              </button>
            </div>
          </>
        )}

        {orderRequested && (
          <div className="mt-8 rounded-[8px] border border-gold/35 bg-card p-5 text-[14.5px] text-text-dim">
            {t.cart.orderPlacedNote}{" "}
            <button
              type="button"
              onClick={() => {
                clear();
                setOrderRequested(false);
              }}
              className="text-gold-soft underline decoration-dotted"
            >
              {t.cart.clearCart}
            </button>
          </div>
        )}

        <OrderStatusList t={t} locale={locale} />
      </Wrap>
    </main>
  );
}
