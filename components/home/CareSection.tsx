import { Wrap } from "@/components/layout/Wrap";

const CARE_ITEMS = [
  {
    title: "Стирка наизнанку",
    text: "Выворачивайте вещь и стирайте в деликатном режиме без отжима.",
  },
  {
    title: "Без сушилки",
    text: "Сушите на плечиках или горизонтально, вдали от батарей и солнца.",
  },
  {
    title: "Гладить с изнанки",
    text: "Утюг и парогенератор — только по обратной стороне ткани, не по принту.",
  },
  {
    title: "Без химчистки",
    text: "Агрессивные растворители могут повредить клеевой состав страз.",
  },
];

export function CareSection() {
  return (
    <section id="care" className="py-24">
      <Wrap>
        <div className="mx-auto mb-13 max-w-[620px] text-center">
          <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
            Уход
          </div>
          <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-semibold text-text">
            Чтобы блеск оставался надолго
          </h2>
          <p className="mt-3.5 text-[15.5px] text-text-dim">
            Стразы держатся прочно, но, как и любые украшения ручной работы,
            любят бережное обращение.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARE_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-[8px] border border-line bg-card px-6 py-7.5 text-center"
            >
              <div className="mx-auto mb-4.5 flex h-11 w-11 items-center justify-center rounded-full border border-gold font-serif text-xl text-gold-soft">
                ✦
              </div>
              <h4 className="mb-2 text-[17px] font-semibold text-text">
                {item.title}
              </h4>
              <p className="text-[13.5px] text-text-dim">{item.text}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
