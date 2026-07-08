"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deliveryMethodNeedsAddress, isDeliveryMethod } from "@/lib/delivery";
import {
  sendNewOrderNotification,
  type OrderChannel,
} from "@/lib/order-notifications";
import { isSizeType, type SizeType } from "@/lib/sizes";
import {
  ORDER_STATUSES,
  type CategoryRow,
  type OrderItemSnapshot,
  type OrderStatus,
  type ShowroomItemRow,
} from "@/lib/supabase/types";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

export async function createCategory(
  name: string
): Promise<{ error?: string; category?: CategoryRow }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug: slugify(name) })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { category: data as CategoryRow };
}

export async function updateCategory(
  id: string,
  name: string
): Promise<{ error?: string; slug?: string }> {
  const slug = slugify(name);
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, slug })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { slug };
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  return {};
}

export interface ProductInput {
  title: string;
  slug: string;
  description: string;
  priceValue: number;
  priceIsFrom: boolean;
  badge: string | null;
  tags: string[];
  categoryId: string | null;
  available: boolean;
  orderIndex: number | null;
  images: string[];
  sizeType: SizeType;
}

function toRow(input: ProductInput) {
  return {
    title: input.title,
    slug: slugify(input.slug),
    description: input.description,
    price_value: input.priceValue,
    price_is_from: input.priceIsFrom,
    badge: input.badge,
    tags: input.tags,
    category_id: input.categoryId,
    available: input.available,
    order_index: input.orderIndex,
    images: input.images,
    size_type: isSizeType(input.sizeType) ? input.sizeType : "clothing",
  };
}

export async function createProduct(
  input: ProductInput
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();
  const row = toRow(input);
  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/catalog/${row.slug}`);
  revalidatePath("/admin/products");
  return { id: data.id as string };
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const row = toRow(input);
  const { error } = await supabase.from("products").update(row).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/catalog/${row.slug}`);
  revalidatePath("/admin/products");
  return {};
}

export async function deleteProduct(
  id: string,
  slug: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/catalog/${slug}`);
  revalidatePath("/admin/products");
  return {};
}

export interface OrderInput {
  /** Generated in the browser so the order number can be quoted in the
      WhatsApp/Telegram message before the insert round-trip finishes. */
  id: string;
  items: OrderItemSnapshot[];
  total: number;
  note: string;
  locale: string;
  channel: OrderChannel;
  customerName: string;
  customerPhone: string;
  deliveryMethod: string;
  deliveryAddress: string;
}

export async function createOrder(
  input: OrderInput
): Promise<{ error?: string }> {
  if (input.items.length === 0 || input.items.length > 100) {
    return { error: "Некорректный состав заказа" };
  }

  const customerName = input.customerName.trim().slice(0, 200);
  const customerPhone = input.customerPhone.trim().slice(0, 50);
  if (!customerName || !customerPhone) {
    return { error: "Укажите имя и телефон" };
  }

  const deliveryMethod = isDeliveryMethod(input.deliveryMethod)
    ? input.deliveryMethod
    : "courier";
  const deliveryAddress = deliveryMethodNeedsAddress(deliveryMethod)
    ? input.deliveryAddress.trim().slice(0, 500)
    : "";
  if (deliveryMethodNeedsAddress(deliveryMethod) && !deliveryAddress) {
    return { error: "Укажите адрес доставки" };
  }

  const note = input.note.trim().slice(0, 2000);
  const channel: OrderChannel =
    input.channel === "telegram" ? "telegram" : "whatsapp";

  const supabase = await createClient();
  const { error } = await supabase.from("orders").insert({
    id: input.id,
    items: input.items,
    total: input.total,
    note,
    locale: input.locale,
    channel,
    customer_name: customerName,
    customer_phone: customerPhone,
    delivery_method: deliveryMethod,
    delivery_address: deliveryAddress,
  });

  if (error) return { error: error.message };

  // Sent only after a successful insert — a duplicate submit with the same
  // id fails on the primary key above, so the owner never gets the same
  // order twice. Never throws; checkout succeeds even if Telegram is down.
  await sendNewOrderNotification({
    orderNumber: input.id.slice(0, 8).toUpperCase(),
    items: input.items,
    total: input.total,
    note,
    locale: input.locale,
    channel,
    customerName,
    customerPhone,
    deliveryMethod,
    deliveryAddress,
  });

  revalidatePath("/admin/orders");
  return {};
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<{ error?: string }> {
  if (!ORDER_STATUSES.includes(status)) {
    return { error: "Неизвестный статус" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  return {};
}

export async function deleteOrder(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  return {};
}

export interface ShowroomItemInput {
  title: string;
  image: string;
  orderIndex: number | null;
}

function toShowroomRow(input: ShowroomItemInput) {
  return {
    title: input.title,
    image: input.image,
    order_index: input.orderIndex,
  };
}

export async function createShowroomItem(
  input: ShowroomItemInput
): Promise<{ error?: string; item?: ShowroomItemRow }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("showroom_items")
    .insert(toShowroomRow(input))
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/showroom");
  return { item: data as ShowroomItemRow };
}

export async function updateShowroomItem(
  id: string,
  input: ShowroomItemInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("showroom_items")
    .update(toShowroomRow(input))
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/showroom");
  return {};
}

export async function deleteShowroomItem(
  id: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("showroom_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/showroom");
  return {};
}
