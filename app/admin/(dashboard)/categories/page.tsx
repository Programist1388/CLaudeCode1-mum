import { getAllCategories } from "@/lib/supabase/queries";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-semibold text-text">
        Категории
      </h1>
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
