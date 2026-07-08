export const SIZE_TYPES = ["clothing", "shoes", "none"] as const;

export type SizeType = (typeof SIZE_TYPES)[number];

export function isSizeType(value: string): value is SizeType {
  return (SIZE_TYPES as readonly string[]).includes(value);
}

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const SHOE_SIZES = Array.from({ length: 45 - 36 + 1 }, (_, i) =>
  String(36 + i)
);

/** Empty for `"none"` — those products (e.g. pillows) have no size to pick. */
export function sizeOptionsFor(type: SizeType): readonly string[] {
  if (type === "clothing") return CLOTHING_SIZES;
  if (type === "shoes") return SHOE_SIZES;
  return [];
}
