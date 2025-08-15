import { supabase } from '@/integrations/supabase/client';

export const uploadImageToSupabase = async (file: File, projectId: string): Promise<string | null> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Apenas imagens são permitidas');
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Imagem muito grande. Máximo 10MB');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${projectId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Erro no upload da imagem:', error);
    return null;
  }
};

export const deleteImageFromSupabase = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract the file path from the URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // Get projectId/filename.ext

    const { error } = await supabase.storage
      .from('project-images')
      .remove([filePath]);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    return false;
  }
};

export const optimizeImageForDisplay = (url: string, width?: number, height?: number): string => {
  if (!url || (!width && !height)) return url;
  
  // For Supabase Storage, we could add transformation parameters
  // This is a simple implementation - you might want to use a service like Cloudinary
  const params = new URLSearchParams();
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  
  return url + (url.includes('?') ? '&' : '?') + params.toString();
};