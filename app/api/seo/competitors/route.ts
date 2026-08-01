import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { domain1, domain2 }: any = await req.json();

    if (!domain1 || !domain2) {
      return NextResponse.json({ error: "Both domains are required" }, { status: 400 });
    }

    // Simulate AI Processing Delay for Domain Analysis
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulated Competitor Data
    // In production, this pulls from Ahrefs Batch Analysis API
    
    const cleanDomain = (d: string) => d.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    const d1 = cleanDomain(domain1);
    const d2 = cleanDomain(domain2);

    const generateRandomMetrics = () => {
      const traffic = Math.floor(Math.random() * 500000) + 10000;
      return {
        authority: Math.floor(Math.random() * 40) + 30,
        organicTraffic: traffic,
        organicKeywords: Math.floor(traffic / (Math.random() * 5 + 2)),
        backlinks: Math.floor(traffic / (Math.random() * 10 + 5)),
        referringDomains: Math.floor(traffic / (Math.random() * 50 + 20)),
      };
    };

    const metrics1 = generateRandomMetrics();
    const metrics2 = generateRandomMetrics();

    // Calculate simulated overlap
    const totalKeywords = metrics1.organicKeywords + metrics2.organicKeywords;
    const overlapPercentage = Math.floor(Math.random() * 30) + 10; 
    const sharedKeywords = Math.floor(totalKeywords * (overlapPercentage / 100));

    // Simulated content gaps (keywords d2 ranks for that d1 doesn't)
    const generateGaps = () => {
      const gaps: any[] = [];
      for(let i=0; i<5; i++) {
        gaps.push({
          keyword: `example keyword ${i+1}`,
          volume: Math.floor(Math.random() * 10000) + 500,
          d1Position: "-",
          d2Position: Math.floor(Math.random() * 10) + 1,
          difficulty: Math.floor(Math.random() * 60) + 20
        });
      }
      return gaps;
    };

    return NextResponse.json({
      domains: {
        d1,
        d2
      },
      metrics: {
        d1: metrics1,
        d2: metrics2
      },
      overlap: {
        percentage: overlapPercentage,
        shared: sharedKeywords
      },
      contentGaps: generateGaps()
    });

  } catch (error: any) {
    console.error("Competitor Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze competitors", details: error.message }, 
      { status: 500 }
    );
  }
}
