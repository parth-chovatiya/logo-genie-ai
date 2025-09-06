import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { logoGenerationRequestSchema } from "@shared/schema";
import { generateLogos } from "./services/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate", async (req, res) => {
    try {
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
