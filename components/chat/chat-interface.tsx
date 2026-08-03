"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, Mic, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/utils/supabase/client";
import { AttachmentMenu } from "@/components/chat/attachment-menu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/chat/code-block";

export function ChatInterface({ 
  chatId, 
  initialMessages = [] 
}: { 
  chatId: string; 
  initialMessages?: any[];
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    // 1. Add User Message to UI
    const userMessage = { role: "user", content: textToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setAttachedFile(null); // Clear the attached file
    setIsLoading(true);

    // 2. Save User Message to DB
    if (user) {
      await supabase.from("messages").insert({
        chat_id: chatId,
        user_id: user.id,
        role: "user",
        content: textToSend,
      });
      // Update chat updated_at
      await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId);
    }

    try {
      // 3. Fetch from API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, userPlan: "basic" }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = "";

      // 4. Add empty assistant message to UI
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantReply += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = { ...updated[lastIndex], content: assistantReply };
          return updated;
        });
      }

      // 5. Save Assistant Reply to DB
      if (user) {
        await supabase.from("messages").insert({
          chat_id: chatId,
          user_id: user.id,
          role: "assistant",
          content: assistantReply,
        });
      }

    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection error. Please verify your network and retry." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // If a URL parameter 'q' is present on first load, consume it
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q && messages.length === 0) {
      // clear the url without reloading
      window.history.replaceState({}, '', `/chats/${chatId}`);
      sendMessage(q);
    }
  }, [chatId]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full relative">
      <div className="flex-1 overflow-y-auto pt-8 pb-32 px-4 scrollbar-hide">
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
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre({ children }) {
                          return <div className="not-prose">{children}</div>;
                        },
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          if (!inline && match) {
                            return (
                              <CodeBlock 
                                language={match[1]} 
                                value={String(children).replace(/\n$/, "")} 
                              />
                            );
                          }
                          return (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 md:gap-4 max-w-full w-full group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(109,91,255,0.5)]">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1 text-[15px] text-slate-200 leading-relaxed">
                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:max-w-full prose-img:rounded-xl prose-img:shadow-lg break-words">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          pre({ children }) {
                            return <div className="not-prose">{children}</div>;
                          },
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || "");
                            if (!inline && match) {
                              return (
                                <CodeBlock 
                                  language={match[1]} 
                                  value={String(children).replace(/\n$/, "")} 
                                />
                              );
                            }
                            return (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
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
      </div>

      {/* Floating Prompt Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-4 md:bottom-10 left-0 right-0 flex justify-center px-4 z-40"
      >
        <div className="w-full max-w-3xl glass-panel rounded-[2rem] p-2 flex flex-col gap-2 shadow-[0_20px_60px_-15px_rgba(109,91,255,0.3)] focus-within:border-highlight/50 bg-[#060816]/60 backdrop-blur-xl">
          
          {/* File Preview Area */}
          <AnimatePresence>
            {attachedFile && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pt-2"
              >
                <div className="relative inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 pr-4">
                  <button 
                    onClick={() => setAttachedFile(null)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 hover:bg-red-500 text-white flex items-center justify-center transition z-10"
                  >
                    <span className="text-[10px]">✕</span>
                  </button>
                  
                  {attachedFile.type.startsWith("image/") ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/50">
                      <img 
                        src={URL.createObjectURL(attachedFile)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold">FILE</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-white max-w-[150px] truncate">
                      {attachedFile.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {(attachedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <AttachmentMenu 
              direction="up" 
              onFileSelect={(file) => setAttachedFile(file)} 
              onAction={(action) => setInput(`[${action}] ` + input)}
            />
            
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
              placeholder="Reply to Nexora..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-[15px] py-3 px-2"
            />
            
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0">
              <Mic size={18} />
            </button>
            
            <button 
              onClick={() => sendMessage()}
              disabled={(!input.trim() && !attachedFile) || isLoading}
              className="w-12 h-12 rounded-full bg-primary hover:bg-accent text-white flex items-center justify-center transition shadow-[0_0_15px_rgba(109,91,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ml-1"
            >
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
