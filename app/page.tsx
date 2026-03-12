"use client";

import Home from "@/pages/home";

const Page = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "LogoGenie AI",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    description:
      "Generate unique, high-quality logos in seconds with AI. Pick a style, tweak your brand details, and download instantly.",
    url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? undefined,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
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
