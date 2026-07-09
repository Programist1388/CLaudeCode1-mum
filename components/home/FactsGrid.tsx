import { RevealOnScroll } from "@/components/layout/RevealOnScroll";
import { Wrap } from "@/components/layout/Wrap";
import type { Dictionary } from "@/lib/i18n/dictionary";

// A sharp-edged "editorial facts" grid — the same visual grammar as a
// movie/brand facts page (big stat numbers, hairline dividers, no rounded
// corners), built entirely from real shop stats and copy rather than
// product photos.
const CELL_BORDER = "border-r border-b border-line/60";

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className={`flex min-h-[220px] flex-col justify-between p-6 sm:p-8 ${CELL_BORDER}`}>
      <span className="font-sans text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight text-text">
        {value}
      </span>
      <span className="text-[12.5px] font-semibold tracking-[0.05em] text-text-dim uppercase">
        {label}
      </span>
    </div>
  );
}

function TextCell({ label, text }: { label: string; text: string }) {
  return (
    <div className={`flex min-h-[220px] flex-col justify-between p-6 sm:p-8 ${CELL_BORDER}`}>
      <span className="text-[12.5px] font-semibold tracking-[0.05em] text-gold-soft uppercase">
        {label}
      </span>
      <p className="text-[14.5px] leading-relaxed text-text-dim">{text}</p>
    </div>
  );
}

export function FactsGrid({ t }: { t: Dictionary }) {
  return (
    <section className="py-24">
      <Wrap>
        <RevealOnScroll className="mx-auto mb-13 max-w-[620px] text-center">
          <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
            {t.factsGrid.kicker}
          </div>
          <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-semibold text-text">
            {t.factsGrid.title}
          </h2>
          <p className="mt-3.5 text-[15.5px] text-text-dim">
            {t.factsGrid.subtitle}
          </p>
        </RevealOnScroll>

        <RevealOnScroll
          delayMs={150}
          className="grid grid-cols-1 border-t border-l border-line/60 bg-bg sm:grid-cols-2 lg:grid-cols-3"
        >
          <StatCell value={t.stats.handmadeValue} label={t.stats.handmadeLabel} />
          <StatCell value={t.stats.designsValue} label={t.stats.designsLabel} />
          <TextCell label={t.factsGrid.workLabel} text={t.factsGrid.workText} />
          <StatCell value={t.stats.stitchesValue} label={t.stats.stitchesLabel} />
          <StatCell value={t.stats.warrantyValue} label={t.stats.warrantyLabel} />
          <TextCell label={t.factsGrid.productsLabel} text={t.factsGrid.productsText} />
        </RevealOnScroll>
      </Wrap>
    </section>
  );
}
