import { ImageResponse } from "next/og";

// Default share image (WhatsApp, Instagram, Google Discover, X ...).
export const alt = "DivuCloset — Premium Fashion Store";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background:
            "radial-gradient(circle at 80% 10%, #3a3326 0%, #0a0a0b 55%)",
          color: "#f4f4f5",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 92,
            letterSpacing: 18,
            fontWeight: 700,
            display: "flex",
          }}
        >
          DIVUCLOSET
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 30,
            letterSpacing: 6,
            color: "#d4b483",
            display: "flex",
          }}
        >
          SAREES · ETHNIC WEAR · MEN · JEWELRY
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 26,
            color: "#a1a1aa",
            display: "flex",
          }}
        >
          divucloset.com
        </div>
      </div>
    ),
    { ...size }
  );
}
