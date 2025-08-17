
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full bg-background/95 backdrop-blur-md shadow-lg z-50 border-b border-border transition-all duration-300"
    >
      <div className={`container mx-auto px-4 transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-6'
      }`}>
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src="/lovable-uploads/2637c813-1f59-4fc8-82f5-a5c27d976878.png" 
              alt="RC Construções" 
              className={`w-auto transition-all duration-300 ${
                isScrolled ? 'h-12' : 'h-20'
              }`}
            />
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {[
              { label: 'Início', id: 'home' },
              { label: 'Sobre Nós', id: 'about' },
              { label: 'Serviços', id: 'services' },
              { label: 'Galeria', id: 'gallery' },
              { label: 'Contacto', id: 'contact' }
            ].map((item, index) => (
              <motion.button 
                key={item.id}
                onClick={() => scrollToSection(item.id)} 
                className="text-foreground hover:text-primary font-semibold transition-colors relative"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span className="relative z-10">{item.label}</span>
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.nav 
          className="md:hidden overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0, 
            opacity: isMenuOpen ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="pt-4 pb-2 border-t border-border mt-4">
            <div className="flex flex-col space-y-2">
              {[
                { label: 'Início', id: 'home' },
                { label: 'Sobre Nós', id: 'about' },
                { label: 'Serviços', id: 'services' },
                { label: 'Galeria', id: 'gallery' },
                { label: 'Contacto', id: 'contact' }
              ].map((item, index) => (
                <motion.button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className="text-left text-foreground hover:text-primary font-semibold py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default Header;
