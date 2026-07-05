"use client";

import { useState } from "react";
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
      <div className="overflow-hidden rounded-[8px] border border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={alt}
          className="aspect-square w-full object-cover"
        />
      </div>

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
    </div>
  );
}
