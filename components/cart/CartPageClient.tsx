"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Wrap } from "@/components/layout/Wrap";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderStatusList } from "@/components/cart/OrderStatusList";
import { buildOrderSummary } from "@/components/cart/OrderSummaryBuilder";
import { cartLineKey, useCart } from "@/lib/cart/cart-context";
import { addOrderId, newOrderId } from "@/lib/cart/order-storage";
import {
  DELIVERY_METHODS,
  deliveryMethodNeedsAddress,
  type DeliveryMethod,
} from "@/lib/delivery";
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
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("courier");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [orderRequested, setOrderRequested] = useState(false);
  const [copied, setCopied] = useState(false);
  // The order id is minted in the browser so its number can be quoted in
  // the message right away; a fresh one is minted if the cart changes
  // after an order was already placed (that's a different order then).
  const [draft, setDraft] = useState(() => ({
    id: newOrderId(),
    placed: false,
  }));

  const needsAddress = deliveryMethodNeedsAddress(deliveryMethod);
  const isValid =
    customerName.trim().length > 0 &&
    customerPhone.trim().length > 0 &&
    (!needsAddress || deliveryAddress.trim().length > 0);

  useEffect(() => {
    // A placed draft belongs to the cart/checkout details it was placed
    // with; if any of that changes afterwards, that's a different order.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft((d) => (d.placed ? { id: newOrderId(), placed: false } : d));
  }, [items, note, customerName, customerPhone, deliveryMethod, deliveryAddress]);

  const summary = useMemo(
    () =>
      buildOrderSummary(items, note, locale, {
        name: customerName,
        phone: customerPhone,
        deliveryMethod,
        deliveryAddress,
      }),
    [items, note, locale, customerName, customerPhone, deliveryMethod, deliveryAddress]
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
        size: item.size,
      })),
      total,
      note,
      locale,
      channel,
      customerName,
      customerPhone,
      deliveryMethod,
      deliveryAddress,
    }).then((result) => {
      if (!result.error) addOrderId(draft.id);
    });
  }

  async function handleCopyAndOpenTelegram() {
    if (!isValid) {
      setShowErrors(true);
      return;
    }
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
                <CartLineItem key={cartLineKey(item.slug, item.size)} item={item} t={t} />
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

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block text-sm text-text-dim">
                {t.cart.nameLabel}
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t.cart.namePlaceholder}
                  className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text placeholder:text-text-dim/60 focus:border-gold focus:outline-none"
                />
                {showErrors && !customerName.trim() && (
                  <span className="mt-1 block text-[13px] text-rose">
                    {t.cart.requiredFieldError}
                  </span>
                )}
              </label>

              <label className="block text-sm text-text-dim">
                {t.cart.phoneLabel}
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={t.cart.phonePlaceholder}
                  className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text placeholder:text-text-dim/60 focus:border-gold focus:outline-none"
                />
                {showErrors && !customerPhone.trim() && (
                  <span className="mt-1 block text-[13px] text-rose">
                    {t.cart.requiredFieldError}
                  </span>
                )}
              </label>

              <label className="block text-sm text-text-dim">
                {t.cart.deliveryMethodLabel}
                <select
                  value={deliveryMethod}
                  onChange={(e) =>
                    setDeliveryMethod(e.target.value as DeliveryMethod)
                  }
                  className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
                >
                  {DELIVERY_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {
                        {
                          courier: t.cart.deliveryMethodCourier,
                          post: t.cart.deliveryMethodPost,
                          cdek: t.cart.deliveryMethodCdek,
                          pickup: t.cart.deliveryMethodPickup,
                        }[method]
                      }
                    </option>
                  ))}
                </select>
              </label>

              {needsAddress && (
                <label className="block text-sm text-text-dim">
                  {t.cart.deliveryAddressLabel}
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={t.cart.deliveryAddressPlaceholder}
                    className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text placeholder:text-text-dim/60 focus:border-gold focus:outline-none"
                  />
                  {showErrors && !deliveryAddress.trim() && (
                    <span className="mt-1 block text-[13px] text-rose">
                      {t.cart.requiredFieldError}
                    </span>
                  )}
                </label>
              )}
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
                onClick={(e) => {
                  if (!isValid) {
                    e.preventDefault();
                    setShowErrors(true);
                    return;
                  }
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
