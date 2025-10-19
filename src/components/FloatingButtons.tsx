import { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
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

  const openWhatsApp = () => {
    // Sanitize and validate - no user input here, just static message
    const phoneNumber = '351123456789'; // Altere para o número real
    const message = encodeURIComponent('Olá! Gostaria de solicitar um orçamento.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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

      {/* WhatsApp Button */}
      <Button
        onClick={openWhatsApp}
        size="lg"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg transition-all duration-300 hover:scale-110 animate-scale-fade"
        aria-label="Contactar via WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default FloatingButtons;
