import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllCategories } from "@/lib/supabase/queries";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductRow } from "@/lib/supabase/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: product }, categories] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    getAllCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-semibold text-text">
        Редактировать товар
      </h1>
      <ProductForm
        categories={categories}
        initialProduct={product as ProductRow}
      />
    </div>
  );
}
