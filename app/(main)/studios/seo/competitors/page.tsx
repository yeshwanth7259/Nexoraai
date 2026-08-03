"use client";

import { useState } from "react";
import { Search, AlertCircle, RefreshCw, Zap, Users, Globe, Link as LinkIcon, BarChart3, TrendingDown, Target, Plus } from "lucide-react";

export default function CompetitorsPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [domain1, setDomain1] = useState("");
  const [domain2, setDomain2] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async () => {
    if(!domain1 || !domain2) return;
    setAnalyzing(true);
    setError("");
    
    try {
      const res = await fetch("/api/seo/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain1, domain2 })
      });
      
      const result: any = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to analyze competitors");
      }
      
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* VS SEARCH BAR */}
      <div className="w-full bg-background border border-borders rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-bgDarker rounded-full border border-borders flex items-center justify-center text-xs font-bold text-textMuted z-10 hidden md:flex">
          VS
        </div>

        <div className="flex-1 w-full relative">
          <Globe size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
          <input 
            type="text" 
            placeholder="Your Domain (e.g., nexora.ai)" 
            className="w-full bg-bgDarker border border-blue-500/20 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-blue-500/50 transition"
            value={domain1}
            onChange={(e) => setDomain1(e.target.value)}
          />
        </div>

        <div className="flex-1 w-full relative">
          <Target size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
          <input 
            type="text" 
            placeholder="Competitor Domain (e.g., competitorsite.com)" 
            className="w-full bg-bgDarker border border-purple-500/20 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-purple-500/50 transition"
            value={domain2}
            onChange={(e) => setDomain2(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={analyzing || !domain1 || !domain2}
          className="w-full md:w-auto px-8 py-2.5 bg-primary hover:bg-accent rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(109,91,255,0.3)] shrink-0 z-10"
        >
          {analyzing ? (
            <><RefreshCw size={16} className="animate-spin" /> Analyzing...</>
          ) : (
            <><Zap size={16} className="text-white" /> Compare</>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* SIDE BY SIDE METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* DOMAIN 1 */}
             <div className="bg-background border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
               <h2 className="text-xl font-bold text-white mb-6 relative z-10">{data.domains.d1}</h2>
               
               <div className="grid grid-cols-2 gap-4 relative z-10">
                 <div className="bg-bgDarker p-4 rounded-2xl border border-borders">
                    <p className="text-xs text-textMuted mb-1 flex items-center gap-1"><BarChart3 size={12}/> Domain Authority</p>
                    <p className="text-2xl font-bold text-white">{data.metrics.d1.authority}</p>
                 </div>
                 <div className="bg-bgDarker p-4 rounded-2xl border border-borders">
                    <p className="text-xs text-textMuted mb-1 flex items-center gap-1"><Users size={12}/> Est. Traffic</p>
                    <p className="text-2xl font-bold text-blue-400">{formatNumber(data.metrics.d1.organicTraffic)}</p>
                 </div>
                 <div className="bg-bgDarker p-4 rounded-2xl border border-borders">
                    <p className="text-xs text-textMuted mb-1 flex items-center gap-1"><Search size={12}/> Keywords</p>
                    <p className="text-xl font-bold text-foreground">{formatNumber(data.metrics.d1.organicKeywords)}</p>
                 </div>
                 <div className="bg-bgDarker p-4 rounded-2xl border border-borders">
                    <p className="text-xs text-textMuted mb-1 flex items-center gap-1"><LinkIcon size={12}/> Backlinks</p>
                    <p className="text-xl font-bold text-foreground">{formatNumber(data.metrics.d1.backlinks)}</p>
                 </div>
               </div>
             </div>

             {/* DOMAIN 2 */}
             <div className="bg-background border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full"></div>
               <h2 className="text-xl font-bold text-white mb-6 relative z-10">{data.domains.d2}</h2>
               
               <div className="grid grid-cols-2 gap-4 relative z-10">
                 <div className="bg-bgDarker p-4 rounded-2xl border border-borders">
                    <p className="text-xs text-textMuted mb-1 flex items-center gap-1"><BarChart3 size={12}/> Domain Authority</p>
                    <p className="text-2xl font-bold text-white">{data.metrics.d2.authority}</p>
                 </div>
                 <div className="bg-bgDarker p-4 rounded-2xl border border-borders">
                    <p className="text-xs text-textMuted mb-1 flex items-center gap-1"><Users size={12}/> Est. Traffic</p>
                    <p className="text-2xl font-bold text-purple-400">{formatNumber(data.metrics.d2.organicTraffic)}</p>
                 </div>
                 <div className="bg-bgDarker p-4 rounded-2xl border border-borders">
                    <p className="text-xs text-textMuted mb-1 flex items-center gap-1"><Search size={12}/> Keywords</p>
                    <p className="text-xl font-bold text-foreground">{formatNumber(data.metrics.d2.organicKeywords)}</p>
                 </div>
                 <div className="bg-bgDarker p-4 rounded-2xl border border-borders">
                    <p className="text-xs text-textMuted mb-1 flex items-center gap-1"><LinkIcon size={12}/> Backlinks</p>
                    <p className="text-xl font-bold text-foreground">{formatNumber(data.metrics.d2.backlinks)}</p>
                 </div>
               </div>
             </div>

          </div>

          {/* OVERLAP AND GAPS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* OVERLAP CHART */}
            <div className="bg-background border border-borders rounded-3xl p-6 flex flex-col items-center justify-center text-center">
               <h3 className="text-sm font-semibold mb-6">Keyword Overlap</h3>
               
               {/* CSS Venn Diagram Mock */}
               <div className="relative w-48 h-32 mb-6">
                 <div className="absolute left-0 w-32 h-32 rounded-full border-4 border-blue-500/50 bg-blue-500/10 flex items-center justify-center -translate-x-4 mix-blend-screen"></div>
                 <div className="absolute right-0 w-32 h-32 rounded-full border-4 border-purple-500/50 bg-purple-500/10 flex items-center justify-center translate-x-4 mix-blend-screen"></div>
                 <div className="absolute inset-0 flex items-center justify-center z-10">
                   <span className="text-xl font-bold text-white drop-shadow-md">{data.overlap.percentage}%</span>
                 </div>
               </div>

               <p className="text-sm text-textMuted">
                 You share <span className="font-bold text-white">{formatNumber(data.overlap.shared)}</span> keywords with this competitor.
               </p>
            </div>

            {/* CONTENT GAPS TABLE */}
            <div className="lg:col-span-2 bg-background border border-borders rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-semibold flex items-center gap-2"><TrendingDown size={18} className="text-orange-400"/> Content Gaps</h3>
               <button className="text-xs font-medium text-primary hover:text-white transition">View All Gaps</button>
              </div>
              <p className="text-xs text-textMuted mb-4">Keywords they rank for, but you don't. (Opportunities for new content)</p>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-borders text-textMuted">
                      <th className="pb-3 font-medium">Keyword</th>
                      <th className="pb-3 font-medium text-center">Their Pos.</th>
                      <th className="pb-3 font-medium text-center">Your Pos.</th>
                      <th className="pb-3 font-medium text-right">Volume</th>
                      <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.contentGaps.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition">
                        <td className="py-3 font-medium text-foreground">{row.keyword}</td>
                        <td className="py-3 text-center text-purple-400 font-bold">{row.d2Position}</td>
                        <td className="py-3 text-center text-textMuted">{row.d1Position}</td>
                        <td className="py-3 text-right text-textMuted">{formatNumber(row.volume)}</td>
                        <td className="py-3 text-right">
                           <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-md text-xs font-medium transition flex items-center gap-1 ml-auto">
                             <Plus size={12} /> Add to Plan
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
