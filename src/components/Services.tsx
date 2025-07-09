import { Building, Home, Wrench, PaintBucket } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Building,
      title: "Construção Civil",
      description: "Construção de habitações e estruturas comerciais com foco na qualidade estrutural e durabilidade excecional.",
      features: ["Estruturas Robustas", "Materiais Certificados", "Técnicas Avançadas", "Controlo de Qualidade"]
    },
    {
      icon: Home,
      title: "Remodelações Completas",
      description: "Renovação total de espaços existentes com qualidade construtiva superior e atenção aos detalhes.",
      features: ["Qualidade Estrutural", "Acabamentos Premium", "Segurança Garantida", "Durabilidade"]
    },
    {
      icon: Wrench,
      title: "Projetos Chave na Mão",
      description: "Da planta ao acabamento final, garantimos qualidade em cada etapa do processo construtivo.",
      features: ["Gestão Completa", "Controlo de Qualidade", "Entrega no Prazo", "Estruturas Sólidas"]
    },
    {
      icon: PaintBucket,
      title: "Acabamentos de Qualidade",
      description: "Acabamentos superiores que garantem a longevidade e beleza das estruturas construídas.",
      features: ["Materiais Premium", "Técnicas Especializadas", "Durabilidade Comprovada", "Acabamentos Perfeitos"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
              Os Nossos <span className="text-primary">Serviços</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              Construção de qualidade superior com estruturas sólidas e duradouras, garantindo segurança e excelência em cada projeto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {services.slice(0, 2).map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/10">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                      <service.icon className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.slice(2, 4).map((service, index) => (
              <div key={index + 2} className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/10">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                      <service.icon className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
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
