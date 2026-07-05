import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: categoryCount }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  return {
    products: productCount ?? 0,
    categories: categoryCount ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const { products, categories } = await getCounts();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-semibold text-text">
        Дашборд
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-[8px] border border-line bg-card p-8">
          <div className="font-serif text-4xl font-semibold text-gold-soft">
            {products}
          </div>
          <div className="mt-2 text-text-dim">товаров в каталоге</div>
        </div>

        <div className="rounded-[8px] border border-line bg-card p-8">
          <div className="font-serif text-4xl font-semibold text-gold-soft">
            {categories}
          </div>
          <div className="mt-2 text-text-dim">категорий</div>
        </div>
      </div>
    </div>
  );
}
