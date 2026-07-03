import type { Product } from "@/lib/types";

/**
 * Temporary hardcoded catalog matching the original static site, used until
 * Phase 3 wires the catalog to live Sanity data. Remove once
 * lib/sanity/queries.ts is in place.
 */
export const placeholderProducts: Product[] = [
  {
    slug: "scrooge-mcduck",
    title: "Scrooge McDuck",
    description:
      "Крупная объёмная композиция: цилиндр, мешок монет и фирменный прищур Скруджа выложены сотнями страз с металлическим и золотистым переливом.",
    images: [],
    priceValue: 6900,
    priceIsFrom: false,
    badge: "Bestseller",
    tags: ["Худи, серый меланж", "Стразы hotfix: серебро + золото + янтарь"],
    available: true,
  },
  {
    slug: "dr-detailing",
    title: "Dr.Detailing",
    description:
      "Брендированная наволочка с логотипом в стразах — делаем такие для бизнеса: фирменный знак, название студии или паблика на текстиле для мерча и подарков.",
    images: [],
    priceValue: 3500,
    priceIsFrom: true,
    tags: ["Наволочка, велюр, графит", "Стразы: красный AB + графит"],
    available: true,
  },
  {
    slug: "raikov",
    title: "Raikov",
    description:
      "Именная надпись и персонаж в мультиколоре — каждая буква выложена своим оттенком страз. Хороший формат для имени, ника или подарка на заказ.",
    images: [],
    priceValue: 5400,
    priceIsFrom: false,
    badge: "Яркий выбор",
    tags: ["Футболка, красная", "Стразы: mix цветов, AB-эффект"],
    available: true,
  },
  {
    slug: "squid-game",
    title: "Squid Game",
    description:
      "Логотип и фигуры-символы с эффектом стекающей неоново-розовой краски. Контраст чёрной ткани и яркого страза считывается издалека.",
    images: [],
    priceValue: 6500,
    priceIsFrom: false,
    badge: "Хит продаж",
    tags: ["Худи, чёрная", "Стразы: неон-розовый + серебро"],
    available: true,
  },
  {
    slug: "joker",
    title: "Joker",
    description:
      "Портрет культового персонажа — от зелёных прядей до деталей костюма — с плавными цветовыми переходами внутри одного изображения.",
    images: [],
    priceValue: 7200,
    priceIsFrom: false,
    badge: "Новинка",
    tags: ["Худи, серо-синяя", "Стразы: mix, объёмный портрет"],
    available: true,
  },
  {
    slug: "tom-party",
    title: "Tom Party",
    description:
      "Мультяшный персонаж и дерзкая авторская надпись крупными стразами — заказывают как шуточный подарок другу или на вечеринку.",
    images: [],
    priceValue: 5200,
    priceIsFrom: false,
    tags: ["Футболка оверсайз, зелёная", "Стразы: жёлтый + красный"],
    available: true,
  },
];
