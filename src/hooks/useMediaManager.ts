import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { uploadImageToSupabase, deleteImageFromSupabase } from '@/utils/imageHelpers';
import { useToast } from '@/hooks/use-toast';

interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  url: string;
  title?: string;
  description?: string;
  tags?: string[];
  category: string;
  created_at: string;
  updated_at: string;
}

export const useMediaManager = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const fetchMediaFiles = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaFiles(data || []);
    } catch (error) {
      console.error('Erro ao buscar arquivos de mídia:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar arquivos de mídia",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const uploadFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map(async (file, index) => {
      const fileId = `${Date.now()}-${index}`;
      
      try {
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Upload to Supabase Storage
        const url = await uploadImageToSupabase(file, 'media');
        if (!url) throw new Error('Falha no upload da imagem');

        setUploadProgress(prev => ({ ...prev, [fileId]: 50 }));

        // Save metadata to database
        const { data, error } = await supabase
          .from('media_files')
          .insert({
            filename: `media/${Date.now()}_${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`,
            original_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            url: url,
            category: 'media'
          })
          .select()
          .single();

        if (error) throw error;

        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        
        return data;
      } catch (error) {
        console.error('Erro no upload:', error);
        toast({
          title: "Erro no Upload",
          description: `Erro ao fazer upload de ${file.name}`,
          variant: "destructive",
        });
        return null;
      } finally {
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 2000);
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(Boolean);
    
    if (successfulUploads.length > 0) {
      toast({
        title: "Upload Concluído",
        description: `${successfulUploads.length} arquivo(s) enviado(s) com sucesso`,
      });
      fetchMediaFiles();
    }
  }, [toast, fetchMediaFiles]);

  const deleteFile = useCallback(async (mediaFile: MediaFile) => {
    try {
      setLoading(true);
      
      // Delete from Supabase Storage
      const deleted = await deleteImageFromSupabase(mediaFile.url);
      if (!deleted) {
        console.warn('Falha ao deletar do storage, continuando com remoção do banco');
      }

      // Delete from database
      const { error } = await supabase
        .from('media_files')
        .delete()
        .eq('id', mediaFile.id);

      if (error) throw error;

      toast({
        title: "Arquivo Removido",
        description: "Arquivo removido com sucesso",
      });
      
      fetchMediaFiles();
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover arquivo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, fetchMediaFiles]);

  const updateFile = useCallback(async (id: string, updates: Partial<MediaFile>) => {
    try {
      const { error } = await supabase
        .from('media_files')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Arquivo Atualizado",
        description: "Informações do arquivo atualizadas com sucesso",
      });
      
      fetchMediaFiles();
    } catch (error) {
      console.error('Erro ao atualizar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar arquivo",
        variant: "destructive",
      });
    }
  }, [toast, fetchMediaFiles]);

  return {
    mediaFiles,
    loading,
    uploadProgress,
    fetchMediaFiles,
    uploadFiles,
    deleteFile,
    updateFile,
  };
};