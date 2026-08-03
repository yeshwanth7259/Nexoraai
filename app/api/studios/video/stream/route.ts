import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uri = searchParams.get('uri');

    if (!uri) {
      return NextResponse.json({ error: "uri is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Google Generative AI API key is missing" }, { status: 500 });
    }

    const response = await fetch(`${uri}?key=${apiKey}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video stream: ${response.statusText}`);
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error: any) {
    console.error("Error streaming video:", error);
    return NextResponse.json({ error: error?.message || "Failed to stream video" }, { status: 500 });
  }
}
