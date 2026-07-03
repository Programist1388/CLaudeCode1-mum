import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

// `createClient` throws immediately if `projectId` is empty, even if the
// client is never used. Before the owner sets up Sanity, `projectId` is ""
// and lib/sanity/queries.ts short-circuits to placeholder data without ever
// calling this client — but it still has to construct without throwing, so
// an empty projectId falls back to a dummy value here.
export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});
