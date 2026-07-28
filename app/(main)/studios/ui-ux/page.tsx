"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Palette, Layout, Type, Sparkles, Download, Code2, 
  Copy, Check, Zap, Maximize2, Monitor, Smartphone,
  Plus, Image as ImageIcon, Link2, FileText, Upload,
  Figma, Send, Settings, History, Layers, MessageSquare,
  ChevronRight, ChevronDown, CheckCircle2, Loader2, Play,
  FolderOpen, MousePointer2, Wand2, Paintbrush, FileJson,
  Github, Box, ArrowRight, X, PaintBucket, Type as TypeIcon,
  Rocket, ShoppingCart, Paperclip
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AppState = 'input' | 'analyzing' | 'canvas';
type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

export default function UIUXStudioPage() {
  const [appState, setAppState] = useState<AppState>('input');
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("React + Tailwind");
  
  // Analyzing State
  const [analysisStep, setAnalysisStep] = useState(0);
  const analysisSteps = [
    "Analyzing Request...",
    "Extracting Design Tokens...",
    "Building Components...",
    "Generating Design System...",
    "Compiling Code..."
  ];

  // Canvas State
  const [responsiveMode, setResponsiveMode] = useState<ResponsiveMode>('desktop');
  const [activeVersion, setActiveVersion] = useState('Version A');
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    {role: 'ai', text: 'Design generated successfully. What would you like to refine?'}
  ]);
  
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setAppState('analyzing');
    setAnalysisStep(0);
    
    // Start fake progress for UI feel
    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < 3) {
        currentStep++;
        setAnalysisStep(currentStep);
      }
    }, 1500);

    try {
      const response = await fetch('/api/studios/ui-ux/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, framework })
      });
      
      const data = await response.json();
      
      clearInterval(progressInterval);
      setAnalysisStep(4);
      setGeneratedCode(data.code);
      
      setTimeout(() => setAppState('canvas'), 800);
    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      setAppState('input');
      alert("Failed to generate UI");
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, {role: 'user', text: chatInput}]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, {role: 'ai', text: 'Applying changes to the canvas...'}]);
    }, 1000);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] text-white overflow-hidden flex flex-col bg-[#05050A]">
      <AnimatePresence mode="wait">
        
        {/* ======================= INPUT VIEW ======================= */}
        {appState === 'input' && (
          <motion.div 
            key="input-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 w-full overflow-y-auto custom-scrollbar"
          >
            <div className="flex flex-col items-center min-h-full pt-12 pb-16 px-6 md:px-12 max-w-[1200px] mx-auto">
              {/* Header Area */}
              <div className="mb-10 text-center flex flex-col items-center shrink-0 w-full">
                <div className="mb-6 relative w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-4xl sm:text-[3.5rem] leading-tight font-bold mb-4 tracking-tight text-white">
                  Nexora <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Design</span> <span className="text-blue-500">AI</span>
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-base">
                  Describe what you want to build, upload reference images, wireframes, or brand assets, and let Nexora generate a fully editable design system and code.
                </p>
              </div>

              {/* Input Box Area */}
              <div className="w-full max-w-4xl relative group mb-10 shrink-0">
                <div className="rounded-[24px] p-[1px] bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-blue-500/40 group-hover:from-pink-500/70 group-hover:via-purple-500/70 group-hover:to-blue-500/70 transition-all duration-500 relative shadow-[0_0_40px_-15px_rgba(168,85,247,0.3)]">
                  <div className="relative bg-[#09090E] rounded-[23px] flex flex-col pt-2">
                    <div className="px-5 pt-4 pb-2 flex items-center gap-2 text-sm text-slate-400 font-medium">
                      <Sparkles size={16} className="text-purple-400" /> Describe what you want to build...
                    </div>
                    
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A dark-mode analytics dashboard with a sidebar and premium glassmorphism cards"
                      className="w-full bg-transparent border-none outline-none text-lg text-white px-5 pb-6 pt-2 min-h-[120px] resize-none focus:ring-0 placeholder:text-slate-600"
                    />

                    {/* Bottom Action Row */}
                    <div className="px-3 pb-3 flex items-center justify-between flex-wrap gap-4 mt-auto">
                      
                      {/* Left: Upload Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button className="w-10 h-10 rounded-xl bg-[#12121A] hover:bg-[#1A1A24] flex items-center justify-center text-slate-400 hover:text-white transition border border-white/5">
                          <Plus size={18} />
                        </button>
                        <button className="px-3 h-10 rounded-xl bg-[#12121A] hover:bg-[#1A1A24] flex items-center gap-2 text-xs font-semibold text-slate-300 transition border border-white/5">
                          <ImageIcon size={14} className="text-blue-400"/> Upload Image
                        </button>
                        <button className="px-3 h-10 rounded-xl bg-[#12121A] hover:bg-[#1A1A24] flex items-center gap-2 text-xs font-semibold text-slate-300 transition border border-white/5">
                          <Link2 size={14} className="text-green-400"/> Website URL
                        </button>
                        <button className="px-3 h-10 rounded-xl bg-[#12121A] hover:bg-[#1A1A24] flex items-center gap-2 text-xs font-semibold text-slate-300 transition border border-white/5">
                          <Figma size={14} className="text-pink-400"/> Figma File
                        </button>
                        <button className="px-3 h-10 rounded-xl bg-[#12121A] hover:bg-[#1A1A24] flex items-center gap-2 text-xs font-semibold text-slate-300 transition border border-white/5">
                          <Palette size={14} className="text-orange-400"/> Brand Kit
                        </button>
                      </div>

                      {/* Right: Framework & Generate */}
                      <div className="flex items-center gap-3 ml-auto">
                        <select 
                          value={framework}
                          onChange={(e) => setFramework(e.target.value)}
                          className="bg-[#12121A] border border-white/5 rounded-xl px-4 h-10 text-xs font-semibold text-slate-300 outline-none cursor-pointer appearance-none pr-9 relative hover:bg-[#1A1A24] transition"
                          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.8rem top 50%', backgroundSize: '0.65rem auto' }}
                        >
                          <option className="bg-[#12121A]">React + Tailwind</option>
                          <option className="bg-[#12121A]">HTML + CSS</option>
                        </select>
                        
                        <button 
                          onClick={handleGenerate}
                          disabled={!prompt}
                          className="px-6 h-10 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] hover:opacity-90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                        >
                          Generate <Zap size={16} className="fill-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Template Suggestions */}
              <div className="flex items-center gap-4 mb-16 text-sm shrink-0">
                <span className="text-slate-400 font-medium">Try these examples</span>
                <button onClick={() => setPrompt("A modern SaaS landing page with dark mode, glowing accents, and an animated hero section.")} className="px-4 py-2 rounded-full border border-white/5 bg-[#12121A] hover:bg-[#1A1A24] text-slate-300 hover:text-white transition flex items-center gap-2 font-medium shadow-sm">
                  <Rocket size={14} className="text-pink-400"/> SaaS Landing Page
                </button>
                <button onClick={() => setPrompt("A complex e-commerce dashboard with sales charts, recent orders table, and a sidebar navigation.")} className="px-4 py-2 rounded-full border border-white/5 bg-[#12121A] hover:bg-[#1A1A24] text-slate-300 hover:text-white transition flex items-center gap-2 font-medium shadow-sm">
                  <ShoppingCart size={14} className="text-green-400"/> E-commerce Dashboard
                </button>
                <button onClick={() => setPrompt("A minimalistic blog layout with large typography and plenty of whitespace.")} className="px-4 py-2 rounded-full border border-white/5 bg-[#12121A] hover:bg-[#1A1A24] text-slate-300 hover:text-white transition flex items-center gap-2 font-medium shadow-sm">
                  <Paperclip size={14} className="text-slate-400"/> Minimal Blog
                </button>
              </div>

              {/* Bottom Features Grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-5 shrink-0 mt-auto">
                <FeatureCard 
                  icon={<Sparkles size={20} className="text-purple-400"/>} 
                  iconBg="bg-purple-500/10 border-purple-500/20"
                  title="AI Design Generation"
                  desc="Generate beautiful UI/UX designs from text or reference images."
                />
                <FeatureCard 
                  icon={<Layout size={20} className="text-blue-400"/>} 
                  iconBg="bg-blue-500/10 border-blue-500/20"
                  title="Smart Components"
                  desc="Get fully responsive, accessible, and modern components."
                />
                <FeatureCard 
                  icon={<Wand2 size={20} className="text-green-400"/>} 
                  iconBg="bg-green-500/10 border-green-500/20"
                  title="Live Edit & Customize"
                  desc="Edit designs visually with our powerful live canvas editor."
                />
                <FeatureCard 
                  icon={<Code2 size={20} className="text-orange-400"/>} 
                  iconBg="bg-orange-500/10 border-orange-500/20"
                  title="Code Export"
                  desc="Export clean, production-ready code in your preferred framework."
                />
                <FeatureCard 
                  icon={<Box size={20} className="text-pink-400"/>} 
                  iconBg="bg-pink-500/10 border-pink-500/20"
                  title="Design System"
                  desc="Auto-generate design systems with colors, typography & more."
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= ANALYZING VIEW ======================= */}
        {appState === 'analyzing' && (
          <motion.div 
            key="analyzing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full"
          >
            <div className="mb-12 relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full animate-ping duration-1000"></div>
              <div className="absolute inset-4 border-4 border-blue-500/40 rounded-full animate-spin-slow"></div>
              <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)] z-10">
                <Sparkles className="text-white w-8 h-8" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-8">AI Design Engine Processing</h2>

            <div className="w-full space-y-6">
              {analysisSteps.map((step, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${index <= analysisStep ? 'text-white' : 'text-slate-600'}`}>
                      {step}
                    </span>
                    {index < analysisStep && <CheckCircle2 size={16} className="text-green-500" />}
                    {index === analysisStep && <Loader2 size={16} className="text-purple-400 animate-spin" />}
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${index < analysisStep ? 'bg-green-500' : index === analysisStep ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-transparent'}`}
                      initial={{ width: "0%" }}
                      animate={{ width: index < analysisStep ? "100%" : index === analysisStep ? "100%" : "0%" }}
                      transition={{ duration: index === analysisStep ? 1.5 : 0.2, ease: "linear" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ======================= CANVAS VIEW ======================= */}
        {appState === 'canvas' && (
          <motion.div 
            key="canvas-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex w-full h-full"
          >
            {/* LEFT SIDEBAR (Project/Assets/Design System) */}
            <div className="w-64 border-r border-white/10 bg-[#0B0B14] flex flex-col h-full overflow-y-auto shrink-0 hidden lg:flex">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-2"><Layers size={16} className="text-purple-400"/> Project Assets</span>
              </div>
              
              <div className="p-2 space-y-1">
                <SidebarItem icon={<FolderOpen size={14}/>} label="Design System" active />
                <div className="pl-6 space-y-1 mt-1 mb-2">
                  <SidebarSubItem label="Colors" />
                  <SidebarSubItem label="Typography" />
                  <SidebarSubItem label="Spacing" />
                </div>
                <SidebarItem icon={<Box size={14}/>} label="Components" />
                <SidebarItem icon={<History size={14}/>} label="Version History" />
              </div>
            </div>

            {/* MAIN CANVAS AREA */}
            <div className="flex-1 flex flex-col relative h-full bg-[#05050A] min-w-0">
              
              {/* Top Bar */}
              <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#0B0B14] shrink-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sparkles size={16} className="text-purple-400"/> Generated Result
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex bg-[#1A1A24] rounded-lg p-1 mr-2 sm:mr-4">
                    <button onClick={() => setResponsiveMode('desktop')} className={`p-1.5 rounded-md transition ${responsiveMode === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><Monitor size={14}/></button>
                    <button onClick={() => setResponsiveMode('tablet')} className={`p-1.5 rounded-md transition ${responsiveMode === 'tablet' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><rect x="4" y="2" width="16" height="20" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24" style={{width: 14, height: 14}}/></button>
                    <button onClick={() => setResponsiveMode('mobile')} className={`p-1.5 rounded-md transition ${responsiveMode === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><Smartphone size={14}/></button>
                  </div>
                  <button onClick={() => setAppState('input')} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold transition border border-white/10">
                    New Generation
                  </button>
                </div>
              </div>

              {/* Canvas Rendering Area */}
              <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center">
                <div 
                  className={`bg-[#0B0B14] border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out relative group flex flex-col ${
                    responsiveMode === 'desktop' ? 'w-full max-w-6xl rounded-2xl min-h-[600px]' :
                    responsiveMode === 'tablet' ? 'w-[768px] rounded-3xl min-h-[800px] shrink-0' :
                    'w-[375px] rounded-[3rem] min-h-[700px] border-[8px] border-[#1A1A24] shrink-0'
                  }`}
                >
                  {framework === "HTML + CSS" ? (
                    <iframe 
                      srcDoc={`
                        <html>
                          <head>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>body { margin: 0; background-color: #0B0B14; color: white; }</style>
                          </head>
                          <body>${generatedCode}</body>
                        </html>
                      `}
                      className="w-full h-full border-none"
                      title="Generated Component Preview"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center">
                      <Code2 size={48} className="text-slate-700 mb-4" />
                      <h3 className="text-xl font-bold text-slate-300 mb-2">React Preview Not Available</h3>
                      <p className="text-slate-500 max-w-md">The generated code is a React component. Because it may use external imports, we cannot render it safely in the browser here. Please view the code in the right panel.</p>
                      <button onClick={() => {setFramework('HTML + CSS'); handleGenerate();}} className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium text-sm transition">Generate HTML version instead</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR (Properties & Code) */}
            <div className="w-[400px] border-l border-white/10 bg-[#0B0B14] flex flex-col h-full overflow-y-auto shrink-0">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-2"><Code2 size={16} className="text-blue-400"/> Generated Code</span>
                <button 
                  onClick={() => {
                    if (generatedCode) {
                      navigator.clipboard.writeText(generatedCode);
                      alert("Code copied to clipboard!");
                    }
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded"
                >
                  <Copy size={12}/> Copy
                </button>
              </div>
              
              <div className="flex-1 p-4 flex flex-col overflow-hidden">
                <div className="bg-[#1A1A24] rounded-xl p-4 border border-white/5 flex-1 overflow-auto custom-scrollbar">
                  <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                    {generatedCode || "Generating code..."}
                  </pre>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Helper Components ---

function FeatureCard({ icon, iconBg, title, desc }: { icon: React.ReactNode, iconBg: string, title: string, desc: string }) {
  return (
    <div className="bg-[#09090E] border border-white/5 rounded-[20px] p-6 hover:bg-[#12121A] transition duration-300 cursor-pointer group shadow-sm flex flex-col h-full">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${iconBg} shadow-inner bg-[#0B0B14]`}>
        {icon}
      </div>
      <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{title}</h3>
      <p className="text-[13px] text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-medium truncate">{label}</span>
      {active && <ChevronDown size={14} className="ml-auto opacity-50" />}
    </div>
  );
}

function SidebarSubItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition text-slate-400 hover:bg-white/5 hover:text-white">
      <div className="w-1 h-1 rounded-full bg-white/20"></div>
      <span className="text-xs truncate">{label}</span>
    </div>
  );
}

