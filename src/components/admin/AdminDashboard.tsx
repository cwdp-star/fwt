import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Plus,
  Eye,
  Edit3,
  Trash2,
  MessageSquare,
  Settings,
  Users
} from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectFormWizard from './ProjectFormWizard';
import QuoteRequestsManager from './QuoteRequestsManager';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  category: string;
  city: string;
  duration: string;
  start_date: string;
  end_date?: string;
  delivery_date: string;
  completion_deadline: string;
  description: string;
  cover_image: string;
  created_at?: string;
  updated_at?: string;
}

const AdminDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showQuotes, setShowQuotes] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== projectId));
      toast({
        title: "Projeto Eliminado",
        description: "O projeto foi eliminado com sucesso",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar o projeto",
        variant: "destructive",
      });
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowWizard(true);
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/projetos/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel de Administração
          </h1>
          <p className="text-muted-foreground">
            Gerir projetos, orçamentos e conteúdo do website
          </p>
        </motion.div>

        {/* Action Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Button 
            onClick={() => {
              setEditingProject(null);
              setShowWizard(true);
            }}
            className="h-24 flex-col gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <Plus className="h-6 w-6" />
            <span className="font-semibold">Novo Projeto</span>
          </Button>
          
          <Button 
            onClick={() => setShowQuotes(true)}
            variant="outline"
            className="h-24 flex-col gap-2 border-2 hover:bg-accent"
            size="lg"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="font-semibold">Gerir Orçamentos</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/admin-login')}
            variant="outline"
            className="h-24 flex-col gap-2 border-2 hover:bg-accent"
            size="lg"
          >
            <Settings className="h-6 w-6" />
            <span className="font-semibold">Configurações</span>
          </Button>
        </motion.div>

        {/* Projects Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Projetos</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>{projects.length} projetos</span>
            </div>
          </div>

          {projects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16 bg-card rounded-lg border"
            >
              <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Comece por adicionar o seu primeiro projeto.
              </p>
              <Button 
                onClick={() => {
                  setEditingProject(null);
                  setShowWizard(true);
                }}
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group relative"
                >
                  <ProjectCard 
                    project={project}
                    onEdit={() => handleEditProject(project)}
                    onDelete={() => handleDeleteProject(project.id)}
                    onManageImages={() => navigate(`/admin/projetos/${project.id}/gestao`)}
                    onManageProgress={() => navigate(`/admin/projetos/${project.id}/gestao`)}
                    onView={() => handleViewProject(project.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Modals */}
        {showWizard && (
          <ProjectFormWizard 
            project={editingProject}
            onClose={() => {
              setShowWizard(false);
              setEditingProject(null);
            }}
            onSuccess={() => {
              fetchProjects();
              setShowWizard(false);
              setEditingProject(null);
            }}
          />
        )}

        {showQuotes && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gestão de Orçamentos</h2>
                <Button onClick={() => setShowQuotes(false)} variant="ghost" size="sm">
                  ✕
                </Button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <QuoteRequestsManager />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;