import { useState, useCallback } from 'react';
import { X, Trash2, ZoomIn, Upload, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
}

interface ProjectImageGalleryProps {
  images: ProjectImage[];
  projectId: string;
  projectTitle: string;
  onImageDeleted: () => void;
}

const ProjectImageGallery = ({ images, projectId, projectTitle, onImageDeleted }: ProjectImageGalleryProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ProjectImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      toast.error('Por favor, solte apenas arquivos de imagem.');
      return;
    }

    await uploadImages(files);
  }, [projectId]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await uploadImages(files);
    }
    e.target.value = '';
  };

  const uploadImages = async (files: File[]) => {
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `project-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        const { error: insertError } = await supabase
          .from('project_images')
          .insert({
            project_id: projectId,
            url: publicUrl,
            caption: file.name.replace(/\.[^/.]+$/, '')
          });

        if (insertError) throw insertError;
      });

      await Promise.all(uploadPromises);
      toast.success(`${files.length} imagem(ns) adicionada(s) com sucesso!`);
      onImageDeleted();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload das imagens.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (image: ProjectImage) => {
    if (!confirm(`Tem certeza que deseja excluir esta imagem?`)) {
      return;
    }

    setDeletingId(image.id);

    try {
      const urlParts = image.url.split('/project-images/');
      if (urlParts.length > 1) {
        const filePath = `project-images/${urlParts[1]}`;
        await supabase.storage.from('project-images').remove([filePath]);
      }

      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;

      toast.success('Imagem excluída com sucesso!');
      onImageDeleted();
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      toast.error('Erro ao excluir imagem. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-4 mb-4 transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-primary/10 scale-[1.02]' 
            : 'border-muted-foreground/30 hover:border-primary/50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center py-4 text-center">
          {uploading ? (
            <>
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
              <p className="text-sm text-muted-foreground">A fazer upload...</p>
            </>
          ) : (
            <>
              <Upload className={`h-10 w-10 mb-3 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm text-muted-foreground mb-2">
                {isDragging ? 'Solte as imagens aqui' : 'Arraste imagens para cá ou'}
              </p>
              <label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                  <span>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Selecionar Imagens
                  </span>
                </Button>
              </label>
            </>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p>Nenhuma imagem neste projeto</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              <img
                src={image.url}
                alt={image.caption || projectTitle}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => setPreviewImage(image)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDeleteImage(image)}
                  disabled={deletingId === image.id}
                >
                  {deletingId === image.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="absolute top-2 right-2 z-10">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {previewImage && (
            <div className="relative">
              <img
                src={previewImage.url}
                alt={previewImage.caption || projectTitle}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
              {previewImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 text-center">
                  {previewImage.caption}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectImageGallery;
