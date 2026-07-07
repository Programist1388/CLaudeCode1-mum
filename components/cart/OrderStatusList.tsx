"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { loadOrderIds, orderNumber } from "@/lib/cart/order-storage";
import type { OrderStatus } from "@/lib/supabase/types";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

interface TrackedOrder {
  id: string;
  status: OrderStatus;
  created_at: string;
}

// The customer only ever sees three states: cancelled, ready, or
// "accepted" (which covers both "new" and "in progress" for the admin).
function statusLabel(status: OrderStatus, t: Dictionary): string {
  if (status === "cancelled") return t.orders.statusCancelled;
  if (status === "ready") return t.orders.statusReady;
  return t.orders.statusAccepted;
}

function statusClass(status: OrderStatus): string {
  if (status === "cancelled") return "text-rose";
  if (status === "ready") return "text-gold-soft";
  return "text-text-dim";
}

export function OrderStatusList({
  t,
  locale,
}: {
  t: Dictionary;
  locale: Locale;
}) {
  const [orders, setOrders] = useState<TrackedOrder[]>([]);

  useEffect(() => {
    const ids = loadOrderIds();
    if (ids.length === 0) return;

    let cancelled = false;
    createClient()
      .from("orders")
      .select("id, status, created_at")
      .in("id", ids)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!cancelled && !error && data) setOrders(data as TrackedOrder[]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (orders.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-left font-serif text-2xl font-semibold text-text">
        {t.orders.title}
      </h2>
      <div className="rounded-[8px] border border-line bg-card px-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line py-4 last:border-b-0"
          >
            <span className="text-[14.5px] text-text">
              {t.orders.orderLabel} {orderNumber(order.id)}{" "}
              <span className="text-text-dim">
                · {new Date(order.created_at).toLocaleDateString(locale)}
              </span>
            </span>
            <span className={`text-[14.5px] ${statusClass(order.status)}`}>
              {statusLabel(order.status, t)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
