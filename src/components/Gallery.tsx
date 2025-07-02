
import { useState, useEffect } from 'react';
import { Images, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  category: string;
  cover_image: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, category, cover_image')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Images className="h-10 w-10 text-orange-500" />
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Os Nossos <span className="text-orange-500">Projetos</span>
                </h2>
              </div>
              <p className="text-xl text-gray-300">A carregar projetos...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Images className="h-10 w-10 text-orange-500" />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Os Nossos <span className="text-orange-500">Projetos</span>
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">
              Confira alguns dos nossos trabalhos em armação de ferro e cofragem estrutural. 
              Cada projeto representa o nosso compromisso com qualidade e segurança.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-xl"
                onClick={() => setSelectedImage(project.cover_image)}
              >
                <img 
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm text-orange-400 font-bold mb-1">
                      {project.category}
                    </div>
                    <h3 className="text-lg font-bold">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 space-y-4">
            <button 
              onClick={() => navigate('/projects')}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center space-x-2 mb-4"
            >
              <span>Ver Todos os Projetos</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <div>
              <p className="text-gray-300 mb-6 text-lg font-medium">
                Precisa de uma estrutura sólida? Entre em contacto connosco!
              </p>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para visualizar imagem */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img 
              src={selectedImage}
              alt="Projeto ampliado"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
