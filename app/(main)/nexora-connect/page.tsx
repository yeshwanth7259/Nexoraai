"use client";

import React, { useState } from "react";
import { 
  Globe, Sparkles, CheckCircle2, AlertCircle, Loader2, 
  Copy, Check, MessageSquare, ExternalLink, Code2, Bot 
} from "lucide-react";

export default function NexoraConnectPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentData, setAgentData] = useState<{ agentId: string; chunkCount: number; siteUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ role: string; content: string }>>([]);
  const [isChatting, setIsChatting] = useState(false);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setAgentData(null);
    setChatLog([]);

    // Generate clean unique project ID automatically
    const generatedId = `agent_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), projectId: generatedId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze website.");
      }

      setAgentData({
        agentId: generatedId,
        chunkCount: data.chunkCount || 0,
        siteUrl: url.trim()
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const embedSnippet = agentData 
    ? `<script src="https://${typeof window !== 'undefined' ? window.location.host : 'your-domain.com'}/widget.js" data-agent-id="${agentData.agentId}" defer></script>`
    : "";

  const handleCopyCode = () => {
    if (!embedSnippet) return;
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessage.trim() || !agentData || isChatting) return;

    const userMsg = testMessage;
    setTestMessage("");
    setChatLog(prev => [...prev, { role: "user", content: userMsg }]);
    setIsChatting(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMsg }],
          projectId: agentData.agentId,
        })
      });
      const data = await res.json();
      setChatLog(prev => [...prev, { role: "assistant", content: data.text || "I found no data on that topic." }]);
    } catch {
      setChatLog(prev => [...prev, { role: "assistant", content: "Error connecting to your website agent." }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-200 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Title Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono">
            <Bot size={14} />
            <span>NEXORA AGENT STUDIO</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Create an AI Agent for Any Website
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Type in any URL. Nexora reads the content and gives you a 1-line embed code to add a 24/7 AI Assistant to that website.
          </p>
        </div>

        {/* Step 1: Input URL */}
        <div className="bg-[#0D1424] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <form onSubmit={handleIngest} className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Enter Website URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourbusiness.com"
                required
                disabled={isLoading}
                className="flex-1 bg-[#070B14] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Learning Website...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Create My Chatbot</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 2: Agent Ready Screen (Easy & Actionable) */}
        {agentData && (
          <div className="space-y-6">
            
            {/* Success Card with Embed Code */}
            <div className="bg-gradient-to-b from-[#0D1B2A] to-[#0D1424] border border-sky-500/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Your AI Agent is Ready!</h3>
                  <p className="text-xs text-slate-400">Learned from <span className="text-sky-400 font-mono">{agentData.siteUrl}</span></p>
                </div>
              </div>

              {/* 1-Line Embed Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Code2 size={14} className="text-sky-400" />
                    Paste this snippet before &lt;/body&gt; on your website:
                  </label>
                  <button
                    onClick={handleCopyCode}
                    className="text-xs flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy Snippet"}
                  </button>
                </div>
                <div className="p-3.5 bg-[#070B14] border border-slate-800 rounded-xl font-mono text-xs text-sky-300 overflow-x-auto select-all">
                  {embedSnippet}
                </div>
              </div>
            </div>

            {/* Live Interactive Test Playground */}
            <div className="bg-[#0D1424] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <MessageSquare size={16} className="text-purple-400" />
                <span>Test Your New Website Agent</span>
              </div>

              {/* Chat Log Window */}
              <div className="h-48 overflow-y-auto bg-[#070B14] border border-slate-800/80 rounded-xl p-4 space-y-3 text-xs">
                {chatLog.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 italic">
                    Ask something about your website (e.g. "What services do you offer?")
                  </div>
                ) : (
                  chatLog.map((c, i) => (
                    <div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-2.5 rounded-xl ${c.role === "user" ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-200 border border-slate-700"}`}>
                        {c.content}
                      </div>
                    </div>
                  ))
                )}
                {isChatting && <div className="text-slate-500 italic">Agent is checking website knowledge...</div>}
              </div>

              {/* Test Input Form */}
              <form onSubmit={handleTestChat} className="flex gap-2">
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Ask your new agent a question..."
                  className="flex-1 bg-[#070B14] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={isChatting || !testMessage.trim()}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl disabled:opacity-40"
                >
                  Send Test
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
