import { useState, useCallback } from 'react';
import { X, Trash2, ZoomIn, Upload, ImagePlus, GripVertical, Pencil, Check, MoveUp, MoveDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  onImagesChanged: () => void;
}

const ProjectImageGallery = ({ images, projectId, projectTitle, onImagesChanged }: ProjectImageGalleryProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ProjectImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);
  const [editingCaptionText, setEditingCaptionText] = useState('');
  const [savingCaption, setSavingCaption] = useState(false);
  const [localImages, setLocalImages] = useState<ProjectImage[]>(images);

  // Sync local images with props
  useState(() => {
    setLocalImages(images);
  });

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
            caption: ''
          });

        if (insertError) throw insertError;
      });

      await Promise.all(uploadPromises);
      toast.success(`${files.length} imagem(ns) adicionada(s) com sucesso!`);
      onImagesChanged();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload das imagens.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (image: ProjectImage) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) {
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
      onImagesChanged();
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      toast.error('Erro ao excluir imagem. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  const startEditCaption = (image: ProjectImage) => {
    setEditingCaptionId(image.id);
    setEditingCaptionText(image.caption || '');
  };

  const saveCaption = async () => {
    if (!editingCaptionId) return;
    
    setSavingCaption(true);
    try {
      const { error } = await supabase
        .from('project_images')
        .update({ caption: editingCaptionText })
        .eq('id', editingCaptionId);

      if (error) throw error;

      toast.success('Legenda atualizada!');
      setEditingCaptionId(null);
      onImagesChanged();
    } catch (error) {
      console.error('Erro ao salvar legenda:', error);
      toast.error('Erro ao salvar legenda.');
    } finally {
      setSavingCaption(false);
    }
  };

  const moveImage = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    // Swap images in local state for immediate feedback
    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setLocalImages(newImages);

    // Update timestamps to change order in database
    try {
      const now = new Date();
      const updates = newImages.map((img, idx) => 
        supabase
          .from('project_images')
          .update({ updated_at: new Date(now.getTime() - idx * 1000).toISOString() })
          .eq('id', img.id)
      );

      await Promise.all(updates);
      onImagesChanged();
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      toast.error('Erro ao reordenar imagens.');
    }
  };

  const displayImages = localImages.length > 0 ? localImages : images;

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
      {displayImages.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p>Nenhuma imagem neste projeto</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayImages.map((image, index) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden border bg-muted"
            >
              {/* Image */}
              <div className="aspect-square">
                <img
                  src={image.url}
                  alt={image.caption || projectTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Overlay actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7"
                  onClick={() => setPreviewImage(image)}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-7 w-7"
                  onClick={() => handleDeleteImage(image)}
                  disabled={deletingId === image.id}
                >
                  {deletingId === image.id ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>

              {/* Reorder buttons */}
              <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                >
                  <MoveUp className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === displayImages.length - 1}
                >
                  <MoveDown className="h-3 w-3" />
                </Button>
              </div>

              {/* Caption section */}
              <div className="p-2 bg-background border-t">
                {editingCaptionId === image.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editingCaptionText}
                      onChange={(e) => setEditingCaptionText(e.target.value)}
                      placeholder="Legenda da imagem..."
                      className="h-8 text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && saveCaption()}
                    />
                    <Button
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={saveCaption}
                      disabled={savingCaption}
                    >
                      {savingCaption ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded p-1 -m-1"
                    onClick={() => startEditCaption(image)}
                  >
                    <Pencil className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                      {image.caption || 'Clique para adicionar legenda...'}
                    </span>
                  </div>
                )}
              </div>
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
