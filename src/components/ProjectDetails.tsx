
import { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Camera } from 'lucide-react';

interface ProjectImage {
  id: string;
  url: string;
  caption: string;
  date: string;
}

interface ProjectProgress {
  phase: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  date?: string;
}

interface ProjectDetailsProps {
  project: {
    id: string;
    title: string;
    category: string;
    city: string;
    duration: string;
    start_date: string;
    end_date?: string;
    description: string;
    images: ProjectImage[];
    progress: ProjectProgress[];
  };
  onBack: () => void;
}

const ProjectDetails = ({ project, onBack }: ProjectDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-orange-500';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar aos Projetos</span>
            </button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{project.city}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{project.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{project.start_date} {project.end_date && `- ${project.end_date}`}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrição do Projeto</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{project.description}</p>
          </div>

          {/* Progress */}
          {project.progress && project.progress.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Progresso da Obra</h2>
              <div className="space-y-4">
                {project.progress.map((phase, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-4 h-4 rounded-full mt-1 ${getStatusColor(phase.status)}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{phase.phase}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                          phase.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getStatusText(phase.status)}
                        </span>
                      </div>
                      <p className="text-gray-600">{phase.description}</p>
                      {phase.date && (
                        <p className="text-sm text-gray-500 mt-1">{phase.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Camera className="h-6 w-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Galeria de Fotos</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.images.map((image) => (
                  <div
                    key={image.id}
                    className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <p className="font-medium text-gray-900 mb-1">{image.caption}</p>
                      <p className="text-sm text-gray-500">{image.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback message when no images or progress */}
          {(!project.images || project.images.length === 0) && (!project.progress || project.progress.length === 0) && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">
                Mais detalhes em breve
              </h3>
              <p className="text-gray-500">
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
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Imagem ampliada"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
