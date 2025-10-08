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

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        console.log('🔥 FETCHING PROJECTS - START');
        
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        console.log('🔥 PROJECTS DATA:', projectsData);

        if (projectsError) throw projectsError;
        if (!projectsData || projectsData.length === 0) {
          console.log('🔥 NO PROJECTS FOUND');
          if (isMounted) {
            setProjects([]);
            setLoading(false);
          }
          return;
        }

        const { data: imagesData, error: imagesError } = await supabase
          .from('project_images')
          .select('*')
          .in('project_id', projectsData.map(p => p.id));

        console.log('🔥 IMAGES DATA:', imagesData);

        if (imagesError) console.error('Images error:', imagesError);

        const processed = projectsData.map((project) => ({
          ...project,
          images: (imagesData || []).filter(img => img.project_id === project.id)
        })).filter(p => p.images.length > 0);

        console.log('🔥 PROCESSED PROJECTS:', processed);

        if (isMounted) {
          setProjects(processed);
          setLoading(false);
        }
      } catch (err) {
        console.error('🔥 ERROR:', err);
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
  }, []);

  return { projects, loading, error, refreshProjects: () => {}, fetchProjects: () => {}, isRetrying: false };
};
