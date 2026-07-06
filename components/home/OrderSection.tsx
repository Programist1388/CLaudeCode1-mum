import { Wrap } from "@/components/layout/Wrap";
import { contactInfo } from "@/lib/order-links";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const CONTACT_LINKS = [
  {
    href: `https://t.me/${contactInfo.telegramHandle}`,
    icon: "TG",
    label: `@${contactInfo.telegramHandle} — Telegram`,
  },
  {
    href: `https://wa.me/${contactInfo.whatsappNumber}`,
    icon: "WA",
    label: "+7 922 737-36-23 — WhatsApp",
  },
  {
    href: contactInfo.emailUrl,
    icon: "@",
    label: contactInfo.email,
  },
  {
    href: "#",
    icon: "IG",
    label: "@lavanda.handmade — Instagram*",
  },
];

export async function OrderSection() {
  const { t } = await getDictionary();

  return (
    <section id="order" className="py-24">
      <Wrap>
        <div className="grid items-center gap-12 rounded-[14px] border border-line bg-gradient-to-br from-card to-[#1a1820] p-8 sm:p-16 lg:grid-cols-2">
          <div>
            <div className="mb-1 text-[13px] tracking-[0.14em] text-gold-soft uppercase">
              {t.orderSection.kicker}
            </div>
            <h2 className="mb-4 font-serif text-[clamp(28px,3.6vw,40px)] font-semibold text-text">
              {t.orderSection.titleLine1}
              <br />
              {t.orderSection.titleLine2}
            </h2>
            <p className="mb-7 max-w-[420px] text-[15px] text-text-dim">
              {t.orderSection.body}
            </p>
            <div className="mt-5.5 text-[12.5px] leading-[1.7] text-text-dim">
              <b className="font-semibold text-gold-soft">
                {t.orderSection.priceNoteBold}
              </b>
              {t.orderSection.priceNoteRest}
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener" : undefined}
                className="flex items-center gap-3.5 rounded-[8px] border border-line px-4.5 py-3.5 text-[15px] text-text transition-colors hover:border-gold hover:text-gold-soft"
              >
                <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-gold text-[13px] font-bold text-bg">
                  {link.icon}
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}
