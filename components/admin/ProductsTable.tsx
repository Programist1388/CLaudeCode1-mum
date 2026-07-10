"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/supabase/mutations";
import { formatPriceRub } from "@/lib/format";

export interface ProductListRow {
  id: string;
  title: string;
  slug: string;
  price_value: number;
  price_is_from: boolean;
  available: boolean;
  categories: { name: string } | null;
}

export function ProductsTable({ products }: { products: ProductListRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, slug: string, title: string) {
    if (!confirm(`Удалить «${title}»?`)) return;
    startTransition(async () => {
      await deleteProduct(id, slug);
      router.refresh();
    });
  }

  if (products.length === 0) {
    return <p className="text-text-dim">Товаров пока нет.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-[8px] border border-line bg-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-text-dim">
            <th className="p-4 font-normal">Товар</th>
            <th className="p-4 font-normal">Категория</th>
            <th className="p-4 font-normal">Цена</th>
            <th className="p-4 font-normal">В наличии</th>
            <th className="p-4 font-normal" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-line last:border-b-0">
              <td className="p-4 text-text">{p.title}</td>
              <td className="p-4 text-text-dim">
                {p.categories?.name ?? "Без категории"}
              </td>
              <td className="p-4 text-gold-soft">
                {formatPriceRub(p.price_value, p.price_is_from)}
              </td>
              <td className="p-4 text-text-dim">
                {p.available ? "Да" : "Нет"}
              </td>
              <td className="p-4 text-right whitespace-nowrap">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="mr-4 text-text-dim underline decoration-dotted hover:text-gold-soft"
                >
                  Изменить
                </Link>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(p.id, p.slug, p.title)}
                  className="text-text-dim underline decoration-dotted hover:text-rose disabled:opacity-60"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
