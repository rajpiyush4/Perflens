import React from "react";
import { 
  ArrowUpRight, 
  Zap, 
  ShieldCheck, 
  Search, 
  Settings2,
  ExternalLink,
  Clock,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Project Header Card */}
      <div className="glass-card rounded-2xl p-8 flex items-center justify-between overflow-hidden relative">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-48 h-32 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="text-[10px] text-zinc-500 font-mono">SITE PREVIEW</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">acme.com</h1>
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <a href="https://acme.com" className="hover:text-white flex items-center gap-1.5 transition-colors">
                https://acme.com <ExternalLink className="h-3 w-3" />
              </a>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Last audit: 2 hours ago
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Next audit: in 22 hours
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12 pr-4 relative z-10">
          <div className="text-center space-y-1">
            <div className="relative h-24 w-24 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-white/5"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="20.1"
                  className="text-green-500"
                />
              </svg>
              <span className="absolute text-2xl font-bold">92</span>
            </div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Performance</div>
          </div>

          <div className="flex gap-8 border-l border-white/5 pl-12">
            <div className="text-center">
              <div className="text-2xl font-bold">24</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Audits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">100%</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-zinc-400">Since Apr 10</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Monitored</div>
            </div>
          </div>
        </div>
        
        {/* Decorative Gradient Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="LCP" value="1.2s" status="good" subtext="Largest Contentful Paint" />
        <MetricCard label="INP" value="98ms" status="good" subtext="Interaction to Next Paint" />
        <MetricCard label="CLS" value="0.04" status="good" subtext="Cumulative Layout Shift" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              Performance Over Time <Settings2 className="h-4 w-4 text-zinc-500" />
            </h3>
            <select className="bg-white/5 border border-white/10 rounded-md text-xs px-2 py-1 outline-none">
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 w-full bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-zinc-500 text-sm italic">
            Chart Placeholder (Recharts)
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-bold">Recent Audits</h3>
          <div className="space-y-3">
            {[92, 89, 74, 91].map((score, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border-2",
                    score > 90 ? "border-green-500/50 text-green-500 bg-green-500/5" : 
                    score > 80 ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/5" :
                    "border-red-500/50 text-red-500 bg-red-500/5"
                  )}>
                    {score}
                  </div>
                  <div>
                    <div className="text-sm font-medium">May {19 - i}, 2025, 10:30 AM</div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{i === 0 ? '2 hours ago' : `${i} day ago`}</div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, status, subtext }: { label: string, value: string, status: string, subtext: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 hover:border-white/20 transition-all group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
        <div className="h-6 w-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-[10px] font-bold text-green-500">
          Good
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-xs text-zinc-500">{subtext}</div>
      </div>
      <div className="pt-4 h-12 flex items-end gap-1">
        {/* Simple Sparkline simulation */}
        {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
          <div key={i} className="flex-1 bg-green-500/20 rounded-t-sm group-hover:bg-green-500/40 transition-all" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

