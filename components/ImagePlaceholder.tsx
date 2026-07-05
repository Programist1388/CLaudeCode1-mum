export function ImagePlaceholder({
  className = "",
  label = "Фото скоро будет",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-card to-bg-soft ${className}`}
    >
      <div className="flex flex-col items-center gap-2 text-gold-soft/60">
        <span className="font-serif text-4xl">✦</span>
        <span className="text-xs tracking-wide text-text-dim">{label}</span>
      </div>
    </div>
  );
}
