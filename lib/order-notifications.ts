// Telegram notification to the owner about a new order, sent server-side
// right after the order row is written. WhatsApp has no free send API
// (only the paid WhatsApp Business API), so Telegram is the single admin
// notification channel regardless of which messenger the customer opened —
// the message says which one it was.
//
// Deliberately never throws: a failed notification must not fail checkout.
// If TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID are unset, it's a no-op.

import {
  deliveryMethodNeedsAddress,
  DELIVERY_METHOD_LABELS_RU,
  type DeliveryMethod,
} from "@/lib/delivery";
import { formatPriceRub } from "@/lib/format";
import type { OrderItemSnapshot } from "@/lib/supabase/types";

const LOCALE_LABELS_RU: Record<string, string> = {
  ru: "русский",
  en: "английский",
  fr: "французский",
  es: "испанский",
};

const CHANNEL_LABELS_RU = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
} as const;

export type OrderChannel = keyof typeof CHANNEL_LABELS_RU;

export interface NewOrderNotification {
  orderNumber: string;
  items: OrderItemSnapshot[];
  total: number;
  note: string;
  locale: string;
  channel: OrderChannel;
  customerName: string;
  customerPhone: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
}

function buildText(order: NewOrderNotification): string {
  const lines = order.items.map(
    (item, i) =>
      `${i + 1}. ${item.title}${item.size ? `, размер ${item.size}` : ""} — ${item.qty} шт. (${formatPriceRub(
        item.priceValue * item.qty,
        item.priceIsFrom
      )})`
  );

  const hasEstimate = order.items.some((i) => i.priceIsFrom);
  const parts = [
    `🆕 Новый заказ ${order.orderNumber}`,
    "",
    ...lines,
    "",
    `Итого${hasEstimate ? " (ориентировочно)" : ""}: ${formatPriceRub(order.total)}`,
    "",
    `Клиент: ${order.customerName}`,
    `Телефон: ${order.customerPhone}`,
    `Способ доставки: ${DELIVERY_METHOD_LABELS_RU[order.deliveryMethod]}`,
  ];

  if (deliveryMethodNeedsAddress(order.deliveryMethod)) {
    parts.push(`Адрес доставки: ${order.deliveryAddress}`);
  }

  parts.push(`Оформлен через: ${CHANNEL_LABELS_RU[order.channel]}`);

  if (order.note.trim()) {
    parts.push(`Комментарий: ${order.note.trim()}`);
  }

  if (order.locale !== "ru") {
    parts.push(
      `Язык клиента: ${LOCALE_LABELS_RU[order.locale] ?? order.locale}`
    );
  }

  parts.push("", "Статус можно поменять в /admin/orders.");
  return parts.join("\n");
}

export async function sendNewOrderNotification(
  order: NewOrderNotification
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: buildText(order) }),
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!response.ok) {
      console.error(
        `Order notification failed: Telegram API ${response.status}`,
        await response.text().catch(() => "")
      );
    }
  } catch (error) {
    console.error("Order notification failed:", error);
  }
}
