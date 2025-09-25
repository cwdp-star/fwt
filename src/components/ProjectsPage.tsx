import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Filter, MapPin, Calendar, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import ProjectDetails from './ProjectDetails';
import { MasonryGrid } from './gallery/MasonryGrid';
import { ImageLightbox } from './lightbox/ImageLightbox';
import { MetaTags, getConstructionProjectStructuredData } from '@/components/seo/MetaTags';

interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  date?: string;
  project_id: string;
}

interface ProjectProgress {
  phase: string;
  status: string;
  description: string;
  date?: string | null;
}

interface Project {
  id: string;
  title: string;
  category: string;
  city: string;
  duration: string;
  start_date: string;
  end_date?: string | null;
  delivery_date: string;
  completion_deadline: string;
  description: string;
  cover_image: string;
  images: ProjectImage[];
  progress: ProjectProgress[];
}

const ProjectsPage = () => {
  const { id: projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Handle both URL params and query params for backward compatibility
  const currentProjectId = projectId || searchParams.get('project');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<ProjectImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle URL params for direct project access
  useEffect(() => {
    if (currentProjectId && projects.length > 0) {
      const project = projects.find(p => p.id === currentProjectId);
      if (project) {
        setSelectedProject(project);
      } else {
        // Project not found, redirect to projects list
        navigate('/projetos', { replace: true });
      }
    }
  }, [currentProjectId, projects, navigate]);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory, selectedCity]);

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error } = await (supabase as any)
        .from('projects')
        .select(`
          *,
          project_images (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: Project[] = projectsData?.map((project: any) => ({
        id: project.id,
        title: project.title,
        category: project.category,
        city: project.city,
        duration: project.duration,
        start_date: project.start_date,
        end_date: project.end_date,
        delivery_date: project.delivery_date,
        completion_deadline: project.completion_deadline,
        description: project.description,
        cover_image: project.cover_image,
        images: project.project_images || [],
        progress: []
      })) || [];

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(project => project.city === selectedCity);
    }

    setFilteredProjects(filtered);
  };

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  const cities = ['all', ...Array.from(new Set(projects.map(p => p.city)))];

  const getProjectStatus = (project: Project) => {
    if (project.progress.length === 0) return { status: 'Não iniciado', color: 'bg-muted-foreground' };
    
    const hasCompleted = project.progress.some(p => p.status === 'completed');
    const hasInProgress = project.progress.some(p => p.status === 'in-progress');
    
    if (project.end_date) return { status: 'Concluído', color: 'bg-green-500' };
    if (hasInProgress) return { status: 'Em Andamento', color: 'bg-primary' };
    if (hasCompleted) return { status: 'Parcialmente Concluído', color: 'bg-accent' };
    return { status: 'Planeamento', color: 'bg-muted-foreground' };
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    navigate(`/projetos/${project.id}`);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    navigate('/projetos');
  };

  const openLightbox = (images: ProjectImage[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const previousImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-12 bg-muted rounded-lg animate-pulse mb-4"></div>
              <div className="h-6 bg-muted rounded-lg animate-pulse max-w-md mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl h-96 animate-pulse shadow-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <>
        <MetaTags
          title={`${selectedProject.title} - Projeto de Construção`}
          description={`${selectedProject.description.substring(0, 150)}...`}
          keywords={[
            selectedProject.title,
            selectedProject.category,
            selectedProject.city,
            "RC Construções",
            "betão armado",
            "projeto de construção"
          ]}
          canonical={`https://rcconstrucoes.pt/projetos/${selectedProject.id}`}
          structuredData={getConstructionProjectStructuredData(selectedProject)}
        />
        <ProjectDetails 
          project={selectedProject} 
          onBack={handleBackToList}
          onImageClick={openLightbox}
        />
      </>
    );
  }

  return (
    <>
      <MetaTags
        title="Projetos de Construção - RC Construções"
        description="Explore os nossos projetos de construção civil, estruturas de betão armado e ferro e cofragem realizados em Portugal."
        keywords={[
          "projetos de construção",
          "obras realizadas",
          "portfolio RC Construções",
          "estruturas betão armado",
          "ferro cofragem",
          "engenharia civil Portugal"
        ]}
        canonical="https://rcconstrucoes.pt/projetos"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20">
        {/* Header */}
        <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-20 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Os Nossos Projetos
                </h1>
                <p className="text-muted-foreground">
                  Descubra alguns dos projetos de construção que realizámos
                </p>
              </div>
              
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-fit"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Site
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Pesquisar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Todas as Categorias</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Todas as Cidades</option>
                {cities.slice(1).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="text-muted-foreground">
              {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const status = getProjectStatus(project);
                return (
                  <div 
                    key={project.id} 
                    className="bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                    onClick={() => handleProjectClick(project)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className={`${status.color} text-primary-foreground`}>
                          {status.status}
                        </Badge>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary">
                          {project.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                        {project.description}
                      </p>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{project.city}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{project.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{project.delivery_date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-card rounded-lg p-12 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Tente ajustar os filtros ou termos de pesquisa para encontrar os projetos desejados.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedCity('');
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Lightbox */}
        <ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={previousImage}
        />
      </div>
    </>
  );
};

export default ProjectsPage;