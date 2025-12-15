import { useState, useEffect } from 'react';
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

export const useProjects = (includeEmpty = false) => {
  const [projects, setProjects] = useState<ProjectWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshProjects = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      setLoading(true);
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;
        if (!projectsData || projectsData.length === 0) {
          if (isMounted) {
            setProjects([]);
            setLoading(false);
          }
          return;
        }

        const { data: imagesData, error: imagesError } = await supabase
          .from('project_images')
          .select('*')
          .in('project_id', projectsData.map((p) => p.id));

        if (imagesError) console.error('Images error:', imagesError);

        const processed = projectsData.map((project) => ({
          ...project,
          images: (imagesData || []).filter((img) => img.project_id === project.id),
        }));

        // If includeEmpty is false, filter out projects without images
        const finalProjects = includeEmpty
          ? processed
          : processed.filter((p) => p.images.length > 0);

        if (isMounted) {
          setProjects(finalProjects);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading projects:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro');
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger, includeEmpty]);

  return { projects, loading, error, refreshProjects };
};
