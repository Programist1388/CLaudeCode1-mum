import { RevealOnScroll } from "@/components/layout/RevealOnScroll";
import { Wrap } from "@/components/layout/Wrap";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function ProcessSection() {
  const { t } = await getDictionary();
  const steps = t.process.steps;

  return (
    <section
      id="process"
      className="border-y border-line bg-bg-soft py-24"
    >
      <Wrap>
        <RevealOnScroll className="mx-auto max-w-[680px] text-center">
          <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
            {t.process.kicker}
          </div>
          <h2 className="mb-2 font-serif text-[clamp(28px,3.6vw,40px)] font-semibold text-text">
            {t.process.title}
          </h2>
        </RevealOnScroll>

        <div className="mx-auto mt-10 max-w-[680px]">
          {steps.map((step, i) => (
            <RevealOnScroll key={step.mark} delayMs={i * 100}>
              <div
                className={`flex gap-5.5 border-t border-line py-6.5 ${
                  i === steps.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="min-w-11 font-serif text-[22px] text-gold">
                  {step.mark}
                </div>
                <div>
                  <h4 className="mb-1.5 text-[19px] font-semibold text-text">
                    {step.title}
                  </h4>
                  <p className="text-[14.5px] text-text-dim">{step.text}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
