"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Globe } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const supabase = createClient();

  const [authSuccess, setAuthSuccess] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    
    if (authMode === "signup") {
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`
        }
      });
      if (error) {
        setAuthError(error.message);
      } else if (data?.user?.identities?.length === 0) {
        setAuthError("This email is already registered. Please log in.");
      } else {
        setAuthSuccess("Check your email for the confirmation link!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
      else onClose();
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="glass-panel bg-[#0b0f24]/90 rounded-3xl shadow-2xl max-w-[400px] w-full p-8 relative border border-white/10"
          >
            <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 transition-colors">
              <X size={20} strokeWidth={2} />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                 <User size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{authMode === "login" ? "Welcome back" : "Create an account"}</h3>
              <p className="text-sm text-slate-400 mt-2">
                {authMode === "login" ? "Enter your details to sign in." : "Start your journey with Nexora OS."}
              </p>
            </div>

            {authError && (
              <div className="mb-6 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm text-center">
                {authError}
              </div>
            )}
            
            {authSuccess && (
              <div className="mb-6 p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-sm text-center">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-accent text-white font-medium py-3 rounded-xl transition shadow-[0_0_20px_rgba(109,91,255,0.4)] mt-4">
                {authMode === "login" ? "Continue" : "Sign up"}
              </button>
            </form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-500 font-medium tracking-widest uppercase">OR</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button 
              onClick={handleGoogleLogin} 
              className="w-full bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-3 rounded-xl border border-white/10 transition flex items-center justify-center gap-2"
            >
              <Globe size={18} /> Continue with Google
            </button>

            <div className="text-center text-sm text-slate-400 mt-8">
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} className="text-highlight hover:text-white font-medium transition">
                {authMode === "login" ? "Sign up" : "Log in"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
