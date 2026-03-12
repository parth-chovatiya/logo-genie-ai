import { GoogleGenAI, Modality } from "@google/genai";
import { randomUUID } from "crypto";
import { GeneratedLogo } from "@shared/schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "",
});

export interface LogoGenerationParams {
  brandName: string;
  description: string;
  businessType: string;
  colorPreference?: string;
}

const LOGO_STYLES = [
  {
    name: "Modern Minimal",
    directive:
      "Create a clean, minimal logo with simple geometric forms. Use negative space cleverly. Think Apple, Airbnb, or Nike level simplicity. The mark should be instantly recognizable even at 16x16 pixels.",
  },
  {
    name: "Bold Wordmark",
    directive:
      "Create a distinctive wordmark/logotype where the brand name IS the logo. Use custom lettering with unique character modifications that make it ownable. Think Google, FedEx, or Coca-Cola. The typography should have personality.",
  },
  {
    name: "Icon & Text",
    directive:
      "Create a combination mark with a distinctive icon/symbol placed next to or above the brand name. The icon should work independently as an app icon. Think Slack, Spotify, or Dropbox. Balance the icon and text so neither dominates.",
  },
  {
    name: "Emblem Badge",
    directive:
      "Create a badge or emblem-style logo where text and imagery are integrated within a contained shape (circle, shield, crest). Think Starbucks, BMW, or Harley-Davidson. It should feel premium and established.",
  },
];

export const generateLogos = async (
  params: LogoGenerationParams,
): Promise<GeneratedLogo[]> => {
  const { brandName, description, businessType, colorPreference } = params;

  const logos: GeneratedLogo[] = [];

  for (const style of LOGO_STYLES) {
    const colorInstruction = colorPreference
      ? `Color palette: Use ${colorPreference} as the primary colors.`
      : `Color palette: Choose a sophisticated, modern color palette appropriate for a ${businessType} brand. Limit to 2-3 colors maximum for versatility.`;

    const prompt = `You are a world-class logo designer. Design a professional logo for the following brand:

Brand Name: "${brandName}"
Industry: ${businessType}
Brand Description: ${description}

Design Direction: ${style.directive}

${colorInstruction}

Critical Requirements:
- The logo must clearly feature or represent the brand name "${brandName}"
- Render on a clean, solid white background
- Use bold, high-contrast elements that remain legible at small sizes
- Ensure the design looks professional enough for a Fortune 500 company
- No gradients that would be hard to reproduce in print — keep it flat and modern
- No stock-art feel — this should look custom and premium
- Center the entire composition with generous padding around all edges
- Square canvas, 1:1 aspect ratio`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
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
            if ((part as any).inlineData && (part as any).inlineData.data) {
              const inlineData = (part as any).inlineData as {
                data: string;
                mimeType: string;
              };
              const logoId = randomUUID();
              const imageData = `data:${inlineData.mimeType};base64,${inlineData.data}`;

              logos.push({
                id: logoId,
                imageData,
                style: style.name,
                rating: Math.round((Math.random() * 1 + 4) * 10) / 10,
              });
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to generate logo with style ${style.name}:`, error);
    }
  }

  if (logos.length === 0) {
    throw new Error(
      "Failed to generate any logos. Please check your API key and try again.",
    );
  }

  return logos;
};
