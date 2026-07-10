import { ImageResponse } from "next/og";

// Replaces the default Next.js placeholder favicon with a small brand
// mark: the gold "Л" — the first letter of the wordmark (ЛАВАНДА) — on
// the site's dark background.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0a0e",
          color: "#f2811c",
          fontFamily: "Georgia, serif",
          fontSize: 22,
          fontWeight: 600,
        }}
      >
        Л
      </div>
    ),
    { ...size }
  );
}
