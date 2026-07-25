"use client";

import { useState } from "react";
import { 
  LineChart as LineChartIcon, Search, AlertCircle, ArrowUpRight, 
  ArrowDownRight, Target, Link as LinkIcon, Activity, Zap, RefreshCw, Plus
} from "lucide-react";
import Link from "next/link";

export default function SEOStudioPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [url, setUrl] = useState("");

  const handleAnalyze = () => {
    if(!url) return;
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto text-white pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <LineChartIcon size={20} />
              </div>
              SEO Studio
            </h1>
            <p className="text-slate-400">Analyze, optimize, and rank your digital assets higher.</p>
          </div>
          <button className="px-4 py-2 bg-primary hover:bg-accent rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-[0_0_15px_rgba(109,91,255,0.3)]">
            <RefreshCw size={14} /> Update Metrics
          </button>
        </div>

        {/* ON-PAGE ANALYZER TOOL */}
        <div className="w-full bg-[#0B0B14] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Enter a URL to run an instant On-Page SEO Audit (e.g., https://nexora.ai)..." 
            className="flex-1 bg-transparent border-none text-[15px] outline-none text-white placeholder:text-slate-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <><RefreshCw size={16} className="animate-spin" /> Analyzing...</>
            ) : (
              <><Zap size={16} className="text-yellow-400" /> Run Audit</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* TOP METRICS (Full Width Grid) */}
        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Domain Authority" value="48" change="+2" trend="up" icon={Target} color="purple" />
          <MetricCard title="Organic Traffic" value="24.5K" change="+18%" trend="up" icon={LineChartIcon} color="green" />
          <MetricCard title="Total Backlinks" value="1,240" change="+124" trend="up" icon={LinkIcon} color="blue" />
          <MetricCard title="Site Health" value="92%" change="-1%" trend="down" icon={Activity} color="orange" />
        </div>

        {/* LEFT MAIN AREA (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* TRAFFIC CHART PLACEHOLDER */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Organic Traffic Growth (6 Months)</h2>
              <select className="bg-[#12121A] border border-white/10 rounded-lg px-3 py-1 text-sm text-slate-300 outline-none">
                <option>Last 6 Months</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            {/* Visual Placeholder for a Chart */}
            <div className="flex-1 w-full bg-[#12121A] border border-white/5 rounded-xl relative overflow-hidden flex items-end">
               {/* Grid lines */}
               <div className="absolute inset-0 flex flex-col justify-between py-10 px-4 opacity-10">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-full h-[1px] bg-white"></div>)}
               </div>
               {/* SVG Graph Mock */}
               <div className="absolute bottom-0 left-0 w-full h-[70%]">
                 <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-green-500 stroke-[0.5] fill-green-500/10">
                   <path d="M0,100 L0,80 C20,70 30,90 50,60 C70,30 80,40 100,10 L100,100 Z" />
                 </svg>
               </div>
               {/* Graph line glow */}
               <div className="absolute bottom-0 left-0 w-full h-[70%]">
                 <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-green-400 stroke-[1] fill-none drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
                   <path d="M0,80 C20,70 30,90 50,60 C70,30 80,40 100,10" />
                 </svg>
               </div>
            </div>
          </div>

          {/* KEYWORD RANKINGS */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Top Keyword Rankings</h2>
              <button className="text-sm text-primary hover:text-white transition">View all keywords</button>
            </div>
            
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400">
                    <th className="pb-3 font-medium">Keyword</th>
                    <th className="pb-3 font-medium">Position</th>
                    <th className="pb-3 font-medium">Volume</th>
                    <th className="pb-3 font-medium">KD</th>
                    <th className="pb-3 font-medium text-right">Traffic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <KeywordRow kw="ai operating system" pos="3" change="+2" vol="12.5K" kd="45" traffic="4.2K" />
                  <KeywordRow kw="nextjs dashboard template" pos="1" change="0" vol="8.2K" kd="32" traffic="3.8K" />
                  <KeywordRow kw="build crm fast" pos="5" change="-1" vol="4.1K" kd="28" traffic="1.1K" />
                  <KeywordRow kw="automated seo tools" pos="12" change="+4" vol="22K" kd="65" traffic="850" />
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1 col) */}
        <div className="flex flex-col gap-6">
          
          {/* TECHNICAL ISSUES */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6">
            <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400" /> Technical Issues
            </h2>
            <div className="space-y-4">
              <IssueCard type="Error" title="404 Pages Found" count="3" color="red" />
              <IssueCard type="Warning" title="Missing Meta Descriptions" count="12" color="orange" />
              <IssueCard type="Notice" title="Slow Page Load Time" count="2" color="yellow" />
            </div>
            <button className="w-full mt-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition">Fix Issues via AI</button>
          </div>

          {/* COMPETITOR ANALYSIS */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6 flex-1">
             <h2 className="text-base font-semibold mb-5">Competitor Tracker</h2>
             <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-[#12121A] rounded-xl border border-white/5">
                 <span className="text-sm">competitor1.com</span>
                 <span className="text-xs text-red-500 font-medium">DA 52</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-[#12121A] rounded-xl border border-white/5">
                 <span className="text-sm">agency-x.dev</span>
                 <span className="text-xs text-green-500 font-medium">DA 41</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-[#12121A] rounded-xl border border-white/5 border-dashed text-slate-500 cursor-pointer hover:text-white transition">
                 <span className="text-sm flex items-center gap-2"><Plus size={14}/> Add Competitor</span>
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- Helper Components ---

function MetricCard({ title, value, change, trend, icon: Icon, color }: any) {
  const colorMap: any = {
    purple: "text-purple-500 bg-purple-500/10",
    green: "text-green-500 bg-green-500/10",
    blue: "text-blue-500 bg-blue-500/10",
    orange: "text-orange-500 bg-orange-500/10",
  };
  
  return (
    <div className="bg-[#0B0B14] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-[120px]">
      <div className="flex justify-between items-start">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={16} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${trend === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>
      <div>
        <span className="block text-2xl font-bold mt-2">{value}</span>
        <span className="text-xs text-slate-400">{title}</span>
      </div>
    </div>
  );
}

function KeywordRow({ kw, pos, change, vol, kd, traffic }: any) {
  const isUp = change.startsWith('+');
  const isNeutral = change === '0';
  
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition">
      <td className="py-3 font-medium text-slate-200">{kw}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <span>{pos}</span>
          {!isNeutral && (
             <span className={`text-[10px] ${isUp ? 'text-green-500' : 'text-red-500'} flex items-center`}>
               {isUp ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {change.replace(/[-+]/g, '')}
             </span>
          )}
        </div>
      </td>
      <td className="py-3 text-slate-400">{vol}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{width: `${kd}%`}}></div>
          </div>
          <span className="text-xs text-slate-400">{kd}</span>
        </div>
      </td>
      <td className="py-3 text-right font-medium text-blue-400">{traffic}</td>
    </tr>
  );
}

function IssueCard({ type, title, count, color }: any) {
  const colorMap: any = {
    red: "text-red-400 border-red-400/20 bg-red-400/10",
    orange: "text-orange-400 border-orange-400/20 bg-orange-400/10",
    yellow: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10",
  };
  
  return (
    <div className="flex items-center justify-between p-3 bg-[#12121A] border border-white/5 rounded-xl">
      <div>
        <div className={`text-[10px] uppercase font-bold tracking-wider inline-block px-1.5 py-0.5 rounded border mb-1 ${colorMap[color]}`}>
          {type}
        </div>
        <p className="text-sm font-medium text-slate-200">{title}</p>
      </div>
      <span className="text-lg font-bold text-slate-400">{count}</span>
    </div>
  );
}
