import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCache } from './useLocalStorage';
import { useRetry } from './useRetry';

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
  const [cachedData, setCachedData, clearCache] = useCache<ProjectWithImages[]>('projects', 30);
  const { retry, isRetrying } = useRetry({
    maxAttempts: 3,
    delay: 1000,
    exponentialBackoff: true
  });

  const fetchProjects = useCallback(async (skipCache: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar projetos ativos
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (projectsError) {
        throw new Error(`Erro ao carregar projetos: ${projectsError.message}`);
      }

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        setLoading(false);
        return [];
      }

      // Buscar imagens para cada projeto
      const { data: imagesData, error: imagesError } = await supabase
        .from('project_images')
        .select('id, project_id, url, caption, created_at')
        .in('project_id', projectsData.map(p => p.id));

      if (imagesError) {
        console.warn('Erro ao carregar imagens:', imagesError);
      }

      // Processar os dados
      const processedProjects: ProjectWithImages[] = projectsData.map((project) => {
        const projectImages: ProjectImage[] = (imagesData?.filter(img => img.project_id === project.id) || []).map(img => ({
          id: img.id,
          url: img.url,
          caption: img.caption,
          project_id: img.project_id,
          created_at: img.created_at
        }));
        
        // Extrair nome do cliente da descrição se disponível
        let client_name = '';
        if (project.description) {
          const clientMatch = project.description.match(/Cliente:\s*([^\n\r\.]+)/i);
          if (clientMatch) {
            client_name = clientMatch[1].trim();
          }
        }

        return {
          ...project,
          images: projectImages,
          client_name: client_name || undefined
        };
      });

      // Filtrar apenas projetos que têm pelo menos uma imagem
      const projectsWithImages = processedProjects.filter(project => 
        project.images && project.images.length > 0
      );
      
      setProjects(projectsWithImages);
      setCachedData(projectsWithImages);
      
      return projectsWithImages;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar projetos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setCachedData]);

  // Effect para carregar projetos na inicialização
  useEffect(() => {
    const loadProjects = async () => {
      // Verificar cache primeiro
      if (cachedData && cachedData.length > 0) {
        setProjects(cachedData);
        setLoading(false);
        return;
      }

      // Se não houver cache, buscar dados
      try {
        await retry(() => fetchProjects());
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
      }
    };
    
    loadProjects();
  }, [cachedData, fetchProjects, retry]);

  const refreshProjects = useCallback(() => {
    return retry(() => fetchProjects(true));
  }, [fetchProjects, retry]);

  return {
    projects,
    loading: loading || isRetrying,
    error,
    refreshProjects,
    fetchProjects,
    isRetrying
  };
};
