
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
<header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-200">
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-21 h-21 flex items-center justify-center">
          <img 
            src="/lovable-uploads/dfdb0f79-49d1-438c-b58d-fc91a779077d.png" 
            alt="Motivo Visionário" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-along-serif">Motivo Visionário</h1>
          <p className="text-sm font-medium text-orange-600 font-along-serif">Ferro e Cofragem</p>
        </div>
      </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-900 hover:text-orange-600 font-semibold transition-colors">
              Início
            </button>
            <button onClick={() => scrollToSection('about')} className="text-gray-900 hover:text-orange-600 font-semibold transition-colors">
              Sobre Nós
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-900 hover:text-orange-600 font-semibold transition-colors">
              Serviços
            </button>
            <button onClick={() => scrollToSection('gallery')} className="text-gray-900 hover:text-orange-600 font-semibold transition-colors">
              Projetos
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-900 hover:text-orange-600 font-semibold transition-colors">
              Contacto
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-gray-900" /> : <Menu className="h-6 w-6 text-gray-900" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection('home')} className="text-left text-gray-900 hover:text-orange-600 font-semibold py-2">
                Início
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left text-gray-900 hover:text-orange-600 font-semibold py-2">
                Sobre Nós
              </button>
              <button onClick={() => scrollToSection('services')} className="text-left text-gray-900 hover:text-orange-600 font-semibold py-2">
                Serviços
              </button>
              <button onClick={() => scrollToSection('gallery')} className="text-left text-gray-900 hover:text-orange-600 font-semibold py-2">
                Projetos
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-gray-900 hover:text-orange-600 font-semibold py-2">
                Contacto
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
