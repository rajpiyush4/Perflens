import React from "react";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      <Sidebar />
      <main className="pl-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B0E14]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Projects</span>
            <span>/</span>
            <span className="text-white font-medium">acme.com</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Share
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-600/20">
              Run Audit
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
