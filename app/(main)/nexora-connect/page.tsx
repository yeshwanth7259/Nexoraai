"use client";

import { useState } from "react";
import { Bot, Globe, ShieldCheck, Cpu, ArrowRight, Loader2, Database, AlertCircle, CheckCircle2 } from "lucide-react";

export default function NexoraConnectPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setStatus({ type: "error", message: "Please provide a website URL to analyze." });
      return;
    }

    setIsLoading(true);
    setStatus({ type: "idle", message: "" });
    
    // Auto-generate a unique project ID behind the scenes
    const generatedProjectId = `agent_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, projectId: generatedProjectId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process the URL.");
      }

      setStatus({ 
        type: "success", 
        message: `${data.message} Your Agent ID is: ${generatedProjectId}` 
      });
      setUrl("");
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Globe className="h-8 w-8 text-blue-500" />
            Nexora Connect
          </h2>
          <p className="text-muted-foreground mt-2">
            Deploy autonomous agents. Scrape websites and vectorize knowledge directly into your AI ecosystem.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Database className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Knowledge Ingestion Pipeline</h3>
              <p className="text-sm text-gray-400">RAG (Retrieval-Augmented Generation)</p>
            </div>
          </div>

          <form onSubmit={handleIngest} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium text-gray-300">
                Target Website URL
              </label>
              <input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">We will automatically generate a unique agent ID for this website.</p>
            </div>

            {status.type === "error" && (
              <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm">{status.message}</p>
              </div>
            )}

            {status.type === "success" && (
              <div className="p-4 rounded-md bg-green-500/10 border border-green-500/20 flex items-start gap-3 text-green-400">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm">{status.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scraping & Vectorizing...
                </>
              ) : (
                <>
                  <Cpu className="mr-2 h-4 w-4" />
                  Analyze & Embed Website
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-purple-400" />
              How it works
            </h3>
            <ol className="relative border-l border-gray-700 ml-3 space-y-6">
              <li className="pl-6">
                <span className="absolute -left-[9px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gray-800 ring-4 ring-black">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </span>
                <h4 className="text-sm font-semibold text-gray-200">Scrape & Clean</h4>
                <p className="text-xs text-gray-400 mt-1">Strips out HTML and CSS, extracting only pure, readable text from the target URL.</p>
              </li>
              <li className="pl-6">
                <span className="absolute -left-[9px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gray-800 ring-4 ring-black">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                </span>
                <h4 className="text-sm font-semibold text-gray-200">Chunk & Embed</h4>
                <p className="text-xs text-gray-400 mt-1">Breaks text into chunks and converts them into 768-dimensional vectors using Google Gemini AI.</p>
              </li>
              <li className="pl-6">
                <span className="absolute -left-[9px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gray-800 ring-4 ring-black">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </span>
                <h4 className="text-sm font-semibold text-gray-200">Vector Storage</h4>
                <p className="text-xs text-gray-400 mt-1">Saves the knowledge to Supabase pgvector, ready for instant semantic retrieval.</p>
              </li>
            </ol>
          </div>
          
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Production Ready
            </h3>
            <p className="text-sm text-gray-400">
              This pipeline uses your Service Role key to securely bypass RLS and write directly to your vector database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
