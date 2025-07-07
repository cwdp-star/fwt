
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { 
  LogOut, 
  Plus, 
  Search,
  Filter,
  LayoutDashboard,
  Settings,
  Users,
  FileText
} from 'lucide-react';
import AdminDashboard from './admin/AdminDashboard';
import ProjectFormWizard from './admin/ProjectFormWizard';
import ProjectCard from './admin/ProjectCard';
import ProjectImageManager from './ProjectImageManager';
import ProjectProgressManager from './ProjectProgressManager';

interface Project {
  id?: string;
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
}

const AdminPanel = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWizard, setShowWizard] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showImageManager, setShowImageManager] = useState<string | null>(null);
  const [showProgressManager, setShowProgressManager] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AdminPanel mounted');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          navigate('/admin-login');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Current session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        navigate('/admin-login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    console.log('Checking admin status for user:', userId);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      console.log('Admin check result:', data, error);

      if (error) {
        console.error('Error checking admin status:', error);
        navigate('/admin-login');
        return;
      }

      if (data?.role === 'admin') {
        console.log('User is admin, loading projects');
        setIsAdmin(true);
        fetchProjects();
      } else {
        console.log('User is not admin, redirecting');
        navigate('/admin-login');
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/admin-login');
    }
  };

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
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowWizard(true);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Erro ao excluir projeto');
    }
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/projects?project=${projectId}`);
  };

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">A carregar...</h2>
          <p className="text-gray-600">A verificar permissões de administrador</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Settings className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">Apenas administradores podem aceder a esta página</p>
          <button
            onClick={() => navigate('/admin-login')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-600">Gestão de Projetos - Motivo Visionário</p>
              </div>
              
              {/* Tabs */}
              <nav className="hidden md:flex space-x-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'projects' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Projetos</span>
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Bem-vindo, {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <AdminDashboard />}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowWizard(true);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors shadow-lg w-fit"
              >
                <Plus className="h-5 w-5" />
                <span>Novo Projeto</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Pesquisar projetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-80"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">Todas as Categorias</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredProjects.length} de {projects.length} projetos
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onManageImages={setShowImageManager}
                  onManageProgress={setShowProgressManager}
                  onView={handleViewProject}
                />
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-4">
                  {projects.length === 0 ? 'Nenhum projeto cadastrado' : 'Nenhum projeto encontrado'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {projects.length === 0 
                    ? 'Clique em "Novo Projeto" para começar.' 
                    : 'Tente ajustar os filtros de pesquisa.'
                  }
                </p>
                {projects.length === 0 && (
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setShowWizard(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Criar Primeiro Projeto
                  </button>
                )}
              </div>
            )}
          </div>
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
          onSuccess={fetchProjects}
        />
      )}

      {showImageManager && (
        <ProjectImageManager
          projectId={showImageManager}
          onClose={() => setShowImageManager(null)}
        />
      )}

      {showProgressManager && (
        <ProjectProgressManager
          projectId={showProgressManager}
          onClose={() => setShowProgressManager(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
