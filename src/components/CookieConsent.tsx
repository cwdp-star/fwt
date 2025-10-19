import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('rc-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('rc-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('rc-cookie-consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl bg-white shadow-2xl border border-primary/20">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Utilização de Cookies e Proteção de Dados (RGPD)</h3>
              <p className="text-gray-700 mb-4">
                Este website utiliza apenas cookies técnicos essenciais para o funcionamento adequado do site. 
                Os seus dados pessoais fornecidos através de formulários são processados de acordo com o 
                Regulamento Geral sobre a Proteção de Dados (RGPD) da UE. Não partilhamos os seus dados com terceiros 
                sem o seu consentimento explícito. Os dados são armazenados de forma segura e apenas para os fins 
                solicitados. Pode exercer os seus direitos de acesso, retificação ou eliminação a qualquer momento 
                contactando-nos diretamente. Consulte a nossa Política de Privacidade para informação detalhada.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={acceptCookies}
                  className="bg-primary hover:bg-primary/90"
                >
                  Aceitar Cookies Essenciais
                </Button>
                <Button 
                  variant="outline" 
                  onClick={rejectCookies}
                >
                  Rejeitar
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={rejectCookies}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;