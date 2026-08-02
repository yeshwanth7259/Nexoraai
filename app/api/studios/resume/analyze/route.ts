import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

export const runtime = 'edge'; // force hot reload 2

export async function POST(req: Request) {
  try {
    const { jobDescription, resumeText }: any = await req.json();

    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: "Missing jobDescription or resumeText" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Google Gemini credentials (GOOGLE_GENERATIVE_AI_API_KEY)." }, { status: 500 });
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) optimizer and professional resume writer.
You will be given a Target Job Description and a Current Resume.
Analyze them strictly against each other.`;

    const userPrompt = `Target Job Description:\n${jobDescription}\n\nCurrent Resume:\n${resumeText}`;

    const { object } = await generateObject({
      model: google('gemini-3.5-flash'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: z.object({
        oldScore: z.number().describe("ATS match score of the current resume (0-100)"),
        newScore: z.number().describe("ATS match score of the optimized resume (usually 90+)"),
        issues: z.array(z.string()).describe("List of missing keywords or weak points addressed"),
        optimizedResume: z.string().describe("The fully rewritten, ATS-optimized resume in Markdown format")
      }),
    });

    return NextResponse.json(object);

  } catch (error: any) {
    console.error("Resume Analyze Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze resume" }, { status: 500 });
  }
}
