"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Sparkles, Globe, Smartphone, Palette, LineChart, 
  Users, Edit3, Zap, Rocket, FolderOpen, BarChart3, 
  Cloud, Blocks, Store, Settings, LogOut, ChevronDown, ChevronRight
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export function Sidebar({ onOpenAuth, workspaces = [] }: { onOpenAuth?: () => void, workspaces?: any[] }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isStudiosOpen, setIsStudiosOpen] = useState(true);

  // Initialize from local storage or default to true
  useEffect(() => {
    const savedState = localStorage.getItem("nexora_studios_open");
    if (savedState !== null) {
      setIsStudiosOpen(JSON.parse(savedState));
    }
  }, []);

  const toggleStudios = () => {
    const newState = !isStudiosOpen;
    setIsStudiosOpen(newState);
    localStorage.setItem("nexora_studios_open", JSON.stringify(newState));
  };

  const NavItem = ({ icon: Icon, label, href, indent = false }: any) => {
    const isActive = pathname?.startsWith(href);
    return (
      <Link href={href} className="block">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
          isActive 
            ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_12px_rgba(109,91,255,0.1)]" 
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        } ${indent ? "ml-4" : ""}`}>
          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-primary" : ""} />
          <span className="font-medium text-[15px]">{label}</span>
        </div>
      </Link>
    );
  };

  const SectionDivider = () => (
    <div className="h-px bg-borders my-4 w-full" />
  );

  return (
    <aside className="hidden md:flex w-[280px] h-full flex-col border-r border-borders bg-background/50 backdrop-blur-xl shrink-0 z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      {/* Header / Logo */}
      <div className="p-6 flex items-center gap-3">
        <Link href="/home" className="flex items-center gap-3">
          <div className="w-8 h-8 relative flex items-center justify-center cursor-pointer">
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
          <span className="font-bold tracking-widest text-lg text-white">NEXORA</span>
        </Link>
      </div>

      {/* Global Navigation */}
      <div className="px-4 py-2 flex-1 overflow-y-auto hide-scrollbar">
        <nav className="space-y-1">
          <NavItem icon={Home} label="Dashboard" href="/home" />
          <NavItem icon={Sparkles} label="AI Assistant" href="/assistant" />
          
          <SectionDivider />

          {/* AI Studios Collapsible */}
          <div 
            onClick={toggleStudios}
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors"
          >
            <span>AI Studios</span>
            {isStudiosOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          
          {isStudiosOpen && (
            <div className="space-y-1 mt-1 mb-2 animate-in slide-in-from-top-2 fade-in duration-200">
              <NavItem icon={Globe} label="Website" href="/studios/website" indent />
              <NavItem icon={Smartphone} label="Mobile Apps" href="/studios/mobile" indent />
              <NavItem icon={Palette} label="UI / UX" href="/studios/ui-ux" indent />
              <NavItem icon={LineChart} label="SEO" href="/studios/seo" indent />
              <NavItem icon={Users} label="CRM" href="/studios/crm" indent />
              <NavItem icon={Edit3} label="Content" href="/studios/content" indent />
              <NavItem icon={Zap} label="Automation" href="/studios/automation" indent />
            </div>
          )}

          <SectionDivider />

          <NavItem icon={FolderOpen} label="Workspaces" href="/workspaces" />
          <NavItem icon={BarChart3} label="Analytics" href="/analytics" />
          <NavItem icon={Cloud} label="Deployments" href="/deployments" />
          <NavItem icon={Blocks} label="Integrations" href="/integrations" />
          <NavItem icon={Store} label="Marketplace" href="/marketplace" />

          <SectionDivider />

          <NavItem icon={Settings} label="Settings" href="/settings" />
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-borders bg-background/80">
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition cursor-pointer" onClick={() => window.location.href='/settings'}>
            <div className="flex items-center gap-3 truncate">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(109,91,255,0.5)] shrink-0">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="text-sm font-medium text-slate-200 truncate">{user.email?.split('@')[0]}</div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                signOut();
              }} 
              className="text-slate-400 hover:text-red-400 transition p-1 shrink-0"
            >
              <LogOut size={16} />
            </button>
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
