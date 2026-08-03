"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Folder, FileText, Settings, Rocket, Bot, MessageSquare } from "lucide-react";

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open palette - we would need to lift state up or use a provider, 
          // but since this component handles its own visibility via props, 
          // the parent will handle the shortcut trigger.
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const actions = [
    { id: "home", label: "Go to Home", icon: Rocket, action: () => router.push("/home") },
    { id: "new_chat", label: "New Chat", icon: MessageSquare, action: () => router.push("/chats") },
    { id: "projects", label: "View Projects", icon: Folder, action: () => router.push("/projects") },
    { id: "knowledge", label: "Upload Knowledge", icon: FileText, action: () => router.push("/knowledge") },
    { id: "agents", label: "Manage Agents", icon: Bot, action: () => router.push("/agents") },
    { id: "settings", label: "Open Settings", icon: Settings, action: () => router.push("/settings") },
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(search.toLowerCase()));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl bg-background border border-borders rounded-2xl shadow-2xl overflow-hidden glass-panel"
          >
            <div className="flex items-center px-4 py-3 border-b border-borders">
              <Search className="text-textMuted mr-3" size={20} />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-foreground text-lg placeholder-slate-500"
              />
              <div className="flex items-center gap-1">
                 <kbd className="bg-hoverBg border border-borders rounded px-1.5 py-0.5 text-xs text-textMuted">ESC</kbd>
              </div>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <div className="text-xs font-semibold text-textMuted uppercase tracking-wider px-3 py-2">
                Suggestions
              </div>
              {filteredActions.map((action, idx) => (
                <button
                  key={action.id}
                  onClick={() => {
                    action.action();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-hoverBg text-textMuted hover:text-foreground transition group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-hoverBg flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition">
                    <action.icon size={16} />
                  </div>
                  <span className="font-medium text-[15px]">{action.label}</span>
                </button>
              ))}
              {filteredActions.length === 0 && (
                <div className="px-3 py-8 text-center text-textMuted text-sm">
                  No results found for "{search}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
