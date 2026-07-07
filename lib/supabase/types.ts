export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ProductRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  images: string[];
  price_value: number;
  price_is_from: boolean;
  badge: string | null;
  tags: string[];
  category_id: string | null;
  available: boolean;
  order_index: number | null;
  created_at: string;
}

export interface ShowroomItemRow {
  id: string;
  title: string;
  image: string;
  order_index: number | null;
  created_at: string;
}

export const ORDER_STATUSES = [
  "new",
  "in_progress",
  "ready",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** One cart line frozen into the order at checkout time. */
export interface OrderItemSnapshot {
  slug: string;
  title: string;
  qty: number;
  priceValue: number;
  priceIsFrom: boolean;
}

export interface OrderRow {
  id: string;
  items: OrderItemSnapshot[];
  total: number;
  note: string;
  locale: string;
  status: OrderStatus;
  channel: "whatsapp" | "telegram";
  customer_name: string;
  customer_phone: string;
  delivery_method: string;
  delivery_address: string;
  created_at: string;
}
