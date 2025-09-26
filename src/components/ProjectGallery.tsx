import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/hooks/useProjects';
import { ImageLightbox } from '@/components/lightbox/ImageLightbox';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Images, Calendar, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProjectImageForLightbox {
  id: string;
  url: string;
  caption?: string;
  project_id: string;
}

const ProjectGallery = () => {
  const { projects, loading } = useProjects();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<ProjectImageForLightbox[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const { elementRef: titleRef, isVisible: titleInView } = useScrollAnimation();
  const { elementRef: galleryRef, isVisible: galleryInView } = useScrollAnimation();

  const handleProjectClick = (projectId: string, projectTitle: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.images.length === 0) return;

    const imageData = project.images.map((image) => ({
      id: image.id,
      url: image.url,
      caption: image.caption || `${projectTitle} - ${project.city || 'Localização não informada'}`,
      project_id: projectId
    }));
    
    setLightboxImages(imageData);
    setLightboxIndex(0);
    setSelectedProject(projectTitle);
    setLightboxOpen(true);
  };

  const handleNextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handlePreviousImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não informada';
    try {
      return format(new Date(dateString), 'MMMM \'de\' yyyy', { locale: ptBR });
    } catch {
      return 'Data não informada';
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-background via-background to-secondary/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-background via-background to-secondary/5">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
        </div>
      </section>
    );
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

        {/* Projects Grid */}
        <div 
          ref={galleryRef}
          className={`transition-all duration-1000 delay-300 ${
            galleryInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                onClick={() => handleProjectClick(project.id, project.title)}
              >
                <CardContent className="p-0">
                  {/* Project Cover Image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={project.images[0]?.url || project.cover_image || '/placeholder.svg'}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Image Counter Badge */}
                    {project.images.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <Images className="inline-block w-4 h-4 mr-1" />
                        {project.images.length}
                      </div>
                    )}
                  </div>
                  
                  {/* Project Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                        {project.title}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {/* Location */}
                        {project.city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{project.city}</span>
                          </div>
                        )}
                        
                        {/* Completion Date */}
                        {project.end_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>Concluído em {formatDate(project.end_date)}</span>
                          </div>
                        )}
                        
                        {/* Client Name (if available in description) */}
                        {project.client_name && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            <span>{project.client_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category Badge */}
                    {project.category && (
                      <div className="flex justify-end">
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>
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
              <strong className="text-foreground">{projects.length}</strong> obra{projects.length !== 1 ? 's' : ''} em destaque
            </span>
          </div>
        </div>

        {/* Image Lightbox */}
        <ImageLightbox
          isOpen={lightboxOpen}
          onClose={() => {
            setLightboxOpen(false);
            setSelectedProject('');
          }}
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
          title={selectedProject}
        />
      </div>
    </section>
  );
};

export default ProjectGallery;