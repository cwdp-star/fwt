import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CookiePolicyModalProps {
  onClose: () => void;
}

const CookiePolicyModal = ({ onClose }: CookiePolicyModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Política de Cookies</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-PT')}
            </p>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">1. O que são Cookies?</h3>
              <p className="text-gray-700">
                Cookies são pequenos ficheiros de texto que são armazenados no seu dispositivo (computador, tablet ou telemóvel) 
                quando visita um website. Os cookies permitem que o website reconheça o seu dispositivo e memorize informações 
                sobre a sua visita, como as suas preferências e configurações.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">2. Como Utilizamos os Cookies</h3>
              <p className="text-gray-700 mb-3">
                A RC Construções utiliza cookies para garantir o funcionamento adequado do website e melhorar a experiência do utilizador. 
                Utilizamos apenas cookies essenciais e técnicos, não utilizamos cookies de marketing, publicidade ou rastreamento.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">3. Tipos de Cookies que Utilizamos</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">3.1. Cookies Estritamente Necessários</h4>
                <p className="text-gray-700 mb-2">
                  Estes cookies são essenciais para o funcionamento do website e não podem ser desativados nos nossos sistemas. 
                  São normalmente definidos apenas em resposta a ações realizadas por si que correspondam a uma solicitação de serviços.
                </p>
                <p className="text-gray-700"><strong>Cookies utilizados:</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li><strong>rc-cookie-consent:</strong> Armazena a sua preferência de cookies (aceitar/rejeitar) | Duração: 1 ano</li>
                  <li><strong>sb-*-auth-token:</strong> Cookie de autenticação para áreas administrativas | Duração: Sessão</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">3.2. Cookies de Funcionalidade</h4>
                <p className="text-gray-700 mb-2">
                  Estes cookies permitem que o website se lembre de escolhas que faz (como o seu idioma ou região) e fornecem 
                  funcionalidades melhoradas e mais personalizadas.
                </p>
                <p className="text-gray-700 mb-2"><strong>Atualmente não utilizamos este tipo de cookies.</strong></p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">3.3. Cookies de Análise/Performance</h4>
                <p className="text-gray-700 mb-2">
                  Estes cookies permitem-nos contar visitas e fontes de tráfego para que possamos medir e melhorar o desempenho do nosso website.
                </p>
                <p className="text-gray-700 mb-2"><strong>Atualmente não utilizamos este tipo de cookies.</strong></p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">3.4. Cookies de Publicidade/Targeting</h4>
                <p className="text-gray-700 mb-2">
                  Estes cookies podem ser definidos através do nosso website pelos nossos parceiros de publicidade para construir 
                  um perfil dos seus interesses.
                </p>
                <p className="text-gray-700 mb-2"><strong>NÃO utilizamos este tipo de cookies.</strong></p>
              </div>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">4. Cookies de Terceiros</h3>
              <p className="text-gray-700">
                Atualmente, não permitimos que terceiros coloquem cookies no nosso website. Caso isto venha a mudar no futuro, 
                esta política será atualizada para refletir essas alterações.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">5. Como Controlar e Eliminar Cookies</h3>
              <p className="text-gray-700 mb-3">
                Pode controlar e/ou eliminar cookies conforme desejar. Pode eliminar todos os cookies que já estão no seu 
                dispositivo e configurar a maioria dos navegadores para impedir que sejam colocados.
              </p>
              
              <div className="mb-3">
                <p className="font-semibold text-gray-900 mb-2">Gestão de Cookies no Navegador:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Google Chrome:</strong> Definições → Privacidade e segurança → Cookies e outros dados do site</li>
                  <li><strong>Mozilla Firefox:</strong> Opções → Privacidade e Segurança → Cookies e Dados de Sites</li>
                  <li><strong>Safari:</strong> Preferências → Privacidade → Cookies e dados de websites</li>
                  <li><strong>Microsoft Edge:</strong> Definições → Cookies e permissões de site → Cookies e dados armazenados</li>
                </ul>
              </div>

              <p className="text-gray-700 mt-3">
                <strong>Nota:</strong> Se optar por eliminar ou bloquear os cookies essenciais, algumas funcionalidades do website 
                podem não funcionar corretamente.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">6. Gestão do seu Consentimento</h3>
              <p className="text-gray-700 mb-3">
                Quando visita o nosso website pela primeira vez, é-lhe apresentado um banner de cookies que lhe permite:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Aceitar todos os cookies (essenciais)</li>
                <li>Rejeitar cookies não essenciais (atualmente não existem)</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Pode alterar as suas preferências de cookies a qualquer momento eliminando o cookie de consentimento do seu navegador 
                e visitando novamente o website.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">7. Cookies e Dados Pessoais</h3>
              <p className="text-gray-700">
                Os cookies técnicos que utilizamos não recolhem dados pessoais identificáveis. Para informações sobre como tratamos 
                os seus dados pessoais, consulte a nossa <strong>Política de Privacidade</strong>.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">8. Atualizações a Esta Política</h3>
              <p className="text-gray-700">
                Podemos atualizar esta Política de Cookies periodicamente para refletir alterações nas nossas práticas ou por 
                outros motivos operacionais, legais ou regulamentares. Quando fizermos alterações, atualizaremos a data de 
                "última atualização" no topo desta página.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">9. Mais Informações</h3>
              <p className="text-gray-700 mb-2">
                Para mais informações sobre cookies, visite:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.allaboutcookies.org</a></li>
                <li><a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.youronlinechoices.eu</a></li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">10. Contacto</h3>
              <p className="text-gray-700 mb-2">
                Se tiver questões sobre a nossa utilização de cookies, contacte-nos através de:
              </p>
              <p className="text-gray-700 mb-1"><strong>Email:</strong> privacidade@rcconstrucoes.pt</p>
              <p className="text-gray-700 mb-1"><strong>Telefone:</strong> [Inserir número]</p>
              <p className="text-gray-700"><strong>Morada:</strong> [Inserir morada completa]</p>
            </section>
          </div>
        </ScrollArea>

        <div className="p-6 border-t">
          <Button onClick={onClose} className="w-full bg-primary hover:bg-accent">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyModal;
