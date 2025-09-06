import { GoogleGenAI, Modality } from "@google/genai";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import { GeneratedLogo } from "@shared/schema";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "",
});

export interface LogoGenerationParams {
  brandName: string;
  description: string;
  businessType: string;
  colorPreference?: string;
}

export async function generateLogos(
  params: LogoGenerationParams
): Promise<GeneratedLogo[]> {
  const { brandName, description, businessType, colorPreference } = params;

  const styles = [
    "Modern Gradient - Clean geometric design with contemporary gradients",
    "Minimalist Badge - Simple, professional circular or badge-style design",
    "Geometric Bold - Strong geometric shapes with bold colors",
    "Classic Circle - Traditional circular design with professional typography",
  ];

  const logos: GeneratedLogo[] = [];

  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];

    const colorInstruction = colorPreference
      ? `Use these color preferences: ${colorPreference}`
      : "Use professional, modern colors that suit the business type";

    const prompt = `Create a professional logo design for:
Brand Name: ${brandName}
Business Type: ${businessType}
Description: ${description}
Style: ${style}
${colorInstruction}

Generate a clean, modern, high-quality logo that is:
- Professional and memorable
- Suitable for digital and print use
- Scalable and readable at different sizes
- Appropriate for the ${businessType} industry
- High resolution and crisp
- PNG format with transparent background

The logo should be centered on a square canvas with adequate padding around the design.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const content = candidates[0].content;
        if (content && content.parts) {
          for (const part of content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const logoId = randomUUID();
              const imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;

              logos.push({
                id: logoId,
                imageData,
                style: style.split(" - ")[0],
                rating: Math.round((Math.random() * 1 + 4) * 10) / 10, // Random rating between 4.0-5.0
              });
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to generate logo with style ${style}:`, error);
      // Continue with other styles even if one fails
    }
  }

  if (logos.length === 0) {
    throw new Error(
      "Failed to generate any logos. Please check your API key and try again."
    );
  }

  return logos;
}
