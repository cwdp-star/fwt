import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/gallery/ProjectCard';
import { Images } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ProjectGallery = () => {
  const { projects, loading, error } = useProjects();
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollAnimation();

  console.log('🎨 GALLERY RENDER:', { projectsCount: projects.length, loading, error });

  if (loading) {
    return (
      <section id="projetos" className="py-20 bg-gradient-to-br from-background via-background to-secondary/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projetos" className="py-20 bg-gradient-to-br from-background via-background to-secondary/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-destructive mb-2">Erro ao carregar projetos</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="projetos" className="py-20 bg-gradient-to-br from-background via-background to-secondary/5">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projetos" className="py-20 bg-gradient-to-br from-background via-background to-secondary/5 lazy-container">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className={`flex items-center justify-center mb-4 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <Images className="h-8 w-8 text-primary mr-3" />
            <Badge variant="secondary" className="px-4 py-2 text-lg font-medium">
              Nossos Projetos
            </Badge>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold text-foreground mb-6 transition-all duration-700 delay-200 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Portfólio de Obras
          </h2>
          <p className={`text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-400 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Conheça nossos projetos realizados com excelência e dedicação. Clique em um projeto para ver mais detalhes e fotos.
          </p>
        </div>

        {/* Projects Grid - 3x2 (3 colunas, limitado a 6 projetos) */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project, index) => (
            <div
              key={project.id}
              className={`transition-all duration-700 ${gridVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
              style={{ 
                transitionDelay: `${index * 100}ms`
              }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className={`inline-flex items-center gap-2 bg-card border rounded-full px-6 py-3 shadow-sm transition-all duration-700 delay-600 ${gridVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <Images className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">{projects.length}</strong> obra{projects.length !== 1 ? 's' : ''} em destaque
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;
