
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import ContactFormFields from './ContactFormFields';
import DocumentUpload from './DocumentUpload';

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
    description: ''
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send email via Supabase Edge Function
      const { error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          ...formData,
          documentsCount: documents.length
        }
      });

      if (error) {
        throw error;
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
        description: ''
      });
      setDocuments([]);
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

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-100 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Solicite o seu <span className="text-orange-600">Orçamento</span>
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Preencha o formulário abaixo e receba um orçamento personalizado para a sua obra.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <ContactFormFields formData={formData} onChange={handleChange} />
              
              <DocumentUpload 
                documents={documents} 
                onDocumentsChange={setDocuments} 
              />

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
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
