"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/supabase/mutations";
import { orderNumber } from "@/lib/cart/order-storage";
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
              <th className="p-4 font-normal">Состав</th>
              <th className="p-4 font-normal">Сумма</th>
              <th className="p-4 font-normal">Статус</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
