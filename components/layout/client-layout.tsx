"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { MobileDock } from "@/components/layout/mobile-dock";
import { CommandPalette } from "@/components/layout/command-palette";
import { AuthModal } from "@/components/auth/auth-modal";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative font-sans selection:bg-primary/30">
      <div className="aurora-bg" />

      {/* Global Sidebar (Desktop) */}
      <Sidebar onOpenAuth={() => setIsAuthModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-0 h-full overflow-hidden">
        <TopHeader onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
        
        {/* Scrollable Container for Pages */}
        <div className="flex-1 overflow-y-auto pt-16 pb-24 md:pb-0 px-4 md:px-8 w-full">
          {children}
        </div>
      </main>

      {/* Mobile Dock */}
      <MobileDock />

      {/* Global Command Palette */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />

      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
