"use client";

import React from "react";
import { Globe, Plus, Loader2, Link as LinkIcon, Shield } from "lucide-react";
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

interface AddProjectModalProps {
  onOpen: boolean;
  onClose: () => void;
}

export function AddProjectModal({ onOpen, onClose }: AddProjectModalProps) {
  const [name, setName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const queryClient = useQueryClient();
  const { userId } = useProject();

  const { mutate: createProject, isPending } = useMutation({
    mutationFn: async (data: { name: string; url: string }) => {
      const response = await axios.post("http://localhost:4000/projects", {
        ...data,
        userId, 
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!", {
        description: `${name} has been added to your dashboard.`,
      });
      onClose();
      setName("");
      setUrl("");
    },
    onError: (error: any) => {
      toast.error("Failed to create project", {
        description: error.response?.data?.message || "Something went wrong.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    
    try {
      new URL(url);
      createProject({ name, url });
    } catch {
      toast.error("Invalid URL", {
        description: "Please include http:// or https://",
      });
    }
  };

  return (
    <Dialog open={onOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#0B0E14] border-white/10 rounded-3xl">
        <DialogHeader className="space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center">
            <Globe className="w-6 h-6 text-blue-400" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-white">Add New Project</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Start monitoring the performance of any website in seconds.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Project Name</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. My Portfolio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Website URL</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending || !name || !url}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-6 border-t border-white/5 flex items-center gap-3 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          <Shield className="w-4 h-4" />
          Secure performance monitoring
        </div>
      </DialogContent>
    </Dialog>
  );
}
