export const runtime = 'edge';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  try {
    const { messages, userPlan }: any = await req.json();

    // 1. Basic AI Router (Intent Detection)
    // Intercept the latest message to see if it's an image generation request
    let latestMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    
    // Extract only the User Query part if a file is attached
    if (latestMessage.includes("user query:")) {
      latestMessage = latestMessage.substring(latestMessage.lastIndexOf("user query:") + 11).trim();
    }

    const isImageRequest = /\b(generate|create|make)\b.*\b(image|poster|thumbnail|logo|picture|photo|illustration|art)\b/i.test(latestMessage) || /\b(draw me|paint me)\b/i.test(latestMessage);

    if (isImageRequest) {
      console.log("[AI Router] Image Generation Intent Detected!");
      
      // Using Pollinations.ai which is completely free and requires NO API KEY!
      try {
        const safePrompt = encodeURIComponent(latestMessage);
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?seed=${seed}&width=1024&height=1024&nologo=true&enhance=true&model=flux`;

        const markdownReply = `![Generated Image](${imageUrl})`;
        
        return new Response(markdownReply, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          }
        });
      } catch (err: any) {
        return new Response(`\n\n**⚠️ Failed to generate image:**\n\`\`\`json\n${err.message}\n\`\`\``, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          }
        });
      }
    }

    // 2. Standard Chat Routing (OpenAI)
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

    // Filter out empty messages and format them for the AI SDK
    const formattedMessages = messages.filter((m: any) => m.content && m.content.trim() !== '').map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

    // Start streaming using Vercel AI SDK
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: NEXORA_SYSTEM_PROMPT,
      messages: formattedMessages,
      temperature: 0.7,
    });

    // Return a pure text stream to perfectly match the frontend parser
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process chat request." }), { status: 500 });
  }
}
