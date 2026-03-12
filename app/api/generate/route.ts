import { NextRequest, NextResponse } from "next/server";
import { logoGenerationRequestSchema } from "@shared/schema";
import { generateLogos } from "../_lib/gemini";
import { uploadLogoDataUrl } from "../_lib/s3";
import {
  getClientIp,
  getRateLimitState,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
} from "../_lib/rate-limit";

const rateLimitWindowDescription = (() => {
  const hours = RATE_LIMIT_WINDOW_MS / (60 * 60 * 1000);
  if (Number.isInteger(hours) && hours >= 1) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const minutes = RATE_LIMIT_WINDOW_MS / (60 * 1000);
  if (Number.isInteger(minutes) && minutes >= 1) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  const seconds = Math.max(1, Math.round(RATE_LIMIT_WINDOW_MS / 1000));
  return `${seconds} second${seconds === 1 ? "" : "s"}`;
})();

export const POST = async (req: NextRequest) => {
  try {
    const ip = getClientIp(req);
    const rl = await getRateLimitState(ip);
    if (rl.limited) {
      const res = NextResponse.json(
        {
          message:
            `Rate limit exceeded. You can generate up to ${RATE_LIMIT_MAX} logo request${
              RATE_LIMIT_MAX === 1 ? "" : "s"
            } every ${rateLimitWindowDescription}. Please try again later.`,
          retryAfterSeconds: rl.retryAfterSeconds,
        },
        { status: 429 }
      );
      res.headers.set("Retry-After", String(rl.retryAfterSeconds));
      res.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
      res.headers.set("X-RateLimit-Remaining", String(rl.remaining));
      res.headers.set("X-RateLimit-Reset", String(Math.floor(rl.resetAtMs / 1000)));
      return res;
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
};
