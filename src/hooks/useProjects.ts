import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  title: string;
  description?: string;
  city?: string;
  start_date?: string;
  end_date?: string;
  delivery_date?: string;
  category?: string;
  cover_image?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  date?: string;
  project_id: string;
  created_at: string;
}

export interface ProjectWithImages extends Project {
  images: ProjectImage[];
  client_name?: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      if (!projectsData) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const { data: imagesData, error: imagesError } = await supabase
        .from('project_images')
        .select('*')
        .in('project_id', projectsData.map(p => p.id));

      if (imagesError) console.warn('Erro ao carregar imagens:', imagesError);

      const processedProjects: ProjectWithImages[] = projectsData.map((project) => {
        const projectImages: ProjectImage[] = (imagesData?.filter(img => img.project_id === project.id) || []).map(img => ({
          id: img.id,
          url: img.url,
          caption: img.caption,
          project_id: img.project_id,
          created_at: img.created_at
        }));

        return {
          ...project,
          images: projectImages,
        };
      });

      const projectsWithImages = processedProjects.filter(p => p.images.length > 0);
      setProjects(projectsWithImages);
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refreshProjects = useCallback(() => {
    return fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refreshProjects,
    fetchProjects,
    isRetrying: false
  };
};
