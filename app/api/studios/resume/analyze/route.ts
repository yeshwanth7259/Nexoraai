import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { jobDescription, resumeText }: any = await req.json();

    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: "Missing jobDescription or resumeText" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const defaultModel = process.env.DEFAULT_FREE_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';

    if (!apiKey) {
      return NextResponse.json({ error: "Missing OpenRouter credentials (OPENROUTER_API_KEY)." }, { status: 500 });
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) optimizer and professional resume writer.
You will be given a Target Job Description and a Current Resume.
Analyze them strictly against each other and return a JSON object with exactly the following structure:
{
  "score": <number between 0 and 100 representing ATS match>,
  "issues": ["<string describing a missing keyword or weak point>", "<string 2>", "<string 3>"],
  "optimizedResume": "<string containing the fully rewritten, ATS-optimized resume in Markdown format>"
}
Do not return any other text outside the JSON object.`;

    const userPrompt = `Target Job Description:\n${jobDescription}\n\nCurrent Resume:\n${resumeText}`;

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

    // Try to parse the JSON response
    let parsedContent;
    try {
      // In case the model wrapped it in markdown code blocks
      const cleanContent = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      parsedContent = JSON.parse(cleanContent);
    } catch (e) {
      throw new Error("Failed to parse AI response as JSON.");
    }

    return NextResponse.json(parsedContent);

  } catch (error: any) {
    console.error("Resume Analyze Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze resume" }, { status: 500 });
  }
}
