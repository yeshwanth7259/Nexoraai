"use client";

import { UploadCloud } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { parseFileToText } from "@/utils/file-parser";

export function QuickUploadAction() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await parseFileToText(file);
        sessionStorage.setItem('nexora_pending_file_text', text);
        sessionStorage.setItem('nexora_pending_file_name', file.name);
        router.push(`/assistant?q=${encodeURIComponent("Please analyze the attached file.")}`);
      } catch (err) {
        console.error("Could not read file", err);
      }
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".txt,.md,.json,.csv,.js,.ts,.tsx,.jsx,.html,.css"
      />
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="bg-[#12121A] rounded-xl border border-white/5 p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition cursor-pointer group h-full"
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 bg-blue-500/10">
          <UploadCloud size={18} className="text-blue-400" />
        </div>
        <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition text-center">Upload File</span>
      </div>
    </>
  );
}
