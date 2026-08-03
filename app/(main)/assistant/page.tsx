"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Plus, Mic, User, Bot, Loader2, X, File as FileIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AttachmentMenu } from "@/components/chat/attachment-menu";
import { motion, AnimatePresence } from "framer-motion";
import { parseFileToText } from "@/utils/file-parser";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';


export default function AssistantPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? null;
  const hasInitialized = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const sendMessage = async (msg: { role: string; content: string }) => {
    const newMessages = [...messages, msg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, userPlan: "basic" }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "API Error");
      }
      if (!res.body) throw new Error("No response body");

      const contentType = res.headers.get("content-type") || "";
      
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      
      if (contentType.includes("text/plain")) {
        const text = await res.text();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = text;
          return updated;
        });
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantReply = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.trim() === "") continue;
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6).trim();
              if (dataStr === "[DONE]") continue;
              try {
                const data = JSON.parse(dataStr);
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                  assistantReply += data.candidates[0].content.parts[0].text;
                }
              } catch (e) {
                // Ignore partial JSON blocks across chunks
              }
            }
          }

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content = assistantReply;
            return updated;
          });
        }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      const pendingFileText = sessionStorage.getItem('nexora_pending_file_text');
      const pendingFileName = sessionStorage.getItem('nexora_pending_file_name');
      
      if (pendingFileText || initialQuery) {
        hasInitialized.current = true;
        let queryContent = initialQuery || "Please analyze the attached file.";
        
        if (pendingFileText && pendingFileName) {
          queryContent = `[Attached File: ${pendingFileName}]\n\n${pendingFileText}\n\nUser Query: ${queryContent}`;
          sessionStorage.removeItem('nexora_pending_file_text');
          sessionStorage.removeItem('nexora_pending_file_name');
        }
        
        sendMessage({ role: "user", content: queryContent });
      }
    }
  }, [initialQuery]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleFormSubmit = async () => {
    if (!input.trim() && !attachedFile) return;
    if (isLoading) return;

    let finalQuery = input.trim() || "Please analyze the attached file.";
    
    if (attachedFile) {
      try {
        const text = await parseFileToText(attachedFile);
        finalQuery = `[Attached File: ${attachedFile.name}]\n\n${text}\n\nUser Query: ${finalQuery}`;
      } catch (err) {
        console.error("Failed to read file", err);
      }
      setAttachedFile(null);
    }
    
    sendMessage({ role: "user", content: finalQuery });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full relative">
      <div className="flex-1 overflow-y-auto pb-32 pt-8 hide-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(109,91,255,0.4)] animate-in zoom-in duration-500">
              <Sparkles size={32} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-2">
              How can I help you build today?
            </h1>
            <p className="text-textMuted max-w-lg mb-10 text-lg animate-in fade-in slide-in-from-bottom-3">
              I'm your universal AI assistant. I can design websites, optimize SEO, manage your CRM, and deploy apps. 
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
              <SuggestionCard title="Build a CRM" desc="for my real estate agency" icon="👥" onClick={() => sendMessage({ role: 'user', content: 'Build a CRM for my real estate agency' })} />
              <SuggestionCard title="Generate a Landing Page" desc="for a new SaaS product" icon="🌐" onClick={() => sendMessage({ role: 'user', content: 'Generate a Landing Page for a new SaaS product' })} />
              <SuggestionCard title="Run an SEO Audit" desc="on my main competitor" icon="📈" onClick={() => sendMessage({ role: 'user', content: 'Run an SEO Audit on my main competitor' })} />
              <SuggestionCard title="Deploy my React app" desc="to Vercel with preview URLs" icon="🚀" onClick={() => sendMessage({ role: 'user', content: 'Deploy my React app to Vercel with preview URLs' })} />
            </div>
          </div>
        ) : (
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
                    <div className="flex-1 pt-1 text-[15px] text-foreground leading-relaxed whitespace-pre-wrap">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <div className="rounded-lg overflow-hidden my-4 border border-borders shadow-lg">
                                <div className="bg-bgDarker px-4 py-2 text-xs text-textMuted border-b border-borders flex items-center justify-between">
                                  <span>{match[1]}</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                    className="hover:text-white transition-colors flex items-center gap-1.5"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    Copy
                                  </button>
                                </div>
                                <SyntaxHighlighter
                                  {...props}
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{ margin: 0, background: '#1e1e1e', padding: '1rem', fontSize: '0.85rem' }}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code {...props} className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-pink-300 font-mono">
                                {children}
                              </code>
                            )
                          },
                          p: ({children}) => <p className="mb-4 last:mb-0 leading-relaxed text-foreground">{children}</p>,
                          h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white">{children}</h1>,
                          h2: ({children}) => <h2 className="text-xl font-bold mb-3 mt-5 text-white">{children}</h2>,
                          h3: ({children}) => <h3 className="text-lg font-bold mb-3 mt-4 text-white">{children}</h3>,
                          ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-foreground">{children}</ol>,
                          li: ({children}) => <li className="leading-relaxed">{children}</li>,
                          a: ({children, href}) => <a href={href} className="text-primary hover:underline" target="_blank" rel="noreferrer">{children}</a>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 bg-primary/5 rounded-r-lg italic text-textMuted">{children}</blockquote>,
                          img: ({node, ...props}) => (
                            <span className="relative group/image inline-block max-w-sm my-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img className="rounded-lg w-full border border-slate-700 shadow-lg object-cover" alt="Generated" {...props} />
                              <span className="absolute top-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                                <button 
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    try {
                                      const res = await fetch(props.src as string);
                                      const blob = await res.blob();
                                      const url = window.URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.style.display = 'none';
                                      a.href = url;
                                      a.download = `nexora-image-${Date.now()}.jpg`;
                                      document.body.appendChild(a);
                                      a.click();
                                      window.URL.revokeObjectURL(url);
                                    } catch (err) {
                                      window.open(props.src as string, '_blank');
                                    }
                                  }}
                                  className="bg-black/60 hover:bg-black/80 backdrop-blur text-white px-3 py-1.5 rounded-lg transition shadow-lg flex items-center gap-1.5 text-xs font-medium border border-borders"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                  Download
                                </button>
                              </span>
                            </span>
                          )
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
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
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit();
          }} 
          className="max-w-3xl mx-auto relative group flex flex-col gap-2"
        >
          {/* File Preview Area for Assistant */}
          <AnimatePresence>
            {attachedFile && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-2"
              >
                <div className="relative inline-flex items-center gap-3 bg-white/5 border border-borders rounded-xl p-2 pr-4 backdrop-blur-md">
                  <button 
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 hover:bg-red-500 text-white flex items-center justify-center transition z-10"
                  >
                    <X size={12} />
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
                      <FileIcon size={20} />
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-white max-w-[150px] truncate">
                      {attachedFile.name}
                    </span>
                    <span className="text-[10px] text-textMuted">
                      {(attachedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-focus-within:bg-primary/30 transition-all duration-300 pointer-events-none mt-[auto]"></div>
          <div className="relative glass-panel rounded-2xl border border-borders flex items-end p-2 bg-background/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="mb-0.5 ml-1">
              <AttachmentMenu 
                direction="up" 
                onFileSelect={(file) => setAttachedFile(file)} 
                onAction={(action) => setInput(`[${action}] ` + input)}
              />
            </div>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              onPaste={(e) => {
                const items = Array.from(e.clipboardData.items);
                const fileItem = items.find(item => item.kind === 'file');
                if (fileItem) {
                  const file = fileItem.getAsFile();
                  if (file) {
                    setAttachedFile(file);
                    e.preventDefault();
                  }
                }
              }}
              placeholder="Ask Nexora to build, design, or analyze anything..."
              className="flex-1 max-h-40 min-h-[44px] bg-transparent border-none text-white focus:ring-0 resize-none px-3 py-3 focus:outline-none placeholder:text-textMuted"
              rows={1}
            />
            <button type="button" className="p-3 text-textMuted hover:text-white hover:bg-white/5 rounded-xl transition mb-0.5">
              <Mic size={20} />
            </button>
            <button 
              type="submit"
              disabled={(!input.trim() && !attachedFile) || isLoading}
              className={`p-3 rounded-xl transition mb-0.5 ml-1 ${
                (input.trim().length > 0 || attachedFile) && !isLoading
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(109,91,255,0.4)]" 
                  : "bg-white/5 text-textMuted"
              }`}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-textMuted mt-3 font-medium">
            Nexora AI can make mistakes. Consider verifying important information.
          </p>
        </form>
      </div>
    </div>
  );
}

function SuggestionCard({ title, desc, icon, onClick }: { title: string, desc: string, icon: string, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="glass-panel p-4 rounded-xl border border-borders hover:border-primary/40 hover:bg-white/5 transition text-left cursor-pointer group">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-white font-medium group-hover:text-primary transition">{title}</h3>
      <p className="text-sm text-textMuted">{desc}</p>
    </div>
  );
}
