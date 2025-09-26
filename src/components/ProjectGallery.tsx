import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMediaManager } from '@/hooks/useMediaManager';
import { ImageLightbox } from '@/components/lightbox/ImageLightbox';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Images } from 'lucide-react';

interface ProjectImageForLightbox {
  id: string;
  url: string;
  caption?: string;
  project_id: string;
}

const ProjectGallery = () => {
  const { mediaFiles, fetchMediaFiles, loading } = useMediaManager();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<ProjectImageForLightbox[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { elementRef: titleRef, isVisible: titleInView } = useScrollAnimation();
  const { elementRef: galleryRef, isVisible: galleryInView } = useScrollAnimation();

  useEffect(() => {
    fetchMediaFiles();
  }, [fetchMediaFiles]);

  const handleImageClick = (index: number) => {
    const imageData = mediaFiles.map((file) => ({
      id: file.id,
      url: file.url,
      caption: file.title || file.description,
      project_id: 'media'
    }));
    setLightboxImages(imageData);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleNextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handlePreviousImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  if (loading || mediaFiles.length === 0) {
    return null;
  }

  return (
    <section id="galeria" className="py-20 bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center mb-4">
            <Images className="h-8 w-8 text-primary mr-3" />
            <Badge variant="secondary" className="px-4 py-2 text-lg font-medium">
              Nossa Galeria
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nossos Trabalhos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore nossa coleção de projetos realizados com excelência e dedicação
          </p>
        </div>

        {/* Gallery Grid */}
        <div 
          ref={galleryRef}
          className={`transition-all duration-1000 delay-300 ${
            galleryInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaFiles.map((file, index) => (
              <Card 
                key={file.id} 
                className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                onClick={() => handleImageClick(index)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={file.url}
                      alt={file.title || file.original_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {(file.title || file.description) && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        {file.title && (
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                            {file.title}
                          </h3>
                        )}
                        {file.description && (
                          <p className="text-xs opacity-90 line-clamp-2">
                            {file.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-card border rounded-full px-6 py-3 shadow-sm">
            <Images className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">{mediaFiles.length}</strong> projeto{mediaFiles.length !== 1 ? 's' : ''} em destaque
            </span>
          </div>
        </div>

        {/* Image Lightbox */}
        <ImageLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
        />
      </div>
    </section>
  );
};

export default ProjectGallery;