"use client";

import { useEffect, useRef } from "react";
import { Send, Sparkles, Plus, Mic, User, Bot, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";

export default function AssistantPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? null;
  const hasInitialized = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: "/api/chat",
    body: { userPlan: "basic" },
  });

  useEffect(() => {
    if (initialQuery && !hasInitialized.current) {
      hasInitialized.current = true;
      append({ role: "user", content: initialQuery });
    }
  }, [initialQuery, append]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full relative">
      <div className="flex-1 overflow-y-auto pb-32 pt-8 hide-scrollbar">
        {messages.length === 0 ? (
          /* Initial Empty State */
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
              <SuggestionCard title="Build a CRM" desc="for my real estate agency" icon="👥" onClick={() => append({ role: 'user', content: 'Build a CRM for my real estate agency' })} />
              <SuggestionCard title="Generate a Landing Page" desc="for a new SaaS product" icon="🌐" onClick={() => append({ role: 'user', content: 'Generate a Landing Page for a new SaaS product' })} />
              <SuggestionCard title="Run an SEO Audit" desc="on my main competitor" icon="📈" onClick={() => append({ role: 'user', content: 'Run an SEO Audit on my main competitor' })} />
              <SuggestionCard title="Deploy my React app" desc="to Vercel with preview URLs" icon="🚀" onClick={() => append({ role: 'user', content: 'Deploy my React app to Vercel with preview URLs' })} />
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="max-w-3xl mx-auto w-full px-4">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`mb-8 flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                {m.role === "user" ? (
                  <div className="max-w-[85%] bg-primary/20 border border-primary/30 rounded-2xl px-5 py-3.5 text-[15px] text-white leading-relaxed shadow-sm backdrop-blur-md">
                    {m.content}
                  </div>
                ) : (
                  <div className="flex gap-4 max-w-full w-full group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(109,91,255,0.5)]">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="flex-1 pt-1 text-[15px] text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-4 self-start max-w-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(109,91,255,0.5)]">
                   <Loader2 size={16} className="text-white animate-spin" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-10" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4">
        <form 
          ref={formRef} 
          onSubmit={handleSubmit} 
          className="max-w-3xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-focus-within:bg-primary/30 transition-all duration-300"></div>
          <div className="relative glass-panel rounded-2xl border border-white/10 flex items-end p-2 bg-background/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <button type="button" className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition">
              <Plus size={20} />
            </button>
            <textarea 
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              placeholder="Ask Nexora to build, design, or analyze anything..."
              className="flex-1 max-h-40 min-h-[44px] bg-transparent border-none text-white focus:ring-0 resize-none px-2 py-3 focus:outline-none placeholder:text-slate-500"
              rows={1}
            />
            <button type="button" className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition mb-0.5">
              <Mic size={20} />
            </button>
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl transition mb-0.5 ml-1 ${
                input.trim().length > 0 && !isLoading
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
        </form>
      </div>
    </div>
  );
}

function SuggestionCard({ title, desc, icon, onClick }: { title: string, desc: string, icon: string, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="glass-panel p-4 rounded-xl border border-white/5 hover:border-primary/40 hover:bg-white/5 transition text-left cursor-pointer group">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-white font-medium group-hover:text-primary transition">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}
