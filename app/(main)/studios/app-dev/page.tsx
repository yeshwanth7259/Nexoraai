"use client";

import { useState } from "react";
import { Smartphone, Sparkles, Send, Loader2, Code2, Zap, ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AppDevStudioPage() {
  const [appState, setAppState] = useState<'input' | 'analyzing' | 'result'>('input');
  const [prompt, setPrompt] = useState("");
  const [generatedFiles, setGeneratedFiles] = useState<{ [key: string]: string }>({});
  const [activeFile, setActiveFile] = useState("App.js");
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    "Analyzing Android app requirements...",
    "Designing mobile interface...",
    "Writing React Native code...",
    "Finalizing Expo setup & packages..."
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setAppState('analyzing');
    setAnalysisStep(0);

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < 3) {
        currentStep++;
        setAnalysisStep(currentStep);
      }
    }, 1500);

    try {
      const response = await fetch('/api/studios/app-dev/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setAnalysisStep(3);

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate app code");
      }

      setGeneratedFiles(data.files || {});
      setActiveFile("App.js");
      setTimeout(() => setAppState('result'), 800);
    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      setAppState('input');
      alert("Error generating app. Check console for details.");
    }
  };

  const handleDownload = async () => {
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      Object.entries(generatedFiles).forEach(([filename, content]) => {
        zip.file(filename, content);
      });
      
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "android-app-source.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading zip", error);
      alert("Failed to download ZIP. You can manually copy the code.");
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] text-foreground overflow-hidden flex flex-col bg-background">
      <AnimatePresence mode="wait">
        
        {/* INPUT VIEW */}
        {appState === 'input' && (
          <motion.div 
            key="input-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 w-full overflow-y-auto custom-scrollbar"
          >
            <div className="flex flex-col items-center min-h-full pt-12 pb-16 px-6 md:px-12 max-w-[1000px] mx-auto">
              <div className="mb-10 text-center flex flex-col items-center shrink-0 w-full">
                <div className="mb-6 relative w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                  <Smartphone className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-4xl sm:text-[3.5rem] leading-tight font-bold mb-4 tracking-tight text-foreground">
                  Nexora <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Android</span> <span className="text-purple-500">Builder</span>
                </h1>
                <p className="text-textMuted max-w-2xl mx-auto text-base">
                  Describe your mobile app idea, and let Nexora generate a fully functional Expo Android codebase ready for download.
                </p>
              </div>

              <div className="w-full max-w-3xl relative group mb-10 shrink-0">
                <div className="rounded-[24px] p-[1px] bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/40 group-hover:from-blue-500/70 group-hover:via-indigo-500/70 group-hover:to-purple-500/70 transition-all duration-500 relative shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]">
                  <div className="relative bg-bgDarker rounded-[23px] flex flex-col pt-2">
                    <div className="px-5 pt-4 pb-2 flex items-center gap-2 text-sm text-textMuted font-medium">
                      <Sparkles size={16} className="text-blue-400" /> Describe your Android app...
                    </div>
                    
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A food delivery app with a home screen showing nearby restaurants, a search bar, and a bottom navigation menu."
                      className="w-full bg-transparent border-none outline-none text-lg text-foreground px-5 pb-6 pt-2 min-h-[120px] resize-none focus:ring-0 placeholder:text-slate-600"
                    />

                    <div className="px-3 pb-3 flex items-center justify-end flex-wrap gap-4 mt-auto border-t border-borders pt-3">
                      <button 
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        className="px-6 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-foreground rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                      >
                        Build Android App <Zap size={16} className="fill-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm shrink-0 flex-wrap justify-center">
                <span className="text-textMuted font-medium">Try these:</span>
                {['Fitness Tracker App', 'E-commerce Store', 'Task Management App'].map((p) => (
                  <button 
                    key={p}
                    onClick={() => setPrompt(`Build an Android ${p} with a modern UI, dark mode, and bottom navigation using Expo.`)} 
                    className="px-4 py-2 rounded-full border border-borders bg-bgDarker hover:bg-hoverBg text-foreground hover:text-foreground transition flex items-center gap-2 font-medium"
                  >
                    {p} <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ANALYZING VIEW */}
        {appState === 'analyzing' && (
          <motion.div 
            key="analyzing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full"
          >
            <div className="mb-12 relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping duration-1000"></div>
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)] z-10">
                <Smartphone className="text-foreground w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-8">Compiling Android App</h2>
            <div className="w-full space-y-6">
              {analysisSteps.map((step, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${index <= analysisStep ? 'text-foreground' : 'text-slate-600'}`}>
                      {step}
                    </span>
                    {index === analysisStep && <Loader2 size={16} className="text-blue-400 animate-spin" />}
                  </div>
                  <div className="w-full h-1.5 bg-hoverBg rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${index < analysisStep ? 'bg-blue-500' : index === analysisStep ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-transparent'}`}
                      initial={{ width: "0%" }}
                      animate={{ width: index <= analysisStep ? "100%" : "0%" }}
                      transition={{ duration: index === analysisStep ? 1.5 : 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* RESULT VIEW */}
        {appState === 'result' && (
          <motion.div 
            key="result-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col w-full h-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Smartphone className="text-blue-400" /> Android App Ready
                </h2>
                <div className="flex bg-bgDarker p-1 rounded-lg border border-borders">
                  {Object.keys(generatedFiles).map(filename => (
                    <button
                      key={filename}
                      onClick={() => setActiveFile(filename)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${activeFile === filename ? 'bg-blue-500/20 text-blue-400' : 'text-textMuted hover:text-foreground'}`}
                    >
                      {filename}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleDownload}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                >
                  Download Source (ZIP)
                </button>
                <button 
                  onClick={() => setAppState('input')}
                  className="px-4 py-2 bg-hoverBg hover:bg-white/20 rounded-lg text-sm font-medium transition"
                >
                  Create New
                </button>
              </div>
            </div>
            <div className="flex-1 bg-bgDarker rounded-xl border border-borders p-6 overflow-y-auto font-mono text-sm text-green-400 whitespace-pre-wrap">
              {generatedFiles[activeFile] || "// No code available"}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
