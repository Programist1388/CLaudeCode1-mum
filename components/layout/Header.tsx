import Link from "next/link";
import { Wrap } from "@/components/layout/Wrap";
import { CartButton } from "@/components/cart/CartButton";

const NAV_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/#process", label: "Как это сделано" },
  { href: "/#care", label: "Уход" },
  { href: "/#order", label: "Контакты" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/86 backdrop-blur-md">
      <Wrap className="flex items-center justify-between py-4.5">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-[0.14em] text-text"
        >
          СИ<em className="text-gold not-italic">Я</em>НИЕ
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
          <CartButton />
          <Link
            href="/#order"
            className="rounded-full border border-gold px-5 py-2 text-[13px] tracking-[0.04em] text-gold-soft transition-all hover:bg-gold hover:text-bg"
          >
            Заказать
          </Link>
        </div>
      </Wrap>
    </header>
  );
}
