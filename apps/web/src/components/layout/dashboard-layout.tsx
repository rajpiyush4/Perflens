"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { AddProjectModal } from "../dashboard/add-project-modal";
import { ProjectProvider, useProject } from "../../context/project-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProjectProvider>
      <DashboardContent>{children}</DashboardContent>
    </ProjectProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [isAddProjectOpen, setIsAddProjectOpen] = React.useState(false);
  const { activeProject, setActiveProject } = useProject();

  // No longer hardcoded - we will use the context!

  const { mutate: runAudit, isPending } = useMutation({
    mutationFn: async () => {
      if (!activeProject) return;
      const response = await axios.post(`http://localhost:4000/audit/${activeProject.id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Audit successfully scheduled!", {
        description: `The worker is now scanning ${activeProject?.name}.`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to start audit", {
        description: error.response?.data?.message || "Please ensure the API and Redis are running.",
      });
    },
  });

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans selection:bg-blue-500/30">
      <Sidebar onAddProject={() => setIsAddProjectOpen(true)} />
      <main className="pl-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B0E14]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Projects</span>
            <span>/</span>
            <span className="text-white font-medium transition-all duration-500">
              {activeProject?.name || "Loading..."}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest truncate max-w-[150px]">
                {activeProject?.url || "Scanning URL..."}
              </span>
            </div>

            <button
              onClick={() => runAudit()}
              disabled={isPending || !activeProject}
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

      <AddProjectModal
        onOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
      />
    </div>
  );
}
