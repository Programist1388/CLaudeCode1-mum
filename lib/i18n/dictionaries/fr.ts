import type { Dictionary } from "@/lib/i18n/dictionary";

export const fr: Dictionary = {
  nav: {
    catalog: "Catalogue",
    process: "Fabrication",
    care: "Entretien",
    contact: "Contact",
    orderCta: "Commander",
  },
  header: {
    cartAria: "Panier",
  },
  hero: {
    kicker: "Fait main · Strass sur commande",
    titleLine1: "Des motifs",
    titleBeforeEmphasis: "qui ",
    titleEmphasis: "brillent",
    titleLine3: "sur tous les tissus",
    subtitle:
      "Sweats, t-shirts et textiles de maison ornés de motifs en strass posés main, cristal par cristal. Votre propre design, personnage ou logo — sur commande.",
    ctaCatalog: "Voir le catalogue",
    ctaProcess: "Comment nous procédons",
  },
  stats: {
    handmadeValue: "100 %",
    handmadeLabel: "strass posés à la main",
    designsValue: "6",
    designsLabel: "designs prêts, plus tout modèle sur mesure",
    crystalsValue: "2000+",
    crystalsLabel: "cristaux par motif en moyenne",
    warrantyValue: "14 jours",
    warrantyLabel: "garantie sur la tenue des strass",
  },
  showroom: {
    kicker: "Vitrine",
    title: "Des créations déjà réalisées",
    subtitle:
      "Extraits de commandes terminées — de quoi inspirer votre propre idée. Le catalogue complet avec les prix se trouve dans sa propre rubrique.",
    empty: "La vitrine sera bientôt garnie.",
    cta: "Voir le catalogue",
  },
  process: {
    kicker: "Procédé",
    title: "Comment naît un motif",
    steps: [
      {
        mark: "01",
        title: "Plan et repérage",
        text: "Nous transformons une image ou une référence en schéma de pose des strass, puis traçons le contour sur le tissu — à la main, sans pochoir.",
      },
      {
        mark: "02",
        title: "Sélection des pierres",
        text: "Nous trions les strass par taille et par nuance pour chaque design, afin d'obtenir des dégradés de couleur harmonieux.",
      },
      {
        mark: "03",
        title: "Pose à la main",
        text: "Chaque cristal est placé à la pince sur une colle thermofusible — l'étape la plus longue et la plus minutieuse.",
      },
      {
        mark: "04",
        title: "Thermofixation et contrôle",
        text: "Nous pressons le motif à chaud et vérifions la tenue de chaque pierre avant l'emballage.",
      },
    ],
  },
  care: {
    kicker: "Entretien",
    title: "Pour que l'éclat dure longtemps",
    subtitle:
      "Les strass tiennent solidement, mais comme toute création artisanale, ils apprécient un entretien délicat.",
    items: [
      {
        title: "Laver à l'envers",
        text: "Retournez le vêtement et lavez-le en cycle délicat, sans essorage.",
      },
      {
        title: "Pas de sèche-linge",
        text: "Séchez sur cintre ou à plat, loin des radiateurs et du soleil direct.",
      },
      {
        title: "Repasser à l'envers",
        text: "Fer ou centrale vapeur uniquement sur l'envers du tissu, jamais sur le motif.",
      },
      {
        title: "Pas de nettoyage à sec",
        text: "Les solvants agressifs peuvent endommager la colle des strass.",
      },
    ],
  },
  orderSection: {
    kicker: "Commande",
    titleLine1: "Vous avez choisi un motif ?",
    titleLine2: "Indiquez-nous la taille et vos souhaits",
    body: "Nous confirmons la disponibilité, le délai de fabrication (généralement 3 à 7 jours) et organisons la livraison en Russie. Un acompte de 50 % est requis pour lancer la production. Nous pouvons aussi réaliser un design personnalisé à partir de votre référence.",
    priceNoteBold: "Les prix sont indicatifs",
    priceNoteRest:
      " et dépendent de la densité de pose des strass — le coût exact est confirmé après validation du plan.",
  },
  footer: {
    tagline: "Fait main · Strass · Réalisé avec passion du détail",
  },
  catalog: {
    kicker: "Catalogue",
    title: "Chaque motif est une pièce unique",
    subtitle:
      "Les photos sont prises par nos soins lors de l'assemblage des commandes — ce sont de vraies pièces, pas des rendus. La taille, la couleur du tissu et la variante de strass sont confirmées lors de la commande. Nous pouvons recréer votre propre idée — envoyez-nous une référence.",
    allTab: "Tout",
    emptyGeneral: "Le catalogue sera bientôt garni.",
    emptyCategory: "Il n'y a pas encore de produits dans cette catégorie.",
  },
  product: {
    addToCart: "Ajouter au panier",
    added: "Ajouté ✓",
    order: "Commander",
    priceFrom: "à partir de",
    priceUnit: "pièce",
  },
  cart: {
    title: "Panier",
    emptyTitle: "Votre panier est vide",
    emptySubtitle: "Parcourez le catalogue pour choisir un motif.",
    browseCatalog: "Voir le catalogue",
    total: "Total",
    estimateTotal: "Estimation",
    noteLabel: "Taille, couleur, souhaits",
    notePlaceholder: "Ex. : taille L, sans inscription en bas",
    nameLabel: "Nom",
    namePlaceholder: "Comment vous appeler",
    phoneLabel: "Téléphone",
    phonePlaceholder: "+33 6 12 34 56 78",
    deliveryMethodLabel: "Mode de livraison",
    deliveryMethodCourier: "Coursier",
    deliveryMethodPost: "Poste russe",
    deliveryMethodCdek: "CDEK",
    deliveryMethodPickup: "Retrait en personne",
    deliveryAddressLabel: "Adresse de livraison",
    deliveryAddressPlaceholder: "Ville, rue, bâtiment, appartement",
    requiredFieldError: "Veuillez remplir ce champ",
    checkoutWhatsapp: "Commander via WhatsApp",
    checkoutTelegram: "Copier et ouvrir Telegram",
    checkoutTelegramCopied: "Copié — ouvrir Telegram",
    orderPlacedNote:
      "Votre commande est prête — vous pouvez vider le panier si vous le souhaitez.",
    clearCart: "Vider le panier",
    decreaseAria: "Diminuer la quantité",
    increaseAria: "Augmenter la quantité",
    remove: "Supprimer",
  },
  orders: {
    title: "Vos commandes",
    orderLabel: "Commande",
    statusAccepted: "Commande reçue",
    statusReady: "Commande prête",
    statusCancelled: "Commande annulée",
  },
  imagePlaceholder: {
    text: "Photo à venir",
  },
  metadata: {
    title: "LAVANDA — vêtements et textiles en strass faits main",
    description:
      "Sweats, t-shirts et textiles de maison ornés de motifs en strass posés main, cristal par cristal. Votre propre design, personnage ou logo — sur commande.",
    catalogTitle: "Catalogue — LAVANDA",
  },
};
