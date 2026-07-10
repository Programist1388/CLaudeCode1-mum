import { unstable_cache } from "next/cache";
import type { Locale } from "@/lib/i18n/locales";

// Product/category text the owner types into /admin is stored only in
// Russian (see CLAUDE.md "Internationalization"). This machine-translates
// it on read for non-Russian visitors via DeepL. Never throws: a failed or
// unconfigured translation falls back to the original Russian text, so a
// missing DEEPL_API_KEY or a DeepL outage never breaks the storefront.
const DEEPL_TARGET_LANG: Partial<Record<Locale, string>> = {
  en: "EN-US",
  fr: "FR",
  es: "ES",
};

async function translateViaDeepl(
  text: string,
  targetLang: string
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) return text;

  try {
    const host = apiKey.endsWith(":fx")
      ? "api-free.deepl.com"
      : "api.deepl.com";
    const response = await fetch(`https://${host}/v2/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        source_lang: "RU",
        target_lang: targetLang,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return text;
    const data = (await response.json()) as {
      translations?: { text: string }[];
    };
    return data.translations?.[0]?.text ?? text;
  } catch {
    return text;
  }
}

// Cached for a week across requests/deployments (Next.js Data Cache) — the
// same product text is translated over and over otherwise, on every visit
// in every non-Russian locale, burning DeepL's free-tier character quota.
const translateCached = unstable_cache(
  async (text: string, targetLang: string) => translateViaDeepl(text, targetLang),
  ["product-text-translation"],
  { revalidate: 60 * 60 * 24 * 7 }
);

export async function translateProductText(
  text: string,
  locale: Locale
): Promise<string> {
  const targetLang = DEEPL_TARGET_LANG[locale];
  if (!targetLang || !text.trim()) return text;
  return translateCached(text, targetLang);
}
