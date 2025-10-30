import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { getSettingValue } = useSiteSettings();
  
  const whatsappNumber = getSettingValue('whatsapp_number') || '351XXXXXXXXX';
  const companyName = getSettingValue('company_name');

  const handleSendMessage = () => {
    const defaultMessage = message || `Olá! Gostaria de saber mais sobre os serviços da ${companyName}.`;
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <>
      {/* WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-40 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 min-h-[56px] min-w-[56px] flex items-center justify-center"
        aria-label="Abrir chat WhatsApp"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-40 w-80 md:w-96 bg-white rounded-lg shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-[#25D366] p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-[#25D366]" />
              </div>
              <div>
                <h3 className="font-semibold">{companyName}</h3>
                <p className="text-xs text-white/90">Normalmente responde em minutos</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 bg-gray-50">
            <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
              <p className="text-sm text-gray-700">
                👋 Olá! Como podemos ajudá-lo hoje?
              </p>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a sua mensagem..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-[#25D366] min-h-[100px]"
              rows={3}
            />
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t">
            <Button
              onClick={handleSendMessage}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white min-h-[48px]"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Enviar mensagem
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppChat;
