import { Hammer, Building } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Hammer,
      title: "Armação de Ferro",
      description: "Execução completa de armação de ferro para lajes, vigas, pilares e fundações com rigor técnico.",
      features: ["Lajes Maciças e Aligeiradas", "Vigas e Pilares", "Fundações e Sapatas", "Escadas de Betão"]
    },
    {
      icon: Building,
      title: "Cofragem Estrutural",
      description: "Montagem de cofragem para betão armado com precisão milimétrica e total segurança.",
      features: ["Cofragem de Lajes", "Formas para Pilares", "Cofragem de Vigas", "Sistemas de Escoramento"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Os Nossos <span className="text-orange-600">Serviços</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              Soluções profissionais em armação de ferro e cofragem para obras seguras, bem executadas e dentro dos padrões exigidos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-6">
                    <service.icon className="h-16 w-16 text-orange-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-12 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
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
