
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                    placeholder="O seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                    placeholder="seuemail@exemplo.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                    placeholder="+351 912 345 678"
                  />
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-sm font-bold text-gray-800 mb-2">
                    Tipo de Projeto *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="construcao-nova">Construção Nova</option>
                    <option value="ampliacao">Ampliação</option>
                    <option value="remodelacao">Remodelação</option>
                    <option value="comercial">Projeto Comercial</option>
                    <option value="industrial">Projeto Industrial</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-bold text-gray-800 mb-2">
                  Localização da Obra *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                  placeholder="Cidade - Distrito"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-bold text-gray-800 mb-2">
                    Orçamento Previsto
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                  >
                    <option value="">Selecione a faixa</option>
                    <option value="ate-25k">Até €25.000</option>
                    <option value="25k-50k">€25.000 - €50.000</option>
                    <option value="50k-100k">€50.000 - €100.000</option>
                    <option value="100k-250k">€100.000 - €250.000</option>
                    <option value="acima-250k">Acima de €250.000</option>
                    <option value="nao-definido">Ainda não definido</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-bold text-gray-800 mb-2">
                    Prazo Desejado
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                  >
                    <option value="">Selecione o prazo</option>
                    <option value="urgente">Urgente (até 1 mês)</option>
                    <option value="rapido">Rápido (1-3 meses)</option>
                    <option value="medio">Médio (3-6 meses)</option>
                    <option value="longo">Longo (6-12 meses)</option>
                    <option value="flexivel">Flexível</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-800 mb-2">
                  Descrição da Obra *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none font-medium"
                  placeholder="Descreva detalhes da sua obra, área, especificações, objetivos..."
                ></textarea>
              </div>

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
