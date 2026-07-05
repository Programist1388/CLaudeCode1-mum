import { Wrap } from "@/components/layout/Wrap";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function Footer() {
  const { t } = await getDictionary();

  return (
    <footer className="border-t border-line py-11">
      <Wrap className="flex flex-wrap items-center justify-between gap-4">
        <div className="font-serif text-[19px] font-semibold text-text">
          СИ<em className="text-gold not-italic">Я</em>НИЕ
        </div>
        <p className="text-[13px] text-text-dim">{t.footer.tagline}</p>
      </Wrap>
    </footer>
  );
}
