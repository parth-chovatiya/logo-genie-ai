import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "LogoAI",
  description: "Generate logos with AI",
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
        </Providers>
      </body>
    </html>
  );
}
