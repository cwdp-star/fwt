import { Hammer, CheckSquare, Shield, Award, Sparkles } from 'lucide-react';
import { useLazyAnimation, useStaggeredLazyAnimation } from '@/hooks/useLazyAnimation';
import constructionMission from '@/assets/construction-mission.jpg';

const About = () => {
  const header = useLazyAnimation({ delay: 0 });
  const imageSection = useLazyAnimation({ delay: 100 });
  const textSection = useLazyAnimation({ delay: 200 });
  const { containerRef, isItemVisible } = useStaggeredLazyAnimation(3, { delay: 200 });

  return (
    <section id="about" className="py-20 bg-muted lazy-container">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div ref={header.elementRef} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-playfair font-bold text-secondary mb-6 ${header.isVisible ? 'animate-fade-down' : 'animate-out'}`}
              style={header.style}>
              Sobre a <span className="text-primary">FTW Construções</span>
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-primary"></div>
              <Sparkles className="h-6 w-6 text-primary mx-4" />
              <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            <p className={`text-xl text-primary max-w-3xl mx-auto font-playfair font-semibold mb-8 ${header.isVisible ? 'animate-fade-up delay-200' : 'animate-out'}`}
              style={{ ...header.style, transitionDelay: '200ms' }}>
              Excelência em Construção Civil Premium
            </p>
            <p className={`text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed font-inter ${header.isVisible ? 'animate-fade-up delay-400' : 'animate-out'}`}
              style={{ ...header.style, transitionDelay: '400ms' }}>
              A FTW Construções representa o mais alto padrão em construção civil e remodelações de luxo. 
              Com décadas de experiência e um portfólio de projetos exclusivos, transformamos visões em realidade 
              através de execução impecável, materiais premium e atenção meticulosa aos detalhes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div 
              ref={imageSection.elementRef}
              className={`relative ${imageSection.isVisible ? 'animate-fade-left' : 'animate-out'}`}
              style={imageSection.style}
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl"></div>
              <div className="relative">
                <img 
                  src={constructionMission}
                  alt="Obra de construção premium FTW"
                  className="rounded-2xl shadow-[0_20px_60px_rgba(212,175,55,0.3)] w-full h-[400px] md:h-[500px] object-cover border-2 border-primary/30"
                  loading="lazy"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-primary to-accent p-6 rounded-2xl shadow-2xl border-2 border-white">
                  <Award className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <div 
              ref={textSection.elementRef}
              className={textSection.isVisible ? 'animate-fade-right' : 'animate-out'}
              style={textSection.style}
            >
              <h3 className="text-3xl md:text-4xl font-playfair font-bold text-secondary mb-8">
                A Nossa <span className="text-primary">Missão</span>
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed text-base md:text-lg font-inter">
                Elevar o padrão da construção civil em Portugal através da excelência técnica, 
                inovação arquitetónica e compromisso inabalável com a qualidade. Cada projeto que 
                desenvolvemos é uma obra de arte funcional, onde a precisão encontra o design 
                sofisticado e os sonhos dos nossos clientes ganham forma tangível.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-inter mb-8">
                Utilizamos exclusivamente materiais premium certificados, tecnologias de construção 
                de ponta e uma equipa de profissionais altamente qualificados. Do planeamento 
                estratégico à entrega das chaves, garantimos transparência total, cumprimento 
                rigoroso de prazos e acabamentos que superam expectativas.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-inter font-semibold text-secondary">Qualidade Premium</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-sm font-inter font-semibold text-secondary">Certificação Total</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={containerRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                icon: CheckSquare, 
                title: "Excelência Técnica", 
                desc: "Materiais premium certificados, técnicas construtivas avançadas e controlo de qualidade rigoroso em cada etapa. Garantimos durabilidade excecional e acabamentos impecáveis que resistem ao tempo.",
                badge: "Premium"
              },
              { 
                icon: Hammer, 
                title: "Experiência Comprovada", 
                desc: "Décadas de expertise em projetos de construção civil e remodelações de luxo. Portfolio extenso com centenas de clientes satisfeitos e obras concluídas com distinção em todo o país.",
                badge: "20+ Anos"
              },
              { 
                icon: Shield, 
                title: "Compromisso Absoluto", 
                desc: "Transparência total em orçamentos, cumprimento rigoroso de prazos e comunicação constante. Oferecemos garantias extensivas e suporte pós-entrega para sua total tranquilidade.",
                badge: "Garantido"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`relative text-center p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 hover:-translate-y-2 ${
                  isItemVisible(index) ? 'animate-scale-fade' : 'animate-out'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {item.badge}
                  </span>
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md transform hover:rotate-6 transition-transform">
                  <item.icon className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                </div>
                <h4 className="text-lg md:text-xl font-playfair font-bold text-secondary mb-4">{item.title}</h4>
                <p className="text-sm md:text-base text-muted-foreground font-inter leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
