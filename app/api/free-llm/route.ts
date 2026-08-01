export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const { messages, model } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const defaultModel = process.env.DEFAULT_FREE_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OpenRouter credentials (OPENROUTER_API_KEY)." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format messages for OpenAI-compatible endpoint
    const orMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'assistant', // ensure standard roles
      content: m.content || m.parts?.[0]?.text || ''
    }));

    const payload = {
      model: model || defaultModel,
      messages: orMessages,
      stream: true, // we want to stream the response back
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
      return new Response(err, { status: response.status });
    }

    // Proxy the SSE stream directly to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      }
    });

  } catch (error: any) {
    console.error("OpenRouter API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process chat request via OpenRouter." }), { status: 500 });
  }
}
