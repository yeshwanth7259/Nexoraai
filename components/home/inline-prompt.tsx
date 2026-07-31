"use client";

import { useState } from "react";
import { Mic, Send, X, File as FileIcon } from "lucide-react";
import { AttachmentMenu } from "@/components/chat/attachment-menu";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function InlinePrompt() {
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    setAttachedFile(file);
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  const handleSubmit = () => {
    if (input.trim() || attachedFile) {
      router.push(`/assistant?q=${encodeURIComponent(input.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="relative z-10 w-full max-w-2xl bg-[#12121A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-2 mx-auto">
      
      {/* File Preview Area */}
      <AnimatePresence>
        {attachedFile && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="px-3"
          >
            <div className="relative inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 pr-4">
              <button 
                onClick={removeFile}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 hover:bg-red-500 text-white flex items-center justify-center transition z-10"
              >
                <X size={12} />
              </button>
              
              {attachedFile.type.startsWith("image/") ? (
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/50">
                  <img 
                    src={URL.createObjectURL(attachedFile)} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FileIcon size={20} />
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-white max-w-[150px] truncate">
                  {attachedFile.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {(attachedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between px-2 sm:px-3 pt-2">
        <AttachmentMenu 
          direction="down" 
          onFileSelect={handleFileSelect} 
          onAction={(action) => setInput(`[${action}] ` + input)}
        />
        
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nexora to build..." 
          className="bg-transparent border-none text-white text-[13px] sm:text-[15px] placeholder:text-slate-500 w-full focus:outline-none focus:ring-0 ml-1 sm:ml-2 min-w-0"
        />
        
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition">
            <Mic size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button 
            onClick={handleSubmit}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition shadow-[0_0_15px_rgba(109,91,255,0.5)] ${input.trim() || attachedFile ? 'bg-primary hover:bg-accent text-white' : 'bg-primary/50 text-white/50 cursor-not-allowed'}`}
          >
            <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-2 pb-2 overflow-x-auto mt-1 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <PromptPill text="Build a website" href="/studios/website" />
        <PromptPill text="Generate SEO report" href="/studios/seo" />
        <PromptPill text="Create CRM" href="/studios/crm" />
        <PromptPill text="Design UI" href="/studios/ui-ux" />
        <PromptPill text="Write blog" href="/studios/content" />
      </div>
    </div>
  );
}

function PromptPill({ text, href }: { text: string, href: string }) {
  return (
    <Link href={href}>
      <button className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition whitespace-nowrap cursor-pointer">
        {text}
      </button>
    </Link>
  );
}

