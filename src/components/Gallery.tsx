import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectGallery from './ProjectGallery';

const Gallery = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section id="gallery" className="py-16 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-12">
            <div className={`flex items-center justify-center space-x-3 mb-4 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-down' : 'opacity-0'
            }`}>
              <Images className="h-10 w-10 text-primary animate-float" />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                A Nossa <span className="text-primary">Experiência</span>
              </h2>
            </div>
            <p className={`text-lg text-foreground/80 max-w-3xl mx-auto transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up-delay-200' : 'opacity-0'
            }`}>
              Com anos de experiência em construção civil e remodelações, 
              oferecemos serviços de qualidade superior com resultados excepcionais.
            </p>
          </div>

          {/* Experience Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">10+</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Anos de Experiência</h3>
              <p className="text-muted-foreground">
                Mais de uma década dedicada à construção civil e remodelações de qualidade.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">100+</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Projetos Concluídos</h3>
              <p className="text-muted-foreground">
                Centenas de obras realizadas com sucesso e satisfação dos clientes.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-1">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">100%</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Satisfação Garantida</h3>
              <p className="text-muted-foreground">
                Compromisso total com a qualidade e satisfação de todos os nossos clientes.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Pronto para o Seu Próximo Projeto?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Entre em contacto connosco para um orçamento personalizado e gratuito.
            </p>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Solicitar Orçamento Gratuito
            </button>
          </div>
        </div>
      </div>

      {/* Project Gallery Section */}
      <ProjectGallery />
    </section>
  );
};

export default Gallery;