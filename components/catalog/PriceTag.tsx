import { formatPriceRub } from "@/lib/format";

export function PriceTag({
  value,
  isFrom,
}: {
  value: number;
  isFrom: boolean;
}) {
  return (
    <div className="font-serif text-2xl font-semibold text-gold-soft">
      {formatPriceRub(value, isFrom)}
      <span className="ml-1 font-sans text-[13px] font-normal text-text-dim">
        / шт
      </span>
    </div>
  );
}
