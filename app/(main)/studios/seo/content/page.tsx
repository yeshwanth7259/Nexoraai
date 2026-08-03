"use client";

import { useState } from "react";
import { Zap, AlertCircle, RefreshCw, FileText, CheckCircle, Search, Type, Target, Wand2 } from "lucide-react";

export default function ContentOptimizerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async () => {
    if(!keyword || !content) return;
    setAnalyzing(true);
    setError("");
    
    try {
      const res = await fetch("/api/seo/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, content })
      });
      
      const result: any = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to analyze content");
      }
      
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 h-[calc(100vh-250px)]">
      
      {/* HEADER CONTROLS */}
      <div className="w-full bg-background border border-borders rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <Target size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Target Keyword (e.g., 'nextjs seo guide')..." 
            className="w-full bg-bgDarker border border-borders rounded-xl py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-green-500/50 transition"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={analyzing || !keyword || !content}
          className="w-full md:w-auto px-8 py-2.5 bg-primary hover:bg-accent rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(109,91,255,0.3)] shrink-0"
        >
          {analyzing ? (
            <><RefreshCw size={16} className="animate-spin" /> Scoring...</>
          ) : (
            <><Zap size={16} className="text-white" /> Analyze Content</>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* SPLIT PANE EDITOR */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* LEFT: EDITOR */}
        <div className="lg:col-span-2 bg-background border border-borders rounded-3xl p-6 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold flex items-center gap-2">
               <FileText size={18} className="text-blue-400" /> Editor
             </h2>
             <button className="flex items-center gap-2 text-xs font-medium text-purple-400 hover:text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 transition">
                <Wand2 size={14} /> AI Rewrite
             </button>
          </div>
          <textarea
            className="flex-1 w-full bg-transparent border-none outline-none resize-none text-textMuted leading-relaxed font-sans"
            placeholder="Paste your article content here to get real-time SEO scoring..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* RIGHT: SCORING & RECOMMENDATIONS */}
        <div className="bg-background border border-borders rounded-3xl p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          {!data ? (
             <div className="flex flex-col items-center justify-center h-full text-textMuted opacity-50">
                <Zap size={48} className="mb-4" />
                <p className="text-center text-sm px-4">Enter a target keyword and content, then click Analyze to see your SEO score.</p>
             </div>
          ) : (
             <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col gap-6">
                
                {/* SCORE */}
                <div className="flex items-center gap-4 bg-bgDarker p-4 rounded-2xl border border-borders">
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${data.score >= 80 ? 'border-green-500 text-green-400' : data.score >= 50 ? 'border-orange-500 text-orange-400' : 'border-red-500 text-red-400'}`}>
                    <span className="text-xl font-bold">{data.score}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Content Score</h3>
                    <p className="text-xs text-textMuted">Aim for 80+ to rank.</p>
                  </div>
                </div>

                {/* METRICS */}
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-bgDarker p-3 rounded-xl border border-borders">
                     <p className="text-[10px] text-textMuted uppercase tracking-wider mb-1">Words</p>
                     <p className="text-lg font-bold text-foreground">{data.metrics.wordCount}</p>
                   </div>
                   <div className="bg-bgDarker p-3 rounded-xl border border-borders">
                     <p className="text-[10px] text-textMuted uppercase tracking-wider mb-1">Density</p>
                     <p className={`text-lg font-bold ${data.metrics.keywordDensity > 3 ? 'text-red-400' : 'text-green-400'}`}>{data.metrics.keywordDensity}%</p>
                   </div>
                </div>

                {/* ISSUES */}
                {data.issues.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">To-Do List</h4>
                    <div className="space-y-2">
                      {data.issues.map((issue: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <p>{issue.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LSI KEYWORDS */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">LSI Keywords (NLP)</h4>
                  
                  {/* Found LSI */}
                  {data.metrics.lsiFound.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] text-green-400 uppercase tracking-wider mb-2 font-bold">Included</p>
                      <div className="flex flex-wrap gap-2">
                        {data.metrics.lsiFound.map((k: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-[11px] flex items-center gap-1">
                             <CheckCircle size={10} /> {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing LSI */}
                  {data.metrics.lsiMissing.length > 0 && (
                    <div>
                      <p className="text-[10px] text-textMuted uppercase tracking-wider mb-2 font-bold">Missing (Add these)</p>
                      <div className="flex flex-wrap gap-2">
                        {data.metrics.lsiMissing.map((k: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-white/5 text-textMuted border border-borders rounded-md text-[11px] cursor-pointer hover:bg-white/10 transition">
                             + {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

             </div>
          )}
        </div>

      </div>
    </div>
  );
}
