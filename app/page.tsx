"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FolderOpen, MessageSquare, Briefcase, FileText, Bot, Settings,
  Globe, Mic, ArrowRight, Zap, Code, PenTool, Database, Search, User,
  Sparkles, Terminal, Layers
} from "lucide-react";

export default function NexoraOS() {
  const [input, setInput] = useState("");

  const workspaces = [
    { name: "Website Launch", icon: Globe },
    { name: "Marketing Plan", icon: Briefcase },
    { name: "CRM Development", icon: Terminal },
    { name: "UI Design", icon: PenTool },
    { name: "Analytics", icon: Database },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative font-sans selection:bg-primary/30">
      {/* Animated Aurora Background */}
      <div className="aurora-bg" />

      {/* ─── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="w-[280px] h-full flex flex-col border-r border-borders bg-background/50 backdrop-blur-xl shrink-0 z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        {/* Header / Logo */}
        <div className="p-6 flex items-center gap-3">
          {/* Custom N Neural Logo */}
          <div className="w-8 h-8 relative flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-[0_0_8px_rgba(109,91,255,0.8)]">
              <defs>
                <linearGradient id="n-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="50%" stopColor="#6D5BFF" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <path 
                d="M10 30 V10 L30 30 V10" 
                fill="none" 
                stroke="url(#n-grad)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <circle cx="10" cy="10" r="3" fill="#00E5FF" />
              <circle cx="30" cy="30" r="3" fill="#A855F7" />
              <circle cx="20" cy="20" r="2" fill="#6D5BFF" />
            </svg>
          </div>
          <span className="font-bold tracking-widest text-lg text-white">NEXORA</span>
        </div>

        {/* Global Navigation */}
        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <nav className="space-y-1 mb-8">
            <NavItem icon={Layers} label="Workspace" active />
            <NavItem icon={MessageSquare} label="Chats" />
            <NavItem icon={FolderOpen} label="Projects" />
            <NavItem icon={FileText} label="Files" />
            <NavItem icon={Bot} label="Agents" />
            <NavItem icon={Settings} label="Settings" />
          </nav>

          <div className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Workspaces
          </div>
          <div className="space-y-1">
            {workspaces.map((ws, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer group"
              >
                <ws.icon size={16} className="text-slate-500 group-hover:text-primary transition" />
                <span className="truncate">{ws.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-borders">
          <button className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(109,91,255,0.5)]">
                Y
              </div>
              <div className="text-sm font-medium text-slate-200">Yashu</div>
            </div>
          </button>
        </div>
      </aside>

      {/* ─── MAIN WORKSPACE CANVAS ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col relative z-0">
        
        {/* Top bar (Search/Profile) */}
        <header className="h-16 flex items-center justify-end px-8 gap-6 z-10">
          <button className="text-slate-400 hover:text-white transition">
            <Search size={20} />
          </button>
          <button className="text-slate-400 hover:text-white transition">
            <User size={20} />
          </button>
        </header>

        {/* Central Hub */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
          
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
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            <ActionTile icon={Code} label="Build" delay={0} />
            <ActionTile icon={Search} label="Research" delay={0.1} />
            <ActionTile icon={PenTool} label="Create" delay={0.2} />
            <ActionTile icon={Zap} label="Automate" delay={0.3} />
          </motion.div>

        </div>

        {/* ─── FLOATING GLASS PROMPT BAR ────────────────────────────────────── */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center px-4 z-50 pointer-events-none"
        >
          <div className="pointer-events-auto w-full max-w-3xl glass-panel rounded-[2rem] p-2 flex items-center gap-2 shadow-[0_20px_60px_-15px_rgba(109,91,255,0.3)] transition-all duration-300 focus-within:shadow-[0_20px_60px_-10px_rgba(0,229,255,0.4)] focus-within:border-highlight/50">
            
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0">
              <Globe size={18} />
            </button>
            
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nexora anything..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-lg py-3 px-2"
            />
            
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0">
              <Mic size={18} />
            </button>
            
            <button 
              disabled={!input.trim()}
              className="w-12 h-12 rounded-full bg-primary hover:bg-accent text-white flex items-center justify-center transition shadow-[0_0_15px_rgba(109,91,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ml-1"
            >
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>

          </div>
        </motion.div>

      </main>
    </div>
  );
}

// Subcomponents

function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
      active 
        ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_12px_rgba(109,91,255,0.1)]" 
        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
    }`}>
      <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? "text-primary" : ""} />
      <span className="font-medium text-[15px]">{label}</span>
    </div>
  );
}

function ActionTile({ icon: Icon, label, delay }: { icon: any, label: string, delay: number }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-white hover:border-primary/50 transition-colors group relative overflow-hidden"
    >
      {/* Subtle hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 z-10">
        <Icon size={24} className="group-hover:text-highlight transition-colors" />
      </div>
      <span className="font-semibold tracking-wide z-10">{label}</span>
    </motion.button>
  );
}