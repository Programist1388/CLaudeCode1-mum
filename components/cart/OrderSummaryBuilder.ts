import type { CartItem } from "@/lib/cart/cart-context";
import {
  deliveryMethodNeedsAddress,
  DELIVERY_METHOD_LABELS_RU,
  type DeliveryMethod,
} from "@/lib/delivery";
import { formatPriceRub } from "@/lib/format";
import type { Locale } from "@/lib/i18n/locales";

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
}

// The order message itself always stays in Russian (the owner reads and
// replies in Russian), but we tell her which language the customer's
// browser was in, so she knows whether to reply in English instead.
const LOCALE_LABELS_RU: Record<Locale, string> = {
  ru: "русский",
  en: "английский",
  fr: "французский",
  es: "испанский",
};

export function buildOrderSummary(
  items: CartItem[],
  note?: string,
  locale?: Locale,
  orderNumber?: string,
  customer?: OrderCustomerInfo
): string {
  const lines = items.map(
    (item, i) =>
      `${i + 1}. ${item.title} — ${item.qty} шт. (${formatPriceRub(
        item.priceValue * item.qty,
        item.priceIsFrom
      )})`
  );

  const hasEstimate = items.some((i) => i.priceIsFrom);
  const total = items.reduce((sum, i) => sum + i.priceValue * i.qty, 0);
  const totalLine = `Итого${hasEstimate ? " (ориентировочно)" : ""}: ${formatPriceRub(total)}`;

  const parts = ["Здравствуйте! Хочу заказать:", "", ...lines, "", totalLine];

  if (customer) {
    parts.push(
      "",
      `Имя: ${customer.name}`,
      `Телефон: ${customer.phone}`,
      `Способ доставки: ${DELIVERY_METHOD_LABELS_RU[customer.deliveryMethod]}`
    );
    if (deliveryMethodNeedsAddress(customer.deliveryMethod)) {
      parts.push(`Адрес доставки: ${customer.deliveryAddress}`);
    }
  }

  if (note?.trim()) {
    parts.push("", `Комментарий: ${note.trim()}`);
  }

  if (locale && locale !== "ru") {
    parts.push("", `Язык сайта клиента: ${LOCALE_LABELS_RU[locale]}`);
  }

  if (orderNumber) {
    parts.push("", `Номер заказа: ${orderNumber}`);
  }

  return parts.join("\n");
}
