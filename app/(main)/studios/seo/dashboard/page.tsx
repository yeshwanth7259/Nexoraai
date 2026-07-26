"use client";

import { useState } from "react";
import { 
  LineChart as LineChartIcon, Search, AlertCircle, ArrowUpRight, 
  ArrowDownRight, Target, Link as LinkIcon, Activity, Zap, RefreshCw, Plus, CheckCircle, Clock, FileText, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";

export default function SEODashboardPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async () => {
    if(!url) return;
    setAnalyzing(true);
    setError("");
    
    try {
      const res = await fetch("/api/seo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to analyze");
      }
      
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* ON-PAGE ANALYZER TOOL */}
      <div className="w-full bg-[#0B0B14] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Enter a URL to run an instant AI Audit (e.g., https://nexora.ai)..." 
          className="flex-1 bg-transparent border-none text-[15px] outline-none text-white placeholder:text-slate-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
        />
        <button 
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-6 py-2.5 bg-primary hover:bg-accent rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(109,91,255,0.3)]"
        >
          {analyzing ? (
            <><RefreshCw size={16} className="animate-spin" /> Analyzing...</>
          ) : (
            <><Zap size={16} className="text-white" /> AI Audit</>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* DEFAULT VIEW VS ANALYZED VIEW */}
      {!data ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* TOP METRICS (Premium/Dummy placeholders before analysis) */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <PremiumMetricCard title="Domain Authority" value="-" desc="Requires Premium Integration" icon={Target} color="purple" />
            <PremiumMetricCard title="Total Backlinks" value="-" desc="Requires Premium Integration" icon={LinkIcon} color="blue" />
            <PremiumMetricCard title="Organic Traffic" value="-" desc="Requires Google Analytics" icon={LineChartIcon} color="green" />
            <PremiumMetricCard title="Keyword Positions" value="-" desc="Requires Premium Integration" icon={Search} color="orange" />
          </div>
          
          <div className="lg:col-span-4 h-[300px] bg-[#0B0B14] border border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-500">
             <Activity size={48} className="mb-4 opacity-20" />
             <p>Enter a URL above to run a comprehensive AI SEO Audit</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
          
          {/* MAIN SCORE & HEALTH */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* OVERALL SCORE */}
            <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6 flex items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full"></div>
              <div className="relative z-10 w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center bg-black/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <span className="text-3xl font-bold text-white">{data.score}</span>
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white mb-1">SEO Health Score</h2>
                <p className="text-sm text-slate-400 mb-3">Target URL: <span className="text-slate-200">{data.url}</span></p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-bold tracking-wider uppercase">Performance</span>
                  <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-wider uppercase">Content</span>
                </div>
              </div>
            </div>

            {/* QUICK METRICS */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard title="Word Count" value={data.metrics.wordCount} icon={FileText} color="blue" />
              <MetricCard title="Load Time" value={`${data.metrics.loadTimeMs}ms`} icon={Clock} color="orange" />
              <MetricCard title="Internal Links" value={data.metrics.internalLinks} icon={LinkIcon} color="purple" />
              <MetricCard title="Total Images" value={data.metrics.totalImages} icon={ImageIcon} color="green" />
            </div>

          </div>

          {/* LEFT MAIN AREA */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* ON-PAGE TECHNICAL DETAILS */}
            <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Activity size={18} className="text-blue-400" /> On-Page SEO Details
              </h2>
              
              <div className="space-y-6">
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-sm font-medium text-slate-300">Title Tag</h3>
                    <span className={`text-xs ${data.metrics.titleLength >= 30 && data.metrics.titleLength <= 60 ? 'text-green-400' : 'text-orange-400'}`}>
                      {data.metrics.titleLength} chars
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl text-sm border border-white/10 break-all">
                    {data.metrics.title || <span className="text-red-400 italic">Missing</span>}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-sm font-medium text-slate-300">Meta Description</h3>
                    <span className={`text-xs ${data.metrics.descriptionLength >= 120 && data.metrics.descriptionLength <= 160 ? 'text-green-400' : 'text-orange-400'}`}>
                      {data.metrics.descriptionLength} chars
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl text-sm border border-white/10 text-slate-300 break-all">
                    {data.metrics.description || <span className="text-red-400 italic">Missing</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                   <div>
                     <p className="text-xs text-slate-500 mb-1">H1 Tags</p>
                     <p className={`text-lg font-bold ${data.metrics.h1Count === 1 ? 'text-green-400' : 'text-red-400'}`}>{data.metrics.h1Count}</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 mb-1">H2 Tags</p>
                     <p className="text-lg font-bold text-slate-200">{data.metrics.h2Count}</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 mb-1">External Links</p>
                     <p className="text-lg font-bold text-slate-200">{data.metrics.externalLinks}</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 mb-1">Missing Image Alt</p>
                     <p className={`text-lg font-bold ${data.metrics.imagesWithoutAlt === 0 ? 'text-green-400' : 'text-orange-400'}`}>{data.metrics.imagesWithoutAlt}</p>
                   </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            
            {/* TECHNICAL ISSUES */}
            <div className="bg-[#0B0B14] border border-white/5 rounded-3xl p-6">
              <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400" /> Discovered Issues
              </h2>
              
              {data.issues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                   <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-3">
                     <CheckCircle size={24} />
                   </div>
                   <p className="text-sm font-medium text-slate-200">Perfect Score!</p>
                   <p className="text-xs text-slate-400 mt-1">No technical issues found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.issues.map((issue: any, i: number) => (
                    <IssueCard 
                      key={i} 
                      type={issue.type} 
                      title={issue.message} 
                      color={issue.type === 'Error' ? 'red' : issue.type === 'Warning' ? 'orange' : 'yellow'} 
                    />
                  ))}
                </div>
              )}
              
              {data.issues.length > 0 && (
                <button className="w-full mt-5 py-2.5 rounded-xl bg-primary hover:bg-accent text-white text-sm font-medium transition shadow-[0_0_15px_rgba(109,91,255,0.4)] flex items-center justify-center gap-2">
                  <Zap size={14} /> Fix with AI
                </button>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

function MetricCard({ title, value, icon: Icon, color }: any) {
  const colorMap: any = {
    purple: "text-purple-400 bg-purple-500/10",
    green: "text-green-400 bg-green-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    orange: "text-orange-400 bg-orange-500/10",
  };
  
  return (
    <div className="bg-[#0B0B14] border border-white/5 rounded-2xl p-4 flex flex-col justify-center h-[120px]">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}>
        <Icon size={16} />
      </div>
      <div>
        <span className="block text-xl font-bold text-white mb-0.5">{value}</span>
        <span className="text-[11px] text-slate-400">{title}</span>
      </div>
    </div>
  );
}

function PremiumMetricCard({ title, value, desc, icon: Icon, color }: any) {
  const colorMap: any = {
    purple: "text-purple-500/50 bg-purple-500/5 border-purple-500/10",
    green: "text-green-500/50 bg-green-500/5 border-green-500/10",
    blue: "text-blue-500/50 bg-blue-500/5 border-blue-500/10",
    orange: "text-orange-500/50 bg-orange-500/5 border-orange-500/10",
  };
  
  return (
    <div className={`border rounded-2xl p-5 flex flex-col justify-between h-[120px] relative overflow-hidden group ${colorMap[color]}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[10px] uppercase tracking-wider font-bold text-white bg-black/60 px-2 py-1 rounded">Connect Integration</span>
      </div>
      <div className="flex justify-between items-start opacity-50">
        <Icon size={20} />
      </div>
      <div className="opacity-50">
        <span className="block text-2xl font-bold mt-2">{value}</span>
        <span className="text-xs">{title}</span>
      </div>
    </div>
  );
}

function IssueCard({ type, title, color }: any) {
  const colorMap: any = {
    red: "text-red-400 border-red-400/20 bg-red-400/10",
    orange: "text-orange-400 border-orange-400/20 bg-orange-400/10",
    yellow: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10",
  };
  
  return (
    <div className="flex items-start gap-3 p-3 bg-[#12121A] border border-white/5 rounded-xl">
      <div className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border mt-0.5 shrink-0 ${colorMap[color]}`}>
        {type}
      </div>
      <p className="text-xs font-medium text-slate-300 leading-snug">{title}</p>
    </div>
  );
}
