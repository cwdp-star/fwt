import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Plus,
  Eye,
  ImageIcon,
  Edit3,
  Trash2
} from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectFormWizard from './ProjectFormWizard';
import QuoteRequestsList from './QuoteRequestsList';

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
  const [activeTab, setActiveTab] = useState('projects');
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

  const handleEditProject = (projectId: string) => {
    navigate(`/admin/projetos/${projectId}/gestao`);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel de Administração
          </h1>
          <p className="text-muted-foreground">
            Gerir projetos, orçamentos e conteúdo do website
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mb-8">
            <TabsTrigger value="projects">Gestão de Projetos</TabsTrigger>
            <TabsTrigger value="quotes">Orçamentos</TabsTrigger>
            <TabsTrigger value="add-project">Novo Projeto</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestão de Projetos</h2>
              <Button 
                onClick={() => setActiveTab('add-project')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Projeto
              </Button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Comece por adicionar o seu primeiro projeto.
                </p>
                <Button onClick={() => setActiveTab('add-project')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="group relative">
                    <ProjectCard 
                      project={project}
                      onEdit={() => handleEditProject(project.id)}
                      onDelete={() => handleDeleteProject(project.id)}
                      onManageImages={() => navigate(`/admin/projetos/${project.id}/gestao`)}
                      onManageProgress={() => navigate(`/admin/projetos/${project.id}/gestao`)}
                      onView={() => handleViewProject(project.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quotes">
            <QuoteRequestsList />
          </TabsContent>

          <TabsContent value="add-project">
            <ProjectFormWizard 
              onClose={() => setActiveTab('projects')}
              onSuccess={() => {
                fetchProjects();
                setActiveTab('projects');
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;