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
    const fetchProjects = async () => {
      try {
        console.log('🚀 Iniciando busca de projetos...');
        setLoading(true);
        setError(null);

        // Buscar projetos
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        console.log('📦 Projetos recebidos:', projectsData?.length);

        if (projectsError) {
          console.error('❌ Erro ao buscar projetos:', projectsError);
          throw projectsError;
        }

        if (!projectsData || projectsData.length === 0) {
          console.log('⚠️ Nenhum projeto encontrado');
          setProjects([]);
          setLoading(false);
          return;
        }

        // Buscar imagens
        const { data: imagesData, error: imagesError } = await supabase
          .from('project_images')
          .select('*')
          .in('project_id', projectsData.map(p => p.id));

        console.log('🖼️ Imagens recebidas:', imagesData?.length);

        if (imagesError) {
          console.warn('⚠️ Erro ao buscar imagens:', imagesError);
        }

        // Processar projetos
        const processedProjects: ProjectWithImages[] = projectsData
          .map((project) => {
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
          })
          .filter(p => p.images.length > 0); // Apenas projetos com imagens

        console.log('✅ Projetos processados:', processedProjects.length);
        setProjects(processedProjects);
      } catch (err) {
        console.error('❌ Erro fatal:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
      } finally {
        setLoading(false);
        console.log('🏁 Busca finalizada');
      }
    };

    fetchProjects();
  }, []); // Array vazio - executa apenas uma vez

  const refreshProjects = () => {
    setLoading(true);
    setError(null);
  };

  return {
    projects,
    loading,
    error,
    refreshProjects,
    fetchProjects: refreshProjects,
    isRetrying: false
  };
};
