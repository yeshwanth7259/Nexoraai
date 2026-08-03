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

    // Since Gemini doesn't currently generate MP4s directly via standard public REST endpoints (usually it's for Gemini Pro text/vision),
    // we use Gemini to "direct" a video and provide a descriptive output, and we simulate the video URL for demonstration.
    // If the user's gemini instance has Veo enabled, this is where that API call would go.
    
    const systemPrompt = `You are an expert AI video director.
    The user will provide a prompt for a video they want to generate.
    Write a brief, vivid description (1-2 sentences) of what the final video looks like, as if you just generated it.
    Focus on lighting, camera movement, and subject matter.`;

    const geminiPayload = {
      contents: [{
        role: "user",
        parts: [{
          text: `${systemPrompt}\n\nUser Prompt: ${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${errorText}`);
    }

    const data = await response.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text || prompt;

    // Return a sample placeholder video along with the Gemini-generated description of the scene
    return NextResponse.json({ 
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: description.trim()
    });

  } catch (error: any) {
    console.error("Error generating Video:", error);
    return NextResponse.json({ error: error?.message || "Failed to generate video" }, { status: 500 });
  }
}
