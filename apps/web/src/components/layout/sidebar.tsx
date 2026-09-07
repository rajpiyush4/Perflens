"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Zap,
  BarChart3,
  GitCompare,
  Bell,
  Target,
  PlusCircle,
  Users,
  Settings,
  Star,
  Monitor,
  Plus,
  LogOut,
  LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useProject } from "../../context/project-context";
import { useSession, signOut } from "next-auth/react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Globe, label: "Projects", href: "/projects" },
  { icon: Zap, label: "Audits", href: "/audits" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: GitCompare, label: "Comparisons", href: "/comparisons" },
];

const workspaceItems = [
  { icon: Target, label: "Budgets", href: "/budget" },
  { icon: Bell, label: "Alerts", href: "/alerts" },
  { icon: PlusCircle, label: "Integrations", href: "/integrations" },
];

interface SidebarProps {
  onAddProject: () => void;
}

export function Sidebar({ onAddProject }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { activeProject, setActiveProject, userId } = useProject();

  // Fetch real projects from API
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:4000/projects?userId=${userId}`);
      return response.data;
    },
  });

  // Auto-select first project on load
  React.useEffect(() => {
    if (projects && projects.length > 0 && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject, setActiveProject]);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-[#0B0E14] flex flex-col">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-10">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
          <Zap className="h-5 w-5 text-white fill-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-white leading-none">PerfLens</span>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">v1.0.0 Alpha</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        {/* Main Navigation */}
        <div className="mb-8">
          <div className="px-3 mb-3 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Navigation</div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20 shadow-[0_0_20px_-12px_rgba(59,130,246,0.5)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                    {item.label}
                  </div>
                  {isActive && <div className="h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Favorite Projects */}
        <div className="mb-8">
          <div className="px-3 mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Active Projects</span>
            <button
              onClick={onAddProject}
              className="p-1 hover:bg-blue-500/20 rounded-md transition-colors group/btn border border-transparent hover:border-blue-500/30"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-600 group-hover/btn:text-blue-400" />
            </button>
          </div>
          <div className="space-y-1">
            {projects?.map((project: any) => {
              const isActive = activeProject?.id === project.id;
              return (
                <div
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer transition-all duration-300 border",
                    isActive
                      ? "bg-white/5 border-white/10"
                      : "border-transparent hover:bg-white/5 hover:border-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-6 w-6 rounded-md flex items-center justify-center border transition-colors",
                      isActive
                        ? "bg-blue-500/10 border-blue-500/20"
                        : "bg-zinc-800 border-white/5 group-hover:border-blue-500/30"
                    )}>
                      <Monitor className={cn("w-3 h-3", isActive ? "text-blue-400" : "text-zinc-400 group-hover:text-blue-400")} />
                    </div>
                    <span className={cn(
                      "text-xs font-medium truncate max-w-[120px] transition-colors",
                      isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                    )}>{project.name}</span>
                  </div>
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all duration-500",
                    isActive ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-zinc-700"
                  )} />
                </div>
              );
            })}

            {isLoading && (
              <div className="px-3 py-2 flex items-center gap-2 animate-pulse">
                <div className="h-2 w-2 rounded-full bg-zinc-800" />
                <div className="h-2 w-20 bg-zinc-800 rounded" />
              </div>
            )}

            {(!projects || projects.length === 0) && !isLoading && (
              <div className="px-3 py-2 text-[10px] text-zinc-600 italic">No projects found</div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-white/5 space-y-2">
        {session?.user ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/5 group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-inner flex-shrink-0">
                {session.user.name ? session.user.name.substring(0, 2).toUpperCase() : session.user.email?.substring(0, 2).toUpperCase() || "US"}
              </div>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-xs font-bold text-white truncate w-24">
                  {session.user.name || "User"}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium truncate w-24">
                  {session.user.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign Out"
              className="p-1.5 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </Link>
        )}

        <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-medium hover:text-zinc-400 cursor-pointer transition-colors">
          <Star className="w-3 h-3" />
          <span>Star project on GitHub</span>
        </div>
      </div>
    </aside>
  );
}
