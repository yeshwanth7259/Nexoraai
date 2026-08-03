"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Folder, Bot, Settings } from "lucide-react";

const DOCK_ITEMS = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: MessageSquare, label: "Chats", href: "/chats" },
  { icon: Folder, label: "Projects", href: "/projects" },
  { icon: Bot, label: "Agents", href: "/agents" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function MobileDock() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="glass-panel bg-background backdrop-blur-xl border border-borders rounded-2xl flex items-center justify-around p-2 shadow-2xl">
        {DOCK_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className="flex flex-col items-center justify-center p-2 rounded-xl transition-all relative group">
                <item.icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`${isActive ? "text-primary" : "text-textMuted group-hover:text-foreground"} transition`} 
                />
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
