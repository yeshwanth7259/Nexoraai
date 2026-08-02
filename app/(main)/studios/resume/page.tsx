"use client";

import { useState, useRef } from "react";
import { FileText, Sparkles, CheckCircle2, AlertTriangle, ChevronRight, Briefcase, Upload } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseFileToText } from "@/utils/file-parser";

export default function ResumeMakerPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{
    oldScore: number;
    newScore: number;
    issues: string[];
    optimizedResume: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setError("Please provide both a Job Description and your current Resume text.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/studios/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, resumeText }),
      });

      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze resume");

      setResult({
        oldScore: data.oldScore || data.score || 0,
        newScore: data.newScore || 95,
        issues: data.issues,
        optimizedResume: data.optimizedResume,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const text = await parseFileToText(file);
      setResumeText(text);
    } catch (err: any) {
      setError(err.message || "Failed to parse file.");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500 bg-green-500/10 border-green-500/20";
    if (score >= 60) return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto text-white p-4 md:p-8 pb-32">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Resume Maker</h1>
            <p className="text-slate-400 text-sm">Analyze and optimize your resume for ATS tracking</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INPUT COLUMN */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#0B0B14] rounded-2xl border border-white/5 p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Briefcase size={18} className="text-purple-400" /> 1. Target Job Description
            </h2>
            <textarea
              className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 resize-none"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="bg-[#0B0B14] rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText size={18} className="text-blue-400" /> 2. Current Resume
              </h2>
              <div>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  className="hidden"
                  id="resume-upload"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <label
                  htmlFor="resume-upload"
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg transition ${
                    isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-500/20"
                  }`}
                >
                  {isUploading ? <Sparkles className="animate-spin" size={14} /> : <Upload size={14} />}
                  {isUploading ? "Extracting..." : "Upload File"}
                </label>
              </div>
            </div>
            <textarea
              className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none"
              placeholder="Paste your current resume content here or upload a file..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 ${
              isAnalyzing ? "bg-purple-600/50 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"
            }`}
          >
            {isAnalyzing ? (
              <span className="animate-pulse flex items-center gap-2">
                <Sparkles size={18} className="animate-spin" /> Analyzing & Optimizing...
              </span>
            ) : (
              <>
                <Sparkles size={18} /> Generate ATS Optimized Resume
              </>
            )}
          </button>
        </div>

        {/* RESULTS COLUMN */}
        <div className="bg-[#0B0B14] rounded-2xl border border-white/5 p-6 flex flex-col h-full min-h-[600px]">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <CheckCircle2 size={18} className="text-green-400" /> Analysis Results
          </h2>

          {!result && !isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
              <FileText size={48} className="mb-4 opacity-50" />
              <p>Your optimized resume and ATS score will appear here.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mb-4"></div>
              <p className="text-purple-400 font-medium animate-pulse">Running AI Analysis...</p>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-6 h-full">
              {/* Score Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 p-5 rounded-xl bg-[#12121A] border border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-1">Old ATS Score</h3>
                      <p className="text-xs text-slate-500">Your original resume</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg border text-xl font-black ${getScoreColor(result.oldScore)}`}>
                      {result.oldScore}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-5 rounded-xl bg-[#12121A] border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-50 group-hover:opacity-100 transition duration-500" />
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                        <Sparkles size={14} className="text-purple-400" /> New ATS Score
                      </h3>
                      <p className="text-xs text-purple-300/70">Optimized for keywords</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg border text-xl font-black text-purple-400 bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                      {result.newScore}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <h3 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} /> Key Missing Elements
                </h3>
                <ul className="space-y-2">
                  {result.issues.map((issue, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <ChevronRight size={14} className="text-orange-500 shrink-0 mt-0.5" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Optimized Resume Section */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                  <Sparkles size={16} /> Your Optimized Resume
                </h3>
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[600px] markdown-body prose prose-invert prose-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.optimizedResume}
                  </ReactMarkdown>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(result.optimizedResume)}
                  className="mt-4 py-2.5 w-full rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
