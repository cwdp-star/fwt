
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save, X, CheckCircle, Clock, Circle } from 'lucide-react';

interface ProjectProgress {
  id: string;
  phase: string;
  status: string;
  description: string;
  date: string | null;
  project_id: string;
}

interface ProjectProgressManagerProps {
  projectId: string;
  onClose: () => void;
}

const ProjectProgressManager = ({ projectId, onClose }: ProjectProgressManagerProps) => {
  const [progress, setProgress] = useState<ProjectProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgress, setEditingProgress] = useState<ProjectProgress | null>(null);
  const [formData, setFormData] = useState({
    phase: '',
    status: 'pending',
    description: '',
    date: ''
  });

  useEffect(() => {
    fetchProgress();
  }, [projectId]);

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('project_progress')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProgress) {
        const { error } = await supabase
          .from('project_progress')
          .update({
            phase: formData.phase,
            status: formData.status,
            description: formData.description,
            date: formData.date || null
          })
          .eq('id', editingProgress.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('project_progress')
          .insert([{
            project_id: projectId,
            phase: formData.phase,
            status: formData.status,
            description: formData.description,
            date: formData.date || null
          }]);

        if (error) throw error;
      }

      setFormData({ phase: '', status: 'pending', description: '', date: '' });
      setEditingProgress(null);
      setShowForm(false);
      fetchProgress();
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Erro ao salvar progresso');
    }
  };

  const handleEdit = (progressItem: ProjectProgress) => {
    setFormData({
      phase: progressItem.phase,
      status: progressItem.status,
      description: progressItem.description,
      date: progressItem.date || ''
    });
    setEditingProgress(progressItem);
    setShowForm(true);
  };

  const handleDelete = async (progressId: string) => {
    if (!confirm('Tem certeza que deseja excluir este progresso?')) return;

    try {
      const { error } = await supabase
        .from('project_progress')
        .delete()
        .eq('id', progressId);

      if (error) throw error;
      fetchProgress();
    } catch (error) {
      console.error('Error deleting progress:', error);
      alert('Erro ao excluir progresso');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in-progress':
        return 'Em Progresso';
      default:
        return 'Pendente';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <p>A carregar progresso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Gestão de Progresso</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => {
                setFormData({ phase: '', status: 'pending', description: '', date: '' });
                setEditingProgress(null);
                setShowForm(true);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Fase</span>
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fase
                    </label>
                    <input
                      type="text"
                      value={formData.phase}
                      onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: Fundação"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="pending">Pendente</option>
                      <option value="in-progress">Em Progresso</option>
                      <option value="completed">Concluída</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Janeiro 2024"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingProgress ? 'Atualizar' : 'Criar'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {progress.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{item.phase}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800' :
                          item.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      {item.date && (
                        <p className="text-sm text-gray-500">{item.date}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {progress.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nenhuma fase encontrada
              </h3>
              <p className="text-gray-500">
                Adicione fases para documentar o progresso deste projeto.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressManager;
