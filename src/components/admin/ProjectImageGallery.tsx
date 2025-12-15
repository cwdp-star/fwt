import { useState } from 'react';
import { X, Trash2, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
}

interface ProjectImageGalleryProps {
  images: ProjectImage[];
  projectTitle: string;
  onImageDeleted: () => void;
}

const ProjectImageGallery = ({ images, projectTitle, onImageDeleted }: ProjectImageGalleryProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ProjectImage | null>(null);

  const handleDeleteImage = async (image: ProjectImage) => {
    if (!confirm(`Tem certeza que deseja excluir esta imagem?`)) {
      return;
    }

    setDeletingId(image.id);

    try {
      // Extract file path from URL for storage deletion
      const urlParts = image.url.split('/project-images/');
      if (urlParts.length > 1) {
        const filePath = `project-images/${urlParts[1]}`;
        await supabase.storage.from('project-images').remove([filePath]);
      }

      // Delete from database
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

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
        <p>Nenhuma imagem neste projeto</p>
        <p className="text-sm mt-1">Adicione imagens usando o campo acima</p>
      </div>
    );
  }

  return (
    <>
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
            
            {/* Overlay with actions */}
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

            {/* Caption badge */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

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
