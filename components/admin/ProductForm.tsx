"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CategoryRow, ProductRow } from "@/lib/supabase/types";
import {
  createProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/supabase/mutations";
import { ImageUploader } from "@/components/admin/ImageUploader";

function slugifyPreview(input: string): string {
  return input.toLowerCase().trim().replace(/\s+/g, "-");
}

export function ProductForm({
  categories,
  initialProduct,
}: {
  categories: CategoryRow[];
  initialProduct?: ProductRow;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);

  const [title, setTitle] = useState(initialProduct?.title ?? "");
  const [slug, setSlug] = useState(initialProduct?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(
    initialProduct?.description ?? ""
  );
  const [priceValue, setPriceValue] = useState(
    initialProduct ? String(initialProduct.price_value) : ""
  );
  const [priceIsFrom, setPriceIsFrom] = useState(
    initialProduct?.price_is_from ?? false
  );
  const [badge, setBadge] = useState(initialProduct?.badge ?? "");
  const [tagsInput, setTagsInput] = useState(
    (initialProduct?.tags ?? []).join(", ")
  );
  const [categoryId, setCategoryId] = useState(
    initialProduct?.category_id ?? ""
  );
  const [available, setAvailable] = useState(
    initialProduct?.available ?? true
  );
  const [orderIndex, setOrderIndex] = useState(
    initialProduct?.order_index != null
      ? String(initialProduct.order_index)
      : ""
  );
  const [images, setImages] = useState<string[]>(
    initialProduct?.images ?? []
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyPreview(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const input: ProductInput = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      priceValue: Number(priceValue) || 0,
      priceIsFrom,
      badge: badge.trim() || null,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      categoryId: categoryId || null,
      available,
      orderIndex: orderIndex.trim() ? Number(orderIndex) : null,
      images,
    };

    const result =
      isEdit && initialProduct
        ? await updateProduct(initialProduct.id, input)
        : await createProduct(input);

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-[640px] flex-col gap-5"
    >
      <label className="text-sm text-text-dim">
        Название
        <input
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
        />
      </label>

      <label className="text-sm text-text-dim">
        Slug (для ссылки)
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 font-mono text-sm text-text focus:border-gold focus:outline-none"
        />
      </label>

      <label className="text-sm text-text-dim">
        Описание
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
        />
      </label>

      <div className="flex gap-4">
        <label className="flex-1 text-sm text-text-dim">
          Цена, ₽
          <input
            required
            type="number"
            min={0}
            step="1"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
          />
        </label>

        <label className="flex items-end gap-2 pb-3 text-sm text-text-dim">
          <input
            type="checkbox"
            checked={priceIsFrom}
            onChange={(e) => setPriceIsFrom(e.target.checked)}
          />
          Цена «от»
        </label>
      </div>

      <label className="text-sm text-text-dim">
        Бейдж (необязательно)
        <input
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          placeholder="Например: Bestseller"
          className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
        />
      </label>

      <label className="text-sm text-text-dim">
        Теги (через запятую)
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Худи, серый меланж, Стразы: серебро"
          className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
        />
      </label>

      <label className="text-sm text-text-dim">
        Категория
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
        >
          <option value="">Без категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-4">
        <label className="flex-1 text-sm text-text-dim">
          Порядок в каталоге
          <input
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(e.target.value)}
            className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
          />
        </label>

        <label className="flex items-end gap-2 pb-3 text-sm text-text-dim">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          В наличии
        </label>
      </div>

      <div>
        <span className="mb-2 block text-sm text-text-dim">Фотографии</span>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {error && <p className="text-sm text-rose">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-2 self-start rounded-full bg-gold px-7 py-3 text-sm font-semibold tracking-[0.03em] text-bg uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {saving ? "Сохраняем..." : isEdit ? "Сохранить" : "Добавить товар"}
      </button>
    </form>
  );
}
