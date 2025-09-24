import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ImageGallery from '@/components/admin/ImageGallery';

const ImageGalleryPage = () => {
  const navigate = useNavigate();

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button
              onClick={() => navigate('/admin')}
              variant="ghost"
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>

            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Images className="h-8 w-8 text-primary" />
              Galeria de Imagens
            </h1>
            <p className="text-muted-foreground">
              Gerencie todas as imagens do site em um local centralizado
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ImageGallery />
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ImageGalleryPage;