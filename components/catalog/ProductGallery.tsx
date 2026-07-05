"use client";

import { useEffect, useState } from "react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export function ProductGallery({
  images,
  alt,
  placeholderLabel,
}: {
  images: string[];
  alt: string;
  placeholderLabel: string;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setZoomed(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomed]);

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-[8px] border border-line">
        <ImagePlaceholder
          className="aspect-square w-full"
          label={placeholderLabel}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label={alt}
        className="block w-full cursor-zoom-in overflow-hidden rounded-[8px] border border-line"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={alt}
          className="aspect-square w-full object-cover"
        />
      </button>

      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((image, i) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${alt} ${i + 1}/${images.length}`}
              className={`h-18 w-18 shrink-0 overflow-hidden rounded-[6px] border transition-colors ${
                i === active
                  ? "border-gold"
                  : "border-line hover:border-gold-soft"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-bg/95 p-6"
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Закрыть"
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-line text-text transition-colors hover:border-gold hover:text-gold-soft"
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  );
}
