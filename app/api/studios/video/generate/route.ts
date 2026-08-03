import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Google Generative AI API key is missing" }, { status: 500 });
    }

    const veoPayload = {
      instances: [{
        prompt: prompt
      }]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(veoPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Veo API Error: ${errorText}`);
    }

    const data = await response.json();
    
    // Veo returns { "name": "operations/..." }
    const operationName = data.name;

    if (!operationName) {
      throw new Error("Failed to get operation name from Veo API");
    }

    return NextResponse.json({ 
      operationName,
      description: prompt
    });

  } catch (error: any) {
    console.error("Error generating Video:", error);
    return NextResponse.json({ error: error?.message || "Failed to generate video" }, { status: 500 });
  }
}
