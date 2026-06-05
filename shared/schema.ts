import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const logoRequests = pgTable("logo_requests", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  brandName: text("brand_name").notNull(),
  description: text("description").notNull(),
  businessType: text("business_type").notNull(),
  colorPreference: text("color_preference"),
  generatedLogos: jsonb("generated_logos").$type<
    Array<{
      id: string;
      imageData: string;
      style: string;
      rating: number;
    }>
  >(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLogoRequestSchema = createInsertSchema(logoRequests).omit({
  id: true,
  createdAt: true,
  generatedLogos: true,
});

export const LOGO_STYLE_NAMES = [
  "Modern Minimal",
  "Bold Wordmark",
  "Icon & Text",
  "Emblem Badge",
] as const;

export type LogoStyleName = (typeof LOGO_STYLE_NAMES)[number];

export const logoGenerationRequestSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  description: z.string().min(1, "Description is required"),
  businessType: z.string().min(1, "Business type is required"),
  colorPreference: z.string().optional(),
  styles: z
    .array(z.enum(LOGO_STYLE_NAMES))
    .min(1, "Select at least one style")
    .max(LOGO_STYLE_NAMES.length)
    .optional(),
});

export type InsertLogoRequest = z.infer<typeof insertLogoRequestSchema>;
export type LogoRequest = typeof logoRequests.$inferSelect;
export type LogoGenerationRequest = z.infer<typeof logoGenerationRequestSchema>;

export interface GeneratedLogo {
  id: string;
  imageData: string;
  style: string;
  rating: number;
}
