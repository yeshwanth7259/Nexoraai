"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, MessageSquare, Rocket, FolderOpen, FileText, Bot, Settings, LogOut, Plus
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: MessageSquare, label: "Chats", href: "/chats" },
  { icon: Rocket, label: "Workspaces", href: "/workspaces" },
  { icon: FolderOpen, label: "Projects", href: "/projects" },
  { icon: FileText, label: "Knowledge", href: "/knowledge" },
  { icon: Bot, label: "AI Agents", href: "/agents" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ onOpenAuth, workspaces = [] }: { onOpenAuth?: () => void, workspaces?: any[] }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

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
      <div className="px-4 py-2 flex-1 overflow-y-auto">
        <nav className="space-y-1 mb-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="block">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_12px_rgba(109,91,255,0.1)]" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}>
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-primary" : ""} />
                  <span className="font-medium text-[15px]">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest flex justify-between items-center">
          <span>Recent Workspaces</span>
          <Link href="/workspaces">
            <button className="hover:text-white transition"><Plus size={14}/></button>
          </Link>
        </div>
        <div className="space-y-1">
          {workspaces.length === 0 ? (
            <div className="px-2 py-2 text-xs text-slate-500">No workspaces yet.</div>
          ) : (
            workspaces.slice(0, 5).map((ws) => (
               <Link key={ws.id} href={`/workspaces/${ws.id}`}>
                 <div 
                   className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition cursor-pointer group text-slate-400 hover:text-white hover:bg-white/5"
                 >
                   <Rocket size={16} className="text-slate-500 group-hover:text-primary transition shrink-0" />
                   <span className="truncate">{ws.name}</span>
                 </div>
               </Link>
            ))
          )}
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
            <button onClick={signOut} className="text-slate-400 hover:text-red-400 transition p-1 shrink-0">
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
