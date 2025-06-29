
import { Building, Hammer, Shield, Plus } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Building,
      title: "Armação de Ferro",
      description: "Execução completa de armação de ferro para lajes, vigas, pilares e fundações.",
      features: ["Lajes Maciças", "Vigas e Pilares", "Fundações", "Escadas"]
    },
    {
      icon: Hammer,
      title: "Cofragem Estrutural",
      description: "Montagem de cofragem para concreto armado com precisão e segurança.",
      features: ["Cofragem de Lajes", "Formas para Pilares", "Cofragem de Vigas", "Escoramentos"]
    },
    {
      icon: Shield,
      title: "Estruturas Metálicas",
      description: "Fabricação e montagem de estruturas metálicas para diversos fins.",
      features: ["Galpões Industriais", "Mezaninos", "Coberturas", "Estruturas Especiais"]
    },
    {
      icon: Plus,
      title: "Projetos Especializados",
      description: "Soluções customizadas para projetos que demandam expertise técnica.",
      features: ["Consultoria Técnica", "Análise Estrutural", "Orçamento Detalhado", "Acompanhamento"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Nossos <span className="text-blue-600">Serviços</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos soluções completas em armação de ferro e cofragem, 
              com qualidade profissional e segurança garantida.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-orange-500 p-3 rounded-lg flex-shrink-0">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Solicitar Orçamento Gratuito
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
