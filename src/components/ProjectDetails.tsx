
import { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Camera, CheckCircle, Circle, AlertCircle, Building2 } from 'lucide-react';

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

interface ProjectDetailsProps {
  project: {
    id: string;
    title: string;
    category: string;
    city: string;
    duration: string;
    start_date: string;
    end_date?: string | null;
    description: string;
    images: ProjectImage[];
    progress: ProjectProgress[];
  };
  onBack: () => void;
}

const ProjectDetails = ({ project, onBack }: ProjectDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="h-5 w-5 text-primary" />;
      case 'pending':
        return <Circle className="h-5 w-5 text-gray-400" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-primary';
      case 'pending':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in-progress':
        return 'Em Progresso';
      case 'pending':
        return 'Pendente';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-primary hover:text-accent font-medium mb-8 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar aos Projetos</span>
          </button>

          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="relative h-96 md:h-[500px]">
              <img
                src={project.images.length > 0 ? project.images[0].url : '/placeholder.svg'}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Project Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="max-w-4xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                    <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                      {project.category}
                    </span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold mb-4">{project.title}</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-primary" />
                      <span><strong>Localização:</strong> {project.city}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-primary" />
                      <span><strong>Duração:</strong> {project.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-6 w-6 text-primary" />
                      <span><strong>Início:</strong> {project.start_date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Building2 className="h-8 w-8 text-primary mr-3" />
                  Descrição do Projeto
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">{project.description}</p>
              </div>

              {/* Gallery */}
              {project.images && project.images.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-8">
                    <Camera className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold text-gray-900">Galeria de Fotos</h2>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {project.images.length} foto{project.images.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.images.map((image) => (
                      <div
                        key={image.id}
                        className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.caption}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Camera className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="p-4 bg-white">
                          <p className="font-semibold text-gray-900 mb-1">{image.caption}</p>
                          <p className="text-sm text-gray-500">{image.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Project Progress */}
              {project.progress && project.progress.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-2" />
                    Progresso da Obra
                  </h2>
                  <div className="space-y-6">
                    {project.progress.map((phase, index) => (
                      <div key={index} className="relative">
                        {/* Timeline Line */}
                        {index < project.progress.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                        )}
                        
                        <div className="flex items-start space-x-4">
                          {/* Status Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(phase.status)}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg">{phase.phase}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                                phase.status === 'in-progress' ? 'bg-primary/10 text-primary' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {getStatusText(phase.status)}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{phase.description}</p>
                            {phase.date && (
                              <p className="text-sm text-gray-500 flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {phase.date}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Stats */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-lg p-8 border border-primary/20">
                <h3 className="text-xl font-bold text-secondary mb-6">Estatísticas do Projeto</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Total de Fotos:</span>
                    <span className="font-bold text-secondary">{project.images.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Fases de Progresso:</span>
                    <span className="font-bold text-secondary">{project.progress.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Status Atual:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      project.end_date ? 'bg-green-100 text-green-800' :
                      project.progress.some(p => p.status === 'in-progress') ? 'bg-primary/10 text-primary' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {project.end_date ? 'Concluído' : 
                       project.progress.some(p => p.status === 'in-progress') ? 'Em Andamento' : 'Planejamento'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fallback message when no additional content */}
          {(!project.images || project.images.length === 0) && (!project.progress || project.progress.length === 0) && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center mt-8">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                Mais detalhes em breve
              </h3>
              <p className="text-gray-500 text-lg">
                Galeria de fotos e progresso da obra serão adicionados conforme o projeto avança.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-5xl max-h-full relative">
            <img
              src={selectedImage}
              alt="Imagem ampliada"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
