const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "79227373623";
const TELEGRAM_HANDLE = process.env.NEXT_PUBLIC_TELEGRAM_HANDLE ?? "LysiaSh";
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "lusiae@mail.ru";

export const contactInfo = {
  whatsappNumber: WHATSAPP_NUMBER,
  telegramHandle: TELEGRAM_HANDLE,
  email: CONTACT_EMAIL,
  telegramUrl: `https://t.me/${TELEGRAM_HANDLE}`,
  emailUrl: `mailto:${CONTACT_EMAIL}`,
};

/** WhatsApp supports prefilling the message text via the `text` query param. */
export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Telegram deep links don't reliably support message prefill, so callers
 * should show `message` in a copy-to-clipboard UI next to this plain link.
 */
export function buildTelegramLink(): string {
  return contactInfo.telegramUrl;
}
