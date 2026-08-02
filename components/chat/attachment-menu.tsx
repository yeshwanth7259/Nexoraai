"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Paperclip, 
  Triangle,
  MoreHorizontal,
  Sparkles,
  Clapperboard,
  Music,
  SquarePlus,
  Atom,
  ChevronRight
} from "lucide-react";

interface AttachmentMenuProps {
  direction?: "up" | "down";
  onFileSelect?: (file: File) => void;
  onAction?: (actionName: string) => void;
}

export function AttachmentMenu({ direction = "up", onFileSelect, onAction }: AttachmentMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
      setIsOpen(false);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAction = (name: string) => {
    if (onAction) {
      onAction(name);
      setIsOpen(false);
    }
  };

  const initialY = direction === "up" ? 10 : -10;

  return (
    <div className="relative flex items-center" ref={menuRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 ${isOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10 outline-none focus:ring-2 focus:ring-white/20'}`}
      >
        <Plus size={22} className={`transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
      </button>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      <AnimatePresence>
        {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: initialY, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: initialY, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`absolute ${direction === "up" ? "bottom-[calc(100%+12px)]" : "top-[calc(100%+12px)]"} left-0 w-[240px] bg-[#212121] border border-[#333] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-1.5 z-50 overflow-hidden`}
            >
            <div className="flex flex-col">
              
              <MenuItem 
                icon={Paperclip} 
                title="Upload files" 
                onClick={() => fileInputRef.current?.click()}
              />
              <MenuItem 
                icon={Triangle} 
                title="Add from Drive" 
                onClick={() => handleAction("Add from Drive")}
              />
              <MenuItem 
                icon={MoreHorizontal} 
                title="More uploads"
                rightIcon={ChevronRight}
                onClick={() => handleAction("More uploads")}
              />
              
              <div className="h-px bg-white/10 my-1 mx-1"></div>
              
              <MenuItem 
                icon={Sparkles} 
                title="Create image"
                badge="New"
                onClick={() => handleAction("Create image")}
              />
              <MenuItem 
                icon={Clapperboard} 
                title="Create video"
                onClick={() => handleAction("Create video")}
              />
              <MenuItem 
                icon={Music} 
                title="Create music"
                badge="New"
                onClick={() => handleAction("Create music")}
              />
              <MenuItem 
                icon={SquarePlus} 
                title="Canvas"
                onClick={() => handleAction("Canvas")}
              />
              <MenuItem 
                icon={Atom} 
                title="Deep Research"
                onClick={() => handleAction("Deep Research")}
              />

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ icon: Icon, title, badge, onClick, rightIcon: RightIcon }: any) {
  return (
    <div onClick={onClick} className="flex items-center justify-between group cursor-pointer hover:bg-white/10 py-2.5 px-2.5 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-slate-300 group-hover:text-white transition-colors shrink-0" strokeWidth={1.75} />
        <span className="text-[14px] text-slate-200 group-hover:text-white transition-colors">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-[#333] text-white/90 text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide leading-none">
            {badge}
          </span>
        )}
        {RightIcon && <RightIcon size={16} className="text-slate-400 group-hover:text-white transition-colors" />}
      </div>
    </div>
  );
}
