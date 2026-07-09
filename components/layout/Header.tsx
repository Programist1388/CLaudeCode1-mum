import Link from "next/link";
import { Wrap } from "@/components/layout/Wrap";
import { CartButton } from "@/components/cart/CartButton";
import { CatalogLink } from "@/components/layout/CatalogLink";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function Header() {
  const { locale, t } = await getDictionary();

  const NAV_LINKS = [
    { href: "/#process", label: t.nav.process },
    { href: "/#care", label: t.nav.care },
    { href: "/#order", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/86 backdrop-blur-md">
      <Wrap className="flex flex-wrap items-center justify-between gap-y-2.5 py-4.5">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-[0.14em] text-text"
        >
          ЛА<em className="text-gold not-italic">В</em>АНДА
        </Link>

        <nav className="hidden gap-9 text-sm tracking-[0.04em] text-text-dim uppercase md:flex">
          <CatalogLink href="/catalog" className="flex items-center transition-colors hover:text-gold-soft">
            {t.nav.catalog}
            <span className="nav-pulse-dot" aria-hidden="true" />
          </CatalogLink>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center transition-colors hover:text-gold-soft"
            >
              {link.label}
              <span className="nav-pulse-dot" aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 max-md:grow max-md:justify-end max-[350px]:gap-3">
          <LanguageSwitcher locale={locale} />
          <CartButton ariaLabel={t.header.cartAria} />
          <Link
            href="/#order"
            className="rounded-full border border-gold px-5 py-2 text-[13px] tracking-[0.04em] text-gold-soft transition-all hover:bg-gold hover:text-bg hover:shadow-gold"
          >
            {t.nav.orderCta}
          </Link>
        </div>
      </Wrap>
    </header>
  );
}
