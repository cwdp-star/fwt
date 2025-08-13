
const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white pt-24">
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/2637c813-1f59-4fc8-82f5-a5c27d976878.png" 
            alt="RC Construções Logo" 
            className="h-40 w-auto"
          />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-secondary mb-6 leading-tight">
          Construção Civil
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
            & Remodelação
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
          Da conceção à entrega das chaves. A RC Construções oferece soluções completas 
          em construção civil e remodelações com qualidade superior, 
          profissionalismo comprovado e cumprimento rigoroso de prazos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
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
