import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Images, Calendar, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ProjectWithImages } from '@/hooks/useProjects';

interface ProjectCardProps {
  project: ProjectWithImages;
  onClick: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Em andamento';
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM \'de\' yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      onClick={onClick}
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
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {project.end_date ? `Concluído em ${formatDate(project.end_date)}` : formatDate(project.end_date)}
                </span>
              </div>
              
              {/* Client Name */}
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
  );
};