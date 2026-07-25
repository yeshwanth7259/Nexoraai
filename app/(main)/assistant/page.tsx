"use client";

import { useState } from "react";
import { Send, Sparkles, Plus, Mic, Paperclip } from "lucide-react";

export default function AssistantPage() {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full relative">
      <div className="flex-1 overflow-y-auto pb-32 pt-8 hide-scrollbar">
        {/* Initial Empty State */}
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(109,91,255,0.4)] animate-in zoom-in duration-500">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-2">
            How can I help you build today?
          </h1>
          <p className="text-slate-400 max-w-lg mb-10 text-lg animate-in fade-in slide-in-from-bottom-3">
            I'm your universal AI assistant. I can design websites, optimize SEO, manage your CRM, and deploy apps. 
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
            <SuggestionCard title="Build a CRM" desc="for my real estate agency" icon="👥" />
            <SuggestionCard title="Generate a Landing Page" desc="for a new SaaS product" icon="🌐" />
            <SuggestionCard title="Run an SEO Audit" desc="on my main competitor" icon="📈" />
            <SuggestionCard title="Deploy my React app" desc="to Vercel with preview URLs" icon="🚀" />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-focus-within:bg-primary/30 transition-all duration-300"></div>
          <div className="relative glass-panel rounded-2xl border border-white/10 flex items-end p-2 bg-background/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition">
              <Plus size={20} />
            </button>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nexora to build, design, or analyze anything..."
              className="flex-1 max-h-40 min-h-[44px] bg-transparent border-none text-white focus:ring-0 resize-none px-2 py-3 focus:outline-none placeholder:text-slate-500"
              rows={1}
            />
            <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition mb-0.5">
              <Mic size={20} />
            </button>
            <button 
              className={`p-3 rounded-xl transition mb-0.5 ml-1 ${
                input.trim().length > 0 
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(109,91,255,0.4)]" 
                  : "bg-white/5 text-slate-500"
              }`}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 mt-3 font-medium">
            Nexora AI can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-primary/40 hover:bg-white/5 transition text-left cursor-pointer group">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-white font-medium group-hover:text-primary transition">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}
