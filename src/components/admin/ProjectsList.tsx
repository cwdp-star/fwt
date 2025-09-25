import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import ProjectFormWizard from './ProjectFormWizard';
import ProjectProgressManager from '@/components/ProjectProgressManager';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProgressManager, setShowProgressManager] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar a lista de projetos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      const { error } = await (supabase as any)
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso.",
      });

      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro ao excluir projeto",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      });
    }
  };

  const handleManageImages = (projectId: string) => {
    navigate(`/admin/images/${projectId}`);
  };

  const handleManageProgress = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowProgressManager(true);
  };

  const handleViewProject = (projectId: string) => {
    // Navigate to project details page
    navigate(`/project/${projectId}`);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-600">Carregando projetos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Projetos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-gray-500 mb-6">
            Comece criando seu primeiro projeto.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Criar Primeiro Projeto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onManageImages={handleManageImages}
              onManageProgress={handleManageProgress}
              onView={handleViewProject}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ProjectFormWizard
          project={editingProject}
          onClose={handleFormCancel}
          onSuccess={handleFormSave}
        />
      )}

      {showProgressManager && selectedProjectId && (
        <ProjectProgressManager
          projectId={selectedProjectId}
          onClose={() => {
            setShowProgressManager(false);
            setSelectedProjectId(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectsList;