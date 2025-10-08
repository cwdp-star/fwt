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
  const [cachedData, setCachedData] = useCache<ProjectWithImages[]>('projects', 30);
  const { retry, isRetrying } = useRetry({
    maxAttempts: 3,
    delay: 1000,
    exponentialBackoff: true
  });

  const fetchProjects = useCallback(async (forceRefresh: boolean = false) => {
    console.log('🚀 fetchProjects iniciando...', { forceRefresh, hasCachedData: !!cachedData });
    
    try {
      setLoading(true);
      setError(null);
      
      // Verificar cache primeiro (apenas se não for refresh forçado)
      if (!forceRefresh && cachedData && cachedData.length > 0) {
        console.log('📦 Usando dados do cache:', cachedData.length, 'projetos');
        setProjects(cachedData);
        setLoading(false);
        return cachedData;
      }

      console.log('🌐 Buscando projetos do Supabase...');
      
      // Timeout de 10 segundos para queries
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao buscar projetos')), 10000)
      );

      // Buscar projetos ativos
      const projectsPromise = supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      const { data: projectsData, error: projectsError } = await Promise.race([
        projectsPromise,
        timeoutPromise
      ]) as any;

      console.log('📊 Projetos recebidos:', projectsData?.length);

      if (projectsError) {
        throw new Error(`Erro ao carregar projetos: ${projectsError.message}`);
      }

      if (!projectsData || projectsData.length === 0) {
        console.log('⚠️ Nenhum projeto encontrado');
        setProjects([]);
        setLoading(false);
        return [];
      }

      // Buscar imagens para cada projeto
      console.log('🖼️ Buscando imagens dos projetos...');
      const imagesPromise = supabase
        .from('project_images')
        .select('id, project_id, url, caption, created_at')
        .in('project_id', projectsData.map(p => p.id));

      const { data: imagesData, error: imagesError } = await Promise.race([
        imagesPromise,
        timeoutPromise
      ]) as any;

      console.log('🖼️ Imagens recebidas:', imagesData?.length);

      if (imagesError) {
        console.warn('⚠️ Erro ao carregar imagens:', imagesError);
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
      
      console.log('✅ Projetos finais com imagens:', projectsWithImages.length);
      
      setProjects(projectsWithImages);
      setCachedData(projectsWithImages);
      
      return projectsWithImages;
    } catch (err) {
      console.error('❌ Erro ao buscar projetos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar projetos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 fetchProjects finalizado');
    }
  }, [cachedData, setCachedData]);

  // Effect para carregar projetos apenas UMA VEZ na montagem
  useEffect(() => {
    console.log('🎬 useProjects montado - iniciando carregamento...');
    
    const loadInitialData = async () => {
      try {
        await retry(() => fetchProjects(false));
      } catch (error) {
        console.error('❌ Erro final ao carregar projetos:', error);
      }
    };
    
    loadInitialData();
    
    // Array vazio = executa apenas uma vez na montagem
  }, []);

  const refreshProjects = useCallback(() => {
    console.log('🔄 refreshProjects - forçando atualização...');
    return retry(() => fetchProjects(true));
  }, [fetchProjects, retry]);

  console.log('📈 useProjects state:', { 
    projectsCount: projects.length, 
    loading, 
    error, 
    isRetrying 
  });

  return {
    projects,
    loading: loading || isRetrying,
    error,
    refreshProjects,
    fetchProjects,
    isRetrying
  };
};
