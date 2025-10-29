import { Building, Home, Wrench } from 'lucide-react';
import { useLazyAnimation, useStaggeredLazyAnimation } from '@/hooks/useLazyAnimation';

const Services = () => {
  const header = useLazyAnimation({ delay: 0 });
  const { containerRef, isItemVisible } = useStaggeredLazyAnimation(4, { delay: 150 });
  
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
      icon: Building,
      title: "Betão Armado",
      description: "Especialistas em estruturas de betão armado, ferro e cofragem com técnicas de construção avançadas.",
      features: ["Ferro e Cofragem", "Estruturas Especiais", "Betão de Qualidade", "Resistência Superior"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white lazy-container">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={header.elementRef}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6 ${header.isVisible ? 'animate-fade-down' : 'animate-out'}`}
              style={header.style}>
              Os Nossos <span className="text-primary">Serviços Premium</span>
            </h2>
            <p className={`text-xl text-muted-foreground max-w-3xl mx-auto font-inter ${header.isVisible ? 'animate-fade-up delay-200' : 'animate-out'}`}
              style={{ ...header.style, transitionDelay: '200ms' }}>
              Especialistas em construção civil premium com excelência técnica e acabamentos de luxo, garantindo qualidade superior e sofisticação em cada detalhe.
            </p>
          </div>

          <div ref={containerRef} className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)] transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 ${
                  isItemVisible(index) ? 'animate-scale-fade' : 'animate-out'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center shadow-sm">
                      <service.icon className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-playfair font-bold text-foreground mb-4">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed font-inter">
                    {service.description}
                  </p>
                </div>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 shadow-sm"></div>
                      <span className="text-muted-foreground font-inter text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.4)] animate-fade-in-up font-inter"
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