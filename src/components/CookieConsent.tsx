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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4">
      <Card className="mx-auto max-w-3xl bg-white/95 backdrop-blur-sm shadow-xl border border-primary/20">
        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 hidden sm:block">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base mb-2">Cookies e RGPD</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                Utilizamos apenas cookies essenciais. Os seus dados são processados segundo o RGPD. 
                Consulte a nossa <button onClick={() => window.dispatchEvent(new CustomEvent('open-privacy-modal'))} className="underline hover:text-primary">Política de Privacidade</button> para mais informações.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={acceptCookies}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-xs sm:text-sm"
                >
                  Aceitar
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={rejectCookies}
                  className="text-xs sm:text-sm"
                >
                  Rejeitar
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={rejectCookies}
              className="flex-shrink-0 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;