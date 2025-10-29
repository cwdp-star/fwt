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
          className={`flex justify-center mb-12 ${logo.isVisible ? 'animate-fade-down' : 'animate-out'}`}
          style={logo.style}
        >
          <img 
            src="/src/assets/ftw-logo.png" 
            alt="FTW Construções Logo" 
            className="h-48 md:h-56 w-auto"
            loading="eager"
          />
        </div>
        
        <h1 
          ref={title.elementRef}
          className={`text-5xl md:text-7xl font-playfair font-bold text-secondary mb-6 leading-tight ${title.isVisible ? 'animate-fade-up' : 'animate-out'}`}
          style={title.style}
        >
          Construção Civil
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
            Premium & Remodelação
          </span>
        </h1>
        
        <p 
          ref={subtitle.elementRef}
          className={`text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-inter ${subtitle.isVisible ? 'animate-fade-up' : 'animate-out'}`}
          style={subtitle.style}
        >
          Da conceção à entrega das chaves. A FTW Construções oferece soluções premium 
          em construção civil e remodelações com excelência técnica, 
          acabamentos de luxo e compromisso absoluto com a qualidade.
        </p>

        <div 
          ref={buttons.elementRef}
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 ${buttons.isVisible ? 'animate-scale-fade' : 'animate-out'}`}
          style={buttons.style}
        >
          <button 
            onClick={scrollToContact}
            className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-12 py-5 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.4)] font-inter"
          >
            Solicitar Orçamento
          </button>
          <button 
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-12 py-5 rounded-xl font-bold text-lg transition-all duration-300 font-inter"
          >
            Ver Galeria
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
