import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="lg"
          className="w-14 h-14 rounded-full bg-secondary hover:bg-secondary/90 text-white shadow-lg transition-all duration-300 hover:scale-110 animate-fade-up"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default FloatingButtons;
