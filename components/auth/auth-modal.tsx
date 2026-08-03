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
  const [authSuccess, setAuthSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setIsLoading(true);
    
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setAuthError("Missing Supabase configuration! Please check your environment variables.");
        setIsLoading(false);
        return;
      }

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
        } else if (data.session) {
          onClose();
        } else {
          setAuthSuccess("Check your email for the confirmation link!");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setAuthError(error.message);
        else onClose();
      }
    } catch (err: any) {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        }
      });
      if (error) setAuthError(error.message);
    } catch (err: any) {
      setAuthError("Failed to initialize Google login.");
    } finally {
      setIsLoading(false);
    }
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
            className="glass-panel bg-background rounded-3xl shadow-2xl max-w-[400px] w-full p-8 relative border border-borders"
          >
            <button onClick={onClose} className="absolute top-5 right-5 text-textMuted hover:text-foreground p-1 transition-colors">
              <X size={20} strokeWidth={2} />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                 <User size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">{authMode === "login" ? "Welcome back" : "Create an account"}</h3>
              <p className="text-sm text-textMuted mt-2">
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
                <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={isLoading}
                  className="w-full bg-black/30 border border-borders rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition disabled:opacity-50"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={isLoading}
                  className="w-full bg-black/30 border border-borders rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-accent text-foreground font-medium py-3 rounded-xl transition shadow-[0_0_20px_rgba(109,91,255,0.4)] mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {authMode === "login" ? "Continue" : "Sign up"}
              </button>
            </form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-borders"></div>
              <span className="flex-shrink mx-4 text-xs text-textMuted font-medium tracking-widest uppercase">OR</span>
              <div className="flex-grow border-t border-borders"></div>
            </div>

            <button 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
              className="w-full bg-hoverBg hover:bg-hoverBg text-foreground text-sm font-medium py-3 rounded-xl border border-borders transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Globe size={18} /> Continue with Google
            </button>

            <div className="text-center text-sm text-textMuted mt-8">
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} className="text-highlight hover:text-foreground font-medium transition">
                {authMode === "login" ? "Sign up" : "Log in"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
