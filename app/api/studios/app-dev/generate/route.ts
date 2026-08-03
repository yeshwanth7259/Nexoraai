import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.APP_DEV_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key is missing" }, { status: 500 });
    }

    const systemPrompt = `You are an expert React Native and Expo developer.
    The user will provide an app idea or requirement.
    Generate the complete, functional code for a single-file 'App.js' using React Native and Expo.
    Use standard React Native components (View, Text, StyleSheet, TouchableOpacity, ScrollView, etc.).
    Include some modern styling, preferably with a dark mode theme if requested.
    Do NOT output markdown formatting like \`\`\`javascript or \`\`\`. Output ONLY the raw code.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API Error: ${errorText}`);
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || "";

    // Cleanup markdown if present
    if (text.startsWith('```')) {
      const firstNewline = text.indexOf('\n');
      text = text.substring(firstNewline + 1);
    }
    if (text.endsWith('```')) {
      text = text.substring(0, text.lastIndexOf('```'));
    }

    return NextResponse.json({ code: text.trim() });
  } catch (error: any) {
    console.error("Error generating App Dev code:", error);
    return NextResponse.json({ error: error?.message || "Failed to generate app" }, { status: 500 });
  }
}
