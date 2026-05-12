"use client";

import React, { createContext, useContext, useState } from "react";

interface Project {
  id: string;
  name: string;
  url: string;
}

interface ProjectContextType {
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  userId: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // SINGLE SOURCE OF TRUTH FOR USER ID
  const userId = "cmovh88sp00001skllty8tgtf";

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject, userId, isLoading, setIsLoading }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
