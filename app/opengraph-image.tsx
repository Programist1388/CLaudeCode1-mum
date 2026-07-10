import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/i18n/get-dictionary";

// The link-preview image messengers/social apps show when the site's URL
// is shared (og:image) — the site previously had none, so apps fell back
// to a blank or stale cached preview. Reuses the real (already-translated)
// metadata tagline rather than duplicating copy.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { t } = await getDictionary();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0a0e",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Georgia, serif",
            fontSize: 108,
            fontWeight: 600,
            letterSpacing: 6,
            color: "#f4f4f2",
          }}
        >
          ЛА
          <span style={{ color: "#f2811c" }}>В</span>
          АНДА
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            maxWidth: 820,
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            fontSize: 32,
            color: "#a3a3a3",
          }}
        >
          {t.metadata.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
