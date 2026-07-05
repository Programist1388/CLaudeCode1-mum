import { createClient } from "@/lib/supabase/server";
import type { Product, ShowroomItem } from "@/lib/types";
import type {
  CategoryRow,
  ProductRow,
  ShowroomItemRow,
} from "@/lib/supabase/types";

type ProductWithCategory = ProductRow & {
  categories: { slug: string } | null;
};

function toProduct(row: ProductWithCategory): Product {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    images: row.images ?? [],
    priceValue: row.price_value,
    priceIsFrom: row.price_is_from,
    badge: row.badge ?? undefined,
    tags: row.tags ?? [],
    categorySlug: row.categories?.slug,
    available: row.available,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(slug)")
    .eq("available", true)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return (data as ProductWithCategory[]).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(slug)")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return toProduct(data as ProductWithCategory);
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

export async function getAllShowroomItems(): Promise<ShowroomItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("showroom_items")
    .select("*")
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return (data as ShowroomItemRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    image: row.image,
  }));
}
