import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal = ({ onClose }: TermsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Termos e Condições de Utilização</h2>
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
              <h3 className="text-lg font-bold text-gray-900 mb-3">1. Aceitação dos Termos</h3>
              <p className="text-gray-700">
                Ao aceder e utilizar o website da RC Construções, aceita estar vinculado a estes Termos e Condições de Utilização. 
                Se não concordar com algum destes termos, não utilize este website.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">2. Objeto</h3>
              <p className="text-gray-700 mb-3">
                O presente website destina-se a fornecer informações sobre os serviços da RC Construções e a permitir aos visitantes 
                solicitar orçamentos para serviços de construção civil e remodelação.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">3. Propriedade Intelectual</h3>
              <p className="text-gray-700 mb-3">
                Todo o conteúdo deste website, incluindo mas não se limitando a textos, imagens, gráficos, logótipos, fotografias 
                e código-fonte, é propriedade da RC Construções ou dos seus licenciadores e está protegido pelas leis de direitos de autor 
                e propriedade intelectual portuguesas e internacionais.
              </p>
              <p className="text-gray-700">
                É proibida a reprodução, distribuição, modificação ou uso comercial de qualquer conteúdo sem autorização prévia por escrito.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">4. Utilização do Website</h3>
              <p className="text-gray-700 mb-3">Compromete-se a:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Utilizar o website apenas para fins lícitos</li>
                <li>Fornecer informações verdadeiras e atualizadas nos formulários</li>
                <li>Não tentar obter acesso não autorizado a áreas restritas</li>
                <li>Não transmitir vírus, malware ou código malicioso</li>
                <li>Não realizar ações que possam sobrecarregar ou danificar o website</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">5. Pedidos de Orçamento</h3>
              <p className="text-gray-700 mb-3">
                Os pedidos de orçamento submetidos através do website não constituem propostas contratuais vinculativas. 
                Representam apenas manifestações de interesse que serão analisadas caso a caso.
              </p>
              <p className="text-gray-700 mb-3">
                A RC Construções reserva-se o direito de aceitar ou recusar qualquer pedido de orçamento, sem necessidade de justificação.
              </p>
              <p className="text-gray-700">
                Os orçamentos fornecidos têm validade de 30 dias, salvo indicação em contrário, e estão sujeitos a confirmação 
                após visita técnica ao local.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">6. Privacidade e Proteção de Dados</h3>
              <p className="text-gray-700">
                O tratamento dos seus dados pessoais é regido pela nossa Política de Privacidade, que deve ler atentamente. 
                A utilização deste website implica o conhecimento e aceitação da Política de Privacidade.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">7. Isenção de Responsabilidade</h3>
              <p className="text-gray-700 mb-3">
                A RC Construções empenha-se em manter a informação do website atualizada e correta, mas não garante:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>A exatidão, completude ou atualidade de toda a informação</li>
                <li>O funcionamento ininterrupto ou livre de erros do website</li>
                <li>A adequação do website para fins específicos</li>
              </ul>
              <p className="text-gray-700 mt-3">
                A RC Construções não se responsabiliza por quaisquer danos diretos ou indiretos resultantes da utilização 
                ou impossibilidade de utilização do website.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">8. Links para Websites de Terceiros</h3>
              <p className="text-gray-700">
                Este website pode conter links para websites de terceiros. A RC Construções não tem controlo sobre esses websites 
                e não se responsabiliza pelo seu conteúdo, políticas de privacidade ou práticas.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">9. Disponibilidade e Manutenção</h3>
              <p className="text-gray-700">
                Reservamo-nos o direito de suspender temporariamente o acesso ao website para manutenção, atualizações ou 
                por qualquer outro motivo, sem aviso prévio.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">10. Modificações dos Termos</h3>
              <p className="text-gray-700">
                A RC Construções reserva-se o direito de modificar estes Termos e Condições a qualquer momento. As alterações 
                entram em vigor imediatamente após a publicação no website. A utilização continuada do website após alterações 
                constitui aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">11. Lei Aplicável e Jurisdição</h3>
              <p className="text-gray-700">
                Estes Termos e Condições regem-se pela lei portuguesa. Qualquer litígio emergente ou relacionado com a utilização 
                deste website será da competência exclusiva dos tribunais portugueses.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">12. Contactos</h3>
              <p className="text-gray-700 mb-2">
                Para questões sobre estes Termos e Condições, contacte-nos através de:
              </p>
              <p className="text-gray-700 mb-1"><strong>Email:</strong> info@rcconstrucoes.pt</p>
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

export default TermsModal;
