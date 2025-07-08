
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Calendar, 
  MapPin, 
  Building,
  FileText,
  Eye
} from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { Project } from '@/types/project';

interface ProjectFormWizardProps {
  project?: Project;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectFormWizard = ({ project, onClose, onSuccess }: ProjectFormWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Project>({
    title: '',
    category: '',
    city: '',
    duration: '',
    start_date: '',
    end_date: '',
    delivery_date: '',
    completion_deadline: '',
    description: '',
    cover_image: ''
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const steps = [
    {
      id: 1,
      title: 'Informações Básicas',
      icon: Building,
      description: 'Título, categoria e localização'
    },
    {
      id: 2,
      title: 'Cronograma',
      icon: Calendar,
      description: 'Datas e prazos do projeto'
    },
    {
      id: 3,
      title: 'Conteúdo',
      icon: FileText,
      description: 'Descrição e imagem de capa'
    },
    {
      id: 4,
      title: 'Revisão',
      icon: Eye,
      description: 'Confirmar informações'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (project?.id) {
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', project.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([formData]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Erro ao salvar projeto');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (file: File) => {
    // For now, we'll use a placeholder URL
    // In a real implementation, you'd upload to Supabase Storage
    const imageUrl = URL.createObjectURL(file);
    setFormData({ ...formData, cover_image: imageUrl });
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.title && formData.category && formData.city;
      case 1:
        return formData.start_date && formData.delivery_date && formData.completion_deadline && formData.duration;
      case 2:
        return formData.description && formData.cover_image;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Projeto *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Construção Residencial Vila Nova"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: Armação de Ferro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: Lisboa"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <input
                  type="text"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: Janeiro 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim
                </label>
                <input
                  type="text"
                  value={formData.end_date || ''}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: Março 2024"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração *
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: 3 meses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Entrega *
                </label>
                <input
                  type="text"
                  value={formData.delivery_date}
                  onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: 15 de Março 2024"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo de Conclusão *
              </label>
              <input
                type="text"
                value={formData.completion_deadline}
                onChange={(e) => setFormData({ ...formData, completion_deadline: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: 31 de Março 2024"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Projeto *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Descreva os detalhes do projeto, materiais utilizados, desafios enfrentados..."
              />
            </div>

            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={formData.cover_image}
              onImageRemove={() => setFormData({ ...formData, cover_image: '' })}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revisão do Projeto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Informações Básicas</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Título:</span> {formData.title}</p>
                    <p><span className="font-medium">Categoria:</span> {formData.category}</p>
                    <p><span className="font-medium">Cidade:</span> {formData.city}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Cronograma</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Início:</span> {formData.start_date}</p>
                    <p><span className="font-medium">Duração:</span> {formData.duration}</p>
                    <p><span className="font-medium">Entrega:</span> {formData.delivery_date}</p>
                  </div>
                </div>
              </div>

              {formData.cover_image && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">Imagem de Capa</h4>
                  <img 
                    src={formData.cover_image} 
                    alt="Preview" 
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Descrição</h4>
                <p className="text-sm text-gray-600">{formData.description}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {project ? 'Editar Projeto' : 'Novo Projeto'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              ✕
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-orange-500 border-orange-500 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>

          <div className="flex space-x-3">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Próximo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStepValid(currentStep)}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{project ? 'Atualizar' : 'Criar'} Projeto</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormWizard;
