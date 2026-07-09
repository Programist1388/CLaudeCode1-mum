import Link from "next/link";
import { Wrap } from "@/components/layout/Wrap";
import { Sparkles } from "@/components/home/Sparkles";
import { StatsRow } from "@/components/home/StatsRow";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function Hero() {
  const { t } = await getDictionary();

  return (
    <section className="relative overflow-hidden pt-24 pb-15">
      <Sparkles />
      <Wrap className="relative z-10">
        <div className="mx-auto max-w-[640px] text-center">
          <div className="mb-5 flex items-center justify-center gap-2.5 text-[13px] tracking-[0.14em] text-gold-soft uppercase before:h-px before:w-6.5 before:bg-gold">
            {t.hero.kicker}
          </div>
          <h1 className="font-serif text-[clamp(40px,5.4vw,68px)] leading-[1.05] font-semibold text-text">
            {t.hero.titleLine1}
            <br />
            {t.hero.titleBeforeEmphasis}
            <i className="text-glow-gold text-gold not-italic italic">
              {t.hero.titleEmphasis}
            </i>
            <br />
            {t.hero.titleLine3}
          </h1>
          <p className="mx-auto mt-6 max-w-[460px] text-[17px] text-text-dim">
            {t.hero.subtitle}
          </p>
          <div className="mt-9.5 flex flex-wrap justify-center gap-4">
            <Link
              href="/catalog"
              className="rounded-full bg-gold px-7.5 py-3.5 text-sm font-semibold tracking-[0.03em] text-bg uppercase shadow-gold transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-gold-strong"
            >
              {t.hero.ctaCatalog}
            </Link>
            <a
              href="#process"
              className="rounded-full border border-line px-7 py-3.5 text-sm tracking-[0.03em] text-text uppercase transition-colors hover:border-gold hover:text-gold-soft"
            >
              {t.hero.ctaProcess}
            </a>
          </div>
        </div>

        <StatsRow t={t} />
      </Wrap>
    </section>
  );
}
