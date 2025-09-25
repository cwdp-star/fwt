
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import ContactFormFields from './ContactFormFields';
import PrivacyPolicy from './PrivacyPolicy';
import { sanitizeFormData, isValidEmail, isValidPhone, createRateLimiter } from '@/utils/sanitizer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Rate limiter: max 3 submissions per 10 minutes
const rateLimiter = createRateLimiter(3, 10 * 60 * 1000);

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
    gdprConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const clientId = formData.email || 'anonymous';
    if (!rateLimiter(clientId)) {
      toast({
        title: "Muitas Tentativas",
        description: "Aguarde alguns minutos antes de enviar outro pedido.",
        variant: "destructive"
      });
      return;
    }

    // GDPR consent check
    if (!formData.gdprConsent) {
      toast({
        title: "Consentimento Obrigatório",
        description: "Deve aceitar a política de privacidade para enviar o pedido de orçamento.",
        variant: "destructive"
      });
      return;
    }

    // Enhanced validation
    if (!isValidEmail(formData.email)) {
      toast({
        title: "Email Inválido",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      toast({
        title: "Telefone Inválido",
        description: "Por favor, insira um número de telefone português válido.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Sanitize form data before processing
      const sanitizedData = sanitizeFormData(formData);
      
      // Save to Supabase database
      const { error: dbError } = await supabase
        .from('quote_requests')
        .insert({
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          service: sanitizedData.projectType,
          project_type: sanitizedData.projectType,
          budget: sanitizedData.budget,
          timeline: sanitizedData.timeline,
          city: sanitizedData.location,
          description: sanitizedData.description,
          status: 'new'
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
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
        gdprConsent: false
      });
    } catch (error) {
      console.error('Error sending quote request:', error);
      toast({
        title: "Erro ao Enviar",
        description: "Ocorreu um erro ao enviar o seu pedido. Tente novamente ou contacte-nos diretamente.",
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
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-100 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div ref={headerRef} className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-secondary mb-6 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-down' : 'opacity-0'
            }`}>
              Solicite o seu <span className="text-primary">Orçamento</span>
            </h2>
            <p className={`text-xl text-gray-700 font-medium transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up-delay-200' : 'opacity-0'
            }`}>
              Preencha o formulário abaixo e receba um orçamento personalizado para o seu projeto de construção ou remodelação.
            </p>
          </div>

          <div ref={formRef} className={`bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 transition-all duration-700 ${
            formVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ContactFormFields 
                formData={formData} 
                onChange={handleChange}
                onConsentChange={handleConsentChange}
                onPrivacyClick={handlePrivacyClick}
              />

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.gdprConsent}
                  className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  {isSubmitting ? 'A Enviar...' : 'Solicitar Orçamento Gratuito'}
                </button>
                <p className="text-sm text-gray-600 mt-4 font-medium">
                  * Campos obrigatórios. Responderemos em 24 horas.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
