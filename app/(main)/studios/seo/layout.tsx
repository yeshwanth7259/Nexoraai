"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LineChart as LineChartIcon, Settings, Target, Zap, Search, Users, Activity, FileText
} from "lucide-react";

const SEO_MODULES = [
  { name: "Command Center", href: "/studios/seo/dashboard", icon: LineChartIcon },
  { name: "Technical SEO", href: "/studios/seo/technical", icon: Activity },
  { name: "Content Optimizer", href: "/studios/seo/content", icon: Zap },
  { name: "Keywords", href: "/studios/seo/keywords", icon: Search },
  { name: "Competitors", href: "/studios/seo/competitors", icon: Users },
  { name: "Rank Tracker", href: "/studios/seo/rank", icon: Target },
  { name: "Reports", href: "/studios/seo/reports", icon: FileText },
  { name: "Settings", href: "/studios/seo/settings", icon: Settings },
];

export default function SEOLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full max-w-[1600px] mx-auto text-foreground pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SEO STUDIO HEADER & NAVIGATION */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <LineChartIcon size={20} />
              </div>
              Nexora SEO Intelligence
            </h1>
            <p className="text-textMuted">Enterprise-grade AI auditing, content optimization, and rank tracking.</p>
          </div>
        </div>

        {/* SUB-NAVIGATION BAR */}
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar bg-background border border-borders p-1.5 rounded-2xl">
          {SEO_MODULES.map((mod) => {
            const isActive = pathname === mod.href || pathname?.startsWith(mod.href + "/");
            return (
              <Link key={mod.href} href={mod.href}>
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? "bg-white/10 text-white shadow-sm" 
                    : "text-textMuted hover:text-foreground hover:bg-hoverBg"
                }`}>
                  <mod.icon size={16} className={isActive ? "text-green-400" : ""} />
                  {mod.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* MODULE CONTENT */}
      <div className="w-full">
        {children}
      </div>
      
    </div>
  );
}
