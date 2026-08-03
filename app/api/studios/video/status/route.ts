import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const operationName = searchParams.get('operationName');

    if (!operationName) {
      return NextResponse.json({ error: "operationName is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Google Generative AI API key is missing" }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${apiKey}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Veo Status API Error: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.done) {
      const videoUri = data.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
      if (!videoUri) {
        throw new Error("Video completed but no video URI found in response");
      }
      return NextResponse.json({ done: true, videoUri });
    }

    return NextResponse.json({ done: false });
  } catch (error: any) {
    console.error("Error polling Video Status:", error);
    return NextResponse.json({ error: error?.message || "Failed to poll video status" }, { status: 500 });
  }
}
