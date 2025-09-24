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
  Users,
  Images,
  Search,
  Filter,
  MoreVertical,
  Download
} from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectFormWizard from './ProjectFormWizard';
import QuoteRequestsManager from './QuoteRequestsManager';
import DashboardStats from './DashboardStats';
import ProjectAnalytics from './ProjectAnalytics';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showQuotes, setShowQuotes] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects when search term or category changes
  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => 
        project.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      setFilteredProjects(data || []);
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
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
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

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .in('id', selectedProjects);

      if (error) throw error;

      setProjects(projects.filter(p => !selectedProjects.includes(p.id)));
      setSelectedProjects([]);
      toast({
        title: "Projetos Eliminados",
        description: `${selectedProjects.length} projetos foram eliminados com sucesso`,
      });
    } catch (error) {
      console.error('Error deleting projects:', error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar os projetos selecionados",
        variant: "destructive",
      });
    }
  };

  const handleSelectProject = (projectId: string, selected: boolean) => {
    if (selected) {
      setSelectedProjects([...selectedProjects, projectId]);
    } else {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedProjects(filteredProjects.map(p => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const exportProjects = () => {
    const dataStr = JSON.stringify(filteredProjects, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'projetos.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Exportação Concluída",
      description: "Os dados dos projetos foram exportados com sucesso",
    });
  };

  const getUniqueCategories = () => {
    const categories = projects.map(p => p.category);
    return [...new Set(categories)];
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

        {/* Dashboard Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <DashboardStats />
        </motion.div>

        {/* Analytics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ProjectAnalytics />
        </motion.div>

        {/* Action Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
            onClick={() => navigate('/image-gallery')}
            variant="outline"
            className="h-24 flex-col gap-2 border-2 hover:bg-accent"
            size="lg"
          >
            <Images className="h-6 w-6" />
            <span className="font-semibold">Galeria de Imagens</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/admin/security')}
            variant="outline"
            className="h-24 flex-col gap-2 border-2 hover:bg-accent"
            size="lg"
          >
            <Settings className="h-6 w-6" />
            <span className="font-semibold">Auditoria de Segurança</span>
          </Button>

          <Button 
            onClick={() => navigate('/admin/database-health')}
            variant="outline"
            className="h-24 flex-col gap-2 border-2 hover:bg-accent text-blue-600 border-blue-200"
            size="lg"
          >
            <Users className="h-6 w-6" />
            <span className="font-semibold">Verificar Base de Dados</span>
          </Button>
        </motion.div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Projetos</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{filteredProjects.length} de {projects.length} projetos</span>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-card rounded-lg border p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar projetos por título, descrição ou cidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {getUniqueCategories().map(category => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={exportProjects}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>

              {/* Bulk Actions */}
              {filteredProjects.length > 0 && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedProjects.length === filteredProjects.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedProjects.length > 0 
                        ? `${selectedProjects.length} selecionados`
                        : "Selecionar todos"
                      }
                    </span>
                  </div>
                  {selectedProjects.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Selecionados
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {filteredProjects.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16 bg-card rounded-lg border"
              >
                <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {projects.length === 0 ? "Nenhum projeto encontrado" : "Nenhum projeto corresponde aos filtros"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {projects.length === 0 
                    ? "Comece por adicionar o seu primeiro projeto."
                    : "Tente ajustar os critérios de pesquisa ou filtro."
                  }
                </p>
                {projects.length === 0 && (
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
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={(checked) => handleSelectProject(project.id, checked as boolean)}
                        className="bg-white/80 border-white shadow-sm"
                      />
                    </div>
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
          </div>

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