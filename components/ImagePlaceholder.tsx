/**
 * Stand-in for product/section photography that hasn't been supplied yet.
 * Swap for real <Image> once photos exist (product photos come from Sanity
 * once seeded; see lib/sanity/image.ts from Phase 3).
 */
export function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-card to-bg-soft ${className}`}
    >
      <div className="flex flex-col items-center gap-2 text-gold-soft/60">
        <span className="font-serif text-4xl">✦</span>
        <span className="text-xs tracking-wide text-text-dim">
          Фото скоро будет
        </span>
      </div>
    </div>
  );
}
