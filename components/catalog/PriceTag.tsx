import { formatPriceRub } from "@/lib/format";

export function PriceTag({
  value,
  isFrom,
  fromLabel = "от",
  unitLabel = "шт",
}: {
  value: number;
  isFrom: boolean;
  fromLabel?: string;
  unitLabel?: string;
}) {
  return (
    <div className="font-serif text-2xl font-semibold text-gold-soft">
      {formatPriceRub(value, isFrom, fromLabel)}
      <span className="ml-1 font-sans text-[13px] font-normal text-text-dim">
        / {unitLabel}
      </span>
    </div>
  );
}
