import { createClient } from '@supabase/supabase-js';
import { embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import * as cheerio from 'cheerio';

export const maxDuration = 60; // Allow 60 seconds for scraping

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Note: Use Service Key to bypass RLS for backend insertions
);

export async function POST(req: Request) {
  try {
    const { url, projectId } = await req.json();

    if (!url || !projectId) {
      return Response.json({ error: "URL and Project ID are required." }, { status: 400 });
    }

    // 1. Scrape the website
    const siteResponse = await fetch(url);
    if (!siteResponse.ok) {
        return Response.json({ error: `Failed to fetch URL: ${siteResponse.statusText}` }, { status: 400 });
    }
    const html = await siteResponse.text();
    
    // 2. Extract clean text using Cheerio
    const $ = cheerio.load(html);
    
    // Remove scripts, styles, and nav bars to get pure content
    $('script, style, nav, footer, iframe, img, noscript, svg').remove();
    const cleanText = $('body').text().replace(/\s+/g, ' ').trim();

    // 3. Chunk the text into readable paragraphs (roughly 500 characters each)
    // AI models read better in smaller chunks rather than massive walls of text
    const chunks = cleanText.match(/.{1,500}(?:\s|$)/g) || [];

    if (chunks.length === 0) {
      return Response.json({ error: "Could not extract text from this URL." }, { status: 400 });
    }

    // 4. Convert chunks into Vector Embeddings using Gemini's embedding model
    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel('text-embedding-004'),
      values: chunks,
    });

    // 5. Format the data and save it to Supabase
    const records = chunks.map((chunk, index) => ({
      project_id: projectId,
      url: url,
      chunk_text: chunk,
      embedding: embeddings[index],
    }));

    const { error: dbError } = await supabase.from('knowledge_base').insert(records);

    if (dbError) throw dbError;

    return Response.json({ 
      success: true, 
      message: `Successfully scraped and vectorized ${chunks.length} chunks of data.` 
    });

  } catch (error: any) {
    console.error("Scraping Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
