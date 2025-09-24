import { useState, useEffect } from 'react';
import { Images, Upload, Check, X } from 'lucide-react';
import { listAllImages, uploadImageToSupabase } from '@/utils/imageHelpers';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageSelectorProps {
  selectedImage?: string;
  onImageSelect: (imageUrl: string) => void;
  onClose: () => void;
}

const ImageSelector = ({ selectedImage, onImageSelect, onClose }: ImageSelectorProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Images className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Selecionar Imagem</h2>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                  {images.length} disponíveis
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="quick-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="quick-upload"
                  className={`flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors text-sm ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Enviando...' : 'Upload'}
                </label>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <Images className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma imagem disponível
                </h3>
                <p className="text-gray-500 mb-4">
                  Faça upload de algumas imagens para começar
                </p>
                <label
                  htmlFor="quick-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Fazer Upload
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <motion.div
                    key={image}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      selectedImage === image
                        ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
                        : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-1'
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <img
                      src={image}
                      alt={`Opção ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {selectedImage === image && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-white rounded-full p-2">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-200" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageSelector;