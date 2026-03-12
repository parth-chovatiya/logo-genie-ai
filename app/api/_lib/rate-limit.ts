import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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

const windowSeconds = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(RATE_LIMIT_MAX, `${windowSeconds} s`),
  prefix: "logogenie",
});

export const getClientIp = (req: NextRequest): string => {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;
  return "unknown";
};

export const getRateLimitState = async (
  ip: string,
): Promise<{
  limited: boolean;
  retryAfterSeconds: number;
  remaining: number;
  resetAtMs: number;
}> => {
  const { success, remaining, reset } = await ratelimit.limit(ip);

  if (success) {
    return {
      limited: false,
      retryAfterSeconds: 0,
      remaining,
      resetAtMs: reset,
    };
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return {
    limited: true,
    retryAfterSeconds,
    remaining: 0,
    resetAtMs: reset,
  };
};
