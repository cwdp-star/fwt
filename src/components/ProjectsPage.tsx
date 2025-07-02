
import { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import ProjectDetails from './ProjectDetails';

interface Project {
  id: number;
  title: string;
  category: string;
  city: string;
  duration: string;
  startDate: string;
  endDate?: string;
  deliveryDate: string;
  completionDeadline: string;
  description: string;
  images: Array<{
    id: string;
    url: string;
    caption: string;
    date: string;
  }>;
  progress: Array<{
    phase: string;
    status: 'completed' | 'in-progress' | 'pending';
    description: string;
    date?: string;
  }>;
  coverImage: string;
}

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects] = useState<Project[]>([
    {
      id: 1,
      title: "Edifício Residencial Torres da Rinchoa",
      category: "Residencial",
      city: "Rinchoa, Sintra",
      duration: "8 meses",
      startDate: "Janeiro 2024",
      endDate: "Agosto 2024",
      deliveryDate: "15 de Agosto de 2024",
      completionDeadline: "31 de Julho de 2024",
      description: "Execução completa de armação de ferro e cofragem para edifício residencial de 4 pisos com 24 apartamentos. Projeto incluiu fundações, pilares, vigas e lajes com especificações técnicas rigorosas.",
      coverImage: "https://images.unsplash.com/photo-1597740985671-5f3faeb5c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1597740985671-5f3faeb5c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Fundações concluídas - Vista geral",
          date: "15 de Fevereiro de 2024"
        },
        {
          id: "2",
          url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Armação de pilares - 1º piso",
          date: "20 de Março de 2024"
        },
        {
          id: "3",
          url: "https://images.unsplash.com/photo-1572825719628-4aceb70d8828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Cofragem das vigas principais",
          date: "10 de Abril de 2024"
        },
        {
          id: "4",
          url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Equipa montando estrutura do 3º piso",
          date: "25 de Maio de 2024"
        }
      ],
      progress: [
        {
          phase: "Fundações",
          status: "completed",
          description: "Escavação e execução de fundações em betão armado com sapatas isoladas",
          date: "Concluído em 28 de Fevereiro de 2024"
        },
        {
          phase: "Estrutura Principal",
          status: "completed",
          description: "Armação de ferro e cofragem de pilares e vigas de todos os pisos",
          date: "Concluído em 30 de Maio de 2024"
        },
        {
          phase: "Lajes",
          status: "completed",
          description: "Execução de lajes dos 4 pisos com armação dupla",
          date: "Concluído em 20 de Julho de 2024"
        },
        {
          phase: "Acabamentos Estruturais",
          status: "completed",
          description: "Finalização, controlo de qualidade e limpeza da obra",
          date: "Concluído em 10 de Agosto de 2024"
        }
      ]
    },
    {
      id: 2,
      title: "Armazém Industrial Cascais",
      category: "Industrial",
      city: "Cascais",
      duration: "6 meses",
      startDate: "Setembro 2023",
      endDate: "Março 2024",
      deliveryDate: "20 de Março de 2024",
      completionDeadline: "15 de Março de 2024",
      description: "Construção de estrutura para armazém industrial de grande porte com 2000m² de área coberta. Estrutura em betão armado com vãos livres de 15 metros para facilitar a movimentação de equipamentos industriais.",
      coverImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        {
          id: "5",
          url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Estrutura principal do armazém",
          date: "15 de Dezembro de 2023"
        },
        {
          id: "6",
          url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Fundações para equipamentos pesados",
          date: "20 de Outubro de 2023"
        }
      ],
      progress: [
        {
          phase: "Preparação do Terreno",
          status: "completed",
          description: "Movimentação de terras e preparação das fundações especiais",
          date: "Concluído em 15 de Outubro de 2023"
        },
        {
          phase: "Fundações",
          status: "completed",
          description: "Sapatas e vigas de fundação para suporte de cargas industriais",
          date: "Concluído em 30 de Novembro de 2023"
        },
        {
          phase: "Estrutura Principal",
          status: "completed",
          description: "Pilares e vigas principais com vãos de 15 metros",
          date: "Concluído em 31 de Janeiro de 2024"
        },
        {
          phase: "Cobertura",
          status: "completed",
          description: "Estrutura de cobertura e lajes técnicas",
          date: "Concluído em 15 de Março de 2024"
        }
      ]
    }
  ]);

  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar ao Site</span>
            </button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Gestão de <span className="text-orange-600">Projetos</span>
            </h1>
            <p className="text-xl text-gray-700">
              Visualizar e gerir todos os projetos de armação de ferro e cofragem estrutural
            </p>
          </div>

          {/* Add Project Button */}
          <div className="mb-8">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
              <Plus className="h-5 w-5" />
              <span>Adicionar Novo Projeto</span>
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-orange-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                      <span><strong>Cidade:</strong> {project.city}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-orange-500" />
                      <span><strong>Duração:</strong> {project.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                      <span><strong>Data de Entrega:</strong> {project.deliveryDate}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Ver Detalhes Completos
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Card */}
          <div className="mt-12 bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Informação sobre Projetos
            </h3>
            <p className="text-orange-700">
              Esta página permite visualizar todos os projetos da Motivo Visionário, 
              incluindo detalhes sobre prazos, progresso da obra e galeria de fotos. 
              Cada projeto é documentado com rigor para garantir transparência total.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
