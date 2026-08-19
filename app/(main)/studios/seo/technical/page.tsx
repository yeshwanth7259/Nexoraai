"use client";

import { useState } from "react";
import { Search, AlertCircle, RefreshCw, Zap, CheckCircle, Code, Shield, Globe, Terminal } from "lucide-react";

export default function TechnicalSEOPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async () => {
    if(!url) return;
    setAnalyzing(true);
    setError("");
    
    try {
      const res = await fetch("/api/seo/technical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      
      const result: any = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to analyze");
      }
      
      setData(result.technical);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const StatusIcon = ({ value }: { value: any }) => {
    return value ? (
      <CheckCircle size={18} className="text-green-500" />
    ) : (
      <AlertCircle size={18} className="text-red-500" />
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* ANALYZER TOOL */}
      <div className="w-full bg-background border border-borders rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-hoverBg flex items-center justify-center text-textMuted shrink-0">
          <Terminal size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Enter a URL for a Deep Technical Audit (e.g., https://nexora.ai)..." 
          className="flex-1 bg-transparent border-none text-[15px] outline-none text-foreground placeholder:text-textMuted"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
        />
        <button 
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-6 py-2.5 bg-primary hover:bg-accent rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(109,91,255,0.3)]"
        >
          {analyzing ? (
            <><RefreshCw size={16} className="animate-spin" /> Scanning...</>
          ) : (
            <><Zap size={16} className="text-white" /> Deep Scan</>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
          
          {/* CRAWLABILITY & INDEXING */}
          <div className="bg-background border border-borders rounded-3xl p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Globe size={18} className="text-blue-400" /> Crawlability & Indexing
            </h2>
            <div className="space-y-4">
              
              <div className="flex items-start justify-between p-4 bg-bgDarker border border-borders rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Canonical Tag</p>
                  <p className="text-xs text-textMuted max-w-[250px] truncate">{data.canonical || "No canonical tag found"}</p>
                </div>
                <StatusIcon value={data.canonical} />
              </div>

              <div className="flex items-start justify-between p-4 bg-bgDarker border border-borders rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Robots Meta</p>
                  <p className="text-xs text-textMuted max-w-[250px] truncate">{data.robots || "Not explicitly set (defaults to index, follow)"}</p>
                </div>
                <StatusIcon value={data.robots !== "noindex, nofollow"} />
              </div>
              
              <div className="flex items-start justify-between p-4 bg-bgDarker border border-borders rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">SSL (HTTPS)</p>
                  <p className="text-xs text-textMuted">Secure connection established</p>
                </div>
                <StatusIcon value={data.hasSSL} />
              </div>
              
              <div className="flex items-start justify-between p-4 bg-bgDarker border border-borders rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Language Declaration</p>
                  <p className="text-xs text-textMuted">lang=&quot;{data.language || "Not set"}&quot;</p>
                </div>
                <StatusIcon value={data.language} />
              </div>

            </div>
          </div>

          {/* SOCIAL & STRUCTURED DATA */}
          <div className="bg-background border border-borders rounded-3xl p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Code size={18} className="text-purple-400" /> Social & Structured Data
            </h2>
            <div className="space-y-4">
              
              <div className="flex items-start justify-between p-4 bg-bgDarker border border-borders rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">OpenGraph Title</p>
                  <p className="text-xs text-textMuted max-w-[250px] truncate">{data.ogTitle || "Missing OG Title"}</p>
                </div>
                <StatusIcon value={data.ogTitle} />
              </div>

              <div className="flex items-start justify-between p-4 bg-bgDarker border border-borders rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Twitter Card</p>
                  <p className="text-xs text-textMuted max-w-[250px] truncate">{data.twitterCard || "Missing Twitter Card"}</p>
                </div>
                <StatusIcon value={data.twitterCard} />
              </div>
              
              <div className="flex items-start justify-between p-4 bg-bgDarker border border-borders rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Schema Markup (JSON-LD)</p>
                  <p className="text-xs text-textMuted">{data.schemaMarkupFound ? "Found structured data" : "No JSON-LD structured data found"}</p>
                </div>
                <StatusIcon value={data.schemaMarkupFound} />
              </div>

              <div className="flex items-start justify-between p-4 bg-bgDarker border border-borders rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Mobile Viewport</p>
                  <p className="text-xs text-textMuted max-w-[250px] truncate">{data.viewport || "Missing Viewport Meta"}</p>
                </div>
                <StatusIcon value={data.viewport} />
              </div>

            </div>
          </div>

          <div className="lg:col-span-2">
            <button className="w-full mt-2 py-4 rounded-2xl bg-primary hover:bg-accent text-white font-medium transition shadow-[0_0_20px_rgba(109,91,255,0.4)] flex items-center justify-center gap-2">
               <Zap size={18} /> Fix Missing Tags with AI Assistant
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
