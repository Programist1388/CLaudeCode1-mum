export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ProductRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  images: string[];
  price_value: number;
  price_is_from: boolean;
  badge: string | null;
  tags: string[];
  category_id: string | null;
  available: boolean;
  order_index: number | null;
  created_at: string;
}
