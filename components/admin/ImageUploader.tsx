"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "product-images";

function pathFromPublicUrl(url: string): string | null {
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(fileList)) {
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file);

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleRemove(url: string) {
    onChange(images.filter((img) => img !== url));

    const path = pathFromPublicUrl(url);
    if (!path) return;
    const supabase = createClient();
    await supabase.storage.from(BUCKET).remove([path]);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div
            key={url}
            className="group relative h-24 w-24 overflow-hidden rounded-[6px] border border-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              aria-label="Удалить фото"
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-bg/80 text-xs text-text opacity-0 transition-opacity group-hover:opacity-100 hover:text-rose"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <label className="mt-3 inline-block cursor-pointer rounded-full border border-line px-5 py-2.5 text-sm text-text transition-colors hover:border-gold hover:text-gold-soft">
        {uploading ? "Загрузка..." : "Добавить фото"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>

      {error && <p className="mt-2 text-sm text-rose">{error}</p>}
    </div>
  );
}
