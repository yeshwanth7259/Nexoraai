"use client";

import { useState } from "react";
import { User, Key, Monitor, Shield, Bell, Check, Save } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [apiKeys, setApiKeys] = useState({ gemini: "", openai: "" });
  const [theme, setTheme] = useState("dark");
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: Monitor },
    { id: "models", label: "Models & API Keys", icon: Key },
    { id: "account", label: "Account", icon: User },
    { id: "privacy", label: "Data Controls", icon: Shield },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col bg-[#05050A]">
      <div className="max-w-6xl w-full mx-auto h-full p-6 md:p-10 flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-[240px] shrink-0 flex flex-col h-auto md:h-full border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">
          <h1 className="text-2xl font-bold mb-6 md:mb-8 text-white">Settings</h1>
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 h-full overflow-y-auto hide-scrollbar pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl"
            >
              
              {/* GENERAL TAB */}
              {activeTab === "general" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/5">General Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white mb-1">Theme</div>
                          <div className="text-xs text-slate-400">Customize the appearance of Nexora AI</div>
                        </div>
                        <select 
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                          className="bg-[#12121A] border border-white/10 text-sm text-white rounded-lg px-4 py-2 outline-none focus:border-primary"
                        >
                          <option value="system">System Default</option>
                          <option value="dark">Dark Mode</option>
                          <option value="light">Light Mode</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white mb-1">App Notifications</div>
                          <div className="text-xs text-slate-400">Receive alerts when long-running generation jobs complete</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODELS & API KEYS */}
              {activeTab === "models" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/5">Models & API Keys</h2>
                    <p className="text-sm text-slate-400 mb-6">Connect your own API keys to bypass rate limits and use custom models. Keys are stored securely and never shared.</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                          Google Gemini API Key
                        </label>
                        <input 
                          type="password"
                          value={apiKeys.gemini}
                          onChange={(e) => setApiKeys({...apiKeys, gemini: e.target.value})}
                          placeholder="AIzaSy..."
                          className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                        />
                        <p className="text-[11px] text-slate-500 mt-2">Required for Veo Video generation and Gemini Flash assistance.</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                          OpenAI API Key
                        </label>
                        <input 
                          type="password"
                          value={apiKeys.openai}
                          onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                          placeholder="sk-..."
                          className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                        />
                        <p className="text-[11px] text-slate-500 mt-2">Required for ChatGPT generation and App Dev Studio.</p>
                      </div>

                      <div className="pt-4">
                        <button 
                          onClick={handleSave}
                          className="px-6 py-2.5 bg-primary hover:bg-accent text-white text-sm font-medium rounded-xl transition flex items-center gap-2"
                        >
                          {saved ? <><Check size={16} /> Saved Successfully</> : <><Save size={16} /> Save API Keys</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACCOUNT TAB */}
              {activeTab === "account" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/5">Your Account</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                        <img 
                          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'guest'}`}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full bg-white/5"
                        />
                        <div>
                          <div className="text-lg font-bold text-white mb-1">{user?.email?.split('@')[0] || "Guest User"}</div>
                          <div className="text-sm text-slate-400 mb-3">{user?.email || "Not signed in"}</div>
                          <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition">
                            Change Avatar
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Subscription Plan</h3>
                        <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                              Nexora Pro <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase">Active</span>
                            </div>
                            <div className="text-xs text-slate-400">Unlimited generations, priority support.</div>
                          </div>
                          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition">
                            Manage Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === "privacy" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/5">Data Controls</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white mb-1">Chat History & Training</div>
                          <div className="text-xs text-slate-400 max-w-[400px]">Save new chats and studios on this browser to your history and allow them to be used to improve our models.</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                      
                      <div className="pt-6 border-t border-red-500/10">
                        <h3 className="text-sm font-semibold text-red-500 mb-2">Danger Zone</h3>
                        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-white mb-1">Delete Account</div>
                            <div className="text-xs text-slate-400">Permanently delete your account and all data.</div>
                          </div>
                          <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 text-xs font-medium rounded-lg transition">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
