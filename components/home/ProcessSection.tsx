import { Wrap } from "@/components/layout/Wrap";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const STEPS = [
  {
    mark: "01",
    title: "Макет и разметка",
    text: "Переводим изображение или референс в схему раскладки страз и наносим контур на ткань — вручную, без трафарета.",
  },
  {
    mark: "02",
    title: "Подбор камней",
    text: "Сортируем стразы по размеру и оттенку под конкретный дизайн, чтобы переход цветов был плавным.",
  },
  {
    mark: "03",
    title: "Выкладка вручную",
    text: "Каждый кристалл фиксируется пинцетом на термоклеевой состав — это самая долгая и кропотливая часть работы.",
  },
  {
    mark: "04",
    title: "Термофиксация и проверка",
    text: "Прогреваем принт под прессом и проверяем сцепление каждого камня перед упаковкой.",
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      className="border-y border-line bg-bg-soft py-24"
    >
      <Wrap className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[8px] border border-line">
          <ImagePlaceholder className="h-[340px] w-full lg:h-[520px]" />
        </div>

        <div>
          <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
            Процесс
          </div>
          <h2 className="mb-2 font-serif text-[clamp(28px,3.6vw,40px)] font-semibold text-text">
            Как рождается один принт
          </h2>
          <div className="flex flex-col">
            {STEPS.map((step, i) => (
              <div
                key={step.mark}
                className={`flex gap-5.5 border-t border-line py-6.5 ${
                  i === STEPS.length - 1 ? "border-b" : ""
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
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}
