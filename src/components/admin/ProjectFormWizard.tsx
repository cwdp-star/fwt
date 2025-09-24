
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
  Eye,
  X
} from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { Project } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ProjectFormWizardProps {
  project?: Project;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectFormWizard = ({ project, onClose, onSuccess }: ProjectFormWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
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
      // Input sanitization
      const sanitizedData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        city: formData.city.trim(),
      };

      if (project?.id) {
        const { error } = await supabase
          .from('projects')
          .update(sanitizedData)
          .eq('id', project.id);

        if (error) throw error;
        
        toast({
          title: "Projeto Atualizado",
          description: "O projeto foi atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([sanitizedData]);

        if (error) throw error;
        
        toast({
          title: "Projeto Criado",
          description: "O projeto foi criado com sucesso",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar projeto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);
      
      // Generate a unique filename for the cover image
      const fileExt = file.name.split('.').pop();
      const fileName = `covers/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, cover_image: publicUrl });
      
      toast({
        title: "Sucesso",
        description: "Imagem de capa carregada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem de capa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div 
          className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <motion.h2 
                className="text-2xl font-bold text-foreground"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {project ? 'Editar Projeto' : 'Novo Projeto'}
              </motion.h2>
              <motion.button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-accent transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Steps */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      index <= currentStep 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'border-muted-foreground text-muted-foreground'
                    }`}
                    animate={{ 
                      scale: index === currentStep ? 1.1 : 1,
                      boxShadow: index === currentStep ? '0 0 0 3px hsl(var(--primary) / 0.2)' : '0 0 0 0px transparent'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      animate={{ rotate: index < currentStep ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {index < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </motion.div>
                  </motion.div>
                  
                  {index < steps.length - 1 && (
                    <motion.div 
                      className={`w-12 h-0.5 mx-2 transition-all duration-500 ${
                        index < currentStep ? 'bg-primary' : 'bg-border'
                      }`}
                      animate={{ 
                        scaleX: index < currentStep ? 1 : 0.5,
                        opacity: index < currentStep ? 1 : 0.5
                      }}
                    />
                  )}
                </div>
              ))}
            </motion.div>

            <motion.div 
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-foreground">
                {steps[currentStep].title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <motion.div 
            className="p-6 border-t border-border flex items-center justify-between"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
              whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </motion.button>

            <div className="flex space-x-3">
              {currentStep < steps.length - 1 ? (
                <motion.button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: !isStepValid(currentStep) ? 1 : 1.05 }}
                  whileTap={{ scale: !isStepValid(currentStep) ? 1 : 0.95 }}
                >
                  <span>Próximo</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  disabled={loading || !isStepValid(currentStep)}
                  className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  whileHover={{ scale: loading || !isStepValid(currentStep) ? 1 : 1.05 }}
                  whileTap={{ scale: loading || !isStepValid(currentStep) ? 1 : 0.95 }}
                >
                  {loading ? (
                    <>
                      <motion.div 
                        className="rounded-full h-4 w-4 border-b-2 border-primary-foreground"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{project ? 'Atualizar' : 'Criar'} Projeto</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectFormWizard;
