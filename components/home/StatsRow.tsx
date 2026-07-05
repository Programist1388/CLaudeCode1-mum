import type { Dictionary } from "@/lib/i18n/dictionary";

export function StatsRow({ t }: { t: Dictionary }) {
  const STATS = [
    { value: t.stats.handmadeValue, label: t.stats.handmadeLabel },
    { value: t.stats.designsValue, label: t.stats.designsLabel },
    { value: t.stats.crystalsValue, label: t.stats.crystalsLabel },
    { value: t.stats.warrantyValue, label: t.stats.warrantyLabel },
  ];

  return (
    <div className="relative z-10 mt-16 flex flex-wrap gap-14 border-t border-line pt-9">
      {STATS.map((stat) => (
        <div key={stat.label}>
          <b className="block font-serif text-3xl font-semibold text-gold-soft">
            {stat.value}
          </b>
          <span className="text-[13px] tracking-[0.02em] text-text-dim">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
