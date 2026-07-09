import { RevealOnScroll } from "@/components/layout/RevealOnScroll";
import { Wrap } from "@/components/layout/Wrap";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function CareSection() {
  const { t } = await getDictionary();

  return (
    <section id="care" className="py-24">
      <Wrap>
        <RevealOnScroll className="mx-auto mb-13 max-w-[620px] text-center">
          <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
            {t.care.kicker}
          </div>
          <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-semibold text-text">
            {t.care.title}
          </h2>
          <p className="mt-3.5 text-[15.5px] text-text-dim">
            {t.care.subtitle}
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.care.items.map((item, i) => (
            <RevealOnScroll key={item.title} delayMs={i * 100}>
              <div className="rounded-[8px] border border-line bg-card px-6 py-7.5 text-center">
                <div className="mx-auto mb-4.5 flex h-11 w-11 items-center justify-center rounded-full border border-gold font-serif text-xl text-gold-soft">
                  ✦
                </div>
                <h4 className="mb-2 text-[17px] font-semibold text-text">
                  {item.title}
                </h4>
                <p className="text-[13.5px] text-text-dim">{item.text}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
