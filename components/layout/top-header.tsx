"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Command, Settings, LogOut, Gift, Bell, User } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";

export function TopHeader({ onOpenCommandPalette, onOpenAuth }: { onOpenCommandPalette: () => void, onOpenAuth?: () => void }) {
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
    <header className="absolute top-0 right-0 h-[72px] flex items-center justify-between px-4 md:px-8 z-20 w-full bg-background/50 backdrop-blur-xl pointer-events-none border-b border-white/5">
      
      {/* Left / Search */}
      <div className="pointer-events-auto flex-1 flex items-center gap-3">
        {/* Mobile Logo */}
        <Link href="/home" className="md:hidden flex items-center shrink-0 pl-1 pr-1">
          <div className="w-6 h-6 relative flex items-center justify-center cursor-pointer">
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-[0_0_8px_rgba(109,91,255,0.8)]">
              <defs>
                <linearGradient id="n-grad-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <path d="M10 30 V10 L30 30 V10" fill="none" stroke="url(#n-grad-mobile)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>

        <button 
          onClick={onOpenCommandPalette}
          className="flex items-center justify-between w-[180px] sm:w-[280px] md:w-[340px] text-slate-400 bg-white/5 hover:bg-white/10 px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-white/5 transition group"
        >
          <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
            <Search size={16} className="text-slate-500 group-hover:text-white transition shrink-0" />
            <span className="text-[12px] md:text-[13px] font-medium group-hover:text-white transition truncate">Search...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 bg-black/30 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            <Command size={10} /> K
          </kbd>
        </button>
      </div>

      {/* Right Icons & Profile */}
      <div className="pointer-events-auto flex items-center gap-3 md:gap-5">
        <button className="text-slate-400 hover:text-white transition hidden sm:block">
          <Gift size={20} />
        </button>
        
        <button className="text-slate-400 hover:text-white transition relative">
          <Bell size={20} />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-background">
            2
          </span>
        </button>

        <div className="w-px h-6 bg-white/10 mx-1"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`transition w-9 h-9 flex items-center justify-center rounded-full border border-white/10 overflow-hidden ${
              isDropdownOpen 
                ? "shadow-[0_0_15px_rgba(109,91,255,0.4)]" 
                : "hover:border-white/30"
            }`}
          >
            {user ? (
              <img 
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`} 
                alt="Avatar" 
                className="w-full h-full object-cover bg-white/10"
              />
            ) : (
              <User size={18} className="text-slate-400" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-panel border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
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
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (onOpenAuth) onOpenAuth();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors text-left"
                  >
                    <User size={16} />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
