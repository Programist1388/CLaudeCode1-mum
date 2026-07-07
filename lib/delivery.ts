export const DELIVERY_METHODS = ["courier", "post", "cdek", "pickup"] as const;

export type DeliveryMethod = (typeof DELIVERY_METHODS)[number];

export function isDeliveryMethod(value: string): value is DeliveryMethod {
  return (DELIVERY_METHODS as readonly string[]).includes(value);
}

/** Every method needs a delivery address except picking the order up in person. */
export function deliveryMethodNeedsAddress(method: DeliveryMethod): boolean {
  return method !== "pickup";
}

// The order message to the owner is always Russian regardless of the
// storefront's displayed language (see CLAUDE.md), so the method name in
// that text is Russian too, independent of which label the customer saw
// in their own language's checkout form.
export const DELIVERY_METHOD_LABELS_RU: Record<DeliveryMethod, string> = {
  courier: "Курьером",
  post: "Почтой России",
  cdek: "СДЭК",
  pickup: "Самовывоз",
};
