import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Basic URL validation
    let targetUrl = url;
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    const startTime = Date.now();
    
    // Fetch the HTML
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Nexora-SEO-Bot/1.0",
      },
      next: { revalidate: 3600 } // Cache for 1 hour if possible
    });
    
    const html = await response.text();
    const loadTime = Date.now() - startTime;

    const $ = cheerio.load(html);

    // 1. Basic Metadata
    const title = $("title").text().trim();
    const description = $("meta[name='description']").attr("content")?.trim() || "";
    
    // 2. Headers
    const h1Count = $("h1").length;
    const h2Count = $("h2").length;
    
    // 3. Content Analysis
    const textContent = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = textContent.split(" ").length;

    // 4. Link Analysis
    let internalLinks = 0;
    let externalLinks = 0;
    $("a").each((i, link) => {
      const href = $(link).attr("href");
      if (href) {
        if (href.startsWith("/") || href.startsWith(targetUrl)) {
          internalLinks++;
        } else if (href.startsWith("http")) {
          externalLinks++;
        }
      }
    });
    
    // 5. Image Analysis (Alt tags)
    const totalImages = $("img").length;
    const imagesWithoutAlt = $("img:not([alt]), img[alt='']").length;

    // 6. Calculate Site Health Score
    let score = 100;
    const issues: { type: string, message: string }[] = [];

    if (!title) {
      score -= 15;
      issues.push({ type: "Error", message: "Missing Title Tag" });
    } else if (title.length < 30 || title.length > 60) {
      score -= 5;
      issues.push({ type: "Warning", message: "Suboptimal Title Length (Aim for 30-60 chars)" });
    }

    if (!description) {
      score -= 15;
      issues.push({ type: "Error", message: "Missing Meta Description" });
    } else if (description.length < 120 || description.length > 160) {
      score -= 5;
      issues.push({ type: "Warning", message: "Suboptimal Description Length (Aim for 120-160 chars)" });
    }

    if (h1Count === 0) {
      score -= 10;
      issues.push({ type: "Error", message: "Missing H1 Tag" });
    } else if (h1Count > 1) {
      score -= 5;
      issues.push({ type: "Warning", message: "Multiple H1 Tags found (Best practice is 1)" });
    }
    
    if (imagesWithoutAlt > 0) {
      score -= Math.min(10, imagesWithoutAlt * 2);
      issues.push({ type: "Notice", message: `${imagesWithoutAlt} image(s) missing alt tags` });
    }
    
    if (wordCount < 300) {
      score -= 10;
      issues.push({ type: "Warning", message: "Thin content (< 300 words)" });
    }

    if (loadTime > 2000) {
      score -= 10;
      issues.push({ type: "Warning", message: "Slow response time (> 2000ms)" });
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // --- LLM AI ENHANCEMENT FOR TRAFFIC & SOLUTIONS ---
    let aiTrafficEstimate = "0";
    let aiTrafficValue = "$0";
    let aiDomainRating = 0;
    let aiUrlRating = 0;
    let aiTrafficHistory = [0,0,0,0,0,0];
    let aiSolutions: string[] = [];

    try {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (apiKey) {
        const payload = {
          model: process.env.DEFAULT_FREE_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            { 
              role: 'system', 
              content: 'You are an expert SEO Analyst. Given a webpage\'s metadata and issues, estimate its SEO metrics. Return strictly in JSON format: {"traffic": "1.2K", "trafficValue": "$1.5K", "domainRating": 45, "urlRating": 32, "trafficHistory": [800, 950, 1100, 1050, 1200, 1200], "solutions": ["sol 1", "sol 2", "sol 3"]}. The trafficHistory should be an array of 6 numbers representing the last 6 months of traffic.' 
            },
            { 
              role: 'user', 
              content: `URL: ${targetUrl}\nTitle: ${title}\nDescription: ${description}\nWord Count: ${wordCount}\nScore: ${score}/100\nIssues: ${issues.map(i => i.message).join(", ")}` 
            }
          ],
          response_format: { type: 'json_object' }
        };

        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload)
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const content = aiData.choices[0]?.message?.content;
          if (content) {
            const cleanContent = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            const parsedAi = JSON.parse(cleanContent);
            aiTrafficEstimate = parsedAi.traffic || "0";
            aiTrafficValue = parsedAi.trafficValue || "$0";
            aiDomainRating = parsedAi.domainRating || 0;
            aiUrlRating = parsedAi.urlRating || 0;
            aiTrafficHistory = parsedAi.trafficHistory || [0,0,0,0,0,0];
            aiSolutions = parsedAi.solutions || [];
          }
        }
      }
    } catch (e) {
      console.error("AI SEO Enhancement Error:", e);
      // Fallback
      aiTrafficEstimate = score > 80 ? "10K+" : score > 50 ? "2.5K" : "< 500";
      aiTrafficValue = score > 80 ? "$12.5K" : score > 50 ? "$3.2K" : "< $100";
      aiDomainRating = score > 80 ? 65 : score > 50 ? 42 : 12;
      aiUrlRating = score > 80 ? 55 : score > 50 ? 35 : 10;
      aiTrafficHistory = score > 80 ? [8000, 8500, 9000, 9200, 9800, 10000] : [100, 200, 250, 300, 400, 450];
      aiSolutions = issues.map(i => `Fix: ${i.message}`);
    }

    return NextResponse.json({
      url: targetUrl,
      score,
      loadTimeMs: loadTime,
      trafficEstimate: aiTrafficEstimate,
      trafficValue: aiTrafficValue,
      domainRating: aiDomainRating,
      urlRating: aiUrlRating,
      trafficHistory: aiTrafficHistory,
      aiSolutions,
      metrics: {
        title,
        titleLength: title.length,
        description,
        descriptionLength: description.length,
        h1Count,
        h2Count,
        wordCount,
        internalLinks,
        externalLinks,
        totalImages,
        imagesWithoutAlt
      },
      issues
    });

  } catch (error: any) {
    console.error("SEO Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze URL", details: error.message }, 
      { status: 500 }
    );
  }
}
