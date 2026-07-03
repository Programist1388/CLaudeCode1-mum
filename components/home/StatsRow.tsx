const STATS = [
  { value: "100%", label: "ручная выкладка страз" },
  { value: "6", label: "готовых дизайнов и любой на заказ" },
  { value: "2000+", label: "кристаллов на принт в среднем" },
  { value: "14 дней", label: "гарантия на посадку страз" },
];

export function StatsRow() {
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
