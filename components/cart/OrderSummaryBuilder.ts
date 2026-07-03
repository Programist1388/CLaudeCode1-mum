import type { CartItem } from "@/lib/cart/cart-context";
import { formatPriceRub } from "@/lib/format";

export function buildOrderSummary(items: CartItem[], note?: string): string {
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

  if (note?.trim()) {
    parts.push("", `Комментарий: ${note.trim()}`);
  }

  return parts.join("\n");
}
