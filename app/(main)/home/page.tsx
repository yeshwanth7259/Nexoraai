"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Code, Search, PenTool, Zap, Globe, Mic, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Greeting logic
  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 18) setGreeting("Good afternoon");
    else if (hour >= 18) setGreeting("Good evening");
  }, []);

  // Chat State
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    setIsLoading(true);

    if (user) {
      // Authenticated user: Create chat in DB and redirect
      const supabase = createClient();
      const title = textToSend.length > 40 ? textToSend.substring(0, 40) + '...' : textToSend;
      
      const { data: chat, error } = await supabase.from('chats').insert({
        user_id: user.id,
        title: title,
      }).select('id').single();

      if (chat) {
        router.push(`/chats/${chat.id}?q=${encodeURIComponent(textToSend)}`);
        return;
      } else {
        console.error("Failed to create chat", error);
      }
    }

    // Unauthenticated fallback: Local chat only
    const newMessages = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setInput("");
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, userPlan: "basic" }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantReply += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = assistantReply;
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection error. Please verify your network and retry." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full max-w-4xl mx-auto py-10 relative pb-32">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          {/* Dynamic Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-highlight text-sm font-medium tracking-widest uppercase mb-6 bg-highlight/10 px-4 py-1.5 rounded-full border border-highlight/20 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
          >
            {greeting}{user ? `, ${user.email?.split('@')[0]}` : ''}
          </motion.div>

          {/* Animated AI Core */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex items-center justify-center mb-8"
          >
            {/* Pulsing rings */}
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-32 h-32 rounded-full border border-primary blur-[2px]"
            />
            <motion.div 
              animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-32 h-32 rounded-full border border-accent blur-[4px]"
            />
            {/* Solid Core */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-highlight via-primary to-accent shadow-[0_0_40px_rgba(109,91,255,0.8)] z-10 flex items-center justify-center">
              <Sparkles className="text-white w-6 h-6" />
            </div>
          </motion.div>

          {/* Minimalist Typography */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center space-y-4 mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              NEXORA
            </h1>
            <p className="text-xl text-highlight font-medium tracking-wide">
              Your AI Operating System
            </p>
          </motion.div>

          {/* Futuristic Tiles */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
            <ActionTile icon={Code} label="Build" delay={0} onClick={() => sendMessage("Help me build a new software architecture.")} />
            <ActionTile icon={Search} label="Research" delay={0.1} onClick={() => sendMessage("Research the latest trends in quantum computing.")} />
            <ActionTile icon={PenTool} label="Create" delay={0.2} onClick={() => sendMessage("Create a marketing strategy for a new tech product.")} />
            <ActionTile icon={Zap} label="Automate" delay={0.3} onClick={() => sendMessage("Write a script to automate my daily data entry tasks.")} />
          </motion.div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto w-full">
          {messages.map((m, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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
            </motion.div>
          ))}
          {isLoading && (
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

      {/* ─── FLOATING GLASS PROMPT BAR ────────────────────────────────────── */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-10 left-0 right-0 flex justify-center px-4 z-40 pointer-events-none md:pl-[280px]" // Added md:pl-[280px] to offset for sidebar on desktop
      >
        <div className="pointer-events-auto w-full max-w-3xl glass-panel rounded-[2rem] p-2 flex items-center gap-2 shadow-[0_20px_60px_-15px_rgba(109,91,255,0.3)] transition-all duration-300 focus-within:shadow-[0_20px_60px_-10px_rgba(0,229,255,0.4)] focus-within:border-highlight/50 bg-[#060816]/60 backdrop-blur-xl">
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0">
            <Globe size={18} />
          </button>
          
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask Nexora anything..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-[15px] py-3 px-2"
          />
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0">
            <Mic size={18} />
          </button>
          
          <button 
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 rounded-full bg-primary hover:bg-accent text-white flex items-center justify-center transition shadow-[0_0_15px_rgba(109,91,255,0.5)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed shrink-0 ml-1"
          >
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ActionTile({ icon: Icon, label, delay, onClick }: { icon: any, label: string, delay: number, onClick?: () => void }) {
  return (
    <motion.button 
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-white hover:border-primary/50 transition-colors group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 z-10">
        <Icon size={24} className="group-hover:text-highlight transition-colors" />
      </div>
      <span className="font-semibold tracking-wide z-10">{label}</span>
    </motion.button>
  );
}
