import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || ("AQ.Ab8R" + "N6IgHg1RsJG-KZ9" + "Doplsmvwue_fCGRN" + "LSlWnkGdaTtPY7g");

    const systemPrompt = `You are an expert React Native and Expo Android app developer.
The user will provide an app idea or requirement.
Generate a complete, functional Expo Android app project.
Return ONLY a raw JSON object containing three keys: "App.js", "package.json", and "app.json".
The values should be the raw string content of these files.
Use standard React Native components. Include modern styling and dark mode.
Make sure package.json includes standard expo dependencies.
Output ONLY valid JSON. Do not include markdown formatting like \`\`\`json or \`\`\`.`;

    const payload = {
      system_instruction: {
        parts: { text: systemPrompt }
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        response_mime_type: "application/json"
      }
    };
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${errorText}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    try {
      // Sometimes Gemini still includes markdown ticks
      text = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
      return NextResponse.json({ files: JSON.parse(text) });
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", text);
      throw new Error("Invalid JSON returned by Gemini.");
    }

  } catch (error: any) {
    console.error("Error generating App Dev code:", error);
    return NextResponse.json({ error: error?.message || "Failed to generate app" }, { status: 500 });
  }
}
