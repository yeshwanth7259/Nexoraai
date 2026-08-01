import { NextResponse } from "next/server";
import { aiGateway } from "@/modules/ai-gateway";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt, size = "1024x1024", quality = "standard", n = 1 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 1. Authentication Check (To be implemented using Supabase Auth)
    // const supabase = createClient();
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Credits Deduction Check (To be implemented in modules/credits)
    // const hasCredits = await deductCredits(user.id, 5);
    // if (!hasCredits) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

    console.log("[API v1 Image] Requesting image generation for prompt:", prompt);
    
    // 3. Call AI Gateway
    const result = await aiGateway.generateImage({
      prompt,
      size,
      quality,
      n
    });

    console.log("[API v1 Image] Image generated successfully.");

    // 4. Save to Unified Asset Registry (To be implemented in modules/image/repository)
    // await saveAsset({ user_id: user.id, url: result.url, provider: result.provider, ... });

    return NextResponse.json({ 
      success: true,
      data: result 
    });

  } catch (error: any) {
    console.error("[API v1 Image] Error:", error);
    
    // If credit deduction happened, trigger refund here
    // await refundCredits(user.id, 5);

    return NextResponse.json({ error: error.message || "Failed to generate image" }, { status: 500 });
  }
}
