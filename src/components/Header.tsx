import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/SecurityProvider';
import ftwLogo from '@/assets/ftw-logo.png';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      setIsMenuOpen(false);
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full backdrop-blur-lg z-50 border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/98 shadow-lg border-primary/20' 
          : 'bg-background/95 shadow-[0_4px_30px_rgba(212,175,55,0.15)] border-primary/10'
      }`}
    >
      <div className={`container mx-auto px-4 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/">
              <img 
                src={ftwLogo} 
                alt="FTW Construções - Construção Civil Premium e Remodelações de Luxo" 
                className={`w-auto transition-all duration-300 ${
                  isScrolled ? 'h-16 md:h-20' : 'h-24 md:h-28'
                }`}
              />
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-2 lg:space-x-6 items-center">
            {[
              { label: 'Início', id: 'home', path: '/' },
              { label: 'Sobre Nós', id: 'about' },
              { label: 'Serviços', id: 'services' },
              { label: 'Galeria', id: 'gallery' },
              { label: 'Contacto', id: 'contact' }
            ].map((item, index) => (
              <motion.button 
                key={item.id}
                onClick={() => scrollToSection(item.id)} 
                className="text-foreground hover:text-primary font-semibold transition-all relative font-inter px-4 py-2 rounded-lg hover:bg-primary/5"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span className="relative z-10">{item.label}</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg -z-10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
            
            {user && (
              <>
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    location.pathname === '/admin' 
                      ? 'bg-primary text-white' 
                      : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-lg hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20"
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
          <div className="pt-4 pb-4 border-t border-primary/20 mt-4 bg-gradient-to-b from-primary/5 to-transparent rounded-b-xl">
            <div className="flex flex-col space-y-1">
              {[
                { label: 'Início', id: 'home', path: '/' },
                { label: 'Sobre Nós', id: 'about' },
                { label: 'Serviços', id: 'services' },
                { label: 'Galeria', id: 'gallery' },
                { label: 'Contacto', id: 'contact' }
              ].map((item, index) => (
                <motion.button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className="text-left text-foreground hover:text-primary font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 transition-all border border-transparent hover:border-primary/10"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
              
              {user && (
                <>
                  <Link 
                    to="/admin" 
                    className={`py-3 px-4 rounded-lg font-semibold transition-all border border-transparent ${
                      location.pathname === '/admin'
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'text-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-foreground hover:text-primary transition-all py-3 px-4 rounded-lg hover:bg-primary/5 text-left border border-transparent hover:border-primary/10 font-semibold"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default Header;