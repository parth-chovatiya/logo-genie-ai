import { ImageResponse } from "next/og";

export const alt = "LogoGenie AI — Generate unique logos in seconds with AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Used for both og:image and twitter:image (Next falls back to this when no twitter-image).
const OpengraphImage = () => {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0B1120",
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(37,99,235,0.45) 0%, rgba(11,17,32,0) 45%), radial-gradient(circle at 85% 85%, rgba(124,58,237,0.45) 0%, rgba(11,17,32,0) 50%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 110,
              height: 110,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              borderRadius: 28,
            }}
          >
            <svg width="68" height="68" viewBox="0 0 24 24" fill="white">
              <path d="M12 1.5 L14.2 9.8 L22.5 12 L14.2 14.2 L12 22.5 L9.8 14.2 L1.5 12 L9.8 9.8 Z" />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            <span>LogoGenie&nbsp;</span>
            <span style={{ color: "#60A5FA" }}>AI</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 960,
          }}
        >
          Design your brand identity in seconds.
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            color: "#94A3B8",
            maxWidth: 900,
          }}
        >
          AI-generated, production-ready logos — multiple styles, instant
          PNG / SVG / PDF & favicon downloads.
        </div>
      </div>
    ),
    { ...size },
  );
};

export default OpengraphImage;
