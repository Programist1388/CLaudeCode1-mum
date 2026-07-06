import Link from "next/link";
import { Wrap } from "@/components/layout/Wrap";
import { CartButton } from "@/components/cart/CartButton";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function Header() {
  const { locale, t } = await getDictionary();

  const NAV_LINKS = [
    { href: "/catalog", label: t.nav.catalog },
    { href: "/#process", label: t.nav.process },
    { href: "/#care", label: t.nav.care },
    { href: "/#order", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/86 backdrop-blur-md">
      <Wrap className="flex items-center justify-between py-4.5">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-[0.14em] text-text"
        >
          ЛА<em className="text-gold not-italic">В</em>АНДА
        </Link>

        <nav className="hidden gap-9 text-sm tracking-[0.04em] text-text-dim uppercase md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-gold-soft"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <LanguageSwitcher locale={locale} />
          <CartButton ariaLabel={t.header.cartAria} />
          <Link
            href="/#order"
            className="rounded-full border border-gold px-5 py-2 text-[13px] tracking-[0.04em] text-gold-soft transition-all hover:bg-gold hover:text-bg"
          >
            {t.nav.orderCta}
          </Link>
        </div>
      </Wrap>
    </header>
  );
}
