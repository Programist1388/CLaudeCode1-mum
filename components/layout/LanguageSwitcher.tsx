"use client";

import { useRouter } from "next/navigation";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/locales";

const LABELS: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  fr: "FR",
  es: "ES",
};

function setLocaleCookie(next: Locale) {
  document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  function handleSelect(next: Locale) {
    if (next === locale) return;
    setLocaleCookie(next);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 text-[12px] tracking-[0.04em] text-text-dim">
      {SUPPORTED_LOCALES.map((code, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span className="text-line">/</span>}
          <button
            type="button"
            onClick={() => handleSelect(code)}
            className={
              code === locale
                ? "text-gold-soft"
                : "transition-colors hover:text-gold-soft"
            }
          >
            {LABELS[code]}
          </button>
        </span>
      ))}
    </div>
  );
}
