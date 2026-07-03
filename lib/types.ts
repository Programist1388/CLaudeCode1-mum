export interface Product {
  slug: string;
  title: string;
  description: string;
  images: string[];
  priceValue: number;
  priceIsFrom: boolean;
  badge?: string;
  tags: string[];
  category?: string;
  available: boolean;
}
