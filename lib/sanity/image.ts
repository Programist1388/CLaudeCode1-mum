import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { projectId, dataset } from "@/lib/sanity/client";

const builder = createImageUrlBuilder({
  projectId: projectId || "placeholder",
  dataset,
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
