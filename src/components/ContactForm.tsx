
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import ContactFormFields from './ContactFormFields';
import PrivacyPolicy from './PrivacyPolicy';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { logger } from '@/utils/logger';

const ContactForm = () => {
  const { toast } = useToast();
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });
  const { elementRef: formRef, isVisible: formVisible } = useScrollAnimation({ threshold: 0.2 });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    location: '',
    budget: '',
    timeline: '',
    description: '',
    documentsLink: '',
    preferredStartDate: '',
    gdprConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleSubmit = async (e: React.FormEvent, uploadedFiles: File[]) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Upload files first if any
      let attachments: Array<{filename: string, path: string, size: number}> = [];
      
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${formData.email}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('quote-attachments')
            .upload(filePath, file);
          
          if (uploadError) {
            logger.error('File upload error:', uploadError);
            throw new Error(`Erro ao enviar ficheiro ${file.name}`);
          }
          
          attachments.push({
            filename: file.name,
            path: filePath,
            size: file.size
          });
        }
      }
      
      // Call server-side edge function for validation and submission
      const { data, error } = await supabase.functions.invoke('submit-quote', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          project_type: formData.projectType,
          location: formData.location,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.description,
          documents_link: formData.documentsLink,
          preferred_start_date: formData.preferredStartDate,
          gdpr_consent: formData.gdprConsent,
          attachments: attachments
        }
      });

      if (error) {
        logger.error('Quote submission error:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao enviar o pedido. Por favor, tente novamente.',
          variant: 'destructive',
        });
        return;
      }

      if (data?.error) {
        toast({
          title: 'Erro',
          description: data.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: "Orçamento Enviado com Sucesso!",
        description: "Recebemos o seu pedido de orçamento. Entraremos em contacto dentro de 24 horas.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        location: '',
        budget: '',
        timeline: '',
        description: '',
        documentsLink: '',
        preferredStartDate: '',
        gdprConsent: false
      });
    } catch (error) {
      logger.error('Submission error:', error);
      toast({
        title: "Erro ao Enviar",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConsentChange = (checked: boolean) => {
    setFormData({
      ...formData,
      gdprConsent: checked
    });
  };

  const handlePrivacyClick = () => {
    setShowPrivacyPolicy(true);
  };

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onBack={() => setShowPrivacyPolicy(false)} />;
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-muted to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div ref={headerRef} className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-playfair font-bold text-secondary mb-6 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-down' : 'opacity-0'
            }`}>
              Solicite o seu <span className="text-primary">Orçamento Premium</span>
            </h2>
            <p className={`text-xl text-muted-foreground font-inter transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up-delay-200' : 'opacity-0'
            }`}>
              Preencha o formulário abaixo e receba um orçamento personalizado para o seu projeto de construção premium ou remodelação de luxo.
            </p>
          </div>

          <div ref={formRef} className={`bg-white rounded-2xl shadow-[0_10px_50px_rgba(212,175,55,0.15)] p-8 md:p-12 border-2 border-primary/20 transition-all duration-700 ${
            formVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
          }`}>
            <ContactFormFields 
              formData={formData} 
              onChange={handleChange}
              onConsentChange={handleConsentChange}
              onPrivacyClick={handlePrivacyClick}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
