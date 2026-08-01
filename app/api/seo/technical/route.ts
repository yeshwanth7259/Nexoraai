import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url }: any = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let targetUrl = url;
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Nexora-SEO-Bot/1.0",
      },
      next: { revalidate: 3600 }
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);

    // Deep Technical Extraction
    const canonical = $("link[rel='canonical']").attr("href") || null;
    const robots = $("meta[name='robots']").attr("content") || null;
    const ogTitle = $("meta[property='og:title']").attr("content") || null;
    const ogImage = $("meta[property='og:image']").attr("content") || null;
    const twitterCard = $("meta[name='twitter:card']").attr("content") || null;
    const viewport = $("meta[name='viewport']").attr("content") || null;
    const language = $("html").attr("lang") || null;
    const favicon = $("link[rel='icon'], link[rel='shortcut icon']").attr("href") || null;
    const jsonLdScripts = $("script[type='application/ld+json']").length;

    // Simulate SSL/HTTP checks since we can't easily do it client-side without lower-level modules
    const hasSSL = targetUrl.startsWith("https://");

    return NextResponse.json({
      url: targetUrl,
      technical: {
        canonical,
        robots,
        ogTitle,
        ogImage,
        twitterCard,
        viewport,
        language,
        favicon,
        schemaMarkupFound: jsonLdScripts > 0,
        hasSSL
      }
    });

  } catch (error: any) {
    console.error("Technical Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze URL", details: error.message }, 
      { status: 500 }
    );
  }
}
