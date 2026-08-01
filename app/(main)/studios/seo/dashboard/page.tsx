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
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Est. Monthly Organic Clicks</span>
                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{data.trafficEstimate || "0"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK METRICS */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard title="Word Count" value={data.metrics.wordCount} icon={FileText} color="blue" />
              <MetricCard title="Load Time" value={`${data.loadTimeMs}ms`} icon={Clock} color="orange" />
              <MetricCard title="Internal Links" value={data.metrics.internalLinks} icon={LinkIcon} color="purple" />
              <MetricCard title="Total Images" value={data.metrics.totalImages} icon={ImageIcon} color="green" />
            </div>

            {/* AHREFS STYLE ORGANIC TRAFFIC CHART */}
            <div className="lg:col-span-4">
              <OrganicTrafficView data={data} />
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
              
              {data.issues.length > 0 && data.aiSolutions && data.aiSolutions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h3 className="text-sm font-semibold text-purple-400 mb-4 flex items-center gap-2">
                    <Zap size={16} /> AI Actionable Solutions
                  </h3>
                  <div className="space-y-3">
                    {data.aiSolutions.map((solution: string, i: number) => (
                      <div key={i} className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          {i + 1}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{solution}</p>
                      </div>
                    ))}
                  </div>
                </div>
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

function OrganicTrafficView({ data }: { data: any }) {
  if (!data) return null;
  const history = data.trafficHistory || [0, 0, 0, 0, 0, 0];
  const max = Math.max(...history, 100);
  
  // Create an SVG path for the chart
  const points = history.map((val: number, i: number) => {
    const x = (i / (history.length - 1)) * 100;
    const y = 100 - ((val / max) * 90); // leave some padding at top
    return `${x},${y}`;
  }).join(" ");

  const fillPath = `0,100 ${points} 100,100`;

  return (
    <div className="bg-white rounded-xl p-6 text-slate-800 shadow-sm relative overflow-hidden font-sans border border-slate-200">
      {/* Top Header */}
      <h2 className="text-3xl font-normal mb-1">Organic traffic of</h2>
      <h2 className="text-3xl font-medium truncate mb-2">{data.url}</h2>
      <p className="text-sm text-slate-500 mb-6 border-b pb-4">Domain including subdomains</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Side: Stats */}
        <div className="flex flex-col">
          <div className="flex gap-6 sm:gap-12 mb-6">
            <div>
              <div className="flex items-center gap-1 text-slate-600 mb-1">
                <span className="font-medium text-[13px]">Organic traffic</span>
                <span className="text-[9px] bg-slate-200 text-slate-500 rounded-full w-3 h-3 flex items-center justify-center cursor-help">i</span>
              </div>
              <div className="text-2xl sm:text-[28px] leading-none font-medium">{data.trafficEstimate}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-slate-600 mb-1">
                <span className="font-medium text-[13px]">Traffic value</span>
                <span className="text-[9px] bg-slate-200 text-slate-500 rounded-full w-3 h-3 flex items-center justify-center cursor-help">i</span>
              </div>
              <div className="text-2xl sm:text-[28px] leading-none font-medium">{data.trafficValue}</div>
            </div>
          </div>

          <div className="bg-[#f8f9fa] rounded-lg p-4 sm:p-5 border border-slate-100 flex items-center gap-4 sm:gap-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center relative shrink-0">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                   <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#e9ecef" strokeWidth="12%" />
                   <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#FFA726" strokeWidth="12%" strokeDasharray="251.2%" strokeDashoffset={`${251.2 - (251.2 * (data.domainRating/100))}%`} strokeLinecap="round" />
                </svg>
                <span className="text-xs sm:text-sm font-bold text-slate-700">{data.domainRating}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[12px] sm:text-[13px] text-slate-700">Domain</span>
                <span className="font-medium text-[12px] sm:text-[13px] text-slate-700 flex items-center gap-1">Rating <span className="text-[9px] bg-slate-200 text-slate-500 rounded-full w-3 h-3 flex items-center justify-center">i</span></span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center relative shrink-0">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                   <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#e9ecef" strokeWidth="12%" />
                   <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#42A5F5" strokeWidth="12%" strokeDasharray="251.2%" strokeDashoffset={`${251.2 - (251.2 * (data.urlRating/100))}%`} strokeLinecap="round" />
                </svg>
                <span className="text-xs sm:text-sm font-bold text-slate-700">{data.urlRating}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[12px] sm:text-[13px] text-slate-700">URL</span>
                <span className="font-medium text-[12px] sm:text-[13px] text-slate-700 flex items-center gap-1">Rating <span className="text-[9px] bg-slate-200 text-slate-500 rounded-full w-3 h-3 flex items-center justify-center">i</span></span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-[12px] sm:text-[13px] text-slate-800 font-medium">
            Get DR and UR free with <a href="#" className="text-blue-600 hover:underline">Ahrefs SEO Toolbar</a>
          </div>
        </div>

        {/* Right Side: Chart */}
        <div className="flex flex-col w-full h-full relative pl-2 pt-6 md:pt-2 mt-4 md:mt-0">
          {/* Y Axis labels */}
          <div className="absolute right-0 top-0 bottom-6 flex flex-col justify-between text-[11px] text-slate-400 text-right pr-1 font-mono">
            <span>{max >= 1000 ? (max/1000).toFixed(1) + 'K' : max}</span>
            <span>{Math.round(max/2) >= 1000 ? (Math.round(max/2)/1000).toFixed(1) + 'K' : Math.round(max/2)}</span>
            <span>0</span>
          </div>
          
          {/* Chart Area */}
          <div className="w-full h-40 relative pr-10 border-l border-b border-slate-200">
            {/* Grid lines */}
            <div className="absolute top-0 left-0 right-0 border-t border-slate-100 w-full"></div>
            <div className="absolute top-[50%] left-0 right-0 border-t border-slate-100 w-full"></div>

            {/* SVG Chart */}
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
              <polyline 
                points={fillPath} 
                fill="#FF9800" 
                fillOpacity="0.15" 
              />
              <polyline 
                points={points} 
                fill="none" 
                stroke="#FF9800" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          {/* X Axis labels */}
          <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-1 font-mono">
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
          </div>
        </div>
      </div>
    </div>
  );
}
