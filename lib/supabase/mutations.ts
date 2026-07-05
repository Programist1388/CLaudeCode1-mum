"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CategoryRow, ShowroomItemRow } from "@/lib/supabase/types";

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
