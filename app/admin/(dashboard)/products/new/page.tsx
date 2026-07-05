import { getAllCategories } from "@/lib/supabase/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-semibold text-text">
        Новый товар
      </h1>
      <ProductForm categories={categories} />
    </div>
  );
}
