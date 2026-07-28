"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Palette, Layout, Type, Sparkles, Download, Code2, 
  Copy, Check, Zap, Maximize2, Monitor, Smartphone,
  Plus, Image as ImageIcon, Link2, FileText, Upload,
  Figma, Send, Settings, History, Layers, MessageSquare,
  ChevronRight, ChevronDown, CheckCircle2, Loader2, Play,
  FolderOpen, MousePointer2, Wand2, Paintbrush, FileJson,
  Github, Box, ArrowRight, X, PaintBucket, Type as TypeIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AppState = 'input' | 'analyzing' | 'canvas';
type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

export default function UIUXStudioPage() {
  const [appState, setAppState] = useState<AppState>('input');
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("React + Tailwind");
  const [files, setFiles] = useState<{name: string, type: string}[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
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

  const handleGenerate = () => {
    if (!prompt && files.length === 0) return;
    setAppState('analyzing');
    setAnalysisStep(0);
    
    // Simulate multi-step analysis
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < analysisSteps.length) {
        setAnalysisStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => setAppState('canvas'), 500);
      }
    }, 1500);
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
            className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full"
          >
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-purple-500/30 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Nexora Design AI</h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Describe what you want to build, upload reference images, wireframes, or brand assets, and let Nexora generate a fully editable design system and code.
              </p>
            </div>

            <div className="w-full bg-[#0B0B14] border border-white/10 rounded-3xl shadow-2xl p-2 relative group focus-within:border-purple-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
              
              <div className="relative bg-[#12121A] rounded-2xl flex flex-col">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="✨ Describe what you want to build... (e.g., A dark-mode analytics dashboard with a sidebar and premium glassmorphism cards)"
                  className="w-full bg-transparent border-none outline-none text-[15px] placeholder:text-slate-500 text-white p-6 min-h-[120px] resize-none focus:ring-0"
                />

                {/* Reference Files Area */}
                {files.length > 0 && (
                  <div className="px-6 pb-4 flex gap-3 flex-wrap">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                        {f.type === 'image' && <ImageIcon size={12} className="text-blue-400"/>}
                        {f.type === 'figma' && <Figma size={12} className="text-pink-400"/>}
                        {f.type === 'url' && <Link2 size={12} className="text-green-400"/>}
                        {f.type === 'pdf' && <FileText size={12} className="text-red-400"/>}
                        {f.name}
                        <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="ml-1 hover:text-white"><X size={12}/></button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-white/5 p-3 flex items-center justify-between">
                  <div className="relative">
                    <button 
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                    >
                      <Plus size={18} />
                    </button>
                    
                    <AnimatePresence>
                      {showAttachmentMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-2 w-48 bg-[#1A1A24] border border-white/10 rounded-xl shadow-xl overflow-hidden z-10"
                        >
                          <button onClick={() => { setFiles([...files, {name: 'dashboard-ref.png', type: 'image'}]); setShowAttachmentMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"><ImageIcon size={14}/> Image / Screenshot</button>
                          <button onClick={() => { setFiles([...files, {name: 'https://olangana.com', type: 'url'}]); setShowAttachmentMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"><Link2 size={14}/> Website URL</button>
                          <button onClick={() => { setFiles([...files, {name: 'brand-guidelines.pdf', type: 'pdf'}]); setShowAttachmentMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"><FileText size={14}/> Brand PDF</button>
                          <button onClick={() => { setFiles([...files, {name: 'App-Design.fig', type: 'figma'}]); setShowAttachmentMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"><Figma size={14}/> Figma Export</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-3">
                    <select 
                      value={framework}
                      onChange={(e) => setFramework(e.target.value)}
                      className="bg-transparent border-none text-sm text-slate-400 focus:ring-0 outline-none cursor-pointer"
                    >
                      <option className="bg-[#12121A]">React + Tailwind</option>
                      <option className="bg-[#12121A]">Next.js + Tailwind</option>
                      <option className="bg-[#12121A]">HTML + CSS</option>
                      <option className="bg-[#12121A]">Vue + Tailwind</option>
                    </select>
                    
                    <button 
                      onClick={handleGenerate}
                      disabled={!prompt && files.length === 0}
                      className="px-6 h-10 bg-white hover:bg-slate-200 text-black rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Generate <Zap size={16} className="fill-black" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Template Suggestions */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <span className="text-xs text-slate-500 mr-2 self-center">Try:</span>
              <button onClick={() => setPrompt("A modern SaaS landing page with dark mode, glowing accents, and an animated hero section.")} className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition">SaaS Landing Page</button>
              <button onClick={() => setPrompt("A complex e-commerce dashboard with sales charts, recent orders table, and a sidebar navigation.")} className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition">E-commerce Dashboard</button>
              <button onClick={() => setPrompt("A minimalistic blog layout with large typography and plenty of whitespace.")} className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition">Minimal Blog</button>
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

            {/* Simulated Analysis Results */}
            <AnimatePresence>
              {analysisStep >= 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 w-full grid grid-cols-3 gap-4"
                >
                  <div className="bg-[#12121A] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <PaintBucket className="text-pink-400 mb-2" size={20} />
                    <p className="text-xs text-slate-500 mb-1">Primary Color</p>
                    <p className="text-sm font-mono font-medium">#6D5BFF</p>
                  </div>
                  <div className="bg-[#12121A] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <TypeIcon className="text-blue-400 mb-2" size={20} />
                    <p className="text-xs text-slate-500 mb-1">Typography</p>
                    <p className="text-sm font-medium">Inter & Outfit</p>
                  </div>
                  <div className="bg-[#12121A] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <Box className="text-purple-400 mb-2" size={20} />
                    <p className="text-xs text-slate-500 mb-1">Components</p>
                    <p className="text-sm font-medium">12 Detected</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
            <div className="w-64 border-r border-white/10 bg-[#0B0B14] flex flex-col h-full overflow-y-auto shrink-0">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-2"><Layers size={16} className="text-purple-400"/> Project Assets</span>
              </div>
              
              <div className="p-2 space-y-1">
                <SidebarItem icon={<FolderOpen size={14}/>} label="Design System" active />
                <div className="pl-6 space-y-1 mt-1 mb-2">
                  <SidebarSubItem label="Colors" />
                  <SidebarSubItem label="Typography" />
                  <SidebarSubItem label="Spacing" />
                  <SidebarSubItem label="Shadows" />
                </div>
                <SidebarItem icon={<Box size={14}/>} label="Components (12)" />
                <div className="pl-6 space-y-1 mt-1 mb-2">
                  <SidebarSubItem label="Hero Section" />
                  <SidebarSubItem label="Navbar" />
                  <SidebarSubItem label="Pricing Cards" />
                  <SidebarSubItem label="Footer" />
                </div>
                <SidebarItem icon={<FileText size={14}/>} label="Pages (3)" />
                <SidebarItem icon={<History size={14}/>} label="Version History" />
                <SidebarItem icon={<Download size={14}/>} label="Exports" />
              </div>
            </div>

            {/* MAIN CANVAS AREA */}
            <div className="flex-1 flex flex-col relative h-full bg-[#05050A] min-w-0">
              
              {/* Top Bar */}
              <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#0B0B14] shrink-0">
                <div className="flex bg-[#1A1A24] rounded-lg p-1 overflow-x-auto hide-scrollbar">
                  <button onClick={() => setActiveVersion('Version A')} className={`whitespace-nowrap px-3 py-1 text-xs rounded-md font-medium transition ${activeVersion === 'Version A' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>Version A (Modern)</button>
                  <button onClick={() => setActiveVersion('Version B')} className={`whitespace-nowrap px-3 py-1 text-xs rounded-md font-medium transition ${activeVersion === 'Version B' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>Version B (Dark)</button>
                  <button onClick={() => setActiveVersion('Version C')} className={`whitespace-nowrap px-3 py-1 text-xs rounded-md font-medium transition ${activeVersion === 'Version C' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>Version C (Luxury)</button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex bg-[#1A1A24] rounded-lg p-1 mr-2 sm:mr-4">
                    <button onClick={() => setResponsiveMode('desktop')} className={`p-1.5 rounded-md transition ${responsiveMode === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><Monitor size={14}/></button>
                    <button onClick={() => setResponsiveMode('tablet')} className={`p-1.5 rounded-md transition ${responsiveMode === 'tablet' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><rect x="4" y="2" width="16" height="20" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24" style={{width: 14, height: 14}}/></button>
                    <button onClick={() => setResponsiveMode('mobile')} className={`p-1.5 rounded-md transition ${responsiveMode === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><Smartphone size={14}/></button>
                  </div>

                  <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs font-semibold transition">
                    <Wand2 size={14} /> AI Review
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-black hover:bg-slate-200 rounded-lg text-xs font-semibold transition">
                    <Code2 size={14} /> Get Code
                  </button>
                </div>
              </div>

              {/* Canvas Rendering Area */}
              <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center">
                <div 
                  className={`bg-[#0B0B14] border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out relative group ${
                    responsiveMode === 'desktop' ? 'w-full max-w-6xl rounded-2xl aspect-[16/9]' :
                    responsiveMode === 'tablet' ? 'w-[768px] rounded-3xl aspect-[4/3] shrink-0' :
                    'w-[375px] rounded-[3rem] aspect-[9/19] border-[8px] border-[#1A1A24] shrink-0'
                  }`}
                >
                  {/* Interactive Editable Overlay Hint */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-xl pointer-events-none transition-colors z-50"></div>
                  
                  {/* Fake Generated UI iframe equivalent */}
                  <div className="w-full h-full flex flex-col hover:cursor-pointer relative">
                    <div className="absolute top-2 right-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                       <MousePointer2 size={10} /> Editable Canvas
                    </div>

                    {/* Header */}
                    <div className="w-full h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B0B14] hover:bg-white/5 transition-colors">
                      <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Brand.</div>
                      <div className={`${responsiveMode === 'mobile' ? 'hidden' : 'flex'} items-center gap-6 text-sm text-slate-300`}>
                        <span className="hover:text-white transition-colors">Features</span>
                        <span className="hover:text-white transition-colors">Pricing</span>
                        <span className="hover:text-white transition-colors">About</span>
                      </div>
                      <div className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">Get Started</div>
                    </div>
                    {/* Hero */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden bg-[#0B0B14] hover:bg-white/5 transition-colors">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-3xl leading-tight">
                        The future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">digital design</span> is here.
                      </h1>
                      <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl">Create stunning, fast, and accessible web experiences in minutes with our new AI-powered platform.</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="px-6 py-3 bg-white text-black rounded-xl font-semibold shadow-lg shadow-white/10 hover:scale-105 transition-transform">Start Building</div>
                        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-colors hover:scale-105 transition-transform">View Demo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating AI Chat for Interactive Editing */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[500px] max-w-[90%] bg-[#12121A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40">
                <div className="max-h-48 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'ai' && <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0 mt-0.5"><Sparkles size={10} className="text-white"/></div>}
                      <div className={`p-2.5 rounded-xl max-w-[85%] ${msg.role === 'user' ? 'bg-purple-600/30 text-white' : 'bg-white/5 text-slate-200'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleChatSubmit} className="p-2 border-t border-white/10 flex items-center gap-2 bg-[#0B0B14]">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI to change something... (e.g. 'Make hero premium')" 
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white px-3 focus:ring-0"
                  />
                  <button type="submit" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition disabled:opacity-50" disabled={!chatInput.trim()}>
                    <Send size={14} />
                  </button>
                </form>
              </div>

            </div>

            {/* RIGHT SIDEBAR (Properties & Code) */}
            <div className="w-72 border-l border-white/10 bg-[#0B0B14] flex flex-col h-full overflow-y-auto shrink-0 hidden lg:flex">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-2"><Code2 size={16} className="text-blue-400"/> Code & Export</span>
              </div>
              
              <div className="p-4 flex flex-col gap-6">
                
                {/* Export Options */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Export As</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1A1A24] hover:bg-white/5 border border-white/5 rounded-xl transition text-xs font-medium"><Code2 size={18} className="text-blue-400"/> React</button>
                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1A1A24] hover:bg-white/5 border border-white/5 rounded-xl transition text-xs font-medium"><FileJson size={18} className="text-black fill-white"/> Next.js</button>
                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1A1A24] hover:bg-white/5 border border-white/5 rounded-xl transition text-xs font-medium"><Paintbrush size={18} className="text-orange-400"/> HTML</button>
                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1A1A24] hover:bg-white/5 border border-white/5 rounded-xl transition text-xs font-medium"><Figma size={18} className="text-pink-400"/> Figma</button>
                  </div>
                </div>

                {/* Deploy Options */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Deploy</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 bg-[#1A1A24] hover:bg-white/5 border border-white/5 rounded-xl transition text-sm">
                      <span className="flex items-center gap-2"><Github size={16}/> Push to GitHub</span>
                      <ArrowRight size={14} className="text-slate-500"/>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-[#1A1A24] hover:bg-white/5 border border-white/5 rounded-xl transition text-sm">
                      <span className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#ffffff"/></svg>
                        Deploy to Vercel
                      </span>
                      <ArrowRight size={14} className="text-slate-500"/>
                    </button>
                  </div>
                </div>

                {/* Quick Code Preview */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hero Section Code</h3>
                    <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Copy size={12}/> Copy</button>
                  </div>
                  <div className="bg-[#1A1A24] rounded-xl p-3 border border-white/5 flex-1 min-h-[200px] overflow-hidden relative group">
                    <pre className="text-[10px] text-slate-400 font-mono leading-relaxed h-full overflow-y-auto hide-scrollbar">
{`export default function Hero() {
  return (
    <div className="flex-1 flex flex-col 
      items-center justify-center text-center 
      p-8 relative overflow-hidden bg-[#0B0B14]">
      
      <div className="absolute top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2 
        w-96 h-96 bg-purple-500/20 
        rounded-full blur-[100px]"></div>
      
      <h1 className="text-5xl sm:text-6xl 
        font-bold tracking-tight mb-6 
        max-w-3xl leading-tight">
        The future of <span className="...">
          digital design
        </span> is here.
      </h1>
      
      <p className="text-slate-400 text-lg 
        mb-8 max-w-xl">
        Create stunning, fast, and accessible 
        web experiences in minutes.
      </p>
      
      <div className="flex gap-4">
        <div className="px-6 py-3 bg-white 
          text-black rounded-xl font-semibold 
          shadow-lg shadow-white/10">
          Start Building
        </div>
        <div className="px-6 py-3 bg-white/5 
          border border-white/10 rounded-xl 
          font-semibold hover:bg-white/10 
          transition">
          View Demo
        </div>
      </div>
    </div>
  )
}`}
                    </pre>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1A1A24] to-transparent pointer-events-none"></div>
                  </div>
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
