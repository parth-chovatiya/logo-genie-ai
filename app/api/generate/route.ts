import { NextRequest, NextResponse } from "next/server";
import { logoGenerationRequestSchema } from "@shared/schema";
import { generateLogos } from "../_lib/gemini";

export async function POST(req: NextRequest) {
  try {
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
