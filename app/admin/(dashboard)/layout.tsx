import Link from "next/link";
import { Wrap } from "@/components/layout/Wrap";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { createClient } from "@/lib/supabase/server";

const NAV_LINKS = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/categories", label: "Категории" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-bg-soft">
        <Wrap className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-8">
            <span className="font-serif text-xl font-semibold text-text">
              Админ · СИЯНИЕ
            </span>
            <nav className="flex gap-6 text-sm text-text-dim">
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
          </div>
          <div className="flex items-center gap-4 text-sm text-text-dim">
            {user?.email}
            <LogoutButton />
          </div>
        </Wrap>
      </header>
      <main className="py-10">
        <Wrap>{children}</Wrap>
      </main>
    </div>
  );
}
