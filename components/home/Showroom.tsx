import Link from "next/link";
import type { ShowroomItem } from "@/lib/types";
import { Wrap } from "@/components/layout/Wrap";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function Showroom({ items }: { items: ShowroomItem[] }) {
  const { t } = await getDictionary();
  const track = items.length > 0 ? [...items, ...items] : [];

  return (
    <section id="showroom" className="overflow-hidden py-24">
      <Wrap>
        <div className="mx-auto mb-13 max-w-[620px] text-center">
          <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-semibold text-text">
            {t.showroom.title}
          </h2>
          <p className="mt-3.5 text-[15.5px] text-text-dim">
            {t.showroom.subtitle}
          </p>
        </div>
      </Wrap>

      {track.length > 0 ? (
        <div className="showroom-track flex w-max gap-6 px-5">
          {track.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="relative h-[360px] w-[260px] shrink-0 overflow-hidden rounded-[8px] border border-line"
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlaceholder
                  className="h-full w-full"
                  label={t.imagePlaceholder.text}
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent p-4 pt-10">
                <span className="font-serif text-lg text-text">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Wrap>
          <p className="text-center text-text-dim">{t.showroom.empty}</p>
        </Wrap>
      )}

      <Wrap className="mt-13 text-center">
        <Link
          href="/catalog"
          className="catalog-press inline-block rounded-full bg-gold px-7.5 py-3.5 text-sm font-semibold tracking-[0.03em] text-bg uppercase transition-transform hover:-translate-y-0.5"
        >
          {t.showroom.cta}
        </Link>
      </Wrap>
    </section>
  );
}
