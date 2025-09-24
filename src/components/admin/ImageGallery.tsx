import { useState, useEffect } from 'react';
import { Images, Upload, Trash2, Eye, X } from 'lucide-react';
import { listAllImages, uploadImageToSupabase, deleteImageFromSupabase } from '@/utils/imageHelpers';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const imageList = await listAllImages();
      setImages(imageList);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar galeria de imagens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ficheiro inválido",
          description: `${file.name} não é uma imagem válida`,
          variant: "destructive",
        });
        continue;
      }

      try {
        const url = await uploadImageToSupabase(file, 'gallery');
        if (url) {
          newImages.push(url);
        }
      } catch (error) {
        console.error('Erro no upload:', error);
        toast({
          title: "Erro no upload",
          description: `Erro ao fazer upload de ${file.name}`,
          variant: "destructive",
        });
      }
    }

    if (newImages.length > 0) {
      setImages(prev => [...newImages, ...prev]);
      toast({
        title: "Sucesso",
        description: `${newImages.length} imagem(ns) adicionada(s) com sucesso`,
      });
    }

    setUploading(false);
    event.target.value = '';
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const success = await deleteImageFromSupabase(imageUrl);
      if (success) {
        setImages(prev => prev.filter(img => img !== imageUrl));
        toast({
          title: "Sucesso",
          description: "Imagem removida com sucesso",
        });
      } else {
        throw new Error('Falha ao remover imagem');
      }
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem",
        variant: "destructive",
      });
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copiado",
      description: "URL da imagem copiada para o clipboard",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Images className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Galeria de Imagens</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Images className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Galeria de Imagens</h1>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {images.length} imagens
          </span>
        </div>
        
        <div className="flex gap-3">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className={`flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Enviando...' : 'Adicionar Imagens'}
          </label>
        </div>
      </div>

      {/* Image Grid */}
      {images.length === 0 ? (
        <div className="text-center py-16">
          <Images className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Nenhuma imagem na galeria
          </h3>
          <p className="text-gray-500 mb-6">
            Comece adicionando algumas imagens à sua galeria
          </p>
          <label
            htmlFor="image-upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-5 w-5" />
            Adicionar Primeira Imagem
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image);
                    }}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    <Eye className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyImageUrl(image);
                    }}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    <Images className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image);
                    }}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              
              <img
                src={selectedImage}
                alt="Imagem ampliada"
                className="w-full h-full object-contain"
              />
              
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <button
                  onClick={() => copyImageUrl(selectedImage)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Copiar URL
                </button>
                <button
                  onClick={() => handleDeleteImage(selectedImage)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;