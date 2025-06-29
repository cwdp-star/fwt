
import { useState } from 'react';
import { Images } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const projects = [
    {
      id: 1,
      title: "Armação de Laje Residencial",
      category: "Residencial",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Estrutura de Galpão Industrial",
      category: "Industrial",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Cofragem de Pilares",
      category: "Cofragem",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Armação de Fundação",
      category: "Fundação",
      image: "https://images.unsplash.com/photo-1572825719628-4aceb70d8828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Estrutura Metálica",
      category: "Metálica",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Vergalhões em Obra",
      category: "Armação",
      image: "https://images.unsplash.com/photo-1597740985671-5f3faeb5c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Images className="h-8 w-8 text-orange-500" />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Nossos <span className="text-orange-500">Projetos</span>
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Confira alguns dos nossos trabalhos em armação de ferro e cofragem. 
              Cada projeto representa nosso compromisso com qualidade e segurança.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => setSelectedImage(project.image)}
              >
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm text-orange-400 font-semibold mb-1">
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

          <div className="text-center mt-12">
            <p className="text-gray-300 mb-6">
              Precisa de uma estrutura sólida? Entre em contato conosco!
            </p>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Solicitar Orçamento
            </button>
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
