import { Wrap } from "@/components/layout/Wrap";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Sparkles } from "@/components/home/Sparkles";
import { StatsRow } from "@/components/home/StatsRow";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-15">
      <Sparkles />
      <Wrap className="relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 flex items-center gap-2.5 text-[13px] tracking-[0.14em] text-gold-soft uppercase before:h-px before:w-6.5 before:bg-gold">
              Ручная работа · Стразы на заказ
            </div>
            <h1 className="font-serif text-[clamp(40px,5.4vw,68px)] leading-[1.05] font-semibold text-text">
              Принты,
              <br />
              которые <i className="text-gold not-italic italic">сияют</i>
              <br />
              на любой ткани
            </h1>
            <p className="mt-6 max-w-[460px] text-[17px] text-text-dim">
              Худи, футболки и текстиль для дома с авторскими принтами из
              страз, выложенных вручную кристалл за кристаллом. Свой дизайн,
              персонаж или логотип — под ваш запрос.
            </p>
            <div className="mt-9.5 flex flex-wrap gap-4">
              <a
                href="#catalog"
                className="rounded-full bg-gold px-7.5 py-3.5 text-sm font-semibold tracking-[0.03em] text-bg uppercase shadow-[0_8px_26px_-8px_rgba(201,167,104,0.55)] transition-transform hover:-translate-y-0.5"
              >
                Смотреть каталог
              </a>
              <a
                href="#process"
                className="rounded-full border border-line px-7 py-3.5 text-sm tracking-[0.03em] text-text uppercase transition-colors hover:border-gold hover:text-gold-soft"
              >
                Как мы это делаем
              </a>
            </div>
          </div>

          <div className="relative order-first lg:order-none">
            <div className="relative overflow-hidden rounded-[6px] border border-line">
              <ImagePlaceholder className="h-[460px] w-full" />
            </div>
            <div className="absolute -bottom-6 left-4 max-w-[230px] rounded-[6px] border border-line bg-card p-5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] lg:-left-6">
              <div className="font-serif text-[30px] text-gold-soft">
                4–8 ч
              </div>
              <div className="mt-1 text-[12.5px] text-text-dim">
                среднее время ручной выкладки одного принта
              </div>
            </div>
          </div>
        </div>

        <StatsRow />
      </Wrap>
    </section>
  );
}
