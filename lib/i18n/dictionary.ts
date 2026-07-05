export interface Dictionary {
  nav: {
    catalog: string;
    process: string;
    care: string;
    contact: string;
    orderCta: string;
  };
  header: {
    cartAria: string;
  };
  hero: {
    kicker: string;
    titleLine1: string;
    titleBeforeEmphasis: string;
    titleEmphasis: string;
    titleLine3: string;
    subtitle: string;
    ctaCatalog: string;
    ctaProcess: string;
    statCardValue: string;
    statCardLabel: string;
  };
  stats: {
    handmadeValue: string;
    handmadeLabel: string;
    designsValue: string;
    designsLabel: string;
    crystalsValue: string;
    crystalsLabel: string;
    warrantyValue: string;
    warrantyLabel: string;
  };
  showroom: {
    kicker: string;
    title: string;
    subtitle: string;
    empty: string;
    cta: string;
  };
  process: {
    kicker: string;
    title: string;
    steps: { mark: string; title: string; text: string }[];
  };
  care: {
    kicker: string;
    title: string;
    subtitle: string;
    items: { title: string; text: string }[];
  };
  orderSection: {
    kicker: string;
    titleLine1: string;
    titleLine2: string;
    body: string;
    priceNoteBold: string;
    priceNoteRest: string;
  };
  footer: {
    tagline: string;
  };
  catalog: {
    kicker: string;
    title: string;
    subtitle: string;
    allTab: string;
    emptyGeneral: string;
    emptyCategory: string;
  };
  product: {
    addToCart: string;
    added: string;
    order: string;
    priceFrom: string;
    priceUnit: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    browseCatalog: string;
    total: string;
    estimateTotal: string;
    noteLabel: string;
    notePlaceholder: string;
    checkoutWhatsapp: string;
    checkoutTelegram: string;
    checkoutTelegramCopied: string;
    orderPlacedNote: string;
    clearCart: string;
    decreaseAria: string;
    increaseAria: string;
    remove: string;
  };
  imagePlaceholder: {
    text: string;
  };
  metadata: {
    title: string;
    description: string;
    catalogTitle: string;
  };
}
