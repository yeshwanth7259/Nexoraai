import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uri = searchParams.get('uri');

    if (!uri) {
      return NextResponse.json({ error: "uri is required" }, { status: 400 });
    }

    // Redirect directly to the video URI to allow proper browser range requests
    return NextResponse.redirect(uri);
  } catch (error: any) {
    console.error("Error streaming video:", error);
    return NextResponse.json({ error: error?.message || "Failed to stream video" }, { status: 500 });
  }
}
