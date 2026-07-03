import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Содержимое")
    .items([
      S.listItem()
        .title("Товары")
        .child(
          S.documentList()
            .title("Товары")
            .filter('_type == "product"')
            .defaultOrdering([{ field: "orderIndex", direction: "asc" }])
        ),
      ...S.documentTypeListItems().filter((item) => item.getId() !== "product"),
    ]);
