import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { uploadImageToSupabase } from '@/utils/imageHelpers';
import { supabase } from '@/integrations/supabase/client';

interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  date?: string;
  project_id: string;
}

export const useImageUpload = (projectId: string, maxImages: number = 20) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadImages = useCallback(async (
    files: FileList,
    images: ProjectImage[],
    onSuccess: (newImages: ProjectImage[]) => void
  ) => {
    if (images.length + files.length > maxImages) {
      toast({
        title: "Limite excedido",
        description: `Máximo de ${maxImages} imagens por projeto`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    const newImages: ProjectImage[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update progress
      setUploadProgress(Math.round((i / totalFiles) * 80)); // 80% for upload
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ficheiro inválido",
          description: `${file.name} não é uma imagem válida`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Ficheiro muito grande",
          description: `${file.name} excede o limite de 10MB`,
          variant: "destructive",
        });
        continue;
      }

      try {
        const url = await uploadImageToSupabase(file, 'gallery');
        
        if (url) {
          // Update progress
          setUploadProgress(Math.round(((i + 0.5) / totalFiles) * 80 + 10)); // 90% when database insert starts
          
          const { data, error } = await supabase
            .from('project_images')
            .insert({
              project_id: projectId,
              url,
              caption: '',
              date: new Date().toISOString(),
            })
            .select()
            .single();

          if (data && !error) {
            newImages.push(data);
          } else {
            toast({
              title: "Erro na base de dados",
              description: `Erro ao guardar ${file.name}`,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Erro no upload",
            description: `Erro ao fazer upload de ${file.name}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        toast({
          title: "Erro no processamento",
          description: `Erro ao processar ${file.name}`,
          variant: "destructive",
        });
      }
    }

    setUploadProgress(100);

    if (newImages.length > 0) {
      onSuccess(newImages);
      toast({
        title: "Sucesso",
        description: `${newImages.length} imagem(ns) adicionada(s) com sucesso`,
      });
    }

    setUploading(false);
    setUploadProgress(0);
  }, [projectId, maxImages, toast]);

  return {
    uploading,
    uploadProgress,
    uploadImages,
  };
};