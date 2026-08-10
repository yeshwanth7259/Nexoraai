"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Sparkles, Globe, Smartphone, Palette, LineChart, 
  Users, Edit3, Zap, BarChart3, Cloud, Blocks, Store, Settings, 
  ChevronDown, ChevronRight, Briefcase, FileText, Video
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export function Sidebar({ onOpenAuth, workspaces = [] }: { onOpenAuth?: () => void, workspaces?: any[] }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  
  // The design doesn't show collapsible studios, it shows them fully listed under an "AI STUDIOS" header.
  // But we can keep them visible.
  
  const NavItem = ({ icon: Icon, label, href, active = false }: any) => {
    const isActive = active || pathname?.startsWith(href);
    return (
      <Link href={href} className="block w-full">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
          isActive 
            ? "bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_15px_rgba(109,91,255,0.3)]" 
            : "text-textMuted hover:text-foreground hover:bg-hoverBg"
        }`}>
          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : ""} />
          <span className={`text-[14px] ${isActive ? "font-semibold" : "font-medium"}`}>{label}</span>
        </div>
      </Link>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-5 mt-6 mb-3 text-[10px] font-bold text-textMuted uppercase tracking-widest">
      {title}
    </div>
  );

  return (
    <aside className="hidden md:flex w-[260px] h-full flex-col border-r border-borders bg-bgDarker shrink-0 z-10 relative">
      {/* Header / Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <Link href="/home" className="flex items-center gap-3">
          <div className="w-7 h-7 relative flex items-center justify-center cursor-pointer">
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-[0_0_10px_rgba(109,91,255,1)]">
              <defs>
                <linearGradient id="n-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <path d="M10 30 V10 L30 30 V10" fill="none" stroke="url(#n-grad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-bold tracking-[0.2em] text-[15px] text-foreground uppercase">NEXORA</span>
        </Link>
      </div>

      {/* Global Navigation */}
      <div className="px-3 py-2 flex-1 overflow-y-auto hide-scrollbar">
        <nav className="space-y-1">
          <NavItem icon={Home} label="Dashboard" href="/home" active={pathname === '/home' || pathname === '/'} />
          <NavItem icon={Sparkles} label="AI Assistant" href="/assistant" />
          <NavItem icon={Globe} label="Nexora Connect" href="/nexora-connect" />
          
          <SectionHeader title="AI STUDIOS" />
          
          <NavItem icon={LineChart} label="SEO Studio" href="/studios/seo" />
          <NavItem icon={Edit3} label="Content Studio" href="/studios/content" />
          <NavItem icon={FileText} label="Resume Maker" href="/studios/resume" />


        </nav>
      </div>

      {/* Footer Nav */}
      <div className="px-3 pb-2 pt-2">
        <NavItem icon={Settings} label="Settings" href="/settings" />
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-borders">
        {user ? (
          <div className="flex items-center justify-between cursor-pointer group" onClick={signOut}>
            <div className="flex items-center gap-3">
              <img 
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`} 
                alt="Avatar" 
                className="w-9 h-9 rounded-full bg-white/10"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-foreground leading-tight group-hover:text-primary transition">{user.email?.split('@')[0]}</span>
                <span className="text-[11px] text-textMuted truncate max-w-[120px]">{user.email}</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-textMuted group-hover:text-foreground transition" />
          </div>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-accent text-white font-medium text-sm transition shadow-[0_0_15px_rgba(109,91,255,0.3)]"
          >
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
}
