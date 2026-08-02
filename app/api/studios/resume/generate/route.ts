import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { jobDescription, userDetails }: any = await req.json();

    if (!jobDescription || !userDetails) {
      return NextResponse.json({ error: "Missing jobDescription or userDetails" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Google Gemini credentials (GOOGLE_GENERATIVE_AI_API_KEY)." }, { status: 500 });
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) optimizer and professional resume writer.
You will be given a Target Job Description and the User's Personal Details/Experience.
Your task is to generate a fully complete, professional, ATS-optimized resume from scratch.
Use standard ATS-friendly formatting (clean headers, bullet points).
Fill in logical gaps with professional phrasing based on the provided details, but do not hallucinate false experiences.`;

    const userPrompt = `Target Job Description:\n${jobDescription}\n\nUser Details/Experience:\n${userDetails}`;

    const { object } = await generateObject({
      model: google('gemini-1.5-pro'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: z.object({
        score: z.number().describe("ATS match score of the generated resume (90-100)"),
        optimizedResume: z.string().describe("The fully written, ATS-optimized resume in Markdown format")
      }),
    });

    return NextResponse.json(object);

  } catch (error: any) {
    console.error("Resume Generate Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate resume" }, { status: 500 });
  }
}

