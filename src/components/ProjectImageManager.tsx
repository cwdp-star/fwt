
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';

interface ProjectImage {
  id: string;
  url: string;
  caption: string;
  date: string;
  project_id: string;
}

interface ProjectImageManagerProps {
  projectId: string;
  onClose: () => void;
}

const ProjectImageManager = ({ projectId, onClose }: ProjectImageManagerProps) => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<ProjectImage | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    caption: '',
    date: ''
  });

  useEffect(() => {
    fetchImages();
  }, [projectId]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingImage) {
        const { error } = await supabase
          .from('project_images')
          .update({
            url: formData.url,
            caption: formData.caption,
            date: formData.date
          })
          .eq('id', editingImage.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('project_images')
          .insert([{
            project_id: projectId,
            url: formData.url,
            caption: formData.caption,
            date: formData.date
          }]);

        if (error) throw error;
      }

      setFormData({ url: '', caption: '', date: '' });
      setEditingImage(null);
      setShowForm(false);
      fetchImages();
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Erro ao salvar imagem');
    }
  };

  const handleEdit = (image: ProjectImage) => {
    setFormData({
      url: image.url,
      caption: image.caption,
      date: image.date
    });
    setEditingImage(image);
    setShowForm(true);
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Erro ao excluir imagem');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <p>A carregar imagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Gestão de Imagens</h3>
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
                setFormData({ url: '', caption: '', date: '' });
                setEditingImage(null);
                setShowForm(true);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Imagem</span>
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legenda
                  </label>
                  <input
                    type="text"
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
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
                    <span>{editingImage ? 'Atualizar' : 'Criar'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">{image.caption}</h4>
                  <p className="text-sm text-gray-500 mb-3">{image.date}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(image)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nenhuma imagem encontrada
              </h3>
              <p className="text-gray-500">
                Adicione imagens para documentar o progresso deste projeto.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectImageManager;
