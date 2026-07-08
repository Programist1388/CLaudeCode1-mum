"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteOrder, updateOrderStatus } from "@/lib/supabase/mutations";
import { orderNumber } from "@/lib/cart/order-storage";
import {
  deliveryMethodNeedsAddress,
  DELIVERY_METHOD_LABELS_RU,
  isDeliveryMethod,
} from "@/lib/delivery";
import { formatPriceRub } from "@/lib/format";
import {
  ORDER_STATUSES,
  type OrderRow,
  type OrderStatus,
} from "@/lib/supabase/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "🆕 Новый заказ",
  in_progress: "⚙️ Заказ в процессе выполнения",
  ready: "✅ Заказ готов",
  cancelled: "❌ Заказ отменен",
};

const CHANNEL_LABELS: Record<OrderRow["channel"], string> = {
  whatsapp: "💬 WhatsApp",
  telegram: "✈️ Telegram",
};

const LOCALE_LABELS: Record<string, string> = {
  ru: "русский",
  en: "английский",
  fr: "французский",
  es: "испанский",
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleStatusChange(id: string, status: OrderStatus) {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(id, status);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete(id: string, number: string) {
    if (!confirm(`Удалить заказ ${number}?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteOrder(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (orders.length === 0) {
    return <p className="text-text-dim">Заказов пока нет.</p>;
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-rose">Ошибка: {error}</p>}

      <div className="overflow-x-auto rounded-[8px] border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-text-dim">
              <th className="p-4 font-normal">Заказ</th>
              <th className="p-4 font-normal">Клиент</th>
              <th className="p-4 font-normal">Состав</th>
              <th className="p-4 font-normal">Сумма</th>
              <th className="p-4 font-normal">Статус</th>
              <th className="p-4 font-normal" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line last:border-b-0">
                <td className="p-4 align-top whitespace-nowrap">
                  <div className="text-text">{orderNumber(order.id)}</div>
                  <div className="mt-1 text-text-dim">
                    {new Date(order.created_at).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="mt-1 font-semibold text-gold-soft">
                    {CHANNEL_LABELS[order.channel]}
                  </div>
                </td>
                <td className="p-4 align-top whitespace-nowrap">
                  <div className="text-text">{order.customer_name}</div>
                  <div className="mt-1 text-text-dim">{order.customer_phone}</div>
                  {isDeliveryMethod(order.delivery_method) && (
                    <div className="mt-1 text-text-dim">
                      {DELIVERY_METHOD_LABELS_RU[order.delivery_method]}
                      {deliveryMethodNeedsAddress(order.delivery_method) &&
                        order.delivery_address &&
                        ` — ${order.delivery_address}`}
                    </div>
                  )}
                </td>
                <td className="p-4 align-top text-text-dim">
                  {order.items.map((item) => (
                    <div key={item.slug}>
                      {item.title} — {item.qty} шт.
                    </div>
                  ))}
                  {order.note && (
                    <div className="mt-2 text-text-dim/70">
                      Комментарий: {order.note}
                    </div>
                  )}
                  {order.locale !== "ru" && (
                    <div className="mt-2 text-text-dim/70">
                      Язык клиента: {LOCALE_LABELS[order.locale] ?? order.locale}
                    </div>
                  )}
                </td>
                <td className="p-4 align-top whitespace-nowrap text-gold-soft">
                  {formatPriceRub(order.total)}
                </td>
                <td className="p-4 align-top">
                  <select
                    value={order.status}
                    disabled={isPending}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as OrderStatus)
                    }
                    className="rounded-[8px] border border-line bg-bg-soft p-2 text-text focus:border-gold focus:outline-none disabled:opacity-60"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-right align-top">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(order.id, orderNumber(order.id))}
                    className="text-text-dim underline decoration-dotted hover:text-rose disabled:opacity-60"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
