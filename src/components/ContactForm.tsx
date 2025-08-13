
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import ContactFormFields from './ContactFormFields';
import PrivacyPolicy from './PrivacyPolicy';

const ContactForm = () => {
  const { toast } = useToast();
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
    
    if (!formData.gdprConsent) {
      toast({
        title: "Consentimento Obrigatório",
        description: "Deve aceitar a política de privacidade para enviar o pedido de orçamento.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // For now, we'll just use localStorage to simulate storing requests
      // This will be replaced with proper database integration later
      const quoteRequest = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        project_type: formData.projectType,
        location: formData.location,
        budget: formData.budget,
        timeline: formData.timeline,
        description: formData.description,
        documents_link: formData.documentsLink,
        gdpr_consent: formData.gdprConsent,
        created_at: new Date().toISOString()
      };
      
      const existingRequests = JSON.parse(localStorage.getItem('quote_requests') || '[]');
      existingRequests.unshift(quoteRequest);
      localStorage.setItem('quote_requests', JSON.stringify(existingRequests));

      // Send email via Supabase Edge Function
      const { error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          ...formData
        }
      });

      if (error) {
        console.warn('Email sending failed:', error);
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
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
              Solicite o seu <span className="text-primary">Orçamento</span>
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Preencha o formulário abaixo e receba um orçamento personalizado para o seu projeto de construção ou remodelação.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200">
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
