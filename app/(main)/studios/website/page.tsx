"use client";

import { useState } from "react";
import { 
  Globe, Plus, Sparkles, ExternalLink, MoreVertical, 
  Settings, BarChart2, Zap, Palette, Code, Eye, Laptop, Smartphone
} from "lucide-react";
import Link from "next/link";

export default function WebsiteStudioPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="w-full max-w-[1600px] mx-auto text-white pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER & AI PROMPT */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Globe size={20} />
              </div>
              Website Studio
            </h1>
            <p className="text-slate-400">Design, build, and deploy high-converting websites in seconds.</p>
          </div>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 transition">
            <Settings size={16} />
            <span className="text-sm font-medium">Studio Settings</span>
          </button>
        </div>

        {/* AI Generator Bar */}
        <div className="relative w-full p-1 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-[1px]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-50 rounded-2xl"></div>
          <div className="relative flex items-center gap-3 bg-[#0B0B14] rounded-2xl p-2 px-4 border border-white/10 shadow-2xl">
            <Sparkles className="text-purple-400 shrink-0" size={20} />
            <input 
              type="text" 
              placeholder="Describe the website you want to build (e.g., A minimalist portfolio for a photographer)..." 
              className="flex-1 bg-transparent border-none outline-none text-[15px] placeholder:text-slate-500 text-white h-12 focus:ring-0"
            />
            <button className="px-6 py-2.5 bg-primary hover:bg-accent rounded-xl font-medium transition shadow-[0_0_20px_rgba(109,91,255,0.4)] flex items-center gap-2">
              Generate <Zap size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* MAIN CONTENT (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* SITES GRID */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">My Sites</h2>
              <div className="flex bg-[#12121A] border border-white/5 rounded-lg p-1">
                {["all", "published", "drafts"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium capitalize transition ${activeTab === tab ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {/* Site Card 1 */}
              <div className="group bg-[#12121A] border border-white/5 hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all duration-300">
                <div className="h-40 bg-[#1A1A24] relative border-b border-white/5 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                  <Globe size={40} className="text-blue-500/20" />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"><Code size={18} /></button>
                    <button className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition"><Eye size={18} /></button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-[15px] group-hover:text-blue-400 transition">Nexora Digital Agency</h3>
                      <Link href="#" className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 mt-1">
                        nexora-agency.vercel.app <ExternalLink size={10} />
                      </Link>
                    </div>
                    <button className="text-slate-500 hover:text-white"><MoreVertical size={16} /></button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-slate-400">Published</span>
                    </div>
                    <span className="text-xs text-slate-500">2 days ago</span>
                  </div>
                </div>
              </div>

              {/* Site Card 2 */}
              <div className="group bg-[#12121A] border border-white/5 hover:border-purple-500/30 rounded-2xl overflow-hidden transition-all duration-300">
                <div className="h-40 bg-[#1A1A24] relative border-b border-white/5 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
                  <Laptop size={40} className="text-purple-500/20" />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"><Code size={18} /></button>
                    <button className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition"><Eye size={18} /></button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-[15px] group-hover:text-purple-400 transition">SaaS Landing Page</h3>
                      <span className="text-xs text-slate-500 mt-1 block">Custom Domain</span>
                    </div>
                    <button className="text-slate-500 hover:text-white"><MoreVertical size={16} /></button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-xs text-slate-400">Draft</span>
                    </div>
                    <span className="text-xs text-slate-500">5 hrs ago</span>
                  </div>
                </div>
              </div>

              {/* Create New Card */}
              <div className="bg-[#12121A]/50 border border-white/5 border-dashed hover:border-white/20 hover:bg-[#12121A] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[260px]">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-400">
                  <Plus size={24} />
                </div>
                <h3 className="font-semibold text-[15px] mb-1">Create New Site</h3>
                <p className="text-xs text-slate-500">Start from scratch or use AI</p>
              </div>
            </div>
          </div>

          {/* TEMPLATES */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Palette size={18} className="text-pink-400" /> Premium Templates</h2>
              <button className="text-sm text-primary hover:text-white transition">View all</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Modern E-Commerce", cat: "Store" },
                { name: "SaaS Dashboard", cat: "Web App" },
                { name: "Creator Portfolio", cat: "Personal" },
                { name: "Marketing Agency", cat: "Business" }
              ].map((tpl, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="h-32 bg-[#12121A] border border-white/5 rounded-xl mb-3 group-hover:border-white/20 transition"></div>
                  <h4 className="text-sm font-medium text-slate-200 group-hover:text-white">{tpl.name}</h4>
                  <p className="text-xs text-slate-500">{tpl.cat}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1 col) */}
        <div className="flex flex-col gap-6">
          
          {/* QUICK ANALYTICS */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6">
             <h2 className="text-base font-semibold mb-5 flex items-center gap-2"><BarChart2 size={16} className="text-green-400" /> Analytics Summary</h2>
             
             <div className="space-y-4">
               <div className="bg-[#12121A] rounded-xl p-4 border border-white/5">
                 <p className="text-xs text-slate-400 mb-1">Total Visitors (30d)</p>
                 <div className="flex items-end gap-2">
                   <span className="text-2xl font-bold">12,450</span>
                   <span className="text-xs text-green-500 font-medium mb-1">+14%</span>
                 </div>
               </div>
               
               <div className="bg-[#12121A] rounded-xl p-4 border border-white/5">
                 <p className="text-xs text-slate-400 mb-1">Avg. Load Time</p>
                 <div className="flex items-end gap-2">
                   <span className="text-2xl font-bold">0.8s</span>
                   <span className="text-xs text-green-500 font-medium mb-1">-0.2s</span>
                 </div>
               </div>

               <div className="bg-[#12121A] rounded-xl p-4 border border-white/5">
                 <p className="text-xs text-slate-400 mb-1">Bandwidth Used</p>
                 <div className="flex items-end gap-2">
                   <span className="text-2xl font-bold">45 GB</span>
                   <span className="text-xs text-slate-500 font-medium mb-1">/ 100 GB</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                   <div className="h-full bg-blue-500 w-[45%]"></div>
                 </div>
               </div>
             </div>
          </div>

          {/* ACTIVE DEVICES */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6 flex-1">
             <h2 className="text-base font-semibold mb-5">Traffic by Device</h2>
             <div className="flex items-center justify-between p-3 bg-[#12121A] rounded-xl border border-white/5 mb-3">
               <div className="flex items-center gap-3">
                 <Laptop size={16} className="text-slate-400" />
                 <span className="text-sm">Desktop</span>
               </div>
               <span className="text-sm font-medium">65%</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-[#12121A] rounded-xl border border-white/5">
               <div className="flex items-center gap-3">
                 <Smartphone size={16} className="text-slate-400" />
                 <span className="text-sm">Mobile</span>
               </div>
               <span className="text-sm font-medium">35%</span>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
