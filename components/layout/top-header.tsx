"use client";

import { Search, User, Command } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export function TopHeader({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  const { user } = useAuth();

  return (
    <header className="absolute top-0 right-0 h-16 flex items-center justify-end px-8 gap-6 z-20 w-full bg-gradient-to-b from-background to-transparent pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-4">
        {/* Command Palette Trigger */}
        <button 
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 transition"
        >
          <Search size={16} />
          <span className="text-sm font-medium">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 bg-black/30 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            <Command size={10} /> K
          </kbd>
        </button>

        <button className="text-slate-400 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}
