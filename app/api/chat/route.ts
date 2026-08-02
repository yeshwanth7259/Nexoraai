import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

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

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    system: NEXORA_SYSTEM_PROMPT,
    messages,
    tools: {
      generateImage: tool({
        description: 'Generate an image based on a user request. Use this when a user asks for a picture, poster, or drawing.',
        parameters: z.object({
          prompt: z.string().describe('A highly detailed, descriptive prompt for the image to generate.'),
        }),
        execute: async ({ prompt }) => {
          const encodedPrompt = encodeURIComponent(prompt);
          const seed = Math.floor(Math.random() * 1000000);
          const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true&enhance=true&model=flux`;
          
          return { url: imageUrl, prompt };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}