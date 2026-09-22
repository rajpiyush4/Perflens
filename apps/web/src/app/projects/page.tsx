"use client";

import React, { useState, useMemo } from "react";
import {
    Globe,
    Plus,
    Search,
    LayoutGrid,
    List,
    ExternalLink,
    MoreVertical,
    Edit,
    Trash2,
    Zap,
    Activity,
    CheckCircle2,
    BarChart2,
    Server,
    Play,
    ArrowRight,
    ShieldCheck,
    Clock,
    Loader2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useProject } from "@/context/project-context";
import { AddProjectModal } from "@/components/dashboard/add-project-modal";
import { EditProjectModal } from "@/components/projects/edit-project-modal";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuditSummary {
    id: string;
    performanceScore?: number | null;
    seoScore?: number | null;
    accessibilityScore?: number | null;
    bestPracticesScore?: number | null;
    createdAt: string;
    status: string;
}

interface ProjectItem {
    id: string;
    name: string;
    url: string;
    environment?: string;
    createdAt?: string;
    audits?: AuditSummary[];
}

export default function ProjectsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { activeProject, setActiveProject, userId } = useProject();

    const [searchQuery, setSearchQuery] = useState("");
    const [envFilter, setEnvFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
    const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [runningAuditId, setRunningAuditId] = useState<string | null>(null);

    // Fetch Projects
    const { data: projects = [], isLoading } = useQuery<ProjectItem[]>({
        queryKey: ["projects"],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:4000/projects?userId=${userId}`);
            return res.data;
        },
    });

    // Run Audit Mutation
    const { mutate: runAudit } = useMutation({
        mutationFn: async (projectId: string) => {
            setRunningAuditId(projectId);
            const res = await axios.post(`http://localhost:4000/audit/${projectId}`);
            return res.data;
        },
        onSuccess: (_, projectId) => {
            setRunningAuditId(null);
            toast.success("Audit started!", {
                description: "Scanning domain in background worker.",
            });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            if (activeProject?.id === projectId) {
                queryClient.invalidateQueries({ queryKey: ["audits", projectId] });
            }
        },
        onError: (err: any) => {
            setRunningAuditId(null);
            toast.error("Failed to run audit", {
                description: err.response?.data?.message || "Verify API service availability.",
            });
        },
    });

    // Filtered Projects
    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.url.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesEnv =
                envFilter === "all" || (p.environment || "production").toLowerCase() === envFilter.toLowerCase();
            return matchesSearch && matchesEnv;
        });
    }, [projects, searchQuery, envFilter]);

    // Aggregate Metrics
    const stats = useMemo(() => {
        const totalProjects = projects.length;
        let totalAudits = 0;
        let scoreSum = 0;
        let scoreCount = 0;

        projects.forEach((p) => {
            if (p.audits && p.audits.length > 0) {
                totalAudits += p.audits.length;
                const last = p.audits[0];
                if (typeof last.performanceScore === "number") {
                    scoreSum += last.performanceScore;
                    scoreCount++;
                }
            }
        });

        const avgScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : null;
        return { totalProjects, totalAudits, avgScore };
    }, [projects]);

    const getScoreBadgeClass = (score: number | null | undefined) => {
        if (score == null) return "bg-zinc-800 text-zinc-500 border-zinc-700";
        if (score >= 90) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        if (score >= 50) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    };

    const handleSelectProject = (project: ProjectItem) => {
        setActiveProject(project);
        router.push("/");
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Globe className="w-4 h-4 text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Project Dashboard</h1>
                    </div>
                    <p className="text-sm text-zinc-400">
                        Manage your monitored websites, environments, and performance thresholds.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 self-start md:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Add New Project
                </button>
            </div>

            {/* KPI Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#121620]/60 border border-white/5 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Projects</span>
                        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <Globe className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{stats.totalProjects}</span>
                        <span className="text-xs text-emerald-400 font-medium">Monitored</span>
                    </div>
                </div>

                <div className="bg-[#121620]/60 border border-white/5 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Audits</span>
                        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                            <Zap className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{stats.totalAudits}</span>
                        <span className="text-xs text-purple-400 font-medium">Runs completed</span>
                    </div>
                </div>

                <div className="bg-[#121620]/60 border border-white/5 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Avg Perf Score</span>
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <BarChart2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">
                            {stats.avgScore !== null ? `${stats.avgScore}/100` : "N/A"}
                        </span>
                        {stats.avgScore !== null && (
                            <span className="text-xs text-emerald-400 font-medium">Overall health</span>
                        )}
                    </div>
                </div>

                <div className="bg-[#121620]/60 border border-white/5 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">System Status</span>
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            Operational
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter and Control Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121620]/40 border border-white/5 p-3 rounded-2xl">
                <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                    {/* Search Box */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search projects by name or URL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>

                    {/* Environment Filter */}
                    <div className="relative">
                        <select
                            value={envFilter}
                            onChange={(e) => setEnvFilter(e.target.value)}
                            className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none pr-8 cursor-pointer"
                        >
                            <option value="all" className="bg-[#121620]">All Environments</option>
                            <option value="production" className="bg-[#121620]">Production</option>
                            <option value="staging" className="bg-[#121620]">Staging</option>
                            <option value="development" className="bg-[#121620]">Development</option>
                        </select>
                        <Server className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                </div>

                {/* View Switcher */}
                <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1 rounded-xl self-end sm:self-auto">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === "grid"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                        title="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === "table"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                        title="Table View"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Loading Skeletons */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-[#121620]/40 border border-white/5 rounded-3xl p-6 h-64 animate-pulse space-y-4">
                            <div className="h-6 bg-zinc-800 rounded w-1/2" />
                            <div className="h-4 bg-zinc-800 rounded w-3/4" />
                            <div className="h-20 bg-zinc-800/50 rounded-2xl" />
                            <div className="h-8 bg-zinc-800 rounded" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredProjects.length === 0 && (
                <div className="bg-[#121620]/30 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4">
                    <div className="h-16 w-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">No Projects Found</h3>
                        <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                            {searchQuery || envFilter !== "all"
                                ? "No projects match your active search or environment filters."
                                : "Get started by adding your first project to scan and monitor performance."}
                        </p>
                    </div>
                    {searchQuery || envFilter !== "all" ? (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setEnvFilter("all");
                            }}
                            className="text-xs text-blue-400 hover:underline font-medium"
                        >
                            Clear Search Filters
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Project
                        </button>
                    )}
                </div>
            )}

            {/* Projects Grid View */}
            {!isLoading && viewMode === "grid" && filteredProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => {
                        const isActive = activeProject?.id === project.id;
                        const lastAudit = project.audits && project.audits.length > 0 ? project.audits[0] : null;
                        const isAuditRunning = runningAuditId === project.id;

                        return (
                            <div
                                key={project.id}
                                className={`group relative bg-[#121620]/80 border transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/5 ${isActive
                                        ? "border-blue-500/40 ring-1 ring-blue-500/20 shadow-[0_0_30px_-15px_rgba(59,130,246,0.3)]"
                                        : "border-white/5 hover:border-white/15"
                                    }`}
                            >
                                <div>
                                    {/* Top Bar inside Card */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-10 w-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-inner flex-shrink-0 group-hover:border-blue-500/30 transition-colors">
                                                <Globe className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-white text-base truncate group-hover:text-blue-400 transition-colors">
                                                        {project.name}
                                                    </h3>
                                                </div>
                                                <a
                                                    href={project.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-zinc-500 hover:text-blue-400 flex items-center gap-1 truncate mt-0.5"
                                                >
                                                    <span className="truncate">{project.url}</span>
                                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Actions Menu */}
                                        <div className="relative flex-shrink-0">
                                            <button
                                                onClick={() =>
                                                    setOpenDropdownId(openDropdownId === project.id ? null : project.id)
                                                }
                                                className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {openDropdownId === project.id && (
                                                <div className="absolute right-0 top-8 z-50 w-36 bg-[#0B0E14] border border-white/10 rounded-xl shadow-xl py-1 backdrop-blur-2xl">
                                                    <button
                                                        onClick={() => {
                                                            setOpenDropdownId(null);
                                                            setEditingProject(project);
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                                    >
                                                        <Edit className="w-3.5 h-3.5 text-blue-400" />
                                                        Edit Project
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenDropdownId(null);
                                                            setDeletingProject(project);
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 border-t border-white/5"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Badges: Environment & Active State */}
                                    <div className="flex items-center gap-2 my-4">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/10">
                                            {project.environment || "production"}
                                        </span>
                                        {isActive ? (
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                Active Project
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => setActiveProject(project)}
                                                className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-300 transition-colors"
                                            >
                                                Set Active
                                            </button>
                                        )}
                                    </div>

                                    {/* Lighthouse Scores Summary */}
                                    <div className="bg-black/30 border border-white/5 rounded-2xl p-3 my-4">
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                                            Latest Scan Scores
                                        </span>
                                        {lastAudit ? (
                                            <div className="grid grid-cols-4 gap-2 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] text-zinc-500 uppercase">Perf</span>
                                                    <span
                                                        className={`text-xs font-extrabold px-1.5 py-0.5 rounded-lg border mt-1 w-full ${getScoreBadgeClass(
                                                            lastAudit.performanceScore
                                                        )}`}
                                                    >
                                                        {lastAudit.performanceScore ?? "-"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] text-zinc-500 uppercase">SEO</span>
                                                    <span
                                                        className={`text-xs font-extrabold px-1.5 py-0.5 rounded-lg border mt-1 w-full ${getScoreBadgeClass(
                                                            lastAudit.seoScore
                                                        )}`}
                                                    >
                                                        {lastAudit.seoScore ?? "-"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] text-zinc-500 uppercase">A11y</span>
                                                    <span
                                                        className={`text-xs font-extrabold px-1.5 py-0.5 rounded-lg border mt-1 w-full ${getScoreBadgeClass(
                                                            lastAudit.accessibilityScore
                                                        )}`}
                                                    >
                                                        {lastAudit.accessibilityScore ?? "-"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] text-zinc-500 uppercase">Best</span>
                                                    <span
                                                        className={`text-xs font-extrabold px-1.5 py-0.5 rounded-lg border mt-1 w-full ${getScoreBadgeClass(
                                                            lastAudit.bestPracticesScore
                                                        )}`}
                                                    >
                                                        {lastAudit.bestPracticesScore ?? "-"}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-zinc-600 italic text-center py-1">
                                                No audits recorded yet
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Card Footer Actions */}
                                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
                                    <button
                                        onClick={() => runAudit(project.id)}
                                        disabled={isAuditRunning}
                                        className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                    >
                                        {isAuditRunning ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                                        ) : (
                                            <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                                        )}
                                        <span>{isAuditRunning ? "Auditing..." : "Run Audit"}</span>
                                    </button>

                                    <button
                                        onClick={() => handleSelectProject(project)}
                                        className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <span>View Dashboard</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Projects Table View */}
            {!isLoading && viewMode === "table" && filteredProjects.length > 0 && (
                <div className="bg-[#121620]/60 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <th className="py-4 px-6">Project Name</th>
                                    <th className="py-4 px-4">Environment</th>
                                    <th className="py-4 px-4 text-center">Performance</th>
                                    <th className="py-4 px-4 text-center">SEO</th>
                                    <th className="py-4 px-4 text-center">A11y</th>
                                    <th className="py-4 px-4 text-center">Best Practices</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs font-medium">
                                {filteredProjects.map((project) => {
                                    const isActive = activeProject?.id === project.id;
                                    const lastAudit = project.audits && project.audits.length > 0 ? project.audits[0] : null;
                                    const isAuditRunning = runningAuditId === project.id;

                                    return (
                                        <tr
                                            key={project.id}
                                            className={`hover:bg-white/[0.02] transition-colors ${isActive ? "bg-blue-600/[0.03]" : ""
                                                }`}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                        <Globe className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-white">{project.name}</span>
                                                            {isActive && (
                                                                <span className="h-2 w-2 rounded-full bg-emerald-400" title="Active Project" />
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] text-zinc-500 truncate block max-w-xs">
                                                            {project.url}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/10">
                                                    {project.environment || "production"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded-md text-xs font-bold border inline-block w-12 ${getScoreBadgeClass(
                                                        lastAudit?.performanceScore
                                                    )}`}
                                                >
                                                    {lastAudit?.performanceScore ?? "-"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded-md text-xs font-bold border inline-block w-12 ${getScoreBadgeClass(
                                                        lastAudit?.seoScore
                                                    )}`}
                                                >
                                                    {lastAudit?.seoScore ?? "-"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded-md text-xs font-bold border inline-block w-12 ${getScoreBadgeClass(
                                                        lastAudit?.accessibilityScore
                                                    )}`}
                                                >
                                                    {lastAudit?.accessibilityScore ?? "-"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded-md text-xs font-bold border inline-block w-12 ${getScoreBadgeClass(
                                                        lastAudit?.bestPracticesScore
                                                    )}`}
                                                >
                                                    {lastAudit?.bestPracticesScore ?? "-"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => runAudit(project.id)}
                                                        disabled={isAuditRunning}
                                                        className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-transparent hover:border-blue-500/30"
                                                        title="Run Audit"
                                                    >
                                                        {isAuditRunning ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Play className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleSelectProject(project)}
                                                        className="p-1.5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                                        title="View Dashboard"
                                                    >
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingProject(project)}
                                                        className="p-1.5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingProject(project)}
                                                        className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals & Dialogs */}
            <AddProjectModal
                onOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <EditProjectModal
                project={editingProject}
                isOpen={!!editingProject}
                onClose={() => setEditingProject(null)}
            />

            <DeleteProjectDialog
                project={deletingProject}
                isOpen={!!deletingProject}
                onClose={() => setDeletingProject(null)}
            />
        </div>
    );
}
