"use client";

import Home from "@/pages/home";

const Page = () => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "LogoGenie AI",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    description:
      "Generate unique, high-quality logos in seconds with AI. Pick a style, tweak your brand details, and download instantly.",
    url: siteUrl,
    image: siteUrl ? `${siteUrl}/opengraph-image` : undefined,
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "AI-generated logo concepts",
      "Multiple logo styles",
      "PNG, SVG, and PDF downloads",
      "Transparent PNG export",
      "Favicon pack export",
    ],
    creator: {
      "@type": "Organization",
      name: "LogoGenie AI",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Structured data must be a string, not an object.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Home />
    </>
  );
};

export default Page;
