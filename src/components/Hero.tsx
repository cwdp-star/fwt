
const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 rounded-full shadow-2xl flex items-center justify-center p-4 bg-white border-2 border-gray-200">
            <img 
              src="/lovable-uploads/dfdb0f79-49d1-438c-b58d-fc91a779077d.png" 
              alt="Motivo Visionário Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Estruturas de
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent block">
            Ferro Sólidas
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
          Especialistas em armação de ferro e cofragem estrutural para obras. 
          A Motivo Visionário oferece soluções completas com qualidade, 
          rigor técnico e segurança incomparáveis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button 
            onClick={scrollToContact}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Solicitar Orçamento
          </button>
          <button 
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300"
          >
            Ver Projetos
          </button>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Estruturas Executadas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">5+</div>
              <div className="text-gray-600 font-medium">Anos de Experiência</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Segurança Garantida</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">2</div>
              <div className="text-gray-600 font-medium">Anos de Garantia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
