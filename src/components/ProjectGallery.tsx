import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/hooks/useProjects';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ProjectCard } from '@/components/gallery/ProjectCard';
import { Images } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const ProjectGallery = () => {
  // CRITICAL: Hooks MUST be called before any conditional returns
  const { projects, loading, error, isRetrying, refreshProjects } = useProjects();
  const { elementRef: titleRef, isVisible: titleInView } = useScrollAnimation();
  const { elementRef: galleryRef, isVisible: galleryInView } = useScrollAnimation();

  // Estado de erro com retry
  if (error) {
    return (
      <ErrorBoundary>
        <section className="py-20 bg-gradient-to-br from-background via-background to-secondary/5">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8">
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  Erro ao carregar projetos
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={refreshProjects}
                  disabled={isRetrying}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {isRetrying ? 'Tentando novamente...' : 'Tentar Novamente'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </ErrorBoundary>
    );
  }

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
    <ErrorBoundary>
      <section id="projetos" className="py-20 bg-gradient-to-br from-background via-background to-secondary/5">
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
                Nossos Projetos
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Portfólio de Obras
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Conheça nossos projetos realizados com excelência e dedicação. Clique em um projeto para ver mais detalhes e fotos.
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
                <ProjectCard
                  key={project.id}
                  project={project}
                />
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
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default ProjectGallery;
