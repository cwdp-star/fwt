
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`Pedido de Orçamento - ${formData.projectType}`);
    const body = encodeURIComponent(`
Nome: ${formData.name}
Email: ${formData.email}
Telefone: ${formData.phone}
Tipo de Projeto: ${formData.projectType}
Localização: ${formData.location}
Orçamento Previsto: ${formData.budget}
Prazo Desejado: ${formData.timeline}

Descrição do Projeto:
${formData.description}

Documentos Anexados: ${documents.length > 0 ? documents.map(doc => doc.name).join(', ') : 'Nenhum'}
    `);
    
    const mailtoLink = `mailto:geral@motivovisionario.pt?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    toast({
      title: "Orçamento Solicitado!",
      description: "O seu pedido de orçamento foi preparado. Verifique o seu cliente de email.",
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
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-12 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Solicitar Orçamento Gratuito
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
