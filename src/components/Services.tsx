import { Building, Home, Wrench } from 'lucide-react';
import { useLazyAnimation, useStaggeredLazyAnimation } from '@/hooks/useLazyAnimation';

const Services = () => {
  const header = useLazyAnimation({ delay: 0 });
  const { containerRef, isItemVisible } = useStaggeredLazyAnimation(4, { delay: 150 });
  
  const services = [
    {
      icon: Building,
      title: "Construção Civil Premium",
      description: "Construção de habitações e estruturas comerciais de luxo com excelência técnica absoluta. Cada projeto é executado com precisão arquitetónica e materiais de primeira linha.",
      features: ["Arquitetura Sofisticada", "Materiais Premium Certificados", "Engenharia de Ponta", "Controlo Rigoroso"]
    },
    {
      icon: Home,
      title: "Remodelações de Luxo",
      description: "Transformação completa de espaços com design exclusivo e acabamentos impecáveis. Renovamos mantendo a essência, elevando o padrão de qualidade e conforto.",
      features: ["Design Personalizado", "Acabamentos Impecáveis", "Execução Perfeita", "Atenção aos Detalhes"]
    },
    {
      icon: Wrench,
      title: "Projetos Chave na Mão",
      description: "Gestão integral do seu projeto desde o conceito até a entrega final. Coordenamos todas as fases com eficiência máxima e transparência total para sua tranquilidade.",
      features: ["Gestão Total Integrada", "Coordenação Profissional", "Prazos Garantidos", "Orçamento Transparente"]
    },
    {
      icon: Building,
      title: "Estruturas Especiais",
      description: "Expertise em estruturas complexas de betão armado, aço e sistemas construtivos avançados. Soluções técnicas para os projetos mais desafiadores e ambiciosos.",
      features: ["Engenharia Avançada", "Estruturas Complexas", "Cálculo Estrutural", "Certificação Técnica"]
    }
  ];

  return (
    <section id="services" className="py-16 md:py-20 bg-white lazy-container overflow-hidden">
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

          <div ref={containerRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 hover:-translate-y-2 ${
                  isItemVisible(index) ? 'animate-scale-fade' : 'animate-out'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 rounded-2xl flex items-center justify-center shadow-md transform hover:rotate-6 transition-transform">
                      <service.icon className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-playfair font-bold text-foreground mb-4">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-inter">
                    {service.description}
                  </p>
                </div>
                <ul className="space-y-2 md:space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-primary to-accent rounded-full flex-shrink-0 mt-1.5 shadow-sm"></div>
                      <span className="text-muted-foreground font-inter text-xs md:text-sm leading-relaxed">{feature}</span>
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