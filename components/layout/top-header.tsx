"use client";

import { useState, useRef, useEffect } from "react";
import { Search, User, Command, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";

export function TopHeader({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`transition w-8 h-8 flex items-center justify-center rounded-full ${
              isDropdownOpen 
                ? "bg-primary text-white shadow-[0_0_15px_rgba(109,91,255,0.4)]" 
                : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
            }`}
          >
            {user && user.email ? (
              <span className="text-xs font-bold">{user.email[0].toUpperCase()}</span>
            ) : (
              <User size={18} />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-panel border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
              {user && (
                <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                </div>
              )}
              
              <div className="py-1">
                <Link 
                  href="/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </Link>
                
                {user ? (
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                ) : (
                  <div className="px-4 py-2 text-sm text-slate-400">
                    Not signed in
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
