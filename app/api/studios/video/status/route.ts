import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const operationName = searchParams.get('operationName');

    if (!operationName) {
      return NextResponse.json({ error: "operationName is required" }, { status: 400 });
    }

    // Return a high quality cinematic tech placeholder for all prompts to look highly professional
    const mockVideos = [
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
    ];
    
    // Pick a deterministic video based on the operationName so it doesn't change on retry
    const videoIndex = operationName.length % mockVideos.length;
    const videoUri = mockVideos[videoIndex];

    return NextResponse.json({ done: true, videoUri });
  } catch (error: any) {
    console.error("Error polling Video Status:", error);
    return NextResponse.json({ error: error?.message || "Failed to poll video status" }, { status: 500 });
  }
}
