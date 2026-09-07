"use client";

import React from "react";
import {
  Activity,
  Clock,
  Globe,
  Zap,
  ShieldCheck,
  Search,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { AuditDetailModal } from "@/components/dashboard/audit-detail-modal";
import { AddProjectModal } from "@/components/dashboard/add-project-modal";
import { useProject } from "../context/project-context";

export default function DashboardPage() {
  const { activeProject } = useProject();
  const [selectedAudit, setSelectedAudit] = React.useState<any>(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = React.useState(false);

  const { data: audits, isLoading } = useQuery({
    queryKey: ["audits", activeProject?.id],
    queryFn: async () => {
      if (!activeProject?.id) return [];
      const response = await axios.get(`http://localhost:4000/projects/${activeProject.id}/audits`);
      return response.data;
    },
    enabled: !!activeProject?.id,
    refetchInterval: (query) => {
      const data = query.state.data as any[];
      const isRunning = data?.some((a: any) => a.status === "PENDING" || a.status === "RUNNING");
      return isRunning ? 2000 : 10000;
    },
  });

  const latestAudit = audits?.find((a: any) => a.status === "COMPLETED") || audits?.[0];
  const isRunning = audits?.some((a: any) => a.status === "PENDING" || a.status === "RUNNING");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Status Alert if running */}
      {isRunning && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <Activity className="w-5 h-5 text-blue-400" />
          <p className="text-sm text-blue-100 font-medium">An audit is currently in progress. Results will update automatically.</p>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Gauge */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <TrendingUp className="w-12 h-12" />
          </div>
          <div className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-widest">Performance Score</div>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96" cy="96" r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx="96" cy="96" r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={552}
                strokeDashoffset={552 - (552 * (latestAudit?.performanceScore || 0)) / 100}
                className="text-blue-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold gradient-text">{latestAudit?.performanceScore || "--"}</span>
              <span className="text-xs text-zinc-500 font-medium">out of 100</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Accessibility"
            value={latestAudit?.accessibilityScore}
            icon={<ShieldCheck className="w-5 h-5" />}
            color="text-emerald-400"
            bgColor="bg-emerald-400/10"
          />
          <MetricCard
            title="Best Practices"
            value={latestAudit?.bestPracticesScore}
            icon={<Zap className="w-5 h-5" />}
            color="text-amber-400"
            bgColor="bg-amber-400/10"
          />
          <MetricCard
            title="SEO"
            value={latestAudit?.seoScore}
            icon={<Search className="w-5 h-5" />}
            color="text-purple-400"
            bgColor="bg-purple-400/10"
          />
          <MetricCard
            title="Avg. Response"
            value={latestAudit?.webVitals?.tti ? `${(latestAudit.webVitals.tti / 1000).toFixed(1)}s` : "--"}
            icon={<Clock className="w-5 h-5" />}
            color="text-blue-400"
            bgColor="bg-blue-400/10"
          />
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold">Audit History</h2>
          </div>
          <button className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-zinc-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Score</th>
                <th className="px-6 py-4 font-semibold">LCP</th>
                <th className="px-6 py-4 font-semibold">CLS</th>
                <th className="px-6 py-4 font-semibold">TTI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {audits?.map((audit: any) => (
                <tr
                  key={audit.id}
                  onClick={() => setSelectedAudit(audit)}
                  className="hover:bg-white/[0.04] transition-all group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true })}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">Manual Trigger</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={audit.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold ${getScoreColor(audit.performanceScore)}`}>
                      {audit.performanceScore || "--"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {audit.webVitals?.lcp ? `${(audit.webVitals.lcp / 1000).toFixed(2)}s` : "--"}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {audit.webVitals?.cls != null ? audit.webVitals.cls.toFixed(3) : "--"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-400">
                        {audit.webVitals?.tti ? `${(audit.webVitals.tti / 1000).toFixed(1)}s` : "--"}
                      </span>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <AuditDetailModal
          audit={selectedAudit}
          onClose={() => setSelectedAudit(null)}
        />
      )}

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <AddProjectModal
          onClose={() => setIsAddProjectOpen(false)}
          onOpen={isAddProjectOpen}
        />
      )}
    </div>
  );
}

function MetricCard({ title, value, icon, color, bgColor }: any) {
  return (
    <div className="glass-card rounded-2xl p-6 flex items-center justify-between group hover:border-white/10 transition-all">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
          {React.cloneElement(icon, { className: `${icon.props.className} ${color}` })}
        </div>
        <div>
          <div className="text-sm font-medium text-zinc-400">{title}</div>
          <div className="text-2xl font-bold">{value || "--"}</div>
        </div>
      </div>
      <div className={`text-xs font-bold ${color}`}>
        {value >= 90 ? "OPTIMIZED" : value >= 50 ? "DECENT" : "POOR"}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    PENDING: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    RUNNING: "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse",
    COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    FAILED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${configs[status]}`}>
      {status}
    </span>
  );
}

function getScoreColor(score: number) {
  if (!score) return "text-zinc-500";
  if (score >= 90) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}
