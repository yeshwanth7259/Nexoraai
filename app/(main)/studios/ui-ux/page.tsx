"use client";

import { useState } from "react";
import { 
  Palette, Layout, Type, Sparkles, Download, Code2, 
  Copy, Check, Zap, Maximize2, Monitor, Smartphone
} from "lucide-react";

export default function UIUXStudioPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto text-white pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Palette size={20} />
              </div>
              UI/UX Studio
            </h1>
            <p className="text-slate-400">Generate beautiful React components and manage your design systems.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition flex items-center gap-2">
              <Download size={14} /> Export Figma
            </button>
            <button className="px-4 py-2 bg-primary hover:bg-accent rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-[0_0_15px_rgba(109,91,255,0.3)]">
              <Layout size={14} /> New Component
            </button>
          </div>
        </div>

        {/* AI GENERATOR */}
        <div className="relative w-full p-1 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 p-[1px] mt-4">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-xl opacity-50 rounded-2xl"></div>
          <div className="relative flex flex-col sm:flex-row items-center gap-3 bg-[#0B0B14] rounded-2xl p-2 px-4 border border-white/10 shadow-2xl">
            <Sparkles className="text-pink-400 shrink-0 hidden sm:block" size={20} />
            <input 
              type="text" 
              placeholder="Generate a component... (e.g., A dark-mode pricing table with 3 tiers)" 
              className="flex-1 bg-transparent border-none outline-none text-[15px] placeholder:text-slate-500 text-white h-12 focus:ring-0 w-full"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select className="bg-[#12121A] border border-white/10 rounded-xl px-3 h-10 text-sm text-slate-300 outline-none w-full sm:w-auto">
                <option>React + Tailwind</option>
                <option>Vue + Tailwind</option>
                <option>HTML + CSS</option>
              </select>
              <button className="px-6 h-10 bg-white hover:bg-slate-200 text-black rounded-xl font-bold transition flex items-center justify-center gap-2 w-full sm:w-auto shrink-0">
                Generate <Zap size={16} className="fill-black" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-10">
        
        {/* LEFT SIDE: Design System (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Colors */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6">
            <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
              <Palette size={16} className="text-slate-400" /> Color Palette
            </h2>
            <div className="space-y-4">
              <ColorRow name="Primary" hex="#6D5BFF" color="bg-[#6D5BFF]" />
              <ColorRow name="Background" hex="#05050A" color="bg-[#05050A]" />
              <ColorRow name="Card" hex="#12121A" color="bg-[#12121A]" />
              <ColorRow name="Accent" hex="#00E5FF" color="bg-[#00E5FF]" />
            </div>
            <button className="w-full mt-6 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-sm transition">Generate AI Palette</button>
          </div>

          {/* Typography */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6">
            <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
              <Type size={16} className="text-slate-400" /> Typography
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-xs text-slate-500 mb-1">Heading Font</p>
                <h3 className="text-xl font-bold text-white tracking-tight">Inter (Sans-serif)</h3>
              </div>
              <div className="w-full h-[1px] bg-white/5"></div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Body Font</p>
                <p className="text-sm text-slate-300 leading-relaxed">Inter (Sans-serif)</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE: Components Gallery (9 cols) */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Generated Components</h2>
            <div className="flex bg-[#12121A] border border-white/5 rounded-lg p-1">
              <button className="px-4 py-1.5 rounded-md text-xs font-medium bg-white/10 text-white transition">Recent</button>
              <button className="px-4 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition">Saved</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Component Card 1 */}
            <div className="bg-[#0B0B14] border border-white/5 hover:border-white/20 rounded-3xl overflow-hidden transition group">
              <div className="h-48 bg-[#12121A] relative border-b border-white/5 p-4 overflow-hidden flex items-center justify-center">
                 {/* Fake UI preview */}
                 <div className="w-full max-w-[80%] bg-[#0B0B14] border border-white/10 rounded-xl p-4 shadow-2xl flex flex-col gap-3 group-hover:scale-105 transition-transform duration-500">
                   <div className="h-4 w-1/3 bg-white/10 rounded-full"></div>
                   <div className="h-2 w-full bg-white/5 rounded-full"></div>
                   <div className="h-2 w-2/3 bg-white/5 rounded-full"></div>
                   <div className="mt-2 flex gap-2">
                     <div className="h-6 w-20 bg-primary rounded-lg"></div>
                     <div className="h-6 w-20 bg-white/10 rounded-lg"></div>
                   </div>
                 </div>
                 
                 {/* Top actions */}
                 <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                   <button className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"><Monitor size={14}/></button>
                   <button className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"><Smartphone size={14}/></button>
                   <button className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-slate-300 hover:text-white ml-1"><Maximize2 size={14}/></button>
                 </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[15px]">Hero Section with Email Capture</h3>
                  <p className="text-xs text-slate-500 mt-1">React • Tailwind CSS</p>
                </div>
                <button 
                  onClick={() => handleCopy('hero')}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition"
                >
                  {copied === 'hero' ? <Check size={16} className="text-green-500" /> : <Code2 size={16} className="text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Component Card 2 */}
            <div className="bg-[#0B0B14] border border-white/5 hover:border-white/20 rounded-3xl overflow-hidden transition group">
              <div className="h-48 bg-[#12121A] relative border-b border-white/5 p-4 overflow-hidden flex items-center justify-center">
                 {/* Fake UI preview */}
                 <div className="w-full h-full flex gap-3 items-center justify-center group-hover:scale-105 transition-transform duration-500">
                   <div className="w-1/3 h-[80%] bg-[#0B0B14] border border-white/10 rounded-xl p-3 shadow-xl">
                     <div className="w-6 h-6 rounded-full bg-white/10 mb-3"></div>
                     <div className="h-2 w-full bg-white/5 rounded-full mb-1"></div>
                     <div className="h-2 w-1/2 bg-white/5 rounded-full"></div>
                   </div>
                   <div className="w-1/3 h-[90%] bg-primary/20 border border-primary/30 rounded-xl p-3 shadow-xl relative -mt-4">
                     <div className="w-6 h-6 rounded-full bg-primary mb-3"></div>
                     <div className="h-2 w-full bg-white/20 rounded-full mb-1"></div>
                     <div className="h-2 w-1/2 bg-white/20 rounded-full mb-4"></div>
                     <div className="h-6 w-full bg-primary rounded-lg"></div>
                   </div>
                   <div className="w-1/3 h-[80%] bg-[#0B0B14] border border-white/10 rounded-xl p-3 shadow-xl">
                     <div className="w-6 h-6 rounded-full bg-white/10 mb-3"></div>
                     <div className="h-2 w-full bg-white/5 rounded-full mb-1"></div>
                     <div className="h-2 w-1/2 bg-white/5 rounded-full"></div>
                   </div>
                 </div>
                 
                 <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                   <button className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-slate-300 hover:text-white ml-1"><Maximize2 size={14}/></button>
                 </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[15px]">3-Tier Pricing Table</h3>
                  <p className="text-xs text-slate-500 mt-1">React • Tailwind CSS</p>
                </div>
                <button 
                  onClick={() => handleCopy('pricing')}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition"
                >
                  {copied === 'pricing' ? <Check size={16} className="text-green-500" /> : <Code2 size={16} className="text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Component Card 3 */}
            <div className="bg-[#0B0B14] border border-white/5 hover:border-white/20 rounded-3xl overflow-hidden transition group">
              <div className="h-48 bg-[#12121A] relative border-b border-white/5 p-4 overflow-hidden flex items-center justify-center">
                 {/* Fake UI preview */}
                 <div className="w-full max-w-[80%] bg-[#0B0B14] border border-white/10 rounded-xl p-1 shadow-2xl flex items-center justify-between group-hover:scale-105 transition-transform duration-500">
                    <div className="flex items-center gap-4 px-4 py-3 w-full">
                      <div className="w-6 h-6 rounded-full bg-white/10"></div>
                      <div className="flex gap-4">
                        <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                        <div className="h-2 w-16 bg-white/10 rounded-full"></div>
                        <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="ml-auto h-6 w-16 bg-white/5 rounded-lg"></div>
                    </div>
                 </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[15px]">Glassmorphism Navbar</h3>
                  <p className="text-xs text-slate-500 mt-1">React • Tailwind CSS</p>
                </div>
                <button 
                  onClick={() => handleCopy('nav')}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition"
                >
                  {copied === 'nav' ? <Check size={16} className="text-green-500" /> : <Code2 size={16} className="text-slate-400" />}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// --- Helper Components ---

function ColorRow({ name, hex, color }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg shadow-inner border border-white/10 ${color}`}></div>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-mono group-hover:text-slate-300 transition">{hex}</span>
        <button className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition"><Copy size={12}/></button>
      </div>
    </div>
  );
}
