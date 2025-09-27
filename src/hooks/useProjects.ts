import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  title: string;
  description?: string;
  city?: string;
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
  client_name?: string; // Este campo pode ser adicionado no futuro
}

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      setLoading(true);
      setError(null);

      // Otimizar consulta usando JOIN para buscar projetos e imagens em uma única query
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          images:project_images(
            id,
            url,
            caption,
            date,
            project_id,
            created_at
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      clearTimeout(timeoutId);

      if (projectsError) {
        throw projectsError;
      }

      // Processar dados dos projetos com imagens
      const projectsWithImages: ProjectWithImages[] = (projectsData || []).map(project => {
        // Imagens já vêm incluídas na query
        const projectImages = (project.images || []).sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        
        // Extrair nome do cliente da descrição
        let clientName: string | undefined;
        if (project.description) {
          const clientMatch = project.description.match(/cliente:\s*([^\n\r,.;]+)/i);
          if (clientMatch) {
            clientName = clientMatch[1].trim();
          }
        }
        
        return {
          ...project,
          images: projectImages,
          client_name: clientName
        };
      });

      // Filtrar apenas projetos que têm pelo menos uma imagem
      const projectsWithActualImages = projectsWithImages.filter(
        project => project.images && project.images.length > 0
      );

      setProjects(projectsWithActualImages);
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refreshProjects = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refreshProjects,
    fetchProjects
  };
};