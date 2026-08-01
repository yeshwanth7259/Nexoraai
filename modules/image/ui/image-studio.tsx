"use client";

import React, { useState } from "react";
import { imageTemplates, PromptTemplate } from "../templates";
import { buildImagePrompt } from "../prompts/builder";

export function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("Vibrant");

  const handleTemplateClick = (template: PromptTemplate) => {
    setPrompt(template.basePrompt);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedImageUrl(null);

    const finalPrompt = buildImagePrompt({
      basePrompt: prompt,
      style: selectedStyle,
      aspectRatio: "1:1"
    });

    try {
      const response = await fetch("/api/v1/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setGeneratedImageUrl(data.data.url);
      } else {
        alert("Error: " + (data.error || "Failed to generate image"));
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate image. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Sidebar: Templates & Settings */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-6 overflow-y-auto hidden md:flex">
        <div>
          <h2 className="text-xl font-bold mb-1">Image Studio</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Nexora AI OS</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Styles</h3>
          <select 
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Vibrant">Vibrant</option>
            <option value="Cinematic">Cinematic</option>
            <option value="Minimalist">Minimalist</option>
            <option value="Anime">Anime</option>
            <option value="Photorealistic">Photorealistic</option>
          </select>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Templates</h3>
          <div className="space-y-3">
            {imageTemplates.map((template) => (
              <div 
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">{template.category}</div>
                <div className="text-sm font-medium group-hover:text-blue-500">{template.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 justify-between bg-white dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className="font-medium">Generate Image</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              🪙 500 Credits
            </span>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950/50">
          
          <div className="w-full max-w-3xl flex flex-col items-center gap-8">
            
            {/* Image Preview Container */}
            <div className="w-full aspect-square md:aspect-video bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex items-center justify-center shadow-sm relative">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-gray-500 animate-pulse">Generating masterpiece...</p>
                </div>
              ) : generatedImageUrl ? (
                <img src={generatedImageUrl} alt="Generated AI" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    ✨
                  </div>
                  <h3 className="text-lg font-medium text-gray-400">Describe what you want to see</h3>
                </div>
              )}
            </div>

            {/* Prompt Input Area */}
            <div className="w-full relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city in the style of cyberpunk, raining, neon reflections..."
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl py-4 pl-4 pr-32 min-h-[80px] shadow-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                rows={3}
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-xl transition-all shadow-md active:scale-95"
              >
                Generate
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
