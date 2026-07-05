"use client";

import { useState, type FormEvent } from "react";
import type { ShowroomItemRow } from "@/lib/supabase/types";
import {
  createShowroomItem,
  updateShowroomItem,
  deleteShowroomItem,
  type ShowroomItemInput,
} from "@/lib/supabase/mutations";
import { ImageUploader } from "@/components/admin/ImageUploader";

const BUCKET = "showroom-images";

function sortItems(items: ShowroomItemRow[]): ShowroomItemRow[] {
  return [...items].sort((a, b) => {
    const orderA = a.order_index ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order_index ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.created_at.localeCompare(b.created_at);
  });
}

function ShowroomItemForm({
  initial,
  submitLabel,
  onSaved,
  onCancel,
}: {
  initial?: ShowroomItemRow;
  submitLabel: string;
  onSaved: (item: ShowroomItemRow) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [orderIndex, setOrderIndex] = useState(
    initial?.order_index != null ? String(initial.order_index) : ""
  );
  const [images, setImages] = useState<string[]>(
    initial?.image ? [initial.image] : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!images[0]) {
      setError("Загрузите фото");
      return;
    }
    setSaving(true);
    setError(null);

    const input: ShowroomItemInput = {
      title: title.trim(),
      image: images[0],
      orderIndex: orderIndex.trim() ? Number(orderIndex) : null,
    };

    if (initial) {
      const result = await updateShowroomItem(initial.id, input);
      setSaving(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      onSaved({ ...initial, ...input, order_index: input.orderIndex });
    } else {
      const result = await createShowroomItem(input);
      setSaving(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.item) onSaved(result.item);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-[8px] border border-line bg-card p-5"
    >
      <label className="text-sm text-text-dim">
        Название
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
        />
      </label>

      <label className="text-sm text-text-dim">
        Порядок показа
        <input
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(e.target.value)}
          className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
        />
      </label>

      <div>
        <span className="mb-2 block text-sm text-text-dim">Фото</span>
        <ImageUploader
          images={images}
          onChange={setImages}
          bucket={BUCKET}
          maxImages={1}
        />
      </div>

      {error && <p className="text-sm text-rose">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="self-start rounded-full bg-gold px-6 py-2.5 text-sm font-semibold tracking-[0.03em] text-bg uppercase disabled:opacity-60"
        >
          {saving ? "Сохраняем..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="self-start text-sm text-text-dim underline decoration-dotted"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}

export function ShowroomManager({
  initialItems,
}: {
  initialItems: ShowroomItemRow[];
}) {
  const [items, setItems] = useState(sortItems(initialItems));
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleCreated(item: ShowroomItemRow) {
    setItems((prev) => sortItems([...prev, item]));
    setAdding(false);
  }

  function handleUpdated(item: ShowroomItemRow) {
    setItems((prev) => sortItems(prev.map((i) => (i.id === item.id ? item : i))));
    setEditingId(null);
  }

  async function handleDelete(item: ShowroomItemRow) {
    if (!confirm(`Удалить «${item.title}» из витрины?`)) return;
    setDeletingId(item.id);
    const result = await deleteShowroomItem(item.id);
    setDeletingId(null);
    if (result.error) {
      alert(result.error);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  return (
    <div className="max-w-[640px]">
      {adding ? (
        <div className="mb-6">
          <ShowroomItemForm
            submitLabel="Добавить"
            onSaved={handleCreated}
            onCancel={() => setAdding(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mb-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold tracking-[0.03em] text-bg uppercase"
        >
          + Добавить фото
        </button>
      )}

      {items.length === 0 && !adding && (
        <p className="text-text-dim">В витрине пока нет фото.</p>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item) =>
          editingId === item.id ? (
            <ShowroomItemForm
              key={item.id}
              initial={item}
              submitLabel="Сохранить"
              onSaved={handleUpdated}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-[8px] border border-line bg-card p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="h-16 w-16 shrink-0 rounded-[6px] object-cover"
              />
              <div className="flex-1">
                <div className="text-text">{item.title}</div>
                <div className="text-xs text-text-dim">
                  Порядок: {item.order_index ?? "—"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingId(item.id)}
                className="text-sm text-text-dim underline decoration-dotted hover:text-gold-soft"
              >
                Изменить
              </button>
              <button
                type="button"
                disabled={deletingId === item.id}
                onClick={() => handleDelete(item)}
                className="text-sm text-text-dim underline decoration-dotted hover:text-rose disabled:opacity-60"
              >
                Удалить
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
