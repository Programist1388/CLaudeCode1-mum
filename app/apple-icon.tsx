import { ImageResponse } from "next/og";

// Same brand mark as app/icon.tsx, sized for iOS home-screen shortcuts.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 110,
          fontWeight: 600,
        }}
      >
        В
      </div>
    ),
    { ...size }
  );
}
