import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Brand sparkle mark on the blue→violet gradient used across the app.
const Icon = () => {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
          borderRadius: 7,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M12 1.5 L14.2 9.8 L22.5 12 L14.2 14.2 L12 22.5 L9.8 14.2 L1.5 12 L9.8 9.8 Z" />
        </svg>
      </div>
    ),
    { ...size },
  );
};

export default Icon;
