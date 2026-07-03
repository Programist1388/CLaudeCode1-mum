import { Wrap } from "@/components/layout/Wrap";

export function Footer() {
  return (
    <footer className="border-t border-line py-11">
      <Wrap className="flex flex-wrap items-center justify-between gap-4">
        <div className="font-serif text-[19px] font-semibold text-text">
          СИ<em className="text-gold not-italic">Я</em>НИЕ
        </div>
        <p className="text-[13px] text-text-dim">
          Ручная работа · Стразы · Сделано с любовью к деталям
        </p>
      </Wrap>
    </footer>
  );
}
