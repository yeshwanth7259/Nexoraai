"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "../utils/supabase/client";
import { 
  FolderOpen, MessageSquare, Briefcase, FileText, Bot, Settings,
  Globe, Mic, ArrowRight, Zap, Code, PenTool, Database, Search, User,
  Sparkles, Terminal, Layers, Plus, X, Loader2, LogOut
} from "lucide-react";

const supabase = createClient();

export default function NexoraOS() {
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Chat State
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // UI State
  const [greeting, setGreeting] = useState("Good morning");
  const [activeWorkspace, setActiveWorkspace] = useState("Website Launch");

  const workspaces = [
    { name: "Website Launch", icon: Globe },
    { name: "Marketing Plan", icon: Briefcase },
    { name: "CRM Development", icon: Terminal },
    { name: "UI Design", icon: PenTool },
    { name: "Analytics", icon: Database },
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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
    await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      }
    });
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative font-sans selection:bg-primary/30">
      <div className="aurora-bg" />

      {/* ─── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="w-[280px] h-full flex flex-col border-r border-borders bg-background/50 backdrop-blur-xl shrink-0 z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        {/* Header / Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 relative flex items-center justify-center cursor-pointer" onClick={() => setMessages([])}>
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-[0_0_8px_rgba(109,91,255,0.8)]">
              <defs>
                <linearGradient id="n-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="50%" stopColor="#6D5BFF" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <path d="M10 30 V10 L30 30 V10" fill="none" stroke="url(#n-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="10" r="3" fill="#00E5FF" />
              <circle cx="30" cy="30" r="3" fill="#A855F7" />
              <circle cx="20" cy="20" r="2" fill="#6D5BFF" />
            </svg>
          </div>
          <span className="font-bold tracking-widest text-lg text-white cursor-pointer" onClick={() => setMessages([])}>NEXORA</span>
        </div>

        {/* Global Navigation */}
        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <nav className="space-y-1 mb-8">
            <NavItem icon={Layers} label="Workspace" active />
            <NavItem icon={MessageSquare} label="Chats" onClick={() => setMessages([])} />
            <NavItem icon={FolderOpen} label="Projects" />
            <NavItem icon={FileText} label="Files" />
            <NavItem icon={Bot} label="Agents" />
            <NavItem icon={Settings} label="Settings" />
          </nav>

          <div className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest flex justify-between items-center">
            <span>Workspaces</span>
            <button className="hover:text-white transition"><Plus size={14}/></button>
          </div>
          <div className="space-y-1">
            {workspaces.map((ws, i) => (
              <div 
                key={i} 
                onClick={() => { setActiveWorkspace(ws.name); setMessages([]); }}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition cursor-pointer group ${activeWorkspace === ws.name ? 'bg-primary/20 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <ws.icon size={16} className={`${activeWorkspace === ws.name ? 'text-primary' : 'text-slate-500 group-hover:text-primary'} transition`} />
                <span className="truncate">{ws.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-borders">
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(109,91,255,0.5)] shrink-0">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="text-sm font-medium text-slate-200 truncate">{user.email?.split('@')[0]}</div>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition p-1 shrink-0">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-accent text-white font-medium text-sm transition shadow-[0_0_15px_rgba(109,91,255,0.3)]"
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* ─── MAIN WORKSPACE CANVAS ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col relative z-0">
        
        {/* Top bar (Search/Profile) */}
        <header className="absolute top-0 right-0 h-16 flex items-center justify-end px-8 gap-6 z-20 w-full bg-gradient-to-b from-background to-transparent pointer-events-none">
          <div className="pointer-events-auto flex gap-6">
             <button className="text-slate-400 hover:text-white transition">
              <Search size={20} />
            </button>
            <button onClick={() => !user && setAuthModalOpen(true)} className="text-slate-400 hover:text-white transition">
              <User size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Canvas Area */}
        <div className="flex-1 overflow-y-auto pt-16 pb-32 px-4 md:px-8 w-full">
          {messages.length === 0 ? (
            /* Central Hub */
            <div className="flex flex-col items-center justify-center min-h-full max-w-4xl mx-auto py-10">
              
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
                  Your AI Workspace
                </p>
                <p className="text-sm text-slate-400 tracking-[0.2em] uppercase">
                  Think • Build • Deploy
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
            /* Chat View */
            <div className="max-w-3xl mx-auto pt-8">
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
        </div>

        {/* ─── FLOATING GLASS PROMPT BAR ────────────────────────────────────── */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center px-4 z-50 pointer-events-none"
        >
          <div className="pointer-events-auto w-full max-w-3xl glass-panel rounded-[2rem] p-2 flex items-center gap-2 shadow-[0_20px_60px_-15px_rgba(109,91,255,0.3)] transition-all duration-300 focus-within:shadow-[0_20px_60px_-10px_rgba(0,229,255,0.4)] focus-within:border-highlight/50 bg-[#060816]/60">
            
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
              placeholder={`Ask Nexora anything in ${activeWorkspace}...`}
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
      </main>

      {/* ─── AUTHENTICATION MODAL (Dark Theme) ───────────────────────── */}
      <AnimatePresence>
        {authModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-panel bg-[#0b0f24]/90 rounded-3xl shadow-2xl max-w-[400px] w-full p-8 relative border border-white/10"
            >
              <button onClick={() => setAuthModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 transition-colors">
                <X size={20} strokeWidth={2} />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                   <User size={24} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{authMode === "login" ? "Welcome back" : "Create an account"}</h3>
                <p className="text-sm text-slate-400 mt-2">
                  {authMode === "login" ? "Enter your details to sign in." : "Start your journey with Nexora OS."}
                </p>
              </div>

              {authError && (
                <div className="mb-6 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-accent text-white font-medium py-3 rounded-xl transition shadow-[0_0_20px_rgba(109,91,255,0.4)] mt-4">
                  {authMode === "login" ? "Continue" : "Sign up"}
                </button>
              </form>

              <div className="relative flex py-6 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-500 font-medium tracking-widest uppercase">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button 
                onClick={handleGoogleLogin} 
                className="w-full bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-3 rounded-xl border border-white/10 transition flex items-center justify-center gap-2"
              >
                <Globe size={18} /> Continue with Google
              </button>

              <div className="text-center text-sm text-slate-400 mt-8">
                {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} className="text-highlight hover:text-white font-medium transition">
                  {authMode === "login" ? "Sign up" : "Log in"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Subcomponents

function NavItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
      active 
        ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_12px_rgba(109,91,255,0.1)]" 
        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
    }`}>
      <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? "text-primary" : ""} />
      <span className="font-medium text-[15px]">{label}</span>
    </div>
  );
}

function ActionTile({ icon: Icon, label, delay, onClick }: { icon: any, label: string, delay: number, onClick: () => void }) {
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