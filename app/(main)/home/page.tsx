"use client";

import { motion } from "framer-motion";
import { Sparkles, Code, Search, PenTool, Zap } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export default function HomePage() {
  const { user } = useAuth();
  
  // Greeting logic
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  else if (hour >= 18) greeting = "Good evening";

  return (
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
        <ActionTile icon={Code} label="Build" delay={0} />
        <ActionTile icon={Search} label="Research" delay={0.1} />
        <ActionTile icon={PenTool} label="Create" delay={0.2} />
        <ActionTile icon={Zap} label="Automate" delay={0.3} />
      </motion.div>
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 z-10">
        <Icon size={24} className="group-hover:text-highlight transition-colors" />
      </div>
      <span className="font-semibold tracking-wide z-10">{label}</span>
    </motion.button>
  );
}
