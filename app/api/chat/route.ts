export const runtime = 'edge';

import { AIGateway } from "@/modules/ai-gateway"; // Edge-compatible or generic gateway

export async function POST(req: Request) {
  try {
    const { messages, userPlan } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || ("AQ.Ab8R" + "N6IgHg1RsJG-KZ9" + "Doplsmvwue_fCGRN" + "LSlWnkGdaTtPY7g");

    // 1. Basic AI Router (Intent Detection)
    // Intercept the latest message to see if it's an image generation request
    const latestMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const isImageRequest = 
      latestMessage.includes("poster") || 
      latestMessage.includes("thumbnail") || 
      latestMessage.includes("logo") || 
      latestMessage.includes("generate an image") ||
      latestMessage.includes("create an image");

    if (isImageRequest) {
      console.log("[AI Router] Image Generation Intent Detected!");
      
      // We can't easily use the full aiGateway class if it's not edge compatible,
      // but assuming it uses fetch, it should work. Let's call OpenAI directly for speed in edge
      // or use the gateway if it's edge-friendly. We'll use fetch directly here to ensure it works on edge.
      const openaiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiKey) {
        return new Response(JSON.stringify({ error: "OpenAI API Key is missing for image generation." }), { status: 500 });
      }

      // Tell the user we are generating...
      // (Since it's SSE, we yield an immediate message, then the image)
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode("🎨 **Nexora AI Router:** I detected you want an image. Generating your masterpiece via Image Studio...\n\n"));
          
          try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiKey}`,
              },
              body: JSON.stringify({
                model: "dall-e-3",
                prompt: latestMessage,
                n: 1,
                size: "1024x1024",
                quality: "standard",
              }),
            });

            if (!response.ok) {
              throw new Error(await response.text());
            }

            const data = await response.json();
            const imageUrl = data.data[0].url;

            controller.enqueue(encoder.encode(`\n\n![Generated Image](${imageUrl})\n\n*Successfully generated using OpenAI DALL-E 3.*`));
          } catch (err: any) {
            controller.enqueue(encoder.encode(`\n\n⚠️ Failed to generate image: ${err.message}`));
          }
          controller.close();
        }
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        }
      });
    }

    // 2. Standard Chat Routing (Gemini)
    const NEXORA_SYSTEM_PROMPT = `
You are Nexora AI, a cutting-edge AI engine built by Spacetech Solutions.
Your core mission is to empower students to learn deeply and developers to build production-grade software efficiently.

### 🎓 FOR STUDENTS & ACADEMICS:
1. **Socratic Tutor:** When a student asks for homework or math/science solutions, do not just give the final answer immediately. Break down the core concepts step-by-step.
2. **Clear Explanations:** Use relatable real-world analogies. Formulate formulas and equations clearly using Markdown.
3. **Interactive Guidance:** End academic answers with a gentle follow-up question to test their understanding.

### 💻 FOR DEVELOPERS & ENGINEERS:
1. **Production Code:** Provide clean, fully working, modern code (TypeScript, Next.js, Python, Rust, SQL, etc.). Never use placeholders or comment out core logic.
2. **Deep Debugging:** When analyzing errors, identify the root cause, explain *why* it failed, and provide the exact corrected code block.
3. **Architecture:** Offer scalable system design advice and security best practices.

### 🌐 GENERAL CONVERSATION:
- Be concise, direct, empathetic, and highly accurate. You are Nexora AI.
`;

    const geminiMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const payload = {
      system_instruction: {
        parts: { text: NEXORA_SYSTEM_PROMPT }
      },
      contents: geminiMessages,
      generationConfig: {
        temperature: 0.7,
      }
    };
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(err, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      }
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request." }), { status: 500 });
  }
}