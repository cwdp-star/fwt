import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
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
  status: string; // Changed from union type to string to match Supabase data
  description: string;
  date?: string | null; // Added null possibility to match Supabase schema
}

interface Project {
  id: string;
  title: string;
  category: string;
  city: string;
  duration: string;
  start_date: string;
  end_date?: string | null; // Added null possibility
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                A carregar <span className="text-orange-600">Projetos</span>
              </h1>
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
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar ao Site</span>
            </button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Os Nossos <span className="text-orange-600">Projetos</span>
            </h1>
            <p className="text-xl text-gray-700">
              Confira todos os nossos trabalhos em armação de ferro e cofragem estrutural
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                      <span><strong>Cidade:</strong> {project.city}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-orange-500" />
                      <span><strong>Duração:</strong> {project.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                      <span><strong>Data de Entrega:</strong> {project.delivery_date}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Ver Detalhes Completos
                  </button>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-500">
                Os projetos serão exibidos aqui quando estiverem disponíveis.
              </p>
            </div>
          )}

          {/* Info Card */}
          <div className="mt-12 bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Informação sobre Projetos
            </h3>
            <p className="text-orange-700">
              Esta página permite visualizar todos os projetos da Motivo Visionário, 
              incluindo detalhes sobre prazos, progresso da obra e galeria de fotos. 
              Cada projeto é documentado com rigor para garantir transparência total.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
