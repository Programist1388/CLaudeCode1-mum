import { createClient } from "@/lib/supabase/server";
import type { Product, ShowroomItem } from "@/lib/types";
import type {
  CategoryRow,
  OrderRow,
  ProductRow,
  ShowroomItemRow,
} from "@/lib/supabase/types";
import type { Locale } from "@/lib/i18n/locales";
import { translateProductText } from "@/lib/translate";

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

// Title/description are typed into /admin in Russian only (see CLAUDE.md);
// this machine-translates them for non-Russian visitors at read time
// rather than storing per-locale copies, so the owner never has to type
// anything twice.
async function localizeProduct(
  product: Product,
  locale: Locale
): Promise<Product> {
  if (locale === "ru") return product;
  const [title, description] = await Promise.all([
    translateProductText(product.title, locale),
    translateProductText(product.description, locale),
  ]);
  return { ...product, title, description };
}

export async function getAllProducts(locale: Locale = "ru"): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(slug)")
    .eq("available", true)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  const products = (data as ProductWithCategory[]).map(toProduct);
  return Promise.all(products.map((p) => localizeProduct(p, locale)));
}

export async function getProductBySlug(
  slug: string,
  locale: Locale = "ru"
): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(slug)")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return localizeProduct(toProduct(data as ProductWithCategory), locale);
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

export async function getAllOrders(): Promise<OrderRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as OrderRow[];
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
