import Link from "next/link";
import { Wrap } from "@/components/layout/Wrap";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Sparkles } from "@/components/home/Sparkles";
import { StatsRow } from "@/components/home/StatsRow";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function Hero() {
  const { t } = await getDictionary();

  return (
    <section className="relative overflow-hidden pt-24 pb-15">
      <Sparkles />
      <Wrap className="relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 flex items-center gap-2.5 text-[13px] tracking-[0.14em] text-gold-soft uppercase before:h-px before:w-6.5 before:bg-gold">
              {t.hero.kicker}
            </div>
            <h1 className="font-serif text-[clamp(40px,5.4vw,68px)] leading-[1.05] font-semibold text-text">
              {t.hero.titleLine1}
              <br />
              {t.hero.titleBeforeEmphasis}
              <i className="text-gold not-italic italic">
                {t.hero.titleEmphasis}
              </i>
              <br />
              {t.hero.titleLine3}
            </h1>
            <p className="mt-6 max-w-[460px] text-[17px] text-text-dim">
              {t.hero.subtitle}
            </p>
            <div className="mt-9.5 flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="rounded-full bg-gold px-7.5 py-3.5 text-sm font-semibold tracking-[0.03em] text-bg uppercase shadow-[0_8px_26px_-8px_rgba(201,167,104,0.55)] transition-transform hover:-translate-y-0.5"
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

          <div className="relative order-first lg:order-none">
            <div className="relative overflow-hidden rounded-[6px] border border-line">
              <ImagePlaceholder
                className="h-[460px] w-full"
                label={t.imagePlaceholder.text}
              />
            </div>
            <div className="absolute -bottom-6 left-4 max-w-[230px] rounded-[6px] border border-line bg-card p-5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] lg:-left-6">
              <div className="font-serif text-[30px] text-gold-soft">
                {t.hero.statCardValue}
              </div>
              <div className="mt-1 text-[12.5px] text-text-dim">
                {t.hero.statCardLabel}
              </div>
            </div>
          </div>
        </div>

        <StatsRow t={t} />
      </Wrap>
    </section>
  );
}
