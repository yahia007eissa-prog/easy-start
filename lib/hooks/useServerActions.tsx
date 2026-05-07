'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Project } from '@/lib/types/project';
import { createEmptyCostEstimation, createEmptyROICalculations, createEmptyMaterialTakeoff } from '@/lib/types/project';

// This is a simplified version that works without Prisma
// For production with Prisma, you'd use the full version

// Context
interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createProject: (data: { name: string; type: string; description?: string; address: string; city: string; state: string; zipCode: string }) => Promise<Project>;
  updateProject: (id: string, data: { name?: string; status?: string; description?: string }) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Just return empty array for now - no Prisma
      setProjects([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProject = async (data: { name: string; type: string; description?: string; address: string; city: string; state: string; zipCode: string }) => {
    const newProject: Project = {
      id: `local-${Date.now()}`,
      name: data.name,
      type: data.type as Project['type'],
      status: 'draft' as Project['status'],
      description: data.description || '',
      location: {
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      calculations: { costEstimation: createEmptyCostEstimation(), roiCalculations: createEmptyROICalculations(), materialTakeoff: createEmptyMaterialTakeoff() },
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id: string, data: { name?: string; status?: string; description?: string }) => {
    setProjects(prev => prev.map(p =>
      p.id === id ? {
        ...p,
        ...data,
        status: data.status as Project['status'] || p.status,
        updatedAt: new Date(),
      } : p
    ));
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProject = async (id: string) => {
    return projects.find(p => p.id === id) || null;
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoading,
        error,
        refresh,
        createProject,
        updateProject,
        deleteProject,
        getProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}

export function useProject(id: string) {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectsProvider');
  }

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    context.getProject(id).then((result) => {
      if (mounted) {
        setProject(result);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (mounted) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [id, context]);

  return { project, isLoading, error, refresh: context.refresh };
}