import type { SanityImageSource } from "@sanity/image-url";

export interface SanityProduct {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  images?: SanityImageSource[];
  priceValue: number;
  priceIsFrom?: boolean;
  badge?: string;
  tags?: string[];
  category?: string;
  available?: boolean;
}
