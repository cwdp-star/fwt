import { useLazyAnimation } from '@/hooks/useLazyAnimation';

const Hero = () => {
  const logo = useLazyAnimation({ delay: 0 });
  const title = useLazyAnimation({ delay: 200 });
  const subtitle = useLazyAnimation({ delay: 400 });
  const buttons = useLazyAnimation({ delay: 600 });
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white pt-24 lazy-container"
    >
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div 
          ref={logo.elementRef}
          className={`flex justify-center mb-8 ${logo.isVisible ? 'animate-fade-down' : 'animate-out'}`}
          style={logo.style}
        >
          <img 
            src="/lovable-uploads/2637c813-1f59-4fc8-82f5-a5c27d976878.png" 
            alt="RC Construções Logo" 
            className="h-40 w-auto"
            loading="eager"
          />
        </div>
        
        <h1 
          ref={title.elementRef}
          className={`text-5xl md:text-7xl font-bold text-secondary mb-6 leading-tight ${title.isVisible ? 'animate-fade-up' : 'animate-out'}`}
          style={title.style}
        >
          Construção Civil
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
            & Remodelação
          </span>
        </h1>
        
        <p 
          ref={subtitle.elementRef}
          className={`text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed ${subtitle.isVisible ? 'animate-fade-up' : 'animate-out'}`}
          style={subtitle.style}
        >
          Da conceção à entrega das chaves. A RC Construções oferece soluções completas 
          em construção civil e remodelações com qualidade superior, 
          profissionalismo comprovado e cumprimento rigoroso de prazos.
        </p>

        <div 
          ref={buttons.elementRef}
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 ${buttons.isVisible ? 'animate-scale-fade' : 'animate-out'}`}
          style={buttons.style}
        >
          <button 
            onClick={scrollToContact}
            className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Solicitar Orçamento
          </button>
          <button 
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300"
          >
            Ver Galeria
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
