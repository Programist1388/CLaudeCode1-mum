"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { CategoryRow } from "@/lib/supabase/types";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/supabase/mutations";

export function CategoriesManager({
  initialCategories,
}: {
  initialCategories: CategoryRow[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setError(null);
    startTransition(async () => {
      const result = await createCategory(name);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.category) {
        setCategories((prev) =>
          [...prev, result.category!].sort((a, b) =>
            a.name.localeCompare(b.name, "ru")
          )
        );
      }
      setNewName("");
    });
  }

  function startEdit(cat: CategoryRow) {
    setEditingId(cat.id);
    setEditingName(cat.name);
  }

  function handleSaveEdit(id: string) {
    const name = editingName.trim();
    if (!name) return;
    setError(null);
    startTransition(async () => {
      const result = await updateCategory(id, name);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCategories((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, name, slug: result.slug ?? c.slug } : c
        )
      );
      setEditingId(null);
    });
  }

  function handleDelete(id: string) {
    if (
      !confirm(
        "Удалить категорию? Товары в ней останутся, но без категории."
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
    });
  }

  return (
    <div className="max-w-[560px]">
      <form onSubmit={handleAdd} className="mb-6 flex gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Название категории"
          className="flex-1 rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gold px-6 py-3 text-sm font-semibold tracking-[0.03em] text-bg uppercase disabled:opacity-60"
        >
          Добавить
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-rose">{error}</p>}

      <div className="rounded-[8px] border border-line bg-card">
        {categories.length === 0 && (
          <p className="p-5 text-text-dim">Категорий пока нет.</p>
        )}
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            className={`flex items-center gap-3 p-4 ${i > 0 ? "border-t border-line" : ""}`}
          >
            {editingId === cat.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 rounded-[6px] border border-line bg-bg-soft p-2 text-text focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSaveEdit(cat.id)}
                  className="text-sm text-gold-soft underline decoration-dotted"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-sm text-text-dim underline decoration-dotted"
                >
                  Отмена
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-text">{cat.name}</span>
                <button
                  type="button"
                  onClick={() => startEdit(cat)}
                  className="text-sm text-text-dim underline decoration-dotted hover:text-gold-soft"
                >
                  Изменить
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="text-sm text-text-dim underline decoration-dotted hover:text-rose"
                >
                  Удалить
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
