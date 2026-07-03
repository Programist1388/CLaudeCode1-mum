import { defineQuery } from "next-sanity";
import { sanityClient, projectId } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { placeholderProducts } from "@/lib/placeholder-products";
import type { SanityProduct } from "@/lib/sanity/types";
import type { Product } from "@/lib/types";

const PRODUCT_FIELDS = `
  _id, title, slug, description, images, priceValue, priceIsFrom, badge, tags, category, available
`;

const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && available == true]
    | order(coalesce(orderIndex, 999999) asc, _createdAt asc) {
    ${PRODUCT_FIELDS}
  }
`);

const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    ${PRODUCT_FIELDS}
  }
`);

function toProduct(doc: SanityProduct): Product {
  return {
    slug: doc.slug.current,
    title: doc.title,
    description: doc.description ?? "",
    images: (doc.images ?? []).map((img) =>
      urlFor(img).width(800).height(800).fit("crop").url()
    ),
    priceValue: doc.priceValue,
    priceIsFrom: doc.priceIsFrom ?? false,
    badge: doc.badge,
    tags: doc.tags ?? [],
    category: doc.category,
    available: doc.available ?? true,
  };
}

/**
 * Falls back to the hardcoded launch catalog when no Sanity project is
 * configured yet (NEXT_PUBLIC_SANITY_PROJECT_ID unset), so the site keeps
 * working before the owner completes Sanity setup — see CLAUDE.md.
 */
export async function getAllProducts(): Promise<Product[]> {
  if (!projectId) return placeholderProducts;
  const docs = await sanityClient.fetch<SanityProduct[]>(ALL_PRODUCTS_QUERY);
  return docs.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!projectId) {
    return placeholderProducts.find((p) => p.slug === slug) ?? null;
  }
  const doc = await sanityClient.fetch<SanityProduct | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug }
  );
  return doc ? toProduct(doc) : null;
}
