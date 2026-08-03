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

    const systemPrompt = `You are an expert React Native and Expo Android app developer.
    The user will provide an app idea or requirement.
    Generate a complete, functional Expo Android app project.
    Return ONLY a raw JSON object containing three keys: "App.js", "package.json", and "app.json".
    The values should be the raw string content of these files.
    Use standard React Native components. Include modern styling and dark mode.
    Make sure package.json includes standard expo dependencies.
    Output ONLY valid JSON. Do not include markdown formatting like \`\`\`json or \`\`\`.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
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
    let text = data.choices?.[0]?.message?.content || "{}";

    return NextResponse.json({ files: JSON.parse(text) });
  } catch (error: any) {
    console.error("Error generating App Dev code:", error);
    return NextResponse.json({ error: error?.message || "Failed to generate app" }, { status: 500 });
  }
}
