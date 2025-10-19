import { Hammer, CheckSquare, Shield } from 'lucide-react';
import { useLazyAnimation, useStaggeredLazyAnimation } from '@/hooks/useLazyAnimation';

const About = () => {
  const header = useLazyAnimation({ delay: 0 });
  const imageSection = useLazyAnimation({ delay: 100 });
  const textSection = useLazyAnimation({ delay: 200 });
  const { containerRef, isItemVisible } = useStaggeredLazyAnimation(3, { delay: 200 });

  return (
    <section id="about" className="py-20 bg-gray-50 lazy-container">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div ref={header.elementRef} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold text-secondary mb-6 ${header.isVisible ? 'animate-fade-down' : 'animate-out'}`}
              style={header.style}>
              Sobre a <span className="text-primary">RC Construções</span>
            </h2>
            <p className={`text-xl text-gray-700 max-w-3xl mx-auto font-medium mb-8 ${header.isVisible ? 'animate-fade-up delay-200' : 'animate-out'}`}
              style={{ ...header.style, transitionDelay: '200ms' }}>
              Excelência em Construção Civil e Remodelação
            </p>
            <p className={`text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed ${header.isVisible ? 'animate-fade-up delay-400' : 'animate-out'}`}
              style={{ ...header.style, transitionDelay: '400ms' }}>
              A RC Construções é sinónimo de qualidade estrutural e excelência construtiva. Especializamo-nos em projetos de construção civil, remodelações completas e projetos chave na mão, sempre com foco na durabilidade e segurança das estruturas que construímos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div 
              ref={imageSection.elementRef}
              className={imageSection.isVisible ? 'animate-fade-left' : 'animate-out'}
              style={imageSection.style}
            >
              <img 
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Construção moderna em andamento"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                loading="lazy"
              />
            </div>
            <div 
              ref={textSection.elementRef}
              className={textSection.isVisible ? 'animate-fade-right' : 'animate-out'}
              style={textSection.style}
            >
              <h3 className="text-3xl font-bold text-secondary mb-6">
                A Nossa Missão
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                A RC Construções dedica-se à construção de estruturas sólidas e duradouras. Especializamo-nos em construção nova, remodelações completas e projetos chave na mão, sempre com foco na qualidade estrutural e segurança.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Trabalhamos com materiais certificados e técnicas avançadas de construção. Cada projeto recebe controlo rigoroso de qualidade desde as fundações até aos acabamentos, garantindo estruturas robustas e duradouras.
              </p>
            </div>
          </div>

          <div ref={containerRef} className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CheckSquare, title: "Qualidade Garantida", desc: "Utilizamos materiais de primeira qualidade e técnicas modernas de construção para garantir durabilidade e acabamentos perfeitos." },
              { icon: Hammer, title: "Experiência Comprovada", desc: "Mais de 15 anos no mercado da construção civil, com centenas de projetos realizados com sucesso e clientes satisfeitos." },
              { icon: Shield, title: "Compromisso Total", desc: "Comprometemo-nos com prazos, orçamentos e especificações técnicas, oferecendo transparência total em todas as fases do projeto." }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/10 ${
                  isItemVisible(index) ? 'animate-scale-fade' : 'animate-out'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-12 w-12 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-secondary mb-4">{item.title}</h4>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
