"use client";

import { useState } from "react";
import { Search, AlertCircle, RefreshCw, Zap, TrendingUp, BarChart2, Hash, DollarSign, Filter, Download } from "lucide-react";

export default function KeywordResearchPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async () => {
    if(!keyword) return;
    setAnalyzing(true);
    setError("");
    
    try {
      const res = await fetch("/api/seo/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword })
      });
      
      const result: any = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to generate keywords");
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

  const getIntentColor = (intent: string) => {
    switch (intent.toLowerCase()) {
      case 'informational': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'commercial': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'transactional': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'navigational': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      default: return 'text-slate-400 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* SEARCH BAR */}
      <div className="w-full bg-[#0B0B14] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
          <Hash size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Enter a seed keyword (e.g., 'crm software')..." 
          className="flex-1 bg-transparent border-none text-[15px] outline-none text-white placeholder:text-slate-500"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
        />
        <button 
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-6 py-2.5 bg-primary hover:bg-accent rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(109,91,255,0.3)]"
        >
          {analyzing ? (
            <><RefreshCw size={16} className="animate-spin" /> Generating...</>
          ) : (
            <><Zap size={16} className="text-white" /> AI Research</>
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
          
          {/* OVERVIEW CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0B0B14] border border-white/5 rounded-2xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                <Search size={16} /> <span className="text-sm font-medium">Seed Keyword</span>
              </div>
              <p className="text-2xl font-bold text-white capitalize">{data.seedKeyword}</p>
            </div>
            
            <div className="bg-[#0B0B14] border border-white/5 rounded-2xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                <BarChart2 size={16} /> <span className="text-sm font-medium">Total Volume (Group)</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatNumber(data.totalVolume)}</p>
            </div>
            
            <div className="bg-[#0B0B14] border border-white/5 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                <TrendingUp size={16} /> <span className="text-sm font-medium">Average Difficulty</span>
              </div>
              <div className="flex items-center gap-3">
                 <p className="text-2xl font-bold text-white">{data.averageDifficulty}/100</p>
                 <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${data.averageDifficulty}%` }}></div>
                 </div>
              </div>
            </div>
          </div>

          {/* RESULTS TABLE */}
          <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-semibold">Generated Keyword Clusters</h2>
               <div className="flex gap-2">
                 <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition">
                   <Filter size={16} />
                 </button>
                 <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition">
                   <Download size={16} />
                 </button>
               </div>
             </div>

             <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400">
                    <th className="pb-4 font-medium px-4">Keyword</th>
                    <th className="pb-4 font-medium px-4 text-center">Intent</th>
                    <th className="pb-4 font-medium px-4 text-right">Volume</th>
                    <th className="pb-4 font-medium px-4">Difficulty (KD)</th>
                    <th className="pb-4 font-medium px-4 text-right">Est. CPC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.results.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition">
                      <td className="py-4 px-4 font-medium text-slate-200">{row.keyword}</td>
                      <td className="py-4 px-4 text-center">
                         <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border ${getIntentColor(row.intent)}`}>
                           {row.intent}
                         </span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-300">{formatNumber(row.volume)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-300 w-6">{row.difficulty}</span>
                          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${row.difficulty > 70 ? 'bg-red-500' : row.difficulty > 30 ? 'bg-orange-500' : 'bg-green-500'}`} 
                              style={{width: `${row.difficulty}%`}}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-slate-400 flex items-center justify-end gap-1">
                         <DollarSign size={12} /> {row.cpc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
