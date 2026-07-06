"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const SWIPE_THRESHOLD = 40;

const NAV_BUTTON_CLASS =
  "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/70 text-lg text-text backdrop-blur-sm transition-colors hover:border-gold hover:text-gold-soft";

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
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);

  function goPrev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }

  function goNext() {
    setActive((i) => (i + 1) % images.length);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setZoomed(false);
      } else if (images.length > 1 && e.key === "ArrowLeft") {
        goPrev();
      } else if (images.length > 1 && e.key === "ArrowRight") {
        goNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    didSwipe.current = false;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current || images.length <= 1) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      didSwipe.current = true;
      if (dx < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  }

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
      <div
        onClick={() => {
          if (didSwipe.current) {
            didSwipe.current = false;
            return;
          }
          setZoomed(true);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        aria-label={alt}
        style={{ touchAction: "pan-y" }}
        className="relative block w-full cursor-zoom-in overflow-hidden rounded-[8px] border border-line"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={alt}
          className="aspect-square w-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Предыдущее фото"
              className={`${NAV_BUTTON_CLASS} left-3`}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Следующее фото"
              className={`${NAV_BUTTON_CLASS} right-3`}
            >
              ›
            </button>
          </>
        )}
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

      {zoomed && (
        <div
          onClick={() => {
            if (didSwipe.current) {
              didSwipe.current = false;
              return;
            }
            setZoomed(false);
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: "pan-y" }}
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

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Предыдущее фото"
                className={`${NAV_BUTTON_CLASS} left-4 sm:left-8`}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Следующее фото"
                className={`${NAV_BUTTON_CLASS} right-4 sm:right-8`}
              >
                ›
              </button>
            </>
          )}

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
