import { useState, useEffect } from 'react';
import { Shield, FileText, Cookie } from 'lucide-react';
import PrivacyPolicyModal from './legal/PrivacyPolicyModal';
import TermsModal from './legal/TermsModal';
import CookiePolicyModal from './legal/CookiePolicyModal';
import ftwLogo from '@/assets/ftw-logo.png';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const { getSettingValue } = useSiteSettings();

  const companyName = getSettingValue('company_name') || 'FTW Construções';
  const phone = getSettingValue('company_phone') || '+351 965 123 456';
  const email = getSettingValue('company_email') || 'geral@ftwconstrucoes.pt';
  const addressStreet = getSettingValue('company_address_street') || 'Rua Senhor Dos Aflitos 809';
  const addressPostal = getSettingValue('company_address_postal') || '4415-887';
  const addressCity = getSettingValue('company_address_city') || 'Sandim';
  const addressRegion = getSettingValue('company_address_region') || 'Vila Nova de Gaia';

  useEffect(() => {
    const handleOpenPrivacy = () => setShowPrivacy(true);
    window.addEventListener('open-privacy-modal', handleOpenPrivacy);
    return () => window.removeEventListener('open-privacy-modal', handleOpenPrivacy);
  }, []);

  return (
    <>
      <footer className="bg-secondary text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo e descrição */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-32 h-24 flex items-center justify-center">
                  <img src={ftwLogo} alt={`${companyName} Logo`} className="w-full h-full object-contain brightness-0 invert" />
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg font-inter">
                Especializados em construção civil premium e remodelações de luxo. 
                Oferecemos soluções sofisticadas da planta à chave na mão para 
                habitações, comércios e indústrias em Portugal Continental e Ilhas.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-playfair font-bold mb-6 text-primary flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Legal & Privacidade
              </h4>
              <ul className="space-y-3 text-gray-300 font-inter">
                <li>
                  <button 
                    onClick={() => setShowPrivacy(true)}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Política de Privacidade (RGPD)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowTerms(true)}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Termos e Condições
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowCookies(true)}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Cookie className="h-4 w-4" />
                    Política de Cookies
                  </button>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-lg font-playfair font-bold mb-6 text-primary">Contacto</h4>
              <div className="space-y-4 text-gray-300 font-inter">
                <div>
                  <p className="font-semibold text-white">Telefone:</p>
                  <p className="text-lg">{phone}</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Email:</p>
                  <p>{email}</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Morada:</p>
                  <p>{addressStreet}<br />{addressPostal} {addressCity}<br />{addressRegion}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-primary/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 mb-2 font-inter">
                  © 2025 {companyName}. Todos os direitos reservados.
                </p>
                <p className="text-gray-400 text-xs font-inter">
                  Este site foi criado por{" "}
                  <a href="https://casacriativami.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors underline">
                    Casa Criativa Mi
                  </a>
                </p>
              </div>
              <div className="text-gray-400 text-sm text-center md:text-right font-inter">
                <p>🔒 Conforme o RGPD (UE 2016/679)</p>
                <p className="text-xs mt-1">Os seus dados estão protegidos</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modais */}
      {showPrivacy && <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showCookies && <CookiePolicyModal onClose={() => setShowCookies(false)} />}
    </>
  );
};

export default Footer;
