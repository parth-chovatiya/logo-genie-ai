import type { MetadataRoute } from "next";

const Manifest = (): MetadataRoute.Manifest => {
  return {
    name: "LogoGenie AI — AI Logo Generator",
    short_name: "LogoGenie AI",
    description:
      "Generate unique, high-quality logos in seconds with AI. Pick a style, tweak your brand details, and download instantly.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1120",
    theme_color: "#2563EB",
    categories: ["design", "productivity", "graphics"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
};

export default Manifest;
