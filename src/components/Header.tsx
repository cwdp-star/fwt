
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
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/2637c813-1f59-4fc8-82f5-a5c27d976878.png" 
                alt="RC Construções" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-secondary font-along-serif">RC Construções</h1>
              <p className="text-lg font-medium text-primary font-along-serif">Construção & Remodelação</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-secondary hover:text-primary font-semibold transition-colors">
              Início
            </button>
            <button onClick={() => scrollToSection('about')} className="text-secondary hover:text-primary font-semibold transition-colors">
              Sobre Nós
            </button>
            <button onClick={() => scrollToSection('services')} className="text-secondary hover:text-primary font-semibold transition-colors">
              Serviços
            </button>
            <button onClick={() => scrollToSection('gallery')} className="text-secondary hover:text-primary font-semibold transition-colors">
              Galeria
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-secondary hover:text-primary font-semibold transition-colors">
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
              <button onClick={() => scrollToSection('home')} className="text-left text-secondary hover:text-primary font-semibold py-2">
                Início
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left text-secondary hover:text-primary font-semibold py-2">
                Sobre Nós
              </button>
              <button onClick={() => scrollToSection('services')} className="text-left text-secondary hover:text-primary font-semibold py-2">
                Serviços
              </button>
              <button onClick={() => scrollToSection('gallery')} className="text-left text-secondary hover:text-primary font-semibold py-2">
                Galeria
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-secondary hover:text-primary font-semibold py-2">
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
