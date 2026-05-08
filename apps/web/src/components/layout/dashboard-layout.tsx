"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Hardcoded for testing the first seeded project
  const projectId = "cmovh88ta00011skl9lh700ir";

  const { mutate: runAudit, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`http://localhost:4000/audit/${projectId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Audit successfully scheduled!", {
        description: "The worker is now running a Lighthouse scan in the background.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to start audit", {
        description: error.response?.data?.message || "Please ensure the API and Redis are running.",
      });
    },
  });

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
            <button
              onClick={() => runAudit()}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              {isPending ? "Starting..." : "Run Audit"}
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
