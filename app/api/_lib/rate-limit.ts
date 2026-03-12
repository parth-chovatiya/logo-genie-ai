import type { NextRequest } from "next/server";

type RateEntry = { count: number; windowStart: number };

export const RATE_LIMIT_WINDOW_MS = (() => {
  const raw = process.env.RATE_LIMIT_WINDOW_MS;
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 6 * 60 * 60 * 1000;
})();

export const RATE_LIMIT_MAX = (() => {
  const raw = process.env.RATE_LIMIT_MAX;
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
})();

const rateLimiterStore = new Map<string, RateEntry>();

export const getClientIp = (req: NextRequest): string => {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;
  return "unknown";
};

export const getRateLimitState = (ip: string): {
  limited: boolean;
  retryAfterSeconds: number;
  remaining: number;
  resetAtMs: number;
} => {
  const now = Date.now();
  const entry = rateLimiterStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimiterStore.set(ip, { count: 1, windowStart: now });
    return {
      limited: false,
      retryAfterSeconds: 0,
      remaining: Math.max(0, RATE_LIMIT_MAX - 1),
      resetAtMs: now + RATE_LIMIT_WINDOW_MS,
    };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const resetAtMs = entry.windowStart + RATE_LIMIT_WINDOW_MS;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAtMs - now) / 1000));
    return {
      limited: true,
      retryAfterSeconds,
      remaining: 0,
      resetAtMs,
    };
  }

  entry.count += 1;
  rateLimiterStore.set(ip, entry);

  const resetAtMs = entry.windowStart + RATE_LIMIT_WINDOW_MS;
  return {
    limited: false,
    retryAfterSeconds: 0,
    remaining: Math.max(0, RATE_LIMIT_MAX - entry.count),
    resetAtMs,
  };
};

