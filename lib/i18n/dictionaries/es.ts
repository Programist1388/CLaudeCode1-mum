import type { Dictionary } from "@/lib/i18n/dictionary";

export const es: Dictionary = {
  nav: {
    catalog: "Catálogo",
    process: "Cómo se hace",
    care: "Cuidado",
    contact: "Contacto",
    orderCta: "Pedir",
  },
  header: {
    cartAria: "Carrito",
  },
  hero: {
    kicker: "Hecho a mano · Bordado por encargo",
    titleLine1: "Accesorios",
    titleBeforeEmphasis: "bordados ",
    titleEmphasis: "a mano",
    titleLine3: "punto a punto",
    subtitle:
      "Bolsos, gorras, pins y otros accesorios con bordados originales, hechos a mano punto a punto. Tu propio diseño, personaje o logo, por encargo.",
    ctaCatalog: "Ver catálogo",
    ctaProcess: "Cómo lo hacemos",
  },
  stats: {
    handmadeValue: "100%",
    handmadeLabel: "bordado hecho a mano",
    designsValue: "6",
    designsLabel: "diseños listos, además de cualquier diseño a medida",
    stitchesValue: "10.000+",
    stitchesLabel: "puntadas por accesorio en promedio",
    warrantyValue: "14 días",
    warrantyLabel: "garantía de calidad del bordado",
  },
  showroom: {
    title: "Trabajos que ya hemos realizado",
    subtitle:
      "Fragmentos de pedidos terminados: inspiración para tu propia idea. El catálogo completo con precios está en su propia sección.",
    empty: "Pronto llegarán ejemplos de nuestros trabajos.",
    cta: "Ver catálogo",
  },
  spotlight: {
    kicker: "Colección",
    title: "Encuentra tu accesorio",
    subtitle: "Cambia de modelo con un toque: foto y precio se actualizan al instante.",
    otherModels: "Otros modelos",
    viewDetails: "Ver detalles",
  },
  factsGrid: {
    kicker: "Datos",
    title: "El taller, en cifras y piezas",
    subtitle: "Algunos datos sobre cómo trabajamos y qué hacemos.",
    workLabel: "El trabajo",
    workText: "Cada pieza se borda a mano, punto a punto, desde el trazado en la tela hasta la revisión final antes de embalar.",
    productsLabel: "Las piezas",
    productsText: "Bolsos, mochilas, gorras y otros accesorios: cada uno una pieza única, con un diseño de bordado original.",
  },
  process: {
    kicker: "Proceso",
    title: "Cómo nace un accesorio",
    steps: [
      {
        mark: "01",
        title: "Boceto y trazado",
        text: "Convertimos una imagen o referencia en un esquema de bordado y trazamos el contorno sobre la tela, a mano, sin plantilla.",
      },
      {
        mark: "02",
        title: "Selección de los hilos",
        text: "Elegimos los hilos por color y tono según el diseño concreto, para que las transiciones de color queden suaves.",
      },
      {
        mark: "03",
        title: "Bordado a mano",
        text: "Cada puntada se hace a mano con aguja. Es la parte más larga y minuciosa del trabajo.",
      },
      {
        mark: "04",
        title: "Acabado y control",
        text: "Fijamos los hilos por el reverso, planchamos la pieza al vapor y comprobamos cada puntada antes de embalarla.",
      },
    ],
  },
  care: {
    kicker: "Cuidado",
    title: "Para que el bordado luzca como nuevo",
    subtitle:
      "El bordado se sujeta con firmeza, pero como toda pieza hecha a mano, agradece un trato delicado.",
    items: [
      {
        title: "Lavar del revés",
        text: "Da la vuelta a la pieza y lávala a mano o en ciclo delicado, sin centrifugado.",
      },
      {
        title: "Sin secadora",
        text: "Seca en horizontal sobre una toalla, lejos de radiadores y del sol directo.",
      },
      {
        title: "Planchar del revés",
        text: "Plancha o usa vapor solo por el reverso de la tela, nunca sobre el bordado.",
      },
      {
        title: "Sin tintorería",
        text: "Los disolventes agresivos y la lejía pueden dañar el color y la estructura de los hilos.",
      },
    ],
  },
  orderSection: {
    kicker: "Pedido",
    titleLine1: "¿Elegiste un accesorio?",
    titleLine2: "Escríbenos el color y tus preferencias",
    body: "Confirmamos la disponibilidad, el plazo de fabricación (normalmente de 3 a 7 días) y organizamos el envío dentro de Rusia. Un anticipo del 50% inicia el trabajo. También podemos crear un diseño personalizado a partir de tu referencia.",
    priceNoteBold: "Los precios son orientativos",
    priceNoteRest:
      " y dependen de la complejidad del bordado; el costo exacto se confirma tras acordar el diseño.",
  },
  footer: {
    tagline: "Hecho a mano · Bordado · Hecho con amor por el detalle",
  },
  catalog: {
    kicker: "Catálogo",
    title: "Cada accesorio es una pieza única",
    subtitle:
      "Las fotos las tomamos nosotros mismos al preparar los pedidos: son piezas reales, no renders. El color de la tela y la variante de bordado se confirman al hacer el pedido. Podemos recrear tu propia idea: solo envíanos una referencia.",
    allTab: "Todos",
    emptyGeneral: "El catálogo se llenará pronto.",
    emptyCategory: "Todavía no hay productos en esta categoría.",
  },
  product: {
    addToCart: "Añadir al carrito",
    added: "Añadido ✓",
    order: "Pedir",
    priceFrom: "desde",
    priceUnit: "ud.",
    moreInfo: "Más información",
    lessInfo: "Ocultar",
  },
  cart: {
    title: "Carrito",
    emptyTitle: "Tu carrito está vacío",
    emptySubtitle: "Explora el catálogo para elegir un accesorio.",
    browseCatalog: "Ver catálogo",
    total: "Total",
    estimateTotal: "Estimado",
    noteLabel: "Color, preferencias",
    notePlaceholder: "Ej.: bordado en hilo azul, sin texto en la parte inferior",
    nameLabel: "Nombre",
    namePlaceholder: "Cómo te llamamos",
    phoneLabel: "Teléfono",
    phonePlaceholder: "+34 612 34 56 78",
    deliveryMethodLabel: "Método de entrega",
    deliveryMethodCourier: "Mensajería",
    deliveryMethodPost: "Correo de Rusia",
    deliveryMethodCdek: "CDEK",
    deliveryMethodPickup: "Recogida en persona",
    deliveryAddressLabel: "Dirección de entrega",
    deliveryAddressPlaceholder: "Ciudad, calle, edificio, piso",
    requiredFieldError: "Completa este campo",
    checkoutWhatsapp: "Pedir por WhatsApp",
    checkoutTelegram: "Copiar y abrir Telegram",
    checkoutTelegramCopied: "Copiado, abrir Telegram",
    orderPlacedNote:
      "Tu pedido está listo, puedes vaciar el carrito si lo deseas.",
    clearCart: "Vaciar carrito",
    decreaseAria: "Disminuir cantidad",
    increaseAria: "Aumentar cantidad",
    remove: "Eliminar",
  },
  orders: {
    title: "Tus pedidos",
    orderLabel: "Pedido",
    statusAccepted: "Pedido recibido",
    statusReady: "Pedido listo",
    statusCancelled: "Pedido cancelado",
  },
  imagePlaceholder: {
    text: "Foto próximamente",
  },
  metadata: {
    title: "LAVANDA: accesorios bordados hechos a mano",
    description:
      "Bolsos, gorras, pins y otros accesorios con bordados originales, hechos a mano punto a punto. Tu propio diseño, personaje o logo, por encargo.",
    catalogTitle: "Catálogo | LAVANDA",
  },
};
