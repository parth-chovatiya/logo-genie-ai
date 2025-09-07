import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { logoGenerationRequestSchema } from "@shared/schema";
import { generateLogos } from "./services/gemini";

// Simple in-memory per-IP rate limiter: max 2 requests per 60 seconds
type RateEntry = { count: number; windowStart: number };
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 2;
const rateLimiterStore = new Map<string, RateEntry>();

function getClientIpFromExpress(req: any): string {
  const xff: string | undefined = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0)
    return xff.split(",")[0].trim();
  const xRealIp: string | undefined = req.headers["x-real-ip"];
  if (typeof xRealIp === "string" && xRealIp.length > 0) return xRealIp;
  return req.ip || req.socket?.remoteAddress || "unknown";
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

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate", async (req, res) => {
    try {
      const ip = getClientIpFromExpress(req);
      if (isRateLimited(ip)) {
        return res
          .status(429)
          .json({
            message: "Rate limit exceeded. Please try again in a minute.",
          });
      }

      // Validate request body
      const validation = logoGenerationRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validation.error.errors,
        });
      }

      const requestData = validation.data;

      // Create logo request record
      const logoRequest = await storage.createLogoRequest(requestData);

      // Generate logos using Gemini
      const generatedLogos = await generateLogos({
        brandName: requestData.brandName,
        description: requestData.description,
        businessType: requestData.businessType,
        colorPreference: requestData.colorPreference,
      });

      // Update request with generated logos
      const updatedRequest = await storage.updateLogoRequestWithResults(
        logoRequest.id,
        generatedLogos
      );

      res.json({
        requestId: logoRequest.id,
        logos: generatedLogos,
      });
    } catch (error) {
      console.error("Logo generation error:", error);
      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate logos. Please try again.",
      });
    }
  });

  app.get("/api/request/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const logoRequest = await storage.getLogoRequest(id);

      if (!logoRequest) {
        return res.status(404).json({ message: "Logo request not found" });
      }

      res.json(logoRequest);
    } catch (error) {
      console.error("Error fetching logo request:", error);
      res.status(500).json({ message: "Failed to fetch logo request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
