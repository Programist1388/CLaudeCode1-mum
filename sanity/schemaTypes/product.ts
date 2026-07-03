import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Товар",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (для ссылки)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Описание",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "images",
      title: "Фотографии",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.min(1).error("Добавьте хотя бы одну фотографию"),
    }),
    defineField({
      name: "priceValue",
      title: "Цена, ₽",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "priceIsFrom",
      title: "Цена «от»",
      description: 'Показывать цену как "от 3 500 ₽" вместо точной суммы',
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "badge",
      title: "Бейдж",
      description: 'Например: "Bestseller", "Новинка". Оставьте пустым, если бейдж не нужен.',
      type: "string",
    }),
    defineField({
      name: "tags",
      title: "Теги",
      description: "Короткие подписи под описанием (ткань/цвет, состав страз)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "category",
      title: "Категория",
      type: "string",
      options: {
        list: [
          { title: "Худи", value: "hoodie" },
          { title: "Футболка", value: "tshirt" },
          { title: "Подушка/текстиль для дома", value: "pillow" },
          { title: "Другое", value: "other" },
        ],
      },
    }),
    defineField({
      name: "available",
      title: "В наличии",
      description: "Выключите, чтобы скрыть проданный экземпляр, не удаляя карточку",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "orderIndex",
      title: "Порядок в каталоге",
      description: "Меньше — выше в списке",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Порядок в каталоге",
      name: "orderIndexAsc",
      by: [{ field: "orderIndex", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "priceValue",
      media: "images.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle} ₽` : undefined,
        media,
      };
    },
  },
});
