export const runtime = 'edge';

// Cache the endpoint and key in memory to avoid generating a new key on every request.
// In edge runtime, this cache persists for the lifetime of the edge function isolate.
let cachedAgentEndpoint: string | null = null;
let cachedAgentKey: string | null = null;

async function discoverAgent(agentUuid: string, doToken: string) {
  if (cachedAgentEndpoint && cachedAgentKey) {
    return { endpoint: cachedAgentEndpoint, key: cachedAgentKey };
  }

  const doApiBase = process.env.DO_API_BASE || 'https://api.digitalocean.com';
  const headers = {
    'Authorization': `Bearer ${doToken}`,
    'Content-Type': 'application/json'
  };

  // 1. Get agent deployment URL
  const agentRes = await fetch(`${doApiBase}/v2/gen-ai/agents/${agentUuid}`, { headers });
  if (!agentRes.ok) {
    throw new Error(`Failed to fetch agent details: ${await agentRes.text()}`);
  }
  const agentData = await agentRes.json();
  const deployUrl = agentData.agent?.deployment?.url;
  
  if (!deployUrl) {
    throw new Error('Agent has no deployment URL. Ensure it is deployed successfully.');
  }

  const endpoint = `${deployUrl}/api/v1/chat/completions`;

  // 2. Create an API key
  const keyRes = await fetch(`${doApiBase}/v2/gen-ai/agents/${agentUuid}/api_keys`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: 'nexora-chat-route-' + Date.now() })
  });

  if (!keyRes.ok) {
    throw new Error(`Failed to create agent API key: ${await keyRes.text()}`);
  }
  const keyData = await keyRes.json();
  const key = keyData.api_key_info?.secret_key;

  if (!key) {
    throw new Error('Failed to extract secret_key from DO API response.');
  }

  // Update cache
  cachedAgentEndpoint = endpoint;
  cachedAgentKey = key;

  return { endpoint, key };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const doToken = process.env.DO_API_TOKEN;
    const agentUuid = process.env.AGENT_UUID;
    
    // Fallbacks if they already have an endpoint/key directly
    const directEndpoint = process.env.DO_AGENT_ENDPOINT;
    const directKey = process.env.DO_AGENT_KEY;

    let endpoint: string;
    let apiKey: string;

    if (directEndpoint && directKey) {
      endpoint = directEndpoint;
      apiKey = directKey;
    } else {
      if (!doToken || !agentUuid) {
        return new Response(
          JSON.stringify({ error: "Missing DigitalOcean GenAI credentials (DO_API_TOKEN, AGENT_UUID)." }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      const discovered = await discoverAgent(agentUuid, doToken);
      endpoint = discovered.endpoint;
      apiKey = discovered.key;
    }

    // Format messages for OpenAI-compatible endpoint
    const doMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'assistant', // ensure standard roles
      content: m.content || m.parts?.[0]?.text || ''
    }));

    const payload = {
      messages: doMessages,
      stream: true, // we want to stream the response back
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
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
    console.error("DO Agent API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process chat request via DO Agent." }), { status: 500 });
  }
}
