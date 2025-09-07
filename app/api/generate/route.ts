import { NextRequest, NextResponse } from "next/server";
import { logoGenerationRequestSchema } from "@shared/schema";
import { generateLogos } from "../_lib/gemini";
import { uploadLogoDataUrl } from "../_lib/s3";

// Simple in-memory per-IP rate limiter: max N requests per 60 seconds (from env)
type RateEntry = { count: number; windowStart: number };
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = (() => {
  const raw = process.env.RATE_LIMIT_MAX;
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 4;
})();
const rateLimiterStore = new Map<string, RateEntry>();

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;
  // Fallback – NextRequest does not always expose raw socket IP
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimiterStore.get(ip);
  if (!entry) {
    rateLimiterStore.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimiterStore.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }
  entry.count += 1;
  rateLimiterStore.set(ip, entry);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: "Rate limit exceeded. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = logoGenerationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const logos = await generateLogos(parsed.data);

    // Fire-and-forget upload to S3 for developer analytics; don't block response
    // Use a microtask to avoid holding the response
    Promise.resolve()
      .then(async () => {
        await Promise.all(
          logos.map((logo) =>
            uploadLogoDataUrl({
              dataUrl: logo.imageData,
              key: `requests/${Date.now()}-${logo.id}.png`,
              metadata: {
                style: logo.style,
                rating: String(logo.rating),
                brand_name: parsed.data.brandName,
                description: parsed.data.description,
                business_type: parsed.data.businessType,
                color_preference: parsed.data.colorPreference ?? "",
              },
            }).catch(() => undefined)
          )
        );
      })
      .catch(() => undefined);

    return NextResponse.json({ logos });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Failed to generate logos" },
      { status: 500 }
    );
  }
}
