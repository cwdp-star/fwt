
import { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import ProjectDetails from './ProjectDetails';

interface Project {
  id: number;
  title: string;
  category: string;
  city: string;
  duration: string;
  startDate: string;
  endDate?: string;
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
      description: "Execução completa de armação de ferro e cofragem para edifício residencial de 4 pisos com 24 apartamentos. Projeto incluiu fundações, pilares, vigas e lajes com especificações técnicas rigorosas.",
      coverImage: "https://images.unsplash.com/photo-1597740985671-5f3faeb5c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1597740985671-5f3faeb5c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Fundações concluídas",
          date: "Fevereiro 2024"
        },
        {
          id: "2",
          url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Armação de pilares",
          date: "Março 2024"
        }
      ],
      progress: [
        {
          phase: "Fundações",
          status: "completed",
          description: "Escavação e execução de fundações em betão armado",
          date: "Fevereiro 2024"
        },
        {
          phase: "Estrutura Principal",
          status: "completed",
          description: "Armação de ferro e cofragem de pilares e vigas",
          date: "Maio 2024"
        },
        {
          phase: "Lajes",
          status: "completed",
          description: "Execução de lajes dos 4 pisos",
          date: "Julho 2024"
        },
        {
          phase: "Acabamentos Estruturais",
          status: "completed",
          description: "Finalização e controlo de qualidade",
          date: "Agosto 2024"
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
      description: "Construção de estrutura para armazém industrial de grande porte com 2000m² de área coberta. Estrutura em betão armado com vãos livres de 15 metros.",
      coverImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        {
          id: "3",
          url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Estrutura principal",
          date: "Dezembro 2023"
        }
      ],
      progress: [
        {
          phase: "Preparação do Terreno",
          status: "completed",
          description: "Movimentação de terras e preparação das fundações",
          date: "Outubro 2023"
        },
        {
          phase: "Fundações",
          status: "completed",
          description: "Sapatas e vigas de fundação",
          date: "Novembro 2023"
        },
        {
          phase: "Estrutura Principal",
          status: "completed",
          description: "Pilares e vigas principais",
          date: "Janeiro 2024"
        },
        {
          phase: "Cobertura",
          status: "completed",
          description: "Estrutura de cobertura e lajes",
          date: "Março 2024"
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Gestão de <span className="text-orange-600">Projetos</span>
            </h1>
            <p className="text-xl text-gray-700">
              Gerir e visualizar todos os projetos de armação de ferro e cofragem
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      {project.category}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-orange-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    <p><strong>Cidade:</strong> {project.city}</p>
                    <p><strong>Duração:</strong> {project.duration}</p>
                    <p><strong>Período:</strong> {project.startDate} {project.endDate && `- ${project.endDate}`}</p>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
                  
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
