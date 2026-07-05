import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import type { CategoryRow, ProductRow } from "@/lib/supabase/types";

function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    images: row.images ?? [],
    priceValue: row.price_value,
    priceIsFrom: row.price_is_from,
    badge: row.badge ?? undefined,
    tags: row.tags ?? [],
    available: row.available,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return (data as ProductRow[]).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return toProduct(data as ProductRow);
}

export async function getAllCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error || !data) return [];
  return data as CategoryRow[];
}
