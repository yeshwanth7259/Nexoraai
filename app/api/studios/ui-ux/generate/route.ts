import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, framework } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Determine framework constraint
    const frameworkConstraint = framework === "HTML + CSS" 
      ? "pure HTML and Tailwind CSS (no React or JSX)." 
      : "a single functional React component using Tailwind CSS.";

    const systemPrompt = `You are an expert UI/UX developer. Generate code for the following request:
"${prompt}"

Constraints:
1. You must return ONLY the code, with no markdown formatting backticks (\`\`\`), no explanations, and no intro/outro text.
2. The code must be ${frameworkConstraint}
3. Use lucide-react icons if using React, or standard SVGs if using HTML.
4. Ensure the design is premium, modern, and accessible. Use dark mode styling by default (e.g., bg-[#0B0B14], border-white/10) to match the Nexora brand.
5. If using React, use a default export for the main component. Do not import React.`;

    const { text } = await generateText({
      model: google("models/gemini-1.5-pro-latest"),
      prompt: systemPrompt,
      temperature: 0.7,
    });

    // Clean up any potential markdown formatting the LLM might have ignored
    let cleanedCode = text.trim();
    if (cleanedCode.startsWith('```')) {
      const firstNewline = cleanedCode.indexOf('\n');
      cleanedCode = cleanedCode.substring(firstNewline + 1);
    }
    if (cleanedCode.endsWith('```')) {
      cleanedCode = cleanedCode.substring(0, cleanedCode.lastIndexOf('```'));
    }

    return NextResponse.json({ code: cleanedCode.trim() });
  } catch (error) {
    console.error("Error generating UI:", error);
    return NextResponse.json({ error: "Failed to generate UI" }, { status: 500 });
  }
}
