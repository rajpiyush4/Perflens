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
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Globe, label: "Projects", href: "/projects" },
  { icon: Zap, label: "Audits", href: "/audits" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: GitCompare, label: "Comparisons", href: "/comparisons" },
  { icon: Bell, label: "Alerts", href: "/alerts" },
  { icon: Target, label: "Performance Budget", href: "/budget" },
  { icon: PlusCircle, label: "Integrations", href: "/integrations" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-[#0B0E14] flex flex-col">
      <div className="flex items-center gap-2 px-6 py-8">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Zap className="h-5 w-5 text-white fill-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">PerfLens</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-zinc-500")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/5 p-4 space-y-4">
        <div className="flex items-center gap-3 px-2 text-sm text-zinc-500 hover:text-white cursor-pointer transition-colors">
          <Star className="h-4 w-4" />
          <span>Star on GitHub</span>
        </div>
        
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
            AR
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Arjun Raj</span>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
