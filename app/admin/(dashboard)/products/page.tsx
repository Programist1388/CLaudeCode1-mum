import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductsTable, type ProductListRow } from "@/components/admin/ProductsTable";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, title, slug, price_value, price_is_from, available, categories(name)")
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-text">
          Товары
        </h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-gold px-6 py-3 text-sm font-semibold tracking-[0.03em] text-bg uppercase"
        >
          + Добавить товар
        </Link>
      </div>

      <ProductsTable products={(data as unknown as ProductListRow[]) ?? []} />
    </div>
  );
}
