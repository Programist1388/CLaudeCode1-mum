import { ImageResponse } from "next/og";

// Replaces the default Next.js placeholder favicon with a small brand
// mark: the gold "В" that's highlighted in the header/footer wordmark
// (ЛА«В»АНДА), on the site's dark background.
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
          color: "#c9a768",
          fontFamily: "Georgia, serif",
          fontSize: 22,
          fontWeight: 600,
        }}
      >
        В
      </div>
    ),
    { ...size }
  );
}
