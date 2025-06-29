
const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-gray-800/90 to-orange-600/90"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/dfdb0f79-49d1-438c-b58d-fc91a779077d.png" 
            alt="Motivo Visionário Logo" 
            className="h-32 w-32"
          />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Estruturas de
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent block">
            Ferro Sólidas
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
          Especialistas em armação de ferro e cofragem para estruturas. 
          A Motivo Visionário oferece soluções completas em estruturas metálicas 
          com qualidade e precisão incomparáveis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={scrollToContact}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Solicitar Orçamento
          </button>
          <button 
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
          >
            Ver Estruturas
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">300+</div>
            <div className="text-gray-300">Estruturas Executadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">12+</div>
            <div className="text-gray-300">Anos de Experiência</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">100%</div>
            <div className="text-gray-300">Segurança Garantida</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">24h</div>
            <div className="text-gray-300">Suporte Técnico</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
