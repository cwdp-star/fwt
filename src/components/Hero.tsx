
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Hero = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={elementRef} 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white pt-24"
    >
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className={`flex justify-center mb-8 transition-all duration-700 ${
          isVisible ? 'animate-fade-in-down' : 'opacity-0'
        }`}>
          <img 
            src="/lovable-uploads/2637c813-1f59-4fc8-82f5-a5c27d976878.png" 
            alt="RC Construções Logo" 
            className="h-40 w-auto animate-float"
          />
        </div>
        
        <h1 className={`text-5xl md:text-7xl font-bold text-secondary mb-6 leading-tight transition-all duration-700 ${
          isVisible ? 'animate-fade-in-up-delay-200' : 'opacity-0'
        }`}>
          Construção Civil
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
            & Remodelação
          </span>
        </h1>
        
        <p className={`text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed transition-all duration-700 ${
          isVisible ? 'animate-fade-in-up-delay-400' : 'opacity-0'
        }`}>
          Da conceção à entrega das chaves. A RC Construções oferece soluções completas 
          em construção civil e remodelações com qualidade superior, 
          profissionalismo comprovado e cumprimento rigoroso de prazos.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-700 ${
          isVisible ? 'animate-fade-in-up-delay-600' : 'opacity-0'
        }`}>
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
