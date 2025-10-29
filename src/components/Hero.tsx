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
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-white via-white to-muted/30 pt-24 pb-12 md:pt-32 md:pb-20 lazy-container"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div 
          ref={logo.elementRef}
          className={`flex justify-center mb-8 md:mb-12 ${logo.isVisible ? 'animate-fade-down' : 'animate-out'}`}
          style={logo.style}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl rounded-full"></div>
            <img 
              src="/src/assets/ftw-logo.png" 
              alt="FTW Construções Logo" 
              className="relative h-40 sm:h-48 md:h-56 lg:h-64 w-auto drop-shadow-2xl"
              loading="eager"
            />
          </div>
        </div>
        
        <h1 
          ref={title.elementRef}
          className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-secondary mb-6 leading-tight px-4 ${title.isVisible ? 'animate-fade-up' : 'animate-out'}`}
          style={title.style}
        >
          Construção Civil
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent block mt-2">
            Premium & Remodelação de Luxo
          </span>
        </h1>
        
        <p 
          ref={subtitle.elementRef}
          className={`text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-inter px-4 ${subtitle.isVisible ? 'animate-fade-up' : 'animate-out'}`}
          style={subtitle.style}
        >
          Transformamos visões em realidade através de construção civil premium e remodelações de luxo. 
          Da conceção estratégica à entrega das chaves, garantimos excelência técnica absoluta, 
          acabamentos impecáveis e compromisso total com os seus sonhos.
        </p>

        <div 
          ref={buttons.elementRef}
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 md:mb-16 px-4 ${buttons.isVisible ? 'animate-scale-fade' : 'animate-out'}`}
          style={buttons.style}
        >
          <button 
            onClick={scrollToContact}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.4)] font-inter"
          >
            Solicitar Orçamento Premium
          </button>
          <button 
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 font-inter"
          >
            Ver Portfolio
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
