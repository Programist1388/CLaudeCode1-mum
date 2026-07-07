// Ids of orders placed from this browser, so the customer can see their
// statuses on the cart page. Mirrors cart-storage.ts: localStorage only,
// silently degrades when it's unavailable.

const STORAGE_KEY = "lavanda:orders";
const MAX_TRACKED = 20;

export function loadOrderIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addOrderId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const ids = [id, ...loadOrderIds().filter((known) => known !== id)];
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ids.slice(0, MAX_TRACKED))
    );
  } catch {
    // localStorage may be unavailable — the order still goes through,
    // the customer just won't see its status on this device.
  }
}

export function newOrderId(): string {
  const c = globalThis.crypto;
  if (typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  // Old-browser fallback: RFC 4122 v4 via getRandomValues.
  const bytes = new Uint8Array(16);
  c.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

/** Short human-friendly form quoted in the order message and shown in /admin. */
export function orderNumber(id: string): string {
  return id.slice(0, 8).toUpperCase();
}
