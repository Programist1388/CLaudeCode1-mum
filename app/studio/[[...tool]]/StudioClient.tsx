"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * sanity.config.ts must only be imported from a client component. Importing
 * it from the (server) page.tsx pulls the sanity/next-sanity module graph
 * into Next's RSC bundling pass, where `swr`'s "react-server" export
 * condition breaks (no default export) — hence this split.
 */
export function StudioClient() {
  return <NextStudio config={config} />;
}
