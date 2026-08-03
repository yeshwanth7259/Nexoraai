"use client";

import { useState } from "react";
import { Video, Sparkles, Zap, Loader2, Play, Download, Settings, Share2, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoStudioPage() {
  const [appState, setAppState] = useState<'input' | 'generating' | 'result'>('input');
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [generationStep, setGenerationStep] = useState(0);
  const [videoDescription, setVideoDescription] = useState("");

  const steps = [
    "Analyzing video prompt...",
    "Generating scenes and composition...",
    "Rendering frames...",
    "Finalizing video..."
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setAppState('generating');
    setGenerationStep(0);

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < 2) {
        currentStep++;
        setGenerationStep(currentStep);
      }
    }, 8000);

    try {
      const response = await fetch('/api/studios/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to start video generation");
      }

      setVideoDescription(data.description || prompt);
      const operationName = data.operationName;

      // Start polling
      let isDone = false;
      let finalVideoUri = "";
      
      while (!isDone) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10s between checks
        
        const statusRes = await fetch(`/api/studios/video/status?operationName=${encodeURIComponent(operationName)}`);
        const statusData = await statusRes.json();
        
        if (!statusRes.ok) {
          console.error("Status error:", statusData);
          throw new Error(statusData.error || "Polling failed");
        }
        
        if (statusData.done) {
          isDone = true;
          finalVideoUri = statusData.videoUri;
        }
      }

      clearInterval(progressInterval);
      setGenerationStep(3);

      setVideoUrl(finalVideoUri);
      setTimeout(() => setAppState('result'), 1000);
    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      setAppState('input');
      alert("Error generating video. Check console for details.");
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
                <div className="mb-6 relative w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 flex items-center justify-center border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                  <Film className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-4xl sm:text-[3.5rem] leading-tight font-bold mb-4 tracking-tight text-foreground">
                  Nexora <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Video</span> <span className="text-yellow-500">Gen</span>
                </h1>
                <p className="text-textMuted max-w-2xl mx-auto text-base">
                  Describe the video you want to create, and let Nexora's AI model generate stunning cinematic visuals instantly.
                </p>
              </div>

              <div className="w-full max-w-3xl relative group mb-10 shrink-0">
                <div className="rounded-[24px] p-[1px] bg-gradient-to-r from-red-500/40 via-orange-500/40 to-yellow-500/40 group-hover:from-red-500/70 group-hover:via-orange-500/70 group-hover:to-yellow-500/70 transition-all duration-500 relative shadow-[0_0_40px_-15px_rgba(239,68,68,0.3)]">
                  <div className="relative bg-bgDarker rounded-[23px] flex flex-col pt-2">
                    <div className="px-5 pt-4 pb-2 flex items-center gap-2 text-sm text-textMuted font-medium">
                      <Sparkles size={16} className="text-red-400" /> Describe your scene...
                    </div>
                    
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A cinematic drone shot flying over a futuristic neon city during a rainy night, 4k, photorealistic."
                      className="w-full bg-transparent border-none outline-none text-lg text-foreground px-5 pb-6 pt-2 min-h-[120px] resize-none focus:ring-0 placeholder:text-slate-600"
                    />

                    <div className="px-3 pb-3 flex items-center justify-between flex-wrap gap-4 mt-auto border-t border-borders pt-3">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-hoverBg hover:bg-hoverBg text-xs text-foreground flex items-center gap-2 transition">
                          <Settings size={14} /> Advanced Settings
                        </button>
                      </div>
                      <button 
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        className="px-6 h-10 bg-gradient-to-r from-red-500 to-orange-600 hover:opacity-90 text-foreground rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                      >
                        Generate <Zap size={16} className="fill-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm shrink-0 flex-wrap justify-center">
                <span className="text-textMuted font-medium">Try these prompts:</span>
                {[
                  'Cinematic space nebula', 
                  'Cyberpunk street market', 
                  'Time-lapse blooming flower'
                ].map((p) => (
                  <button 
                    key={p}
                    onClick={() => setPrompt(p)} 
                    className="px-4 py-2 rounded-full border border-borders bg-bgDarker hover:bg-hoverBg text-foreground hover:text-foreground transition flex items-center gap-2 font-medium"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* GENERATING VIEW */}
        {appState === 'generating' && (
          <motion.div 
            key="generating-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full"
          >
            <div className="mb-12 relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-red-500/20 rounded-full animate-ping duration-1000"></div>
              <div className="w-16 h-16 bg-gradient-to-tr from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.5)] z-10">
                <Video className="text-foreground w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-8">Generating Video</h2>
            <div className="w-full space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${index <= generationStep ? 'text-foreground' : 'text-slate-600'}`}>
                      {step}
                    </span>
                    {index === generationStep && <Loader2 size={16} className="text-red-400 animate-spin" />}
                  </div>
                  <div className="w-full h-1.5 bg-hoverBg rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${index < generationStep ? 'bg-red-500' : index === generationStep ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-transparent'}`}
                      initial={{ width: "0%" }}
                      animate={{ width: index <= generationStep ? "100%" : "0%" }}
                      transition={{ duration: index === generationStep ? 2.0 : 0.2 }}
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
            className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto"
          >
            <div className="w-full flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                  <Sparkles className="text-red-400" /> Generated Video
                </h2>
                <p className="text-textMuted text-sm max-w-xl truncate">{videoDescription}</p>
              </div>
              <button 
                onClick={() => setAppState('input')}
                className="px-4 py-2 bg-hoverBg hover:bg-white/20 rounded-lg text-sm font-medium transition"
              >
                Create New Video
              </button>
            </div>
            
            <div className="w-full aspect-video bg-black rounded-2xl border border-borders overflow-hidden shadow-2xl relative flex flex-col justify-center items-center group">
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-textMuted">
                  <Film size={48} className="mb-4 opacity-50" />
                  <p>Video rendering failed</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-foreground rounded-xl font-medium transition flex items-center gap-2">
                <Download size={18} /> Download HD
              </button>
              <button className="px-5 py-2.5 bg-bgDarker border border-borders hover:bg-hoverBg text-foreground rounded-xl font-medium transition flex items-center gap-2">
                <Share2 size={18} /> Share
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
