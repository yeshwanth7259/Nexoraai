"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "../utils/supabase/client";
import { 
  Plus, Trash2, Code2, GraduationCap, 
  Check, User, Globe, Menu, X, ArrowUp, Bot, Loader2, Sparkles
} from "lucide-react";

const supabase = createClient();

export default function NexoraApp() {
  const [activeTab, setActiveTab] = useState<"chat" | "pricing">("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (authMode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
      else setAuthModalOpen(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
      else setAuthModalOpen(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const sendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

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
    <div className="flex h-screen bg-white text-slate-800 font-sans overflow-hidden">
      
      {/* ─── SIDEBAR (Claude Aesthetic) ───────────────────────── */}
      <aside className={`${sidebarOpen ? "w-[260px]" : "w-0"} bg-[#f9f8f6] border-r border-[#e5e3db] flex flex-col transition-all duration-300 overflow-hidden shrink-0`}>
        <div className="p-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="p-2 hover:bg-[#eae8df] rounded-lg transition text-slate-600 md:hidden"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-3 pb-2">
          <button 
            onClick={() => { setMessages([]); setActiveTab("chat"); }}
            className="w-full flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium py-2.5 px-3 rounded-xl border border-[#e5e3db] shadow-sm transition"
          >
            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Plus size={14} strokeWidth={2.5} />
            </div>
            New chat
          </button>
        </div>

        <div className="px-4 py-2 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Chats
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {messages.length > 0 && (
            <div className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#eae8df] text-sm text-slate-700 cursor-pointer transition">
              <span className="truncate max-w-[160px]">{messages[0]?.content.slice(0, 24)}...</span>
              <button onClick={() => setMessages([])} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={14} /></button>
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="mb-2">
             <button 
                onClick={() => setActiveTab("pricing")} 
                className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#eae8df] text-sm text-slate-700 transition"
              >
                <Sparkles size={16} strokeWidth={1.5} className="text-orange-500" />
                Upgrade Plan
             </button>
          </div>
          
          <div className="border-t border-[#e5e3db] pt-2">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">
                    {user.email?.[0]}
                  </div>
                  <div className="text-sm font-medium truncate max-w-[110px] text-slate-700">{user.email?.split('@')[0]}</div>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 p-1"><User size={16} strokeWidth={1.5} /></button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)} 
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2 rounded-xl transition shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-10 bg-gradient-to-b from-white/90 to-transparent">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition">
                <Menu size={20} strokeWidth={1.5} />
              </button>
            )}
            <span className="font-serif text-lg font-semibold tracking-tight text-slate-800 ml-1">
              Nexora<span className="text-orange-500">.</span>
            </span>
          </div>
        </header>

        {/* Tab 1: Chat View (Claude Style) */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto w-full">
              <div className="pt-16 px-4 md:px-8 pb-32 max-w-3xl w-full mx-auto">
                
                {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl font-serif text-slate-800 tracking-tight flex items-center justify-center gap-3">
                      <Sparkles className="text-orange-400" size={32} strokeWidth={1.5} />
                      Good morning
                    </h1>
                  </div>
                  
                  <div className="w-full max-w-2xl mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={() => sendMessage("Help me debug a complex SQL query that is timing out.")} className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition shadow-sm hover:shadow-md">
                      <Code2 className="text-slate-400 mb-3" size={20} strokeWidth={1.5} />
                      <div className="text-sm font-medium text-slate-700">Database Debugging</div>
                      <div className="text-xs text-slate-500 mt-1">Fix SQL bottlenecks instantly</div>
                    </button>
                    <button onClick={() => sendMessage("Explain the concepts of quantum entanglement clearly.")} className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition shadow-sm hover:shadow-md">
                      <GraduationCap className="text-slate-400 mb-3" size={20} strokeWidth={1.5} />
                      <div className="text-sm font-medium text-slate-700">Academic Concepts</div>
                      <div className="text-xs text-slate-500 mt-1">Master difficult subjects</div>
                    </button>
                  </div>
                </div>
              )}

              {messages.map((m, idx) => (
                <div key={idx} className="mb-8 flex flex-col">
                  {m.role === "user" ? (
                    <div className="self-end max-w-[85%]">
                      <div className="bg-slate-100 rounded-2xl px-5 py-3.5 text-[15px] text-slate-800 leading-relaxed shadow-sm">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 self-start max-w-full">
                      <div className="w-8 h-8 rounded-full bg-[#E5D5C5] flex items-center justify-center shrink-0 mt-1 shadow-sm border border-[#D5C5B5]">
                        <Bot size={18} className="text-orange-900" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 pt-1 text-[15px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {m.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 self-start max-w-full">
                  <div className="w-8 h-8 rounded-full bg-[#E5D5C5] flex items-center justify-center shrink-0 mt-1 shadow-sm border border-[#D5C5B5]">
                     <Loader2 size={16} className="text-orange-900 animate-spin" />
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-10" />
              </div>
            </div>

            {/* Floating Input (Claude Style) */}
            <div className="absolute bottom-6 left-0 right-0 px-4 pointer-events-none">
              <div className="max-w-3xl mx-auto relative pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl bg-white border border-slate-200 p-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask anything..."
                  className="w-full bg-transparent resize-none min-h-[44px] max-h-32 py-2.5 px-3 text-[15px] text-slate-800 placeholder-slate-400 focus:outline-none"
                  rows={1}
                />
                <div className="flex items-center justify-between pt-2 px-2 pb-1">
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition">
                      <Plus size={18} strokeWidth={2} />
                    </button>
                  </div>
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white disabled:bg-slate-200 disabled:text-slate-400 transition"
                  >
                    <ArrowUp size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              <div className="text-center mt-2 text-[11px] text-slate-400">
                Nexora AI can make mistakes. Verify important information.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pricing View (ChatGPT Style) */}
        {activeTab === "pricing" && (
          <div className="flex-1 overflow-y-auto bg-white pt-16 px-4 pb-20">
            <button onClick={() => setActiveTab("chat")} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition">
              <X size={24} strokeWidth={1.5} />
            </button>
            <div className="max-w-[1000px] mx-auto pt-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-semibold text-slate-900">Upgrade your plan</h2>
              </div>

              {/* Billing Toggle */}
              <div className="flex justify-center mb-12">
                <div className="bg-slate-100 p-1 rounded-full flex items-center">
                  <button 
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${billingCycle === "monthly" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}
                  >
                    Personal
                  </button>
                  <button 
                    onClick={() => setBillingCycle("yearly")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${billingCycle === "yearly" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}
                  >
                    Business
                  </button>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Basic */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 flex flex-col h-full border border-slate-200">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">Free</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-semibold text-slate-900">₹0</span>
                    <span className="text-sm text-slate-500 font-medium">/ month</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-6">Explore the basics of Nexora AI</p>
                  
                  <button className="w-full py-3 rounded-full bg-slate-100 text-slate-400 font-medium text-sm mb-8 cursor-default">
                    Your current plan
                  </button>

                  <ul className="space-y-4 text-sm text-slate-700 flex-1">
                    <li className="flex items-start gap-3"><Sparkles size={18} className="text-slate-400 shrink-0" /> Core AI model</li>
                    <li className="flex items-start gap-3"><Check size={18} className="text-slate-400 shrink-0" /> Standard response speed</li>
                    <li className="flex items-start gap-3"><Check size={18} className="text-slate-400 shrink-0" /> Basic web search</li>
                  </ul>
                </div>

                {/* Pro */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 flex flex-col h-full border-2 border-orange-500 relative shadow-xl shadow-orange-500/5">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Popular
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">Plus</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-semibold text-slate-900">{billingCycle === "monthly" ? "₹199" : "₹1,000"}</span>
                    <span className="text-sm text-slate-500 font-medium">/ {billingCycle === "monthly" ? "month" : "year"}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-6">Unlock the full experience</p>
                  
                  <button className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm mb-8 transition shadow-sm">
                    Upgrade to Plus
                  </button>

                  <ul className="space-y-4 text-sm text-slate-700 flex-1">
                    <li className="flex items-start gap-3"><Sparkles size={18} className="text-orange-500 shrink-0" /> Advanced Claude 3.5 Sonnet</li>
                    <li className="flex items-start gap-3"><Check size={18} className="text-slate-700 shrink-0" /> Faster response speed</li>
                    <li className="flex items-start gap-3"><Check size={18} className="text-slate-700 shrink-0" /> Advanced data analysis</li>
                    <li className="flex items-start gap-3"><Check size={18} className="text-slate-700 shrink-0" /> Early access to new features</li>
                  </ul>
                </div>

                {/* Ultra Pro */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 flex flex-col h-full border border-slate-200">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">Pro</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-semibold text-slate-900">{billingCycle === "monthly" ? "₹499" : "₹3,000"}</span>
                    <span className="text-sm text-slate-500 font-medium">/ {billingCycle === "monthly" ? "month" : "year"}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-6">Maximize your productivity</p>
                  
                  <button className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm mb-8 transition shadow-sm">
                    Upgrade to Pro
                  </button>
                  
                  <div className="text-xs font-semibold text-slate-900 mb-4 uppercase tracking-wider">Everything in Plus, and:</div>
                  <ul className="space-y-4 text-sm text-slate-700 flex-1">
                    <li className="flex items-start gap-3"><Check size={18} className="text-slate-900 shrink-0" /> Highest message limits</li>
                    <li className="flex items-start gap-3"><Check size={18} className="text-slate-900 shrink-0" /> Priority API access</li>
                    <li className="flex items-start gap-3"><Check size={18} className="text-slate-900 shrink-0" /> Dedicated support team</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── AUTHENTICATION MODAL (Professional Minimal) ─────── */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-[400px] w-full p-8 relative">
            <button onClick={() => setAuthModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
              <X size={20} strokeWidth={1.5} />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif font-semibold text-slate-900">{authMode === "login" ? "Welcome back" : "Create an account"}</h3>
              <p className="text-sm text-slate-500 mt-2">
                {authMode === "login" ? "Enter your details to sign in." : "Start your journey with Nexora AI."}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-sm"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-sm"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 rounded-lg transition shadow-sm mt-2">
                {authMode === "login" ? "Continue" : "Sign up"}
              </button>
            </form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button 
              onClick={handleGoogleLogin} 
              className="w-full bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium py-2.5 rounded-lg border border-slate-300 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Globe size={16} /> Continue with Google
            </button>

            <div className="text-center text-sm text-slate-600 mt-6">
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} className="text-orange-600 hover:text-orange-700 font-medium transition">
                {authMode === "login" ? "Sign up" : "Log in"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}