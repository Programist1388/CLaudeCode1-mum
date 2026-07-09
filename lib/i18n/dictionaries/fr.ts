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
    kicker: "Fait main · Broderie sur commande",
    titleLine1: "Des accessoires",
    titleBeforeEmphasis: "brodés ",
    titleEmphasis: "à la main",
    titleLine3: "point par point",
    subtitle:
      "Sacs, casquettes, pin's et autres accessoires ornés de broderies originales, réalisées à la main point par point. Votre propre design, personnage ou logo — sur commande.",
    ctaCatalog: "Voir le catalogue",
    ctaProcess: "Comment nous procédons",
  },
  stats: {
    handmadeValue: "100 %",
    handmadeLabel: "broderie faite main",
    designsValue: "6",
    designsLabel: "designs prêts, plus tout modèle sur mesure",
    stitchesValue: "10 000+",
    stitchesLabel: "points par accessoire en moyenne",
    warrantyValue: "14 jours",
    warrantyLabel: "garantie sur la qualité de la broderie",
  },
  showroom: {
    title: "Des créations déjà réalisées",
    subtitle:
      "Extraits de commandes terminées — de quoi inspirer votre propre idée. Le catalogue complet avec les prix se trouve dans sa propre rubrique.",
    empty: "Des exemples de nos créations arrivent bientôt.",
    cta: "Voir le catalogue",
  },
  spotlight: {
    kicker: "Collection",
    title: "Trouvez votre accessoire",
    subtitle: "Passez d'un modèle à l'autre en un clic — photo et prix se mettent à jour instantanément.",
    otherModels: "Autres modèles",
    viewDetails: "Voir le détail",
  },
  factsGrid: {
    kicker: "Repères",
    title: "L'atelier, en chiffres et en pièces",
    subtitle: "Quelques faits sur notre façon de travailler et ce que nous créons.",
    workLabel: "Le travail",
    workText: "Chaque pièce est brodée à la main, point par point — du traçage sur le tissu à la vérification finale avant l'emballage.",
    productsLabel: "Les pièces",
    productsText: "Sacs, sacs à dos, casquettes et autres accessoires — chacun est unique, avec un motif de broderie original.",
  },
  process: {
    kicker: "Procédé",
    title: "Comment naît un accessoire",
    steps: [
      {
        mark: "01",
        title: "Plan et repérage",
        text: "Nous transformons une image ou une référence en schéma de broderie, puis traçons le contour sur le tissu — à la main, sans pochoir.",
      },
      {
        mark: "02",
        title: "Choix des fils",
        text: "Nous choisissons les fils par couleur et par nuance pour chaque design, afin d'obtenir des dégradés de couleur harmonieux.",
      },
      {
        mark: "03",
        title: "Broderie à la main",
        text: "Chaque point est réalisé à la main à l'aiguille — l'étape la plus longue et la plus minutieuse.",
      },
      {
        mark: "04",
        title: "Finition et contrôle",
        text: "Nous fixons les fils à l'envers, défroissons la pièce à la vapeur et vérifions chaque point avant l'emballage.",
      },
    ],
  },
  care: {
    kicker: "Entretien",
    title: "Pour que la broderie reste comme neuve",
    subtitle:
      "La broderie tient solidement, mais comme toute création artisanale, elle apprécie un entretien délicat.",
    items: [
      {
        title: "Laver à l'envers",
        text: "Retournez la pièce et lavez-la à la main ou en cycle délicat, sans essorage.",
      },
      {
        title: "Pas de sèche-linge",
        text: "Séchez à plat sur une serviette, loin des radiateurs et du soleil direct.",
      },
      {
        title: "Repasser à l'envers",
        text: "Fer ou centrale vapeur uniquement sur l'envers du tissu, jamais sur la broderie.",
      },
      {
        title: "Pas de nettoyage à sec",
        text: "Les solvants agressifs et l'eau de Javel peuvent altérer la couleur et la structure des fils.",
      },
    ],
  },
  orderSection: {
    kicker: "Commande",
    titleLine1: "Vous avez choisi un accessoire ?",
    titleLine2: "Indiquez-nous la couleur et vos souhaits",
    body: "Nous confirmons la disponibilité, le délai de fabrication (généralement 3 à 7 jours) et organisons la livraison en Russie. Un acompte de 50 % est requis pour lancer la production. Nous pouvons aussi réaliser un design personnalisé à partir de votre référence.",
    priceNoteBold: "Les prix sont indicatifs",
    priceNoteRest:
      " et dépendent de la complexité de la broderie — le coût exact est confirmé après validation du plan.",
  },
  footer: {
    tagline: "Fait main · Broderie · Réalisé avec passion du détail",
  },
  catalog: {
    kicker: "Catalogue",
    title: "Chaque accessoire est une pièce unique",
    subtitle:
      "Les photos sont prises par nos soins lors de l'assemblage des commandes — ce sont de vraies pièces, pas des rendus. La couleur du tissu et la variante de broderie sont confirmées lors de la commande. Nous pouvons recréer votre propre idée — envoyez-nous une référence.",
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
    moreInfo: "Plus d'infos",
    lessInfo: "Masquer",
  },
  cart: {
    title: "Panier",
    emptyTitle: "Votre panier est vide",
    emptySubtitle: "Parcourez le catalogue pour choisir un accessoire.",
    browseCatalog: "Voir le catalogue",
    total: "Total",
    estimateTotal: "Estimation",
    noteLabel: "Couleur, souhaits",
    notePlaceholder: "Ex. : broderie en fil bleu, sans inscription en bas",
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
    title: "LAVANDA — accessoires brodés faits main",
    description:
      "Sacs, casquettes, pin's et autres accessoires ornés de broderies originales, réalisées à la main point par point. Votre propre design, personnage ou logo — sur commande.",
    catalogTitle: "Catalogue — LAVANDA",
  },
};
