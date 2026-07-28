import { Stitch, StitchToolClient } from "@google/stitch-sdk";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, framework } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.STITCH_API_KEY) {
      return NextResponse.json({ error: "Stitch API key is missing" }, { status: 500 });
    }

    // 1. Authenticate with Stitch SDK
    const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });
    const sdk = new Stitch(client);

    // 2. Generate UI using Stitch
    console.log("Creating Stitch project...");
    const project = await sdk.createProject("Nexora UI Generation");
    
    console.log("Generating Stitch screen for prompt:", prompt);
    const screen = await project.generate(prompt, "DESKTOP");
    
    console.log("Fetching HTML...");
    const rawHtml = await screen.getHtml();
    
    // Close the connection
    await client.close();

    // 3. Format based on Framework
    if (framework === "HTML + CSS") {
      return NextResponse.json({ code: rawHtml.trim() });
    }

    // 4. If React + Tailwind, convert HTML to React using Gemini
    console.log("Converting Stitch HTML to React component...");
    const { text } = await generateText({
      model: google("models/gemini-1.5-pro-latest"),
      prompt: `Convert the following HTML into a single functional React component using Tailwind CSS. 
Rules:
1. Replace 'class' with 'className', 'for' with 'htmlFor'.
2. Close all self-closing tags like <img>, <input>, <br>, <hr>.
3. Replace inline styles with React style objects if any.
4. Export as default. Do not import React. Use standard HTML tags (no lucide-react unless you convert SVGs to lucide icons).
5. Output ONLY the code, with no markdown backticks (\`\`\`) or explanations.

HTML to convert:
${rawHtml}`,
      temperature: 0.1,
    });

    let cleanedCode = text.trim();
    if (cleanedCode.startsWith('```')) {
      const firstNewline = cleanedCode.indexOf('\n');
      cleanedCode = cleanedCode.substring(firstNewline + 1);
    }
    if (cleanedCode.endsWith('```')) {
      cleanedCode = cleanedCode.substring(0, cleanedCode.lastIndexOf('```'));
    }

    return NextResponse.json({ code: cleanedCode.trim() });
  } catch (error: any) {
    console.error("Error generating UI with Stitch:", error);
    return NextResponse.json({ error: error?.message || "Failed to generate UI" }, { status: 500 });
  }
}
