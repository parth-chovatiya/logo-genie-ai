import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import { MessageCircle } from "lucide-react";
import { Analytics } from "@vercel/analytics/next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LogoGenie AI",
    template: "%s | LogoGenie AI",
  },
  description:
    "Generate unique, high-quality logos in seconds with AI. Pick a style, tweak your brand details, and download instantly.",
  applicationName: "LogoGenie AI",
  keywords: [
    "AI logo generator",
    "logo generator",
    "LogoGenie AI",
    "brand identity",
    "startup branding",
    "logo design",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "LogoGenie AI",
    description:
      "Generate unique, high-quality logos in seconds with AI. Pick a style, tweak your brand details, and download instantly.",
    siteName: "LogoGenie AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LogoGenie AI",
    description:
      "Generate unique, high-quality logos in seconds with AI. Pick a style, tweak your brand details, and download instantly.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <a
            href="https://forms.gle/whYewHNMdQJNRHxbA"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed left-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Suggestions</span>
          </a>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
