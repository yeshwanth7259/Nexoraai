import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { jobDescription, userDetails }: any = await req.json();

    if (!jobDescription || !userDetails) {
      return NextResponse.json({ error: "Missing jobDescription or userDetails" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const defaultModel = process.env.DEFAULT_FREE_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';

    if (!apiKey) {
      return NextResponse.json({ error: "Missing OpenRouter credentials (OPENROUTER_API_KEY)." }, { status: 500 });
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) optimizer and professional resume writer.
You will be given a Target Job Description and the User's Personal Details/Experience.
Your task is to generate a fully complete, professional, ATS-optimized resume from scratch.
Use standard ATS-friendly formatting (clean headers, bullet points).
Fill in logical gaps with professional phrasing based on the provided details, but do not hallucinate false experiences.
Return a JSON object with exactly the following structure:
{
  "score": <number between 90 and 100 representing ATS match of the generated resume>,
  "optimizedResume": "<string containing the fully written, ATS-optimized resume in Markdown format>"
}
Do not return any other text outside the JSON object.`;

    const userPrompt = `Target Job Description:\n${jobDescription}\n\nUser Details/Experience:\n${userDetails}`;

    const payload = {
      model: defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.ALLOWED_ORIGIN || "http://localhost:3000",
        "X-Title": "Nexora AI"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${err}`);
    }

    const data: any = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from AI");
    }

    let parsedContent;
    try {
      const cleanContent = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      parsedContent = JSON.parse(cleanContent);
    } catch (e) {
      throw new Error("Failed to parse AI response as JSON.");
    }

    return NextResponse.json(parsedContent);

  } catch (error: any) {
    console.error("Resume Generate Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate resume" }, { status: 500 });
  }
}
