"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Paperclip, 
  Image as ImageIcon, 
  Globe, 
  Telescope, 
  Shapes,
  Bot,
  Box,
  Triangle
} from "lucide-react";

export function AttachmentMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative flex items-center" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 ${isOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
      >
        <Plus size={22} className={`transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-[120%] left-0 w-[340px] bg-[#212121] border border-white/5 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
          >
            <div className="max-h-[350px] overflow-y-auto scrollbar-hide py-1">
              
              <MenuItem 
                icon={Paperclip} 
                title="Add photos & files" 
                subtitle="Upload from computer" 
              />
              <MenuItem 
                icon={ImageIcon} 
                iconColor="text-blue-400"
                title="Create image" 
                subtitle="Visualize anything" 
              />
              <MenuItem 
                icon={Globe} 
                iconColor="text-cyan-400"
                title="Web search" 
                subtitle="Find real-time news and info" 
              />
              <MenuItem 
                icon={Telescope} 
                iconColor="text-indigo-400"
                title="Deep research" 
                subtitle="Get a detailed report" 
              />
              <MenuItem 
                icon={Shapes} 
                iconColor="text-pink-400"
                title="Visualize" 
                subtitle="Create visualizations and interactive tools" 
              />
              
              <div className="w-full h-px bg-white/10 my-2"></div>
              
              <MenuItem 
                icon={Bot} 
                iconColor="text-blue-600"
                title="OpenAI Platform" 
                subtitle="Create an OpenAI API key after connecting..." 
              />
              
              <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2.5 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <Triangle size={18} className="text-blue-500 fill-blue-500 shrink-0" />
                  <div>
                    <h4 className="text-[13px] font-medium text-slate-200">Atlassian Rovo</h4>
                    <p className="text-[11px] text-slate-400">Manage Jira and Confluence fast</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 group-hover:text-white transition">Connect</span>
              </div>

              <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2.5 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <Box size={18} className="text-blue-400 fill-blue-400/20 shrink-0" />
                  <div>
                    <h4 className="text-[13px] font-medium text-slate-200">Box</h4>
                    <p className="text-[11px] text-slate-400">Search and reference your documents</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 group-hover:text-white transition">Connect</span>
              </div>

            </div>
            
            <div className="px-3 pt-3 pb-2 mt-1 border-t border-white/5">
              <input 
                type="text" 
                placeholder="Type to search plugins, files, folders & skills" 
                className="w-full bg-transparent border-none text-[12px] text-white placeholder-slate-500 outline-none focus:ring-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ icon: Icon, iconColor = "text-slate-300", title, subtitle }: any) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2.5 rounded-xl transition">
      <Icon size={18} className={`${iconColor} shrink-0`} />
      <div>
        <h4 className="text-[13px] font-medium text-slate-200 flex items-center gap-2">
          {title}
        </h4>
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}
