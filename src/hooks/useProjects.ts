import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCache } from './useLocalStorage';
import { useRetry } from './useRetry';

export interface Project {
  id: string;
  title: string;
  description?: string;
  city?: string;
  start_date?: string;  // Adicionado campo start_date
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
  
  // Cache dos projetos por 15 minutos
  const [cachedProjects, setCachedProjects] = useCache<ProjectWithImages[]>('projects-cache', 15);
  const { retry, isRetrying } = useRetry({
    maxAttempts: 3,
    delay: 2000,
    exponentialBackoff: true
  });

  console.log('🎯 useProjects inicializado');

  const fetchProjects = useCallback(async (skipCache = false) => {
    console.log('🚀 fetchProjects chamada - skipCache:', skipCache, 'cachedProjects:', cachedProjects?.length);
    
    // Verificar cache primeiro (se não forçar atualização)
    if (!skipCache && cachedProjects && cachedProjects.length > 0) {
      console.log('📱 Usando cache - projects:', cachedProjects.length);
      setProjects(cachedProjects);
      setLoading(false);
      return;
    }

    const fetchOperation = async () => {
      console.log('🌐 Iniciando busca no Supabase...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        setLoading(true);
        setError(null);
        console.log('⏳ Loading true, error null');

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
          .order('created_at', { ascending: false })
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);
        console.log('📦 Dados recebidos do Supabase:', { 
          projectsData: projectsData?.length, 
          error: projectsError?.message 
        });

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
            // Expressão regular mais robusta para capturar nomes de clientes
            const clientMatches = [
              /cliente:\s*([^\n\r,.;]+)/i,
              /client[e]?:\s*([^\n\r,.;]+)/i,
              /para:\s*([^\n\r,.;]+)/i,
              /destinatário:\s*([^\n\r,.;]+)/i
            ];
            
            for (const regex of clientMatches) {
              const match = project.description.match(regex);
              if (match) {
                clientName = match[1].trim();
                break;
              }
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

        console.log('✅ Projetos processados:', {
          totalProjects: projectsData?.length || 0,
          projectsWithImages: projectsWithActualImages.length,
          projects: projectsWithActualImages.map(p => ({ id: p.id, title: p.title, imageCount: p.images.length }))
        });

        // Salvar no cache
        setCachedProjects(projectsWithActualImages);
        setProjects(projectsWithActualImages);
        console.log('💾 Cache atualizado e state definido');
        
        return projectsWithActualImages;
      } catch (err) {
        console.error('❌ Erro ao buscar projetos:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
        console.log('🏁 Loading definido como false');
      }
    };

    // Usar retry com a operação
    try {
      console.log('🔄 Iniciando retry...');
      await retry(fetchOperation);
    } catch (finalError) {
      console.error('💥 Erro final após todas as tentativas:', finalError);
    }
  }, [cachedProjects, setCachedProjects, retry]);

  useEffect(() => {
    console.log('🔥 useEffect disparado - fetchProjects');
    fetchProjects();
  }, [fetchProjects]);

  const refreshProjects = useCallback(() => {
    console.log('🔄 refreshProjects chamada');
    fetchProjects(true); // Forçar atualização ignorando cache
  }, [fetchProjects]);

  return {
    projects,
    loading: loading || isRetrying,
    error,
    refreshProjects,
    fetchProjects,
    isRetrying
  };
};