
import { useState, useEffect } from 'react';
import { Images, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';

interface Project {
  id: string;
  title: string;
  category: string;
  cover_image: string;
  city: string;
  start_date: string;
  description: string;
}

const Gallery = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });
  const { containerRef: gridRef, visibleItems } = useStaggeredAnimation(6, 150);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (retryCount = 0) => {
    try {
      console.log(`🔄 Tentativa ${retryCount + 1}: Buscando projetos do Supabase...`);
      
      // Test Supabase connection first
      const { data: connectionTest, error: connectionError } = await supabase
        .from('projects')
        .select('count')
        .single();
        
      console.log('🔗 Teste de conexão Supabase:', { connectionTest, connectionError });
      
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, category, cover_image, city, start_date, description')
        .order('created_at', { ascending: false })
        .limit(6);

      console.log('📊 Resposta completa do Supabase:', { 
        data, 
        error, 
        dataLength: data?.length,
        firstProject: data?.[0],
        allProjects: data
      });

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ Nenhum projeto encontrado na base de dados');
        // Try to fetch without limit to see if there are any projects at all
        const { data: allData } = await supabase
          .from('projects')
          .select('id, title');
        console.log('🔍 Verificação completa da tabela:', { totalProjects: allData?.length });
      }
      
      console.log(`✅ Sucesso: ${data?.length || 0} projetos carregados`);
      setProjects(data || []);
    } catch (error) {
      console.error('💥 Erro ao buscar projetos:', error);
      
      // Retry mechanism
      if (retryCount < 2) {
        console.log(`🔄 Tentando novamente em 2 segundos... (tentativa ${retryCount + 1}/3)`);
        setTimeout(() => fetchProjects(retryCount + 1), 2000);
        return;
      } else {
        console.error('❌ Falha após 3 tentativas. Desistindo...');
      }
    } finally {
      if (retryCount === 0) { // Only set loading false on the first attempt
        setLoading(false);
      }
    }
  };

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects?project=${projectId}`);
  };

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Images className="h-10 w-10 text-primary" />
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Os Nossos <span className="text-primary">Projetos</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-secondary/80 rounded-xl h-80 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-16">
            <div className={`flex items-center justify-center space-x-3 mb-6 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-down' : 'opacity-0'
            }`}>
              <Images className="h-10 w-10 text-primary animate-float" />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Os Nossos <span className="text-primary">Projetos</span>
              </h2>
            </div>
            <p className={`text-xl text-gray-300 max-w-3xl mx-auto font-medium transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up-delay-200' : 'opacity-0'
            }`}>
              Confira alguns dos nossos trabalhos em construção civil e remodelações. 
              Cada projeto representa o nosso compromisso com qualidade estrutural e excelência.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-secondary/50 text-gray-300 hover:bg-primary/20 hover:text-white border border-primary/30'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Images className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-gray-300 mb-4">
                  {projects.length === 0 
                    ? "Ainda não há projetos para exibir. Verifique se os projetos foram adicionados corretamente na base de dados."
                    : "Nenhum projeto corresponde aos filtros selecionados."
                  }
                </p>
                {projects.length === 0 && (
                  <button 
                    onClick={() => fetchProjects()}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                )}
              </div>
            ) : (
              filteredProjects.map((project, index) => {
                console.log(`🎨 Renderizando projeto ${index}:`, { 
                  id: project.id, 
                  title: project.title,
                  image: project.cover_image,
                  visible: visibleItems.has(index)
                });
                
                return (
                  <div 
                    key={project.id}
                    className={`group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-2xl ${
                      visibleItems.has(index) || index < 3 ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    {/* Image */}
                    <div className="relative h-80 overflow-hidden bg-gray-800">
                      <img 
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          console.error(`❌ Erro ao carregar imagem para ${project.title}:`, project.cover_image);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                        onLoad={() => {
                          console.log(`✅ Imagem carregada com sucesso para ${project.title}`);
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          {project.category}
                        </span>
                      </div>
                    </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-300">
                          <MapPin className="h-4 w-4 mr-1 text-primary" />
                          <span>{project.city}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="h-4 w-4 mr-1 text-primary" />
                          <span>{project.start_date}</span>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                     </div>
                   </div>
                 </div>
                 );
               })
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <button 
              onClick={() => navigate('/projects')}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center space-x-3"
            >
              <span>Ver Todos os Projetos</span>
              <ArrowRight className="h-6 w-6" />
            </button>
            
            <div className="mt-8">
              <p className="text-gray-300 mb-6 text-lg font-medium">
                Precisa de construção civil ou remodelação? Entre em contacto connosco!
              </p>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-secondary hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
