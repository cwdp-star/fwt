import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Plus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadImageToSupabase, deleteImageFromSupabase } from '@/utils/imageHelpers';

interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  date?: string;
  project_id: string;
}

interface ImageUploadManagerProps {
  projectId: string;
  images: ProjectImage[];
  onImagesUpdate: (images: ProjectImage[]) => void;
  maxImages?: number;
}

export const ImageUploadManager: React.FC<ImageUploadManagerProps> = ({
  projectId,
  images,
  onImagesUpdate,
  maxImages = 20,
}) => {
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    return await uploadImageToSupabase(file, projectId);
  }, [projectId]);

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      toast({
        title: "Limite excedido",
        description: `Máximo de ${maxImages} imagens por projeto`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newImages: ProjectImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ficheiro inválido",
          description: "Apenas imagens são permitidas",
          variant: "destructive",
        });
        continue;
      }

      const url = await uploadImage(file);
      if (url) {
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
        }
      }
    }

    if (newImages.length > 0) {
      onImagesUpdate([...images, ...newImages]);
      toast({
        title: "Sucesso",
        description: `${newImages.length} imagem(ns) adicionada(s)`,
      });
    }

    setUploading(false);
  }, [images, maxImages, projectId, uploadImage, onImagesUpdate, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const updateImageCaption = useCallback(async (imageId: string, caption: string) => {
    const { error } = await supabase
      .from('project_images')
      .update({ caption })
      .eq('id', imageId);

    if (!error) {
      const updatedImages = images.map(img => 
        img.id === imageId ? { ...img, caption } : img
      );
      onImagesUpdate(updatedImages);
    }
  }, [images, onImagesUpdate]);

  const deleteImage = useCallback(async (imageId: string) => {
    const imageToDelete = images.find(img => img.id === imageId);
    if (!imageToDelete) return;

    // Delete from storage first
    const storageDeleted = await deleteImageFromSupabase(imageToDelete.url);
    
    if (storageDeleted) {
      // Then delete from database
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (!error) {
        const updatedImages = images.filter(img => img.id !== imageId);
        onImagesUpdate(updatedImages);
        toast({
          title: "Sucesso",
          description: "Imagem removida",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao remover imagem da base de dados",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Erro",
        description: "Erro ao remover imagem do armazenamento",
        variant: "destructive",
      });
    }
  }, [images, onImagesUpdate, toast]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop2 = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    // Update order in database - simplified for now
    // In a real implementation, you might want to add an order_index column

    onImagesUpdate(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Adicionar Imagens ao Projeto
        </h3>
        <p className="text-muted-foreground mb-4">
          Arraste imagens aqui ou clique para selecionar
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {images.length}/{maxImages} imagens • PNG, JPG até 10MB cada
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            disabled={uploading || images.length >= maxImages}
            asChild
          >
            <label>
              <Plus className="h-4 w-4 mr-2" />
              Selecionar Ficheiros
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading || images.length >= maxImages}
              />
            </label>
          </Button>
        </div>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card rounded-lg overflow-hidden shadow-sm border"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop2(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  {/* Image */}
                  <div className="relative aspect-video">
                    <img
                      src={image.url}
                      alt={image.caption || `Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Controls */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => deleteImage(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Drag handle */}
                    <div className="absolute top-2 left-2">
                      <GripVertical className="h-5 w-5 text-white/80 cursor-move" />
                    </div>

                    {/* Order indicator */}
                    <div className="absolute bottom-2 left-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-4 space-y-2">
                    <Label htmlFor={`caption-${image.id}`}>Legenda</Label>
                    <Textarea
                      id={`caption-${image.id}`}
                      value={image.caption || ''}
                      onChange={(e) => updateImageCaption(image.id, e.target.value)}
                      placeholder="Adicione uma legenda à imagem..."
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">A carregar imagens...</p>
        </div>
      )}
    </div>
  );
};