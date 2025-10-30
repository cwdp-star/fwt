import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  label: string;
  description?: string;
}

// Default values for when QueryClient is not available
const DEFAULT_SETTINGS: Record<string, string> = {
  'company_name': 'FTW Construções',
  'company_phone': '+351 965 123 456',
  'company_email': 'geral@ftwconstrucoes.pt',
  'company_address_street': 'Rua Senhor Dos Aflitos 809',
  'company_address_postal': '4415-887',
  'company_address_city': 'Sandim',
  'company_address_region': 'Vila Nova de Gaia',
};

export const useSiteSettings = () => {
  const { toast } = useToast();
  const [fallbackSettings, setFallbackSettings] = useState<SiteSetting[]>([]);
  
  // Try to get QueryClient, but don't fail if it's not available
  let queryClient;
  try {
    queryClient = useQueryClient();
  } catch (e) {
    // QueryClient not available, will use fallback
  }

  // Load settings from Supabase once on mount (for non-QueryClient contexts)
  useEffect(() => {
    if (!queryClient) {
      supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true })
        .then(({ data }) => {
          if (data) setFallbackSettings(data as SiteSetting[]);
        });
    }
  }, [queryClient]);

  const { data: settings = fallbackSettings, isLoading } = queryClient 
    ? useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .order('category', { ascending: true });
          
          if (error) throw error;
          return data as SiteSetting[];
        },
      })
    : { data: fallbackSettings, isLoading: false };

  const updateSetting = queryClient 
    ? useMutation({
        mutationFn: async ({ id, value }: { id: string; value: string }) => {
          const { error } = await supabase
            .from('site_settings')
            .update({ value })
            .eq('id', id);
          
          if (error) throw error;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['site-settings'] });
          toast({
            title: 'Sucesso',
            description: 'Configuração atualizada com sucesso',
          });
        },
        onError: (error) => {
          toast({
            title: 'Erro',
            description: 'Erro ao atualizar configuração: ' + error.message,
            variant: 'destructive',
          });
        },
      })
    : {
        mutate: () => {},
        isPending: false,
      };

  const getSettingValue = (key: string): string => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || DEFAULT_SETTINGS[key] || '';
  };

  const getSettingsByCategory = (category: string): SiteSetting[] => {
    return settings.filter(s => s.category === category);
  };

  return {
    settings,
    isLoading,
    updateSetting,
    getSettingValue,
    getSettingsByCategory,
  };
};
