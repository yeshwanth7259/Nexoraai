import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { keyword, content }: any = await req.json();

    if (!keyword || !content) {
      return NextResponse.json({ error: "Keyword and content are required" }, { status: 400 });
    }

    // Simulate AI Processing Delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Basic Analysis
    const wordCount = content.split(/\s+/).filter((w: string) => w.length > 0).length;
    const keywordLower = keyword.toLowerCase();
    const contentLower = content.toLowerCase();
    
    // Count exact keyword matches
    const keywordCount = (contentLower.match(new RegExp(keywordLower, "g")) || []).length;
    const keywordDensity = wordCount > 0 ? ((keywordCount / wordCount) * 100).toFixed(2) : "0";

    // Simulate AI LSI generation and checking
    const suggestedLSI = [
      `${keyword} guide`,
      `best ${keyword}`,
      `${keyword} tutorial`,
      `advanced ${keyword}`,
      `${keyword} tips`
    ];

    const lsiFound = suggestedLSI.filter(lsi => contentLower.includes(lsi.toLowerCase()));
    const lsiMissing = suggestedLSI.filter(lsi => !contentLower.includes(lsi.toLowerCase()));

    // Simulate scoring logic
    let score = 50;
    const issues: any[] = [];

    if (wordCount > 500) score += 20;
    else issues.push({ type: "Warning", message: `Thin content. Current: ${wordCount} words. Target: 1000+ words.` });

    if (keywordCount > 0 && Number(keywordDensity) < 3) {
      score += 15;
    } else if (keywordCount === 0) {
      issues.push({ type: "Error", message: `Target keyword "${keyword}" not found in content.` });
    } else if (Number(keywordDensity) > 3) {
      issues.push({ type: "Warning", message: `Keyword stuffing detected. Density is ${keywordDensity}%. Keep it under 3%.` });
    }

    if (lsiFound.length > 2) {
      score += 15;
    } else {
      issues.push({ type: "Notice", message: "Include more LSI keywords to improve topical authority." });
    }

    // Ensure score bounds
    score = Math.max(0, Math.min(100, score));

    return NextResponse.json({
      score,
      metrics: {
        wordCount,
        keywordCount,
        keywordDensity: Number(keywordDensity),
        lsiFound,
        lsiMissing
      },
      issues
    });

  } catch (error: any) {
    console.error("Content Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze content", details: error.message }, 
      { status: 500 }
    );
  }
}
