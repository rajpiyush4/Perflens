"use client";

import React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useProject } from "@/context/project-context";

interface ProjectItem {
    id: string;
    name: string;
}

interface DeleteProjectDialogProps {
    project: ProjectItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteProjectDialog({ project, isOpen, onClose }: DeleteProjectDialogProps) {
    const queryClient = useQueryClient();
    const { activeProject, setActiveProject } = useProject();

    const { mutate: deleteProject, isPending } = useMutation({
        mutationFn: async () => {
            if (!project) return;
            const response = await axios.delete(`http://localhost:4000/projects/${project.id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            if (activeProject?.id === project?.id) {
                setActiveProject(null as any);
            }
            toast.success("Project deleted", {
                description: `${project?.name} and all its audit history have been removed.`,
            });
            onClose();
        },
        onError: (error: any) => {
            toast.error("Failed to delete project", {
                description: error.response?.data?.message || "Something went wrong.",
            });
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-[#0B0E14] border-white/10 rounded-3xl">
                <DialogHeader className="space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                    </div>
                    <div className="space-y-2">
                        <DialogTitle className="text-2xl font-bold text-white">Delete Project</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Are you sure you want to delete <span className="text-white font-semibold">{project?.name}</span>? This action cannot be undone and will erase all recorded performance audit logs.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="flex items-center gap-3 justify-end mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => deleteProject()}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2"
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Delete Project
                            </>
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
