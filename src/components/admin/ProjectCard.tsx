
import { 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Clock,
  Eye
} from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onManageImages: (projectId: string) => void;
  onManageProgress: (projectId: string) => void;
  onView: (projectId: string) => void;
}

const ProjectCard = ({ 
  project, 
  onEdit, 
  onDelete, 
  onManageImages, 
  onManageProgress,
  onView 
}: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.cover_image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            {project.category}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <button
              onClick={() => onView(project.id!)}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
              title="Ver Projeto"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={() => onManageImages(project.id!)}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
              title="Gestão de Imagens"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onManageProgress(project.id!)}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
              title="Gestão de Progresso"
            >
              <TrendingUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {project.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Project Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 text-orange-400" />
            <span>{project.city}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2 text-orange-400" />
            <span>{project.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 text-orange-400" />
            <span>{project.delivery_date}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(project)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </button>
            <button
              onClick={() => onDelete(project.id!)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              <Trash2 className="h-4 w-4" />
              <span>Excluir</span>
            </button>
          </div>
          
          <span className="text-xs text-gray-400">
            Início: {project.start_date}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
