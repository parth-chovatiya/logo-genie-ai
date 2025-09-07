import { NextRequest, NextResponse } from "next/server";
import { logoGenerationRequestSchema } from "@shared/schema";
import { generateLogos } from "../_lib/gemini";

// Simple in-memory per-IP rate limiter: max 2 requests per 60 seconds
type RateEntry = { count: number; windowStart: number };
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 4;
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
    return NextResponse.json({ logos });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Failed to generate logos" },
      { status: 500 }
    );
  }
}
