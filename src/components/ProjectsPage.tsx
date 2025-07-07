
import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, MapPin, Calendar, Clock, Eye, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ProjectDetails from './ProjectDetails';

interface ProjectImage {
  id: string;
  url: string;
  caption: string;
  date: string;
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  useEffect(() => {
    fetchProjects();
    // Check URL params for direct project access
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    if (projectId) {
      // Will be handled after projects are loaded
    }
  }, []);

  useEffect(() => {
    // Handle direct project access from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [projects]);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory, selectedCity]);

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_images (*),
          project_progress (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: Project[] = projectsData?.map(project => ({
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
        progress: project.project_progress || []
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

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(project => project.city === selectedCity);
    }

    setFilteredProjects(filtered);
  };

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  const cities = ['all', ...Array.from(new Set(projects.map(p => p.city)))];

  const getProjectStatus = (project: Project) => {
    if (project.progress.length === 0) return { status: 'Não iniciado', color: 'bg-gray-500' };
    
    const hasCompleted = project.progress.some(p => p.status === 'completed');
    const hasInProgress = project.progress.some(p => p.status === 'in-progress');
    
    if (project.end_date) return { status: 'Concluído', color: 'bg-green-500' };
    if (hasInProgress) return { status: 'Em Andamento', color: 'bg-orange-500' };
    if (hasCompleted) return { status: 'Parcialmente Concluído', color: 'bg-blue-500' };
    return { status: 'Planejamento', color: 'bg-yellow-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-12 bg-gray-300 rounded-lg animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse max-w-md mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-96 animate-pulse shadow-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={() => {
          setSelectedProject(null);
          // Clean URL
          window.history.pushState({}, '', '/projects');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar ao Site</span>
            </button>
            
            <div className="text-center bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Building className="h-10 w-10 text-orange-500" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Os Nossos <span className="text-orange-600">Projetos</span>
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore nossa galeria completa de projetos em armação de ferro e cofragem estrutural. 
                Cada obra reflete nossa dedicação à excelência e inovação.
              </p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Pesquisar projetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="all">Todas as Categorias</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="all">Todas as Cidades</option>
                    {cities.slice(1).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-3">
                  <span className="text-gray-600 font-medium">
                    {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => {
                const status = getProjectStatus(project);
                return (
                  <div 
                    key={project.id} 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`${status.color} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg`}>
                          {status.status}
                        </span>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          {project.category}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                          <span><strong>Cidade:</strong> {project.city}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2 text-orange-500" />
                          <span><strong>Duração:</strong> {project.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                          <span><strong>Entrega:</strong> {project.delivery_date}</span>
                        </div>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                        Ver Detalhes Completos
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-4">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-gray-500 mb-6">
                  Tente ajustar os filtros ou termos de pesquisa para encontrar os projetos desejados.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedCity('all');
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="mt-16 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-orange-800 mb-4">
                Sobre os Nossos Projetos
              </h3>
              <p className="text-orange-700 text-lg leading-relaxed max-w-4xl mx-auto">
                Cada projeto da Motivo Visionário é desenvolvido com rigor técnico e atenção aos detalhes. 
                Nossa experiência em armação de ferro e cofragem estrutural garante que cada obra seja 
                executada com a máxima qualidade e dentro dos prazos estabelecidos. Explore nossa galeria 
                e conheça os detalhes de cada projeto, incluindo progresso da obra e documentação fotográfica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
