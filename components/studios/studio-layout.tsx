"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

interface Template {
  title: string;
  icon?: any; // lucide icon
}

interface StudioLayoutProps {
  title: string;
  description: string;
  placeholder: string;
  templates: Template[];
  icon: any;
}

export function StudioLayout({ title, description, placeholder, templates, icon: Icon }: StudioLayoutProps) {
  const [input, setInput] = useState("");

  return (
    <div className="max-w-5xl mx-auto w-full pt-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(109,91,255,0.2)]">
          <Icon size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-textMuted">{description}</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          What do you want to build?
        </h2>
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-focus-within:bg-primary/30 transition-all duration-300"></div>
          <div className="relative glass-panel rounded-2xl border border-borders flex items-end p-2 bg-background/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 max-h-40 min-h-[50px] bg-transparent border-none text-foreground focus:ring-0 resize-none px-4 py-3.5 focus:outline-none placeholder:text-textMuted text-lg"
              rows={1}
            />
            <button 
              className={`p-3.5 rounded-xl transition mb-1 ml-2 ${
                input.trim().length > 0 
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(109,91,255,0.4)]" 
                  : "bg-hoverBg text-textMuted"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Or start from a template</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {templates.map((template, idx) => (
            <div 
              key={idx} 
              className="glass-panel p-5 rounded-xl border border-borders hover:border-primary/40 hover:bg-hoverBg transition cursor-pointer group flex flex-col items-center justify-center text-center gap-3 h-32"
            >
              {template.icon && <template.icon size={24} className="text-textMuted group-hover:text-primary transition" />}
              <span className="font-medium text-textMuted group-hover:text-foreground transition">{template.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
