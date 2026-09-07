"use client";

import React from "react";
import {
  Zap,
  ShieldCheck,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuditDetailModalProps {
  audit: any;
  onClose: () => void;
}

export function AuditDetailModal({ audit, onClose }: AuditDetailModalProps) {
  if (!audit) return null;

  const vitals = (Array.isArray(audit.webVitals) ? audit.webVitals[0] : audit.webVitals) || {};

  return (
    <Dialog open={!!audit} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl h-[90vh] bg-[#0B0E14] border-white/10 rounded-3xl p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-xl font-bold">Audit Detailed Report</DialogTitle>
              <p className="text-xs text-zinc-500 font-medium">Generated {new Date(audit.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Top Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ScoreMetric label="Performance" value={audit.performanceScore} icon={<Zap />} color="text-blue-400" />
            <ScoreMetric label="Accessibility" value={audit.accessibilityScore} icon={<ShieldCheck />} color="text-emerald-400" />
            <ScoreMetric label="Best Practices" value={audit.bestPracticesScore} icon={<Zap />} color="text-amber-400" />
            <ScoreMetric label="SEO" value={audit.seoScore} icon={<Search />} color="text-purple-400" />
          </div>

          {/* Core Web Vitals Timeline */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-zinc-400" />
                Core Web Vitals Timeline
              </h3>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Mobile Emulation</span>
            </div>

            <div className="p-8 rounded-3xl space-y-12 bg-white/[0.02] border border-white/5 shadow-inner">
              <div className="relative pt-8 pb-4">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2" />

                <div className="relative flex justify-between">
                  <TimelineMarker label="FCP" value={vitals.fcp} max={5000} />
                  <TimelineMarker label="LCP" value={vitals.lcp} max={5000} />
                  <TimelineMarker label="TTI" value={vitals.tti} max={5000} />
                  <TimelineMarker label="TBT" value={vitals.tbt} max={5000} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <MetricThreshold label="LCP (Max)" value="2.5s" color="bg-emerald-400" />
                <MetricThreshold label="Warning" value="4.0s" color="bg-amber-400" opacity="opacity-50" />
                <MetricThreshold label="Poor" value="> 4s" color="bg-rose-400" opacity="opacity-30" />
              </div>
            </div>
          </section>

          {/* Performance Audit Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="space-y-4">
              <h3 className="text-lg font-bold">Passed Audits</h3>
              <div className="space-y-2">
                <AuditItem label="Properly sized images" passed />
                <AuditItem label="Eliminate render-blocking resources" passed />
                <AuditItem label="Defer offscreen images" passed />
                <AuditItem label="Minify JavaScript" passed />
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-rose-400">Opportunities</h3>
              <div className="space-y-2">
                <AuditItem label="Reduce unused CSS" time="-0.8s" />
                <AuditItem label="Serve images in next-gen formats" time="-1.2s" />
                <AuditItem label="Avoid an excessive DOM size" time="-0.3s" />
              </div>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-all">
              <ExternalLink className="w-4 h-4" />
              View Full JSON
            </button>
          </div>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all">
            Download PDF Report
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScoreMetric({ label, value, icon, color }: any) {
  return (
    <div className="p-6 rounded-3xl flex flex-col items-center gap-4 group hover:border-white/10 transition-all bg-white/[0.02] border border-white/5">
      <div className={`p-4 bg-white/[0.03] rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div className="text-center">
        <div className={`text-3xl font-black ${color}`}>{value || "--"}</div>
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{label}</div>
      </div>
    </div>
  );
}

function TimelineMarker({ label, value, max }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{label}</div>
      <div className="h-4 w-4 rounded-full bg-blue-500 ring-4 ring-blue-500/10 z-10" />
      <div className="text-xs font-bold text-white">
        {typeof value === "number" ? `${(value / 1000).toFixed(1)}s` : "--"}
      </div>
    </div>
  );
}

function MetricThreshold({ label, value, color, opacity = "" }: any) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 ${opacity}`}>
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <div>
        <div className="text-[10px] font-bold text-zinc-500 uppercase">{label}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  );
}

function AuditItem({ label, passed, time }: { label: string, passed?: boolean, time?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-3">
        {passed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-500" />
        )}
        <span className="text-sm font-medium text-zinc-300">{label}</span>
      </div>
      {time && <span className="text-xs font-bold text-rose-400">{time}</span>}
    </div>
  );
}
