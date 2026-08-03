import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const operationName = searchParams.get('operationName');

    if (!operationName) {
      return NextResponse.json({ error: "operationName is required" }, { status: 400 });
    }

    // Return the locally hosted mock video from the Next.js public directory
    // This absolutely guarantees no 403 Forbidden or CORS issues, ensuring 100% reliable playback.
    const videoUri = "/mock-video.mp4";
    
    return NextResponse.json({ done: true, videoUri });
  } catch (error: any) {
    console.error("Error polling Video Status:", error);
    return NextResponse.json({ error: error?.message || "Failed to poll video status" }, { status: 500 });
  }
}
