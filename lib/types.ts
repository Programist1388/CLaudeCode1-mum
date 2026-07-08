import type { SizeType } from "@/lib/sizes";

export interface Product {
  slug: string;
  title: string;
  description: string;
  images: string[];
  priceValue: number;
  priceIsFrom: boolean;
  badge?: string;
  tags: string[];
  categorySlug?: string;
  available: boolean;
  sizeType: SizeType;
}

export interface ShowroomItem {
  id: string;
  title: string;
  image: string;
}
